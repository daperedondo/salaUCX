// Include Nodejs' net module.
const dgram = require('dgram');

class Ud8cr {

    constructor(){
        this.host = '127.0.0.1';
        this.port = 12345;
        
        //this.client = new Net.Socket();
        this.client = dgram.createSocket("udp4");
    }

    connect(host, port, server){
        this.ip   = host;
        this.port   = port;
        this.msgRcv = '';
        this.server = server;

        this.client.udp = dgram.createSocket("udp4");
        const reles_msg = new Buffer.from('FF0401');
        this.client.udp.send(reles_msg, 0, reles_msg.length, this.port, this.ip, (err, bytes) => {
            if (err)
                this.server.debug(`->UDP RELES err : ${err} `);
            else
                this.server.debug(`->UDP RELES ${this.ip}:${this.port} bytes send: ${bytes} msg: ${reles_msg}`);
        });
        
        this.sockets();
    }

    sockets(){
        
                // The client can also receive data from the server by reading from its socket.
        this.client.on('message', (msg, rinfo) => {
            this.server.debug('RELES -> '+msg.toString());
        });
        
        this.client.on('end', () => {
            this.server.debug('Requested an end to the TCP connection');
        });

        this.client.on('error', (err) => {
            this.server.debug(`TCP_err: ${ err }`);
        });

        this.client.on('close', () => {
            this.server.debug('Connection closed.');
        });
    }
    
    powerON(){
        this.write('FF0401');
    }

    powerOFF(){
        this.write('FF0400');
    }
    
    pantallaUP(active){
        if (active){
            // Apaga rele DOWN
            this.write('FF0300');
            // Activa rele UP
            this.write('FF0201');
        }
        else
            // Desactiva rele UP
            this.write('FF0200');
    }

    pantallaDOWN(active){
        if (active){
                // Apaga relé UP
            this.write('FF0200');
                // Activa relé DOWN
            this.write('FF0301');
        }
        else
            // Desactiva relé DOWN
            this.write('FF0300');   
    }

    write(data = []){
        var message = new Buffer.from(data);
        this.client.send(message, 0, message.length, this.port, this.ip, (err, bytes) => {
            if (err)
                this.server.debug(`->Reles UDP err : ${err} `);
            else
                this.server.debug(`->Reles UDP bytes send: ${bytes} msg: ${message}`);
        });
    }

    close(){
        this.client.end('Adios');
    }
}

module.exports = Ud8cr;   