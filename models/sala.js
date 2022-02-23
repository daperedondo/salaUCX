const fs = require('fs');
const Ud8cr = require('./drivers/ud8cr');

    // Clase que contiene todas las propiedades de una sala.
class Sala {

        // Debe construirse con un server con function debug para reportar mensajes.
    constructor(server, baseDirectory){
        this.timeScreenUP   = 8000          // Tiempo de subida de pantalla (8 seg.)
        this.timeScreenDOWN = 8000          // Tiempo de bajada de pantalla (8 seg.)
            // Posibles valores de estado: 'OFF','INICIO','SOLOAUDIO','PROYECCION','VIDEOCONF','ASISTENTE'
        this.state          = 'INICIO';     // Inicializamos sala al estado INICIO.
            // Posibles valores de vista: 'index','escenas','ayuda','soloaudio','proyeccion','videoconf','asistente'
        this.view           = 'index';      // Pantalla que está viendo el usuario.
        this.server         = server;       // Server para reportar mensajes de debug.
        this.devices        = [];           // Array de devices de sala
        this.proyector      = [];           // Array de proyectores de sala
        this.tv             = [];           // Array de TVs Supletorias de sala
        this.baseDirectory  = baseDirectory;

        this.source         = 'connecting...';

        this.set_devices();
        //this.get_devices();
        this.set_state(this.state);
    }
        // Carga los devices de sala y comprueba la comunicación
    set_devices(){
        //----------- Carga los devices y establece la comunicación TCP o UDP -----
        const Devices  = require(this.baseDirectory+'/models/devices');
            // Extraemos el array de devices del file config: db/devices.json 
        const { devices } = new Devices(this.baseDirectory);
        this.devices = devices;

        devices.forEach(dev => {
            const path = this.baseDirectory+'/models/drivers/'+dev.driver+'.js';
            try {
                if (fs.existsSync(path)) {
                    switch(dev.driver){
                        case 'ud8cr':
                            const Ud8cr = require(path);
                            this.reles = new Ud8cr();
                            this.reles.connect(dev.ip, dev.port, this.server);
                            break;
                        case 'ptc310h':
                            const Camara = require(path);
                            this.camara = new Camara();
                            this.camara.connect(dev.ip, dev.port, this.server);
                            break;
                        case 'dmp64plus':
                            const DMP64PLUS = require(path);
                            this.dsp = new DMP64PLUS(dev.ip, dev.port, this.server);
                            break;
                        case 'mmx4x2':
                            const MMX4x2 = require(path);
                            this.matriz = new MMX4x2(dev.ip, dev.port, this.server);
                            break;
                        case 'eb2250u':
                            const EB2250U = require(path);
                            this.proyector.push(new EB2250U(dev.ip, dev.port, this.server));
                            break;
                        case 'microfono':
                            break;
                        case 'galicaster':
                            break;
                        case 'influxdb':
                            break;
                        case 'tv':
                            break;
                        default:
                            this.server.debug(`Driver: ${dev.driver} - Desconocido.`);
                    }
                }else{
                    console.warn('NO Ext: ', path);
                }
            } catch(err) {
                console.error(err)
            }
        });
    }
        // Obtiene los devices cargados y su estado
    get_devices(){
        console.log('>>>>> devices cargados <<<<<<');
        this.devices.forEach(dev => {
            console.log(dev);
        });
    }
        // Fija el estado de la sala
    set_state(newState){
            // Si hay cambio de estado ejecuta la macro del nuevo estado.
        if (this.state !== newState){
            this.macro(newState);
            this.state = newState;
        }
        else if (newState === 'INICIO')
            this.server.io.emit('salaEstado', 'INICIO');
    }
        // Obtiene el estado de la sala
    get_state(){
        return this.estado;
    }
        // Ejecuta macro
    macro(state){
        switch(state){
            case 'OFF':
                this.server.debug('OFF');
                this.reles.pantallaUP(true);
                const time_pantOff = setTimeout(() => {
                    this.reles.pantallaUP(false);
                  }, this.timeScreenUP);
                break;
            case 'INICIO':
                this.server.debug('Macro -> INICIO');
                this.server.io.emit('salaEstado', 'INICIO');
                    // RELES -----------------------------------
                    // ENCIENDE REGLETA Y SUBE PANTALLA
                if (this.reles){
                    this.reles.pantallaUP(true);
                    const time_panta = setTimeout(() => {
                        this.reles.pantallaUP(false);
                      }, this.timeScreenUP);
                }
                    // DISPLAYS -------------------------------
                    // Enciende proyectores y displays
                this.proyector.forEach(element => {
                    element.getPower();
                    element.getLamp();
                    element.getFreeze();
                    element.setPower('OFF');
                });
                break;
            case 'SOLOAUDIO':
                this.server.debug('SOLOAUDIO');
                this.reles.powerON();
                break;
            case 'PROYECCION':
                this.server.debug('PROYECCION');
                break;
            case 'VIDEOCONF':
                this.server.debug('VIDEOCONF');
                this.server.io.emit('salaEstado', 'VIDEOCONF');
                // TODO: --
                // 2. Cuando pase tiempo encendido de proyector, Proyector ON
                // 3. Cuando pase tiempo encendido de DSP preset
                // 4. Cuando pase tiempo encendido de Matriz, ver fuentes de video y seleccionar.
                // 5. Cuando pase tiempo encendido de camara, Power ON, Preset 1 y Autotracking ON.
                    // RELES ------------------------------------
                    // Si está conectado a los reles, Enciende devices y pantalla UP
                if (this.reles){
                    this.reles.powerON();
                    this.reles.pantallaDOWN(true);
                    // transcurrido tiempo de subida apaga motor pantalla
                    const time_pant = setTimeout(() => {
                        this.reles.pantallaDOWN(false);
                    }, this.timeScreenDOWN);
                } else{
                    this.server.debug('ERROR: Error Conection Reles');
                }
                    // DISPLAYS -------------------------------
                    // Enciende proyectores y displays
                this.proyector.forEach(element => {
                    element.getPower();
                    element.getLamp();
                    element.setPower('ON');
                });
                this.tv.forEach(element => {
                    //element.powerON();
                })
                    // CAMARA -----------------------------------
                    // Transcurrido el tiempo de encendido de la camara
                if (this.camara){
                    const time_camara = setTimeout(() => {
                        this.camara.preset(1);
                        this.camara.autoTracking('ON');
                    }, 5000);
                }else{
                    this.server.debug('ERROR: Error conection to camera');
                }
                    // DSP -------------------------------------
                    // Transcurrido el tiempo ON de DSP
                const time_dsp = setTimeout(() => {
                    //this.camara.preset(1);
                    //this.camara.autoTracking('ON');
                }, 5000);
                    // MATRIZ -----------------------------------
                    // Transcurrido el tiempo ON de MATRIZ
                const time_matriz = setTimeout(() => {
                    try{
                        this.source = this.matriz.get_source();
                    }catch(e){
                        this.server.debug(`Error de conexión a la matriz. Err: ${e}`);
                    }
                }, 5000);
                    //--------------------------------------------
                break;
            case 'ASISTENTE':
                this.server.debug('ASISTENTE');
                break;
            default:
                this.server.debug('ERROR Macro no definida.');
                console.log( this.camara.autoTracking('ON') );
                console.log( this.camara.presetSet(6));
                const { reles } = this.devices.find(element => element.driver == 'ud8cr');
                //console.log(reles);
                if (this.reles){
                    console.log('Reles existe');
                    this.reles.pantallaUP();
                }
                else console.log('Reles NOOO existe');
                
                if (this.proyector.length == 0)
                    console.log('No hay proyectores');
                else    
                    console.log('Hay Proyectores: ', this.proyector.length);
                break;
                
                
        }
    }
}

module.exports = Sala;  