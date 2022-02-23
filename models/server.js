const { execShellCommand } = require('../helper/ejecutarCmd');  
///----------- Conexion TCP con devices-----------
const Devices   = require('./devices');
const TCP_Conn  = require('./tcp');

const express = require('express');
const cors = require('cors');

class Server{

    constructor(baseDirectory, port){
        this.app = express();
        this.port = port;
        this.deb = false;
        
    
        this.baseDirectory = baseDirectory;
        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')( this.server );


        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();

        // Sockets
        this.sockets(console);


 
    }

    middlewares(){
        // Cors
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use( express.json() );

        // Middleware para servir contenido estático
        this.app.use( express.static(this.baseDirectory+'/public'));
    }

    routes() {
        // Ejemplo
        //this.app.use('/api/usuarios', require('../routes/users'));

        this.app.get('*', (req, res) => {
            res.send(`404 | Page Not Found. baseDIR: `);
        });
    }

    sockets(){
        this.io.on('connection', socket => {
            this.debug('cliente conectado.', socket.id );

                //
                // Manejador de Eventos
                //
                // Evento disconnect del cliente
            socket.on('disconnect', () =>{
                this.debug('Cliente desconectado.', socket.id );
            });

                // Evento enviar-cmd del cliente
            socket.on('enviar-cmd', (payload) => {
                this.debug(payload);

                if (payload.process){
                    this.debug( process.release );
                    this.debug("process.platform:");
                    this.debug( process.platform );
                }

                if (payload.cmd) {
                        // Ejecuta command
                    execShellCommand(payload.cmd)
                    .then (salida => {
                        this.debug(salida.replace('\n', '<br>'));
                    }).catch(err => {
                        this.debug( JSON.stringify(err));
                    });
                }
            });

            socket.on('debug', (payload) => {
                if (payload.debug === true){
                    this.deb = true;
                    console.log('debug TRUE');
                }
                else 
                    console.log('debug false');
            });
        });
    }

    debug(logger){
        if (this.deb) this.io.emit('debug', logger);
        console.log(JSON.stringify(logger));
    }

    listen(){
        this.server.listen(this.port, (req, res) => {
            console.log(`Escuchando en el port: ${ this.port }`);
        });
    }
}


module.exports = Server;