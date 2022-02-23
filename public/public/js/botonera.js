var slider = document.getElementById("Gr_VOL_Btn_Volume");

/***Redirección de rutas***/
function btnAyuda(){
    targetUrl = 'Ayuda.html';
    top.location.href = targetUrl;
}
function btnConfirmarApagar(){
    targetUrl = 'ConfirmacionApagar.html';
    top.location.href = targetUrl;
}
function btnInicio(){
    socket.emit('salaEstado', 'INICIO');
    targetUrl = 'index.html';
    top.location.href = targetUrl;
}
function btnSoloAudio(){
    socket.emit('salaEstado', 'SOLOAUDIO');
    targetUrl = 'SoloAudio.html';
    top.location.href = targetUrl;
}
function btnProyectar(){
    socket.emit('salaEstado', 'PROYECCION');
    targetUrl = 'Proyectar.html';
    top.location.href = targetUrl;
}
function btnDocenciaHibrida(){
    socket.emit('salaEstado', 'VIDEOCONF');
    socket.emit('macro', 'VIDEOCONF');
    console.log('->macro. Videoconf');
    targetUrl = 'DocenciaHibrida.html';
    //top.location.href = targetUrl;
}
function btnCtrlManual(){
    targetUrl = 'ControlManual.html';
    top.location.href = targetUrl;
}
function btnTeams(){
    targetUrl = 'ConfiguracionTeams.html';
    top.location.href = targetUrl;
    //socket.emit('salaEstado', 'ASISTENTE');
}
function btnAsistente(){
    socket.emit('salaEstado', 'ASISTENTE');
    targetUrl = 'Asistente1.html';
    top.location.href = targetUrl;
}
function btnAsistente2(){
    targetUrl = 'Asistente2.html';
    top.location.href = targetUrl;
}
function btnAsistente3(){
    targetUrl = 'Asistente3.html';
    top.location.href = targetUrl;
}
function btnEscenasSimplificvado(){
    socket.emit('salaEstado', 'INICIO');
    targetUrl = 'EscenasSimplificado.html';
    top.location.href = targetUrl;
}
function btnSeleccionarFuente(){
    targetUrl = 'SeleccionDeFuente.html';
    top.location.href = targetUrl;
}
function btnEscenasSimplificvado(){
    targetUrl = 'EscenasSimplificado.html';
    top.location.href = targetUrl;
}
function btnRetrocede(){

}
function btnSource(src){
    switch(src){
        case 'PC':
            socket.emit('setSource', 'I2');
            break;
        case 'HDMI':
            socket.emit('setSource', 'I1');
            break;
        case 'USBC':
            socket.emit('setSource', 'I3');
            break;
        default:
            console.log('btnSource err: ', src);
    }
}
/********/

/*
solo audio
proyectar
docencia

-volumen+*
-volumen-*
-Mute*

-Encender proyector*
-freez*
-selecionar fuente*

-Encender proyector*
-freez*
-selecionar fuente*
-grabar
*/ 

/************** iniciar freeze y de mute ***********/
function estadoBotones () {
    console.log(sessionStorage.getItem("statusBtnMute"));
    var btnMute = sessionStorage.getItem("statusBtnMute");
    var btnFreeze = sessionStorage.getItem("statusBtnFreeze");
    if (!btnMute){
        sessionStorage.setItem("statusBtnMute", "\"on\"");
    }
    if (!btnFreeze){
        sessionStorage.setItem("statusBtnFreeze", "\"on\"");
    }
}
/********/

/*********estado de los botones **********/
function btnActive(btn){
    if (document.getElementById(btn)) {
        document.getElementById(btn).classList.add('activate');
    }
}
function btnParpadea(btn){
    if (document.getElementById(btn)) {
        document.getElementById(btn).classList.add('parpadea');
    }
}
function btnOff(btn){
    if (document.getElementById(btn)) {
        document.getElementById(btn).classList.remove('activate');
    }
}
function btnParpadeaOff(btn){
    if (document.getElementById(btn)) {
        document.getElementById(btn).classList.remove('parpadea');
    }
}
/********/

/************action buttons************/
function accionSimpleBtn(btnData){
    console.log(sessionStorage.getItem("statusBtnMute"), sessionStorage.getItem("statusBtnFreeze"));
    var active = document.getElementById(btnData.id).classList;
    if (active[1]=="activate"||active[2]=="activate"){
        btnOff(btnData.id);
        btnParpadea(btnData.id);
    } else {
        btnActive(btnData.id);
        btnParpadea(btnData.id);
    }

}
/********/

/***Botones on y off separados***/
function accionMultiBtn(btnData){
    var active = document.getElementById(btnData.id).classList;
    if (active[1]!="activate"||active[2]!="activate") {
        btnActive(btnData.id);
        btnParpadea(btnData.id);
    }
}
/********/

/***Volume slider***/



function rangeStyle() {
    var range = document.getElementById('Gr_VOL_Btn_Volume');
    var x = range.value;
    var color = 'linear-gradient(90deg, rgb(0,204,44) ' + x + '%, rgb(238,238,238) ' + x + '%)';
    range.style.background = color;
    console.log(range.style.background);
}

function getVolumeInput() {
    return document.getElementById("Gr_VOL_Btn_Volume").value;
}
function setVolumeInput(volume) {
  document.getElementById("Gr_VOL_Btn_Volume").value = volume;
}
/*
(function(){
    $(function (){
        var range = $('#Gr_VOL_Btn_Volume'),
            value = $('.range-value');
        value.html(range.attr('value'));

        range.on('input', function(){
            value.html(this.value);
        });
    });
}());

*/
function actualizaVol() {
    var range = $('#Gr_VOL_Btn_Volume'),
        value = $('.range-value');
    value.html(range.attr('value'));

    range.on('input', function(){
        value.html(this.value);
    });
}
/********/

/****Modal source****
(function(){
    $(function (){
        $('#Gr_PROY_Btn_Source').on('click',function(){
            $('#modal-source').modal();
        })
    });
}());
/********/

/****Modal Camara****
(function(){
    $(function (){
        $('#Gr_CAM_Btn_CtrlCam').on('click',function(){
            $('#modal-camara').modal();
        })
    });
}());
(function(){
    $(function (){
        $('#Gr_REC_Btn_CAM').on('click',function(){
            $('#modal-camara').modal();
        })
    });
}());
/********/

/* cambio de imagenes Botones */
function encenderMute(){
    $('#Gr_VOL_Btn_Mute_on').removeAttr("hidden");
    $('#Gr_VOL_Btn_Mute').attr("hidden","hidden");
};
function quitarMute(){
    $('#Gr_VOL_Btn_Mute').removeAttr("hidden");
    $('#Gr_VOL_Btn_Mute_on').attr("hidden","hidden");
}
/***********/
/* cambio de imagenes Botones */
const btn_proy_Pwr_on = document.querySelector('#Gr_PROY_Btn_Pwr_on');
const btn_proy_Pwr    = document.querySelector('#Gr_PROY_Btn_Pwr');
function encenderProyector(){
    btn_proy_Pwr_on.removeAttribute("hidden");
    btn_proy_Pwr.setAttribute("hidden","hidden");
    socket.emit('proyector', 'PWR_ON');
};
function quitarProyector(){
    btn_proy_Pwr.removeAttribute("hidden");
    btn_proy_Pwr_on.setAttribute("hidden","hidden");
    socket.emit('proyector', 'PWR_OFF');
}
/***********/
/* cambio de imagenes Botones */
const btn_proy_Frz_on = document.querySelector('#Gr_PROY_Btn_Freeze_on');
const btn_proy_Frz    = document.querySelector('#Gr_PROY_Btn_Freeze');
function encenderFreeze(){
    btn_proy_Frz_on.removeAttribute("hidden");
    btn_proy_Frz.setAttribute("hidden","hidden");
    socket.emit('proyector', 'FRZ_ON');
    console.log('FRZ_ON');
};
function quitarFreeze(){
    btn_proy_Frz.removeAttribute("hidden");
    btn_proy_Frz_on.setAttribute("hidden","hidden");
    socket.emit('proyector', 'FRZ_OFF');
    console.log('FRZ_OFF');
}
/***********/
