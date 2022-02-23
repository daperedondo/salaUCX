// Include Nodejs' net module.
const Net = require('net');

class EB2250U {

    constructor(ip='127.0.0.1', port=3629, server){
        this.ip     = ip;
        this.port   = port;
        this.server = server;
        this.connection = false;    // Es true cuando el proyector está listo para recibir comandos, responde ESC/VP.net

        // Parametros de comunicacion TCP
        this.TCP_timeout       = 5000;
        this.TCP_encoding      = 'utf8';
        this.TCP_maxReTries    = 20;
        this.TCP_retryInterval = 5000; 
        this.retriedTimes = 0;

        this.client = new Net.Socket();

        this.client.setTimeout(this.TCP_timeout);
        this.client.setEncoding(this.TCP_encoding);

        this.events();
        this.TCPconnect();
    }

    events(){
        // Event Listener para recivir datos desde el TCPServer
        this.client.on('data', (chunk) => {
            //this.server.debug( `->EB2250U: ${chunk.toString()}.` );
            this.response(chunk.toString());
        });
        this.client.on('end', () =>{
            this.server.debug(`->TCP EB2250U -> disconected`);
        });
            // Event Listener de error TCP
        this.client.on('error', (error) => {
            this.server.debug(`->TCP EB2250U -> ${error}`);
        });
            // Event Listener de close TCP
        this.client.on('close', () => {
            this.server.debug(`->TCP EB2250U -> Close conection.`);
            this.reConnect();
        });
    }
    
    // Funcion que realiza la conexión TCP con device
    TCPconnect = () => {
        this.server.debug(`=====> DEVICE: EB2250 intentando conectar... ${this.ip}:${this.port} ... `);
        this.client.connect({ port: this.port, host: this.ip }, () => {
            this.retriedTimes = 0;
                // Inicialización de conexión
            this.client.write(new Buffer.from([0x45,0x53,0x43,0x2F,0x56,0x50,0x2E,0x6E,0x65,0x74,0x10,0x03,0x00,0x00,0x00,0x00]));
            this.server.debug(`=====> DEVICE: EB2250 Conectado! en ${ this.ip } : ${ this.port}.`);
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

        // Encendido y apagado de proyector
    setPower(pw){
        switch(pw){
                // Power ON
            case 'PWR_ON':
                this.client.write(new Buffer.from([0x50,0x57,0x52,0x20,0x4f,0x4e,0x0d]));
                break;
                // Power OFF
            case 'PWR_OFF':
                this.client.write(new Buffer.from([0x50,0x57,0x52,0x20,0x4f,0x46,0x46,0x0d]));
                break;
                // Freeze ON
            case 'FRZ_ON':
                this.client.write(new Buffer.from([0x46,0x52,0x45,0x45,0x5a,0x45,0x20,0x4f,0x4e,0x0d]));
                const frz = new Buffer.from([0x46,0x52,0x45,0x45,0x5a,0x45,0x20,0x4f,0x4e,0x0d]);
                console.log(frz.toString());
                break;
                // Freeze OFF
            case 'FRZ_OFF':
                this.client.write(new Buffer.from([0x46,0x52,0x45,0x45,0x5a,0x45,0x20,0x4f,0x46,0x46,0x0d]));
                break;
            default:
                break;
        }
    }
        // Consulta el estado del power del proyector
    getPower(){
        this.client.write(new Buffer.from([0x50,0x57,0x52,0x3f,0x0d]));
    }
        // Consulta el estado del freeze
    getFreeze(){
        this.client.write(new Buffer.from([0x46,0x52,0x45,0x45,0x5a,0x45,0x3f,0x0d]));
    }
        // Consulta las horas de lámpara
    getLamp(){
        this.client.write(new Buffer.from([0x4c,0x41,0x4d,0x50,0x3f,0x0d]));
    }

        // Parse response
    response(data){
            // split data in lines
        const array = data.split(":");
        console.log('array.lenght', array.length);
        console.log(array);
            // Recorre las lineas de data
        array.forEach(element => {
            // -------------------------------------------------------
            // ERRORES
            if (element.indexOf("ERR:") !== -1){
                this.server.debug(`=====> DEVICE: EB2250. Comando Error`);
            }
            // -------------------------------------------------------
            // COMANDOS
                // Obtencion de datos
                // Conexion establecida
            if (element.indexOf("ESC/VP.net") !== -1){
                this.connection = true;
                this.server.debug(`=====> DEVICE: EB2250. Listo para recibir comandos ESP/VP.net`);
            }
                // POWER State
            if (element.indexOf("PWR=") !== -1){
                this.PWR = element.substring(element.indexOf("=")+1).replace(':','').replace('\r','').replace('\n', '');
                this.server.debug(this.PWR);
            }
                // HOURS LAMP 
            if (element.indexOf("LAMP=") !== -1){
                this.LAMP = element.substring(element.indexOf("=")+1).replace(':','').replace('\r','').replace('\n', '');
                this.server.debug(this.LAMP);
            }
                // FREEZE ESTADO
            if (element.indexOf("FREEZE=") !== -1){
                this.FREEZE = element.substring(element.indexOf("=")+1).replace(':','').replace('\r','').replace('\n', '');
                this.server.debug(this.FREEZE);
            }
                
                // ENCENDIENDO
            if (element.indexOf("IMEVENT=0001 02") !== -1){
                this.PWR = '02';                // Encendiendo
                this.server.debug(this.PWR);
                this.server.io.emit('proyector', '02');
            }
                // ENCENDIDO
            if (element.indexOf("IMEVENT=0001 03") !== -1){
                this.PWR = '01';                // Encendido
                this.server.debug(this.PWR);
                this.server.io.emit('proyector', '01');
            }
                 // APAGANDO
            if (element.indexOf("IMEVENT=0001 04") !== -1){
                this.PWR = '03';                // Apagando
                this.server.debug(this.PWR);
                this.server.io.emit('proyector', '03');
            }
                    // APAGADO
            if (element.indexOf("IMEVENT=0001 01") !== -1){
                this.PWR = '04';                // Apagado
                this.server.debug(this.PWR);
                this.server.io.emit('proyector', '04');
            }
           
        });
    }
        // Cierre de la conexión
    close(){
        this.client.end();
    }
}
   
module.exports = EB2250U;   