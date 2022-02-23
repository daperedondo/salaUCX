// Include Nodejs' net module.
const dgram = require('dgram');

    class UDP_Conn {

    constructor(){
        this.host = '127.0.0.1';
        this.port = 5555;
        
        //this.client = new Net.Socket();
        this.client = dgram.createSocket("udp4");
    }

    connect(host, port){
        this.host = host;
        this.port = port;

        this.client.connect({ port: this.port, host: this.host }, () => {
            // The client can now send data to the server by writing to its socket.
            this.client.write('Hello, server.');
            

            this.sockets();
            // If there is no error, the server has accepted the request and created a new 
            // socket dedicated to us.
        });

    }

    sockets(){
        // The client can also receive data from the server by reading from its socket.
        this.client.on('message', function (msg, rinfo) {
            server.debug("recibido: " + msg + " de " + rinfo.address);
        });
        
        this.client.on('end', function() {
            return 'Requested an end to the TCP connection';
        });

        this.client.on('error', (err) => {
            return `TCP_err: ${ err }`;
        });

        this.client.on('close', function(){
            return 'Connection closed.';
        });

        return result;
    }
    
    write(data){
        return this.client.write(data);
    }

    close(){
        this.client.end('Adios');
    }
}

module.exports = UDP_Conn;   