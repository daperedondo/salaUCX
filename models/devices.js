const fs = require('fs');

class Devices {
    devices = [];
    devPath = '/db/devices.json';

    constructor(dirBase){
        this.leerDev(dirBase+this.devPath);
    }

    guardarDev (dev, dirBase){
        const payload = {
            devices: dev
        };
        fs.writeFileSync( dirBase+this.devPath, JSON.stringify( payload ));
    }

    leerDev(fsRuta){
        // ver si existe.
        if (!fs.existsSync(fsRuta)){
            console.log(fsRuta, fs.existsSync(fsRuta));
            return null;    
        }
        // Cargar informacion del DB a array 
        const info = fs.readFileSync(fsRuta, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.devices = data.devices;
    }
}

module.exports = Devices;