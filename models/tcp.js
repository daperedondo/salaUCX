// Include Nodejs' net module.
const Net = require('net');

class TCP_Conn {

    constructor(comm){
        this.host = '127.0.0.1';
        this.port = 5555;
        this.comm = comm;

        this.client = new Net.Socket();
    }

    
    write(data){
        const i = data.indexOf('0x');
        let msg;
        if (i == -1){
            msg = new Buffer.alloc(data.length,data);
        }
        else{

            // TODO: hacerlo robusto y para más de dos 0x 
            const txt = data.substring(0,i);
            const pri = new Buffer.alloc(txt.length, txt);
            const sec = new Buffer.alloc(1, Number(data.substr(i,4)));
            const tri = new Buffer.alloc(1, Number(data.substr(i+4,4)));

            const arr = [pri,sec,tri];
            msg = Buffer.concat(arr);
        }

        return this.client.write(msg);
    }

    close(){
        this.client.end('Adios');
    }
}

module.exports = TCP_Conn;

;