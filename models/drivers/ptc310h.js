// Include Nodejs' net module.
const dgram = require('dgram');

class Ptc310h {

    constructor(){
        this.host = '127.0.0.1';
        this.port = 52381;
        
        //this.client = dgram.createSocket("udp4");
    }

    connect(host, port, server){
        this.ip   = host;
        this.port   = port;
        this.msgRcv = '';
        this.server = server;

        this.client = dgram.createSocket("udp4");
        // TODO: Realizar una comprobación udp o Ping
        //const cmd = new Buffer.from('Hola');
        //this.write(cmd);

        this.sockets();
    }

    sockets(){
        // The client can also receive data from the server by reading from its socket.
        this.client.on('message', (msg, rinfo) => {
            if (this.server)
                this.server.debug(msg.toString());
        });
        
        this.client.on('end', () => {
            if (this.server)
                this.server.debug('Requested an end to the TCP connection');
        });

        this.client.on('error', (err) => {
            if (this.server)
                this.server.debug(`TCP_err: ${ err }`);
        });

        this.client.on('close', () => {
            if (this.server)
                this.server.debug('Connection closed.');
        });

    }
    
    powerON(){
        try{
            this.write([0x01,0x00,0x00,0x06,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x00,0x02,0xFF]);
        }
        catch(err){
            throw err;
        }
    }

    powerOFF(){
        try {
            this.write([0x01,0x00,0x00,0x06,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x00,0x03,0xFF]);
        }
        catch(err){
            throw err;
        }
    }
    
    zoomStop(){
        try {
            this.write([0x01,0x00,0x00,0x06,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x07,0x00,0xFF]);
        }
        catch(err){
            throw err;
        }
    }
        // Tele sens: entro 0 Low hasta 7 High.
    zoomTele(sens = 3){
        if (!(sens > -1 && sens < 8))
            return 'Sens Error: el valor debe ser de 0 a 7';

        sens += 32;     // cmd Tele: 8x 01 04 07 2(sens) FF
        try{
            this.write([0x01,0x00,0x00,0x06,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x07,sens,0xFF]);
        }
        catch(err){
            throw err;
        }
    }
        // Tele sens: entro 0 Low hasta 7 High.
    zoomWide(sens = 3){
        if (!(sens > -1 && sens < 8))
            return 'Sens Error: el valor debe ser de 0 a 7';

        sens += 48;     // cmd Wide: 8x 01 04 07 3(sens) FF
        try{
            this.write([0x01,0x00,0x00,0x06,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x07,sens,0xFF]);
        }
        catch(err){
            throw err;
        }
    }

    preset(pr = 0x00){
            // pr: Preset Number 0x00~0xFF
            // Cmd Recall preset:  8x 01 04 3F 02 pr FF
        try{
            this.write([0x01,0x00,0x00,0x07,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x3F,0x02,pr,0xFF]);
        }
        catch(err){
            throw err;
        }
    }

    presetSet(pr){
            // pr: Preset Number 0x00~0xFF
            // Cmd Set preset: 8x 01 04 3F 01 pr FF
        if (!(pr > 0x01 && pr < 0xFF))
            return 'Error Set Preset: valor entre 0x02 y 0x0FE';

        try{
            this.write([0x01,0x00,0x00,0x07,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x3F,0x01,pr,0xFF]);
        }
        catch (err){
            throw err;
        }
    }

    autoTracking(auto){
        switch(auto){
            case 'ON':
                try {
                    this.write([0x01,0x00,0x00,0x07,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x7D,0x02,0xFF]);
                } catch(err){
                    throw err;
                }
                break;
            case 'OFF':
                try{
                    this.write([0x01,0x00,0x00,0x07,0x00,0x00,0x00,0x01,0x81,0x01,0x04,0x7D,0x03,0xFF]);
                } catch(err){
                    throw err;
                }
                break;
            default:
                throw 'Error: AutoTracking( "ON"/"OFF").';
        }
        return `Send cmd: ${auto}`;
    }

    write(data = []){
        //this.client = dgram.createSocket("udp4");
        var message = new Buffer.from(data);
        this.client.send(message, 0, message.length, this.port, this.ip, (err, bytes) => {
            if (err)
                throw `-> Err: ${err} `;
            else{
                console.log(data);
                console.log(this.ip, this.port);
                return `-> UDP send: ${bytes} bytes - msg: ${message}`;
            }
        });
    }

    close(){
        this.client.end();
    }
}

module.exports = Ptc310h;   