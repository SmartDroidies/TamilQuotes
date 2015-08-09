//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyAction, false);
function onDeviceReadyAction() {

	// Manage Ad
	initializeAd();
	

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

    //admob.showBanner(admob.BannerSize.BANNER, admob.Position.TOP_CENTER, null);
    admob.showBannerAbsolute(admob.BannerSize.BANNER, 20, 50);
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


function showBannerAd() {
	//show banner at the bottom center
	if(typeof admob !== "undefined") {
		admob.showBanner(admob.BannerSize.BANNER, admob.Position.BOTTOM_CENTER, null);
	}	
}

function hideBannerAd() {
	//show banner at the bottom center
	if(admob) {
		admob.hideBanner();
	}	
}