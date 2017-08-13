/*
 * Visualizza la data della prossima estrazione
 *
 * */
setHeaderDate = function(dateConc, divId, canale) {
    try {
        console.debug('setHeaderDate BEGIN');
        if (dateConc != null) {
            var dataEstrazione = new Date(dateConc),
                giorno = dataEstrazione.getDate(),
                weekDay = dataEstrazione.getDay(),
                month = this.getMonth(dataEstrazione.getMonth(), true),
                txtDate = '';
            if (canale == 'vnc') {
                txtDate = this.getWeekDay(weekDay) + " " + giorno + " " + month;
            } else {
                txtDate = giorno + " " + month;
            }
            jQuery('#' + divId).text(txtDate);
        } else {
            jQuery('#' + divId).text(this.IN_AGGIORNAMENTO);
            //jQuery('#'+divId).addClass("ws-nve-inAggiornamento");
        }
        console.debug('setHeaderDate  END');
    } catch (e) {
        console.log(e);
    }
};
/**
 * setDataEstrazione: imposta la data per la visualizzazione
 *
 * dataEstraz: data
 */
setDataEstrazione = function(dataEstraz, showMonth, showWeekDay, noSeparator) {
    console.debug('Calles GN.Util.setDataEstrazione - IN:dataEstraz = ' + dataEstraz);
    var retValue;
    var date = new Date(dataEstraz);
    console.log(date);
    var year = date.getYear();
    if (year < 1900) year += 1900;
    var month = date.getMonth();
    var day = date.getDate();
    var weekDay = date.getDay();
    if (showWeekDay) {
        retValue = this.getWeekDay(weekDay) + " " + day + "/" + this.getMonth(month, showMonth) + "/" + year;
    } else {
        retValue = day + "/" + this.getMonth(month, showMonth) + "/" + year;
    }
    if (noSeparator) {
        retValue = retValue.replace(/\//g, " ");
    }
    return retValue;
};
getWeekDay = function(day) {
    if (isNaN(day)) return "";
    if (day < 0) return "domenica";
    if (day > 6) return "sabato";
    switch (day) {
        case 0:
            return "domenica";
        case 1:
            return "lunedÃ¬";
        case 2:
            return "martedÃ¬";
        case 3:
            return "mercoledÃ¬";
        case 4:
            return "giovedÃ¬";
        case 5:
            return "venerdÃ¬";
        case 6:
            return "sabato";
    }
};
getMonth = function(day, text) {
    if (isNaN(day)) return "";
    if (text) {
        if (day < 0) return "gennaio";
        if (day > 11) return "dicembre";
        switch (day) {
            case 0:
                return "gennaio";
            case 1:
                return "febbraio";
            case 2:
                return "marzo";
            case 3:
                return "aprile";
            case 4:
                return "maggio";
            case 5:
                return "giugno";
            case 6:
                return "luglio";
            case 7:
                return "agosto";
            case 8:
                return "settembre";
            case 9:
                return "ottobre";
            case 10:
                return "novembre";
            case 11:
                return "dicembre";
        }
    } else {
        if (day < 0) return "01";
        if (day > 11) return "12";
        switch (day) {
            case 0:
                return "01";
            case 1:
                return "02";
            case 2:
                return "03";
            case 3:
                return "04";
            case 4:
                return "05";
            case 5:
                return "06";
            case 6:
                return "07";
            case 7:
                return "08";
            case 8:
                return "09";
            case 9:
                return "10";
            case 10:
                return "11";
            case 11:
                return "12";
        }
    }
};
// var timestamp = jQuery.ajax({
//     url: "http://www.vincicasa.it/sisal-gn-proxy-servlet-web/proxy/" + "/gntn-info-web/rest/gioco/vincicasa/estrazioni/ultimoconcorso",
//     type: 'GET'"http://www.vincicasa.it/sisal-gn-proxy-servlet-web/proxy/" + "/gntn-info-web/rest/gioco/vincicasa/estrazioni/ultimoconcorso",
//     data: {
//         idPartner: "123456789"
//     },
//     dataType: "json",
//     success: function(result) {
//         dataEstrazione = result.dettaglioConcorso.dataEstrazione;
//         return setDataEstrazione(dataEstrazione, false, true, false);
//     },
//     error: function(xhr, msg) {
//         console.log(msg + ": " + xhr.responseText);
//     }
// });
// setDataEstrazione(1494442800000, false, true, false);
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "http://www.vincicasa.it/sisal-gn-proxy-servlet-web/proxy/gntn-info-web/rest/gioco/vincicasa/estrazioni/ultimoconcorso", true);
xmlhttp.setRequestHeader("dataType", "JSON");
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        //alert the user that a response now exists in the responseTest property.
        var data = JSON.parse(xmlhttp.response);
        var dataEstrazione = data.dettaglioConcorso.dataEstrazione;
        setDataEstrazione(dataEstrazione, false, true, false);
        // And to view in firebug
        console.log('xhr', xmlhttp)
    }
}
xmlhttp.send("idPartner=123456789");
