// Include Nodejs' net module.
const Net = require('net');

class MMX4x2 {

    constructor(ip='127.0.0.1', port=6107, server){
        this.ip     = ip;
        this.port   = port;
        this.server = server;

        // Parametros de comunicacion TCP
        this.TCP_timeout       = 5000;
        this.TCP_encoding      = 'utf8';
        this.TCP_maxReTries    = 20;
        this.TCP_retryInterval = 5000; 
        this.retriedTimes = 0;

        this.IN_O1      = '';
        this.IN_O2      = '';
        this.USB_Host   = '';
        
        this.client = new Net.Socket();

        this.client.setTimeout(this.TCP_timeout);
        this.client.setEncoding(this.TCP_encoding);

        this.events();
        this.TCPconnect();
    }

    events(){
        // Event Listener para recivir datos desde el TCPServer
        this.client.on('data', (chunk) => {
            //this.server.debug( `->MMX4x2: ${chunk.toString()}.` );
            this.response(chunk.toString());
        });
        this.client.on('end', () =>{
            this.server.debug(`->TCP MMX4x2 -> disconected`);
        });
            // Event Listener de error TCP
        this.client.on('error', (error) => {
            this.server.debug(`->TCP MMX4x2 -> ${error}`);
        });
            // Event Listener de close TCP
        this.client.on('close', () => {
            this.server.debug(`->TCP MMX4x2 -> Close conection.`);
            this.reConnect();
        });
    }
    
    // Funcion que realiza la conexión TCP con device
    TCPconnect = () => {
        this.server.debug(`=====> DEVICE: MMX4x2 intentando conectar... ${this.ip}:${this.port} ... `);
        this.client.connect({ port: this.port, host: this.ip }, () => {
            this.retriedTimes = 0;
            this.server.debug(`=====> DEVICE: MMX4x2 Conectado! en ${ this.ip } : ${ this.port}.`);
            this.estado_matriz();
            this.monitorizacion();
        });
    }
    // Función que reconecta con device en caso de pérdida de conexión.
    reConnect(){
        if (this.retriedTimes >= this.TCP_maxReTries) {
            this.server.debug('Max retries have been exceeded,I give up.');
            this.retriedTimes = 0;
        } else {
            this.retriedTimes += 1;
            this.server.debug(`ReConnect: ${this.retriedTimes}`);
            setTimeout(this.TCPconnect, this.TCP_retryInterval, this.client);
        }
    }

    // COMANDOS ----------------------------------------------------------------

    estado_matriz(){
        try {
                // Obtiene SerialNumber
            this.client.write('GET /.SerialNumber\r\n');
            //this.server.debug('GET /.SerialNumber\r\n');
                // Obtiene SOURCE seleccionado
            this.client.write('GET /MEDIA/VIDEO/O1.ConnectedSource\r\n');
            this.client.write('GET /MEDIA/VIDEO/O2.ConnectedSource\r\n');
        }
        catch(err){
            throw err;
        }
    }

        // Devuelve la fuente de video seleccionada para una salida dada.
    sourceSelect(out){
            // out: Valores validos [O1, O2]
        if (!(out==='O1' || out==='O2'))
            return 'err sysntax. ejemplo: sourceSelect("O1")';

        try {
            if(this.client.write(`GET /MEDIA/VIDEO/${out}.ConnectedSource\r\n`) != true)
                    server.debug(`Error to write to MMX4x2: GET /MEDIA/VIDEO/${out}.ConnectedSource\r\n`);
        }
        catch(err){
            throw err;
        }
    }
        // Funcion que devuelve la INPUT seleccionada. Parametros: out=['O1','O2']
    get_source(out){
        if (out == 'O1')
            return this.IN_O1;
        if (out === 'O2')
            return this.IN_O2;  
    }
        // Selecciona la fuente para la salida O1
    set_source_O1(input){
        this.client.write(`CALL /MEDIA/VIDEO/XP:switch(${input}:O1)\r\n`);
    }
        // Funcion que habilita la monitorización de la matriz
    monitorizacion(){
        try {
                // Monitor INPUT of O1 
            this.client.write('OPEN /MEDIA/VIDEO/O1\r\n');
            this.server.debug('OPEN /MEDIA/VIDEO/O1\r\n');
                // Monitor INPUT of O2
            this.client.write('OPEN /MEDIA/VIDEO/O2\r\n');
            this.server.debug('OPEN /MEDIA/VIDEO/O2\r\n');
                // Monitor USB Switch
            this.client.write('OPEN /MEDIA/USB/USBSWITCH\r\n');
            this.server.debug('OPEN /MEDIA/USB/USBSWITCH\r\n');
                
        }
        catch(err){
            throw err;
        }
    }
        // Parse response
    response(data){
            // split data in lines
        const array = data.split("\n");
        console.log('array.lenght', array.length);
        console.log(array);
            // Recorre las lineas de data
        array.forEach(element => {
            
                // Manejo de respuestas de ERROR -------------------------
            if (element.indexOf("nE ") !== -1){
                this.server.debug('MMX4x2 -> nE: an error for a node.');
            }
            if (element.indexOf("pE ") !== -1){
                this.server.debug('MMX4x2 -> pE: an error for the property.');
            }
            if (element.indexOf("mE ") !== -1){
                this.server.debug('MMX4x2 -> mE: an error for a method.');
            }
                // -------------------------------------------------------
                // Obtencion de datos
                // Serial Number
            if (element.indexOf("pr /.SerialNumber=") !== -1){
                this.numSerial = element.substring(element.indexOf("=")+1).replace('\r','').replace('\n', '');
                console.log(this.numSerial);
            }
                // INPUT de O1
            if (element.indexOf("pr /MEDIA/VIDEO/O1.ConnectedSource=") !== -1){
                this.IN_O1 = element.substring(element.indexOf("=")+1).replace('\r','').replace('\n', '');
                console.log(this.IN_O1);
            }
                // INPUT de O2
            if (element.indexOf("pr /MEDIA/VIDEO/O2.ConnectedSource=") !== -1){
                this.IN_O2 = element.substring(element.indexOf("=")+1).replace('\r','').replace('\n', '');
                console.log(this.IN_O2);
            }
                         
                // Si data is Subcripting to 
            if (element.indexOf("o-") !== -1){
                console.log(element);
            } 
                // Cambio de INPUT en O1
            if (element.indexOf("CHG /MEDIA/VIDEO/O1.ConnectedSource=") !== -1){
                this.IN_O1 = element.substring(element.indexOf("=")+1).replace('\r','').replace('\n', '');
                this.server.io.emit("matrix", {"O1": this.IN_O1} );
                console.log('O1: ', this.IN_O1);
            }
                // Cambio de INPUT en O2
            if (element.indexOf("CHG /MEDIA/VIDEO/O2.ConnectedSource=") !== -1){
                this.IN_O2 = element.substring(element.indexOf("=")+1).replace('\r','').replace('\n', '');
                //this.server.emit("source", this.IN_O1)
                console.log('O2: ', this.IN_O2);
            }
                // Cambio de Host USB
            if (element.indexOf("CHG /MEDIA/USB/USBSWITCH.HostSelect=") !== -1){
                this.USB_Host = element.substring(element.indexOf("=")+1).replace('\r','').replace('\n', '');
                //this.server.emit("source", this.IN_O1)
                console.log('USB Host: ', this.USB_Host);
            }
        });
    }
    
        // Close conection
    close(){
        this.client.end();
    }
}

module.exports = MMX4x2;   