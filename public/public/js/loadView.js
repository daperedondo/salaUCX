//Carga los estados iniciales de los botones
function ctrlBtnStatus(btnStatus, err) {
    if (btnStatus.Gr_VOL_Btn_Volume) {
        setVolumeInput(btnStatus.Gr_VOL_Btn_Volume);
        actualizaVol();
    }
    if (btnStatus.ESTADO) {
        desbloVista(btnStatus.ESTADO, err);
    }
    for (i = 0; i < Object.keys(btnStatus).length; i++ ){
        var btnName = Object.keys(btnStatus)[i];
        if (!(btnName.toString()=== "Gr_VOL_Btn_Volume") || !(btnName.toString()=== "ERROR")) {
            switch (btnStatus[btnName]) {
                case "encendiendo":
                    btnActive(btnName);
                    btnParpadea(btnName);

                    if (btnName == "Gr_VOL_Btn_Mute"){
                        setBtnMuteLoad("off");
                    }
                    if (btnName == "Gr_PROY_Btn_Freeze"){
                        setBtnFreezeLoad("off");
                    }
                    break;
                case "encendido":
                    btnActive(btnName);

                    if (btnName == "Gr_VOL_Btn_Mute"){
                        setBtnMuteLoad("off");
                    }
                    if (btnName == "Gr_PROY_Btn_Freeze"){
                        setBtnFreezeLoad("off");
                    }
                    break;
                case "apagando":
                    btnParpadea(btnName);

                    if (btnName == "Gr_VOL_Btn_Mute"){
                        setBtnMuteLoad("on");
                    }
                    if (btnName == "Gr_PROY_Btn_Freeze"){
                        setBtnFreezeLoad("on");
                    }
                    break;
                case "apagado":
                    if (btnName == "Gr_VOL_Btn_Mute"){
                        setBtnMuteLoad("on");
                    }
                    if (btnName == "Gr_PROY_Btn_Freeze"){
                        setBtnFreezeLoad("on");
                    }
                    break;
                default:
                    console.log('Lo lamentamos, por el momento no disponemos de.');
            }
        }
    }

}
//set del valor de mute
function setBtnMuteLoad (estado){
    sessionStorage.setItem("statusBtnMute", "\"" +estado+ "\"");
}
//set del valor de Freeze
function setBtnFreezeLoad (estado){
    sessionStorage.setItem("statusBtnFreeze", "\"" +estado+ "\"");
}


//desbloquear la vista
function desbloVista (estado, error) {
    if (estado==="soloAudio") {
        if (!error.AUDIO || (error.AUDIO && error.AUDIO===false)) {
            desbloquearVol();
        }
    }
    if (estado==="proyeccion") {
        if (!error.AUDIO || (error.AUDIO && error.AUDIO===false)) {
            desbloquearVol();
        }
        if (!error.PROYECCION || (error.PROYECCION && error.PROYECCION===false)) {
            desbloquearProy();
        }
    }
    if (estado==="videoCall") {
        if (!error.AUDIO || (error.AUDIO && error.AUDIO===false)) {
            desbloquearVol();
        }
        if (!error.PROYECCION || (error.PROYECCION && error.PROYECCION===false)) {
            desbloquearProy();
        }
        if (!error.CAMARA || (error.CAMARA && error.CAMARA===false)) {
            desbloquearTeamsCam();
        }
    }
    if (estado==="record") {
        if (!error.AUDIO || (error.AUDIO && error.AUDIO===false)) {
            desbloquearVol();
        }
        if (!error.PROYECCION || (error.PROYECCION && error.PROYECCION===false)) {
            desbloquearProy();
        }
        if (!error.CAMARA || (error.CAMARA && error.CAMARA===false)) {
            desbloquearRec();
        }
    }
}
function desbloquearVol () {
    $("#Gr_VOL_Btn_Volume").prop('disabled', false);
    $("#Gr_VOL_Btn_Inc").prop('disabled', false);
    $("#Gr_VOL_Btn_Dec").prop('disabled', false);
    $("#Gr_VOL_Btn_Mute").prop('disabled', false);
}
function desbloquearProy () {
    $("#Gr_PROY_Btn_PwrOn").prop('disabled', false);
    $("#Gr_PROY_Btn_Source").prop('disabled', false);
    $("#Gr_PROY_Btn_Freeze").prop('disabled', false);
    $("#Gr_PROY_Btn_PwrOff").prop('disabled', false);
}
function desbloquearRec () {
    $("#Gr_REC_Btn_ON").prop('disabled', false);
    $("#Gr_REC_Btn_OFF").prop('disabled', false);
    $("#Gr_REC_Btn_CAM").prop('disabled', false);
}
function desbloquearTeamsCam () {
    $("#Gr_CAM_Btn_CtrlCam").prop('disabled', false);
}
