
salaUCX

Esta aplicación es un borrador o primera version de aproximación a la solución de control de dispositivos AV en un aula docente. 
Abre un frontend en el puerto 8088, y mediante la opcion de videoconferencia se conecta a los devices definidos en db/devices.json.

* para instalar: ```bash npm install ```
* para ejecutar: ```bash node ./app ```

Los componentes son los siguientes:
```bash
* app.js    -> Main App
* models/   -> Contiene tres clases y los drivers de los dispositivos.
* ...devices.js   -> clase para leer o escribir nuevos dispositivos. 
* ...sala.js      -> Clase de sala que contiene todos los controladores de sala. Establece comunicación con los drivers y ejecuta macros en función de los eventos recibidos por el front-end mediante websocket (socket.io)
* ...server.js    -> clase que contiene el servicio HTTP. Basado en express
* ...drivers/  -> carpeta que contiene todos los drivers definidos hasta la fecha.
* public/   -> contiene todos los ficheros html, css, js que componen el frontend. 
```

