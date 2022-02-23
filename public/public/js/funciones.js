function ctrlSta(sta) {
    console.log(sta);
    // var targetUrl='';

    if (sta=="inicio") {
        sessionStorage.setItem("estado", "inicio");
    }
    if (sta=="apagado") {
        sessionStorage.setItem("estado", "apagado");
    }
    if (sta=="soloAudio") {
        sessionStorage.setItem("estado", "soloAudio");
    }
    if (sta=="proyeccion") {
        sessionStorage.setItem("estado", "proyeccion");
    }
    if (sta=="videoCall") {
        sessionStorage.setItem("estado", "videoCall");
    }
    if (sta=="record") {
        sessionStorage.setItem("estado", "record");
    }
}





function ctrlVol(vol) {
    var volume;
    if (vol.mute) {
        switch (vol.mute) {
            case "on":
                    btnParpadeaOff("Gr_VOL_Btn_Mute");
                    sessionStorage.setItem("statusBtnMute", "\"off\"");
                break;
            case "off":
                    btnParpadeaOff("Gr_VOL_Btn_Mute");
                    sessionStorage.setItem("statusBtnMute", "\"on\"");
                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }
    if (vol.level) {
        setVolumeInput(vol.level);
    }
    if (vol.inc_level) {
        volume = (vol.inc_level);
        setVolumeInput(volume);
    }
    if (vol.dec_level) {
        volume = (vol.dec_level);
        setVolumeInput(volume);
    }

}
function ctrlProy(proy) {
    if (proy.pwr) {
        switch (proy.pwr) {
            case "on":
                    btnParpadeaOff("Gr_PROY_Btn_PwrOn");
                    btnOff("Gr_PROY_Btn_PwrOff");
                break;
            case "off":
                    btnParpadeaOff("Gr_PROY_Btn_PwrOff");
                    btnOff("Gr_PROY_Btn_PwrOn");
                break;
            case "warm":
                    btnParpadea("Gr_PROY_Btn_PwrOn");
                break;
            case "cool":
                    btnParpadeaOff("Gr_PROY_Btn_PwrOn");
                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }
    if (proy.freeze) {
        switch (proy.freeze) {
            case "on":
                    btnParpadeaOff("Gr_PROY_Btn_Freeze");
                    sessionStorage.setItem("statusBtnFreeze", "\"off\"");
                break;
            case "mute":
                    btnParpadea("Gr_PROY_Btn_Freeze");
                    sessionStorage.setItem("statusBtnFreeze", "\"on\"");
                break;
            case "off":
                    btnParpadeaOff("Gr_PROY_Btn_Freeze");
                    sessionStorage.setItem("statusBtnFreeze", "\"on\"");
                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }
}
function ctrlSource(source) {
    switch (source) {
        case "pcsala":
                btnParpadeaOff("Gr_SOURCE_Btn_Pc");
                btnOff("Gr_SOURCE_Btn_Wireless");
                btnOff("Gr_SOURCE_Btn_Portatil");
            break;
        case "portatil":
                btnParpadeaOff("Gr_SOURCE_Btn_Portatil");
                btnOff("Gr_SOURCE_Btn_Wireless");
                btnOff("Gr_SOURCE_Btn_Pc");
            break;
        case "wireless":
                btnParpadeaOff("Gr_SOURCE_Btn_Wireless");
                btnOff("Gr_SOURCE_Btn_Portatil");
                btnOff("Gr_SOURCE_Btn_Pc");
            break;
        default:
            console.log('Lo lamentamos, por el momento no disponemos de.');
    }
}
function ctrlRec(rec) {

    switch (rec) {
        case "on":
                btnParpadeaOff("Gr_REC_Btn_ON");
                btnOff("Gr_REC_Btn_OFF");
            break;
        case "off":
                btnParpadeaOff("Gr_REC_Btn_OFF");
                btnOff("Gr_REC_Btn_ON");
            break;
        case "err":

            break;
        default:
            console.log('Lo lamentamos, por el momento no disponemos de.');
    }
}
function ctrlCam(cam) {
    if (cam.tracking) {
        switch (cam.tracking) {
            case "on":
                    btnParpadeaOff("Gr_CAM_Btn_TrackingOn");
                    btnOff("Gr_CAM_Btn_TrackingOff");
                break;
            case "off":
                    btnParpadeaOff("Gr_CAM_Btn_TrackingOff");
                    btnOff("Gr_CAM_Btn_TrackingOn");
                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }
    if (cam.preset) {
        switch (cam.preset) {
            case "techo":

                break;
            case "general":
                    btnParpadeaOff("Gr_CAM_Btn_PresetGen");
                    btnOff("Gr_CAM_Btn_PresetMesa");
                    btnOff("Gr_CAM_Btn_PresetIzda");
                    btnOff("Gr_CAM_Btn_PresetDcha");
                break;
            case "mesa":
                    btnParpadeaOff("Gr_CAM_Btn_PresetMesa");
                    btnOff("Gr_CAM_Btn_PresetGen");
                    btnOff("Gr_CAM_Btn_PresetIzda");
                    btnOff("Gr_CAM_Btn_PresetDcha");
                break;
            case "izda":
                    btnParpadeaOff("Gr_CAM_Btn_PresetIzda");
                    btnOff("Gr_CAM_Btn_PresetGen");
                    btnOff("Gr_CAM_Btn_PresetMesa");
                    btnOff("Gr_CAM_Btn_PresetDcha");
                break;
            case "dcha":
                    btnParpadeaOff("Gr_CAM_Btn_PresetDcha");
                    btnOff("Gr_CAM_Btn_PresetGen");
                    btnOff("Gr_CAM_Btn_PresetMesa");
                    btnOff("Gr_CAM_Btn_PresetIzda");
                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }
    if (cam.zoom) {
        switch (cam.zoom) {
            case "in":

                break;
            case "out":

                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }
    if (cam.pantil) {
        switch (cam.pantil) {
            case "up":

                break;
            case "down":

                break;
            case "left":

                break;
            case "rigth":

                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de.');
        }
    }

}