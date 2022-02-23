//
//// Referencias del HTML
//const lblOnline  = document.querySelector('#lblOnline');
//const lblOffline = document.querySelector('#lblOffline');
//const lblCodeIDOK  = document.querySelector('#lblCodeIDOK');
//const lblCodeIDERR = document.querySelector('#lblCodeIDERR');
//const imgQR = document.querySelector('#imgQR');
//
//const txtCodeID  = document.querySelector('#txtCodeID');
//const btnCodeID  = document.querySelector('#btnCodeID');
//const txtCmd     = document.querySelector('#txtCmd');
//const btnCmd     = document.querySelector('#btnCmd');
//const txtNameDev = document.querySelector('#txtNameDev');
//const txtIP      = document.querySelector('#txtIP');
//const txtPort    = document.querySelector('#txtPort');
//const btnAddTCPDevice = document.querySelector('#btnAddTCPDevice');
//const btnAddUDPDevice = document.querySelector('#btnAddUDPDevice');
//const divDevices = document.querySelector('#divDevices');
//const srcDevices = document.querySelector('#srcDevices');
const btn_inicio   = document.querySelector('#Btn_Inicio');
const src_matrix   = document.querySelector('#matrix_source');
//let sala_state = '';

const socket = io();

socket.on('connect', () =>{
    console.log('conectado.');
});

socket.on('disconnect', () =>{
    console.log('Desconectado.');

});

socket.on('salaEstado', (sala) =>{
    console.log(sala);
    
    switch (sala){
        case 'OFF':
            sala_state = 'OFF';
            targetUrl = 'index.html';
            console.log('socket -> salaEstado: OFF');
            break;
        case 'INICIO':
            sala_state = 'INICIO';
            targetUrl = 'EscenasSimplificado.html';
            console.log('socket -> salaEstado: INICIO');
            break;
        case 'SOLOAUDIO':
            sala_state = 'SOLOAUDIO';
            targetUrl = 'SoloAudio.html';
            console.log('socket -> salaEstado: SOLOAUDIO');
            break;
        case 'PROYECCION':
            sala_state = 'PROYECCION';
            targetUrl = 'Proyectar.html';
            console.log('socket -> salaEstado: PROYECCION');
            break;
        case 'VIDEOCONF':
            targetUrl = 'DocenciaHibrida.html';
            console.log('socket -> salaEstado: VIDEOCONF');
            break;
        case 'ASISTENTE':
            targetUrl = 'Asistente1.html';
            console.log('socket -> salaEstado: ASISTENTE');
            break;
        default: 
            targetUrl = 'err.html';
            break;
    }
    
    top.location.href = targetUrl;
});

socket.on('matrix', (src) =>{
    const btn_Source_PC     = document.querySelector('#Gr_SOURCE_Btn_Pc');
    const btn_Source_USBC   = document.querySelector('#Gr_SOURCE_Btn_Portatil');
    const btn_Source_HDMI   = document.querySelector('#Gr_SOURCE_Btn_Hdmi');
    const btn_Source_PC_on  = document.querySelector('#Gr_SOURCE_Btn_Pc_on');
    const btn_Source_USBC_on = document.querySelector('#Gr_SOURCE_Btn_Portatil_on');
    const btn_Source_HDMI_on = document.querySelector('#Gr_SOURCE_Btn_Hdmi_on');

    let fuente = 'err'; 
    switch(src.O1){
        case 'I1': fuente = 'HDMI';
            if (btn_Source_HDMI){
                    // Activa/Visualiza botones
                btn_Source_HDMI_on.removeAttribute("hidden");
                btn_Source_PC.removeAttribute("hidden");
                btn_Source_USBC.removeAttribute("hidden");
                    // Oculta Botones
                btn_Source_HDMI.setAttribute("hidden","hidden");
                btn_Source_PC_on.setAttribute("hidden","hidden");
                btn_Source_USBC_on.setAttribute("hidden","hidden");
            }
            break;
        case 'I2': fuente = 'PC SALA';
            if (btn_Source_PC){
                    // Activa/Visualiza botones
                    btn_Source_HDMI.removeAttribute("hidden");
                    btn_Source_PC_on.removeAttribute("hidden");
                    btn_Source_USBC.removeAttribute("hidden");
                        // Oculta Botones
                    btn_Source_HDMI_on.setAttribute("hidden","hidden");
                    btn_Source_PC.setAttribute("hidden","hidden");
                    btn_Source_USBC_on.setAttribute("hidden","hidden");
                }
            break;
        case 'I3': fuente = 'USBC';
            if (btn_Source_USBC){
                    // Activa/Visualiza botones
                    btn_Source_HDMI.removeAttribute("hidden");
                    btn_Source_PC.removeAttribute("hidden");
                    btn_Source_USBC_on.removeAttribute("hidden");
                        // Oculta Botones
                    btn_Source_HDMI_on.setAttribute("hidden","hidden");
                    btn_Source_PC_on.setAttribute("hidden","hidden");
                    btn_Source_USBC.setAttribute("hidden","hidden");
                }
            break;
        case 'I4': fuente = 'NONE';
            break;
    }
    if (src_matrix)
        src_matrix.innerHTML = 'Fuente seleccionada: '+fuente;

});
    // Cambio de PWR de proyector
socket.on('proyector', (pwr) =>{
    let estado = 'err'; 
    switch(pwr){
        case '01': 
            ;
            break;
        case '02': estado = 'PC SALA';
            break;
        case '03': estado = 'USBC';
            break;
        case '04': estado = 'NONE';
            break;
    }
});

if (btn_inicio){
    btn_inicio.addEventListener('click', () => { 
        const payload = 'image';
        console.log('emitiendo: "CTRL_STATE", "inicio"');
        socket.emit('salaEstado', 'INICIO');
        //socket.emit('image_chg', payload);
        //targetUrl = 'EscenasSimplificado.html';
        //top.location.href = targetUrl;
    });
}
    

//v-on:click='UI_CTRL_evt("CTRL_STATE", "inicio")' onclick='btnEscenasSimplificvado()'