//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyAction, false);
function onDeviceReadyAction() {

	// Manage Ad
	// initializeAd();

    //Handle Setting 
    $( "#setting-cntrl" ).click(function() {
        if($("#setting").is(":visible")) {
            hideMenu();
        } else {
            $("#setting").show(200);
        }
    });

}

function hideMenu() {
    //$("#menu").hide(100);
    $("#setting").hide(100);
}


/*
//Exit Implementation
document.addEventListener("backbutton", function() {
	if ( $('.ui-page-active').attr('id') == 'main') {
		exitAppPopup();
	} else {
		history.back();             
	}
}, false);

function exitAppPopup() {
    navigator.notification.confirm(
          'Exit Telugu Tips'
        , function(button) {
              if (button == 2) {
                  navigator.app.exitApp();
              } 
          }
        , 'Exit'
        , 'No,Yes'
    );  
    return false;
}
*/

function initializeAd() {

	  admob.initAdmob("ca-app-pub-8348832609194072/9466879544","ca-app-pub-8348832609194072/3420345945");
    document.addEventListener(admob.Event.onInterstitialReceive, onInterstitialReceive, false);
    document.addEventListener(admob.Event.onInterstitialFailedReceive,onReceiveFail, false);
    document.addEventListener(admob.Event.onBannerFailedReceive,onReceiveFail, false);

    admob.showBanner(admob.BannerSize.BANNER, admob.Position.BOTTOM_CENTER, null);
  	admob.cacheInterstitial();

}

//Load AdMob Interstitial Ad
function showInterstitial(){
    admob.isInterstitialReady(function(isReady){
        if(isReady){
            admob.showInterstitial();
        }
    });
}

function onInterstitialReceive (message) {
    //alert(message.type + " ,you can show it now");
    //admob.showInterstitial();//show it when received
}

function onReceiveFail (message) {
 	var msg=admob.Error[message.data];
    if(msg==undefined){
       msg=message.data;
    }
    //console.log("load fail: " + message.type + "  " + msg);
} 

//Rate App
function rateus() {
    var version = device.platform;
    hideMenu();
    if(version == "Android") {
        var url = "market://details?id=com.smart.droidies.tamil.quotes";
        window.open(url,"_system");     
    }   
}


//Share the app link with user
function shareApp() {
    window.plugins.socialsharing.share('Try this great App - ', 'Tamil Status & Quotes ', null, 'https://play.google.com/store/apps/details?id=com.smart.droidies.tamil.quotes');

    hideMenu();
}

//Provide Feedback
function feedback() {
    window.plugin.email.open({
        to:      ['tamilistatus@gmail.com'],
        subject: 'Feedback on Tamil Status & Quotes',
        body:    '',
        isHtml:  true
    });
    hideMenu();
}

