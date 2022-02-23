
*** WebApp CommDevices ***                                       
                                                                    
Versión completa de comunicación TCP/UDP añadiendo modulo QRCode para generar imagen QR. Testeada en Taurus UCX-4x2-HC30 y funcionando???.

Aplicación de testeo de comunicación TCP y UDP con dispositivos AV. 

Se trata de una pasarela web -> TCP/UDP, que mantiene una BB.DD. de dispositivos con su IP, port y tipo de conexión. Seleccionando el dispositivo a utilizar se puede enviar datos a los mismos y recibir la respuesta en el caso comunicación TCP.

Para recibir la respuesta de los dispositivos abrir navegador en http://IP:port/debug.html


1. Al comenzar crear el objeto sala con el estado y las conexiones a devices.
2. Al conectar cliente lee la "variable/objeto sala" para pintar correctamente pantalla con el estado actual.- Si está en modo mirror (por defecto), podría existir un modo debug.
3. Crear socket io events de cambio de estado que llame a macros/presets y cambie la variable estado. 
4. Al cambiar el estado debe registrarlo en influxdb.
5. La pulsación de cualquier botón debería poderse ver en el debug.