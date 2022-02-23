#!/usr/bin/nodejs
const { exec } = require("child_process");
    // Puerto de webserver
const portServer    = 8088;                     // Server Port

////----- Establece Directorio de trabajo ------------------------ 
let baseDirectory = '/mnt/config/userscript';   // Directorio de trabajo de UCX.
if (process.platform === "win32")       
    baseDirectory = __dirname;                        // Directorio de trabajo en windows.

////---------- Inicializa Server Web ----------------------
const Server = require(baseDirectory+'/models/server');
const server = new Server(baseDirectory, portServer);
server.listen();
////----------------------------------------------

// Inicializa la sala
const Sala = require(baseDirectory+'/models/sala');
const sala = new Sala(server, baseDirectory);

////=========================================================================
//// ----------- Manejador de eventos de servicio web.-----------------------
server.io.on('connection', socket => {
        // Envía el estado actual de la sala al cliente
    //server.io.emit('salaEstado', 'INICIO');

    socket.on('enviar-cmd', (payload) => {
        server.debug('app.js ->'+JSON.stringify(payload));
    });
        // Evento de cambio de modo de uso / estado de sala.
    socket.on('salaEstado', (estado) =>{
        sala.estado = estado;
        console.log(sala);
        sala.set_state(estado);
    });

        // Evento para seleccionar fuente
    socket.on('selectSource', (src) => {        
        if (sala.source(src))
            server.debug('select: '+src+' OK.');
        else 
            server.debug('Error al seleccionar: '+src);
    });

        // Evento para leer fuente seleccionada
    socket.on('getSource', () => {
        try{

            sala.source = sala.matriz.get_source('O1'); 
            server.io.emit('matrix', {"O1": sala.source});
            console.log('getSource Recibido. SRC:', sala.source);
        }   
        catch(e){
            sala.server.debug(`Error de conexion con matriz. Err: ${e}`);
        }    
    });
        // evento para seleccionar fuente de video.
    socket.on('setSource', (input) => {

        sala.matriz.set_source_O1(input);
    });
        // Proyector ON/OFF
    socket.on('proyector', (pwr) => {
        sala.proyector.forEach(element => {
            element.setPower(pwr);
        });
    });

        // Añade device a fichero de devices
    socket.on('addDevice', (payload) => {
        server.debug(payload);
            // {"name":"dev3","type_com":"tcp","ip":"192.168.42.100","port":6002}
        sala.Dev.devices.push({
            "name": payload.name,
            "type_com": payload.type_com,
            "ip": payload.host,
            "port": payload.port
        });
        const list = [];
        sala.Dev.devices.forEach(dev => {
             list.push({"name":dev.name,"type_com":dev.type_com,"ip":dev.ip,"port":dev.port});
        });
        sala.Dev.guardarDev(list, baseDirectory);
        
        // Conecta al nuevo device
        if (payload.type_com === 'tcp') type_TCP(Dev.devices[Dev.devices.length - 1]);
        if (payload.type_com === 'udp') type_UDP(Dev.devices[Dev.devices.length - 1]);

        // Pinta de nuevo los devices
        server.io.emit('device', {"limpia": true} );

        sala.Dev.devices.forEach(element => {
            server.io.emit('device', element);
        });    

    });

    socket.on('delDevice', (payload) => {
        server.debug(payload);

        const list = [];
        sala.Dev.devices.forEach(dev => {
             list.push({"name":dev.name,"type_com":dev.type_com,"ip":dev.ip,"port":dev.port});
        });

        const index = list.findIndex(dev => dev.name === payload.name);
        
        if (index > -1) {
            list.splice(index, 1);
            sala.Dev.devices.splice(index,1);
        }

        sala.Dev.guardarDev(list, baseDirectory);
        server.debug(`Device: ${payload.name} eliminado!.`);
        // Pinta de nuevo los devices
        server.io.emit('device', {"limpia": true} );
        server.debug(`Limpiamos devices.`);
        sala.Dev.devices.forEach(element => {
            server.io.emit('device', element);
            server.debug(`Añadiendo device: ${element.name}`)
        });    
    });

    socket.on('tcp_write', (payload) => {
        //server.debug(payload);
         try{
                 //Busca conexion socket
            const device = sala.Dev.devices.find(element => element.name == payload.deviceName);

            if (device.tcp !== undefined){
                 // Envia comando a conexion TCP.
                if(device.tcp.write(payload.tcpWrite) != true)
                    server.debug(`Error to write to TPC_${payload.deviceName}: ${payload.tcpWrite}`);
            }
                 
            if (device.udp !== undefined) {
                const msg = payload.tcpWrite.split(',').map(Number);
                const message = new Buffer.from(msg);

                device.udp.send(message, 0, message.length, device.port, device.ip, (err, bytes) => {
                    server.debug(`->UDP ${device.name} err : ${err} << >> UDP bytes send: ${bytes}`);
                });
             }      
         }
         catch(err){
            server.debug(err);
         }
    });

});

/////------------------------------------------------------------------------
