var testDevice = '9ff99ad5ec042ed6TEST';
var interDisplayed = false;
var analyticsId = 'UA-74071818-2';
var GCMSenderId = '1042154778523';

// select the right Ad Id according to platform 
var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos 
    admobid = {
        banner: 'ca-app-pub-8348832609194072/9466879544', 
        interstitial: 'ca-app-pub-8348832609194072/3420345945'
    };
} 

//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyAction, false);
function onDeviceReadyAction() {

    window.analytics.startTrackerWithId(analyticsId);

	// Manage Ad
	initializeAd();

    //Initialize for Google Cloud Messaging
    initializeGCM();


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

function initializeAd() {

    if(!isTestDevice()) {
        if(AdMob) AdMob.createBanner( {
            adId: admobid.banner, 
            position: AdMob.AD_POSITION.BOTTOM_CENTER, 
            autoShow: true 
        } );
    }
            
    // preppare and load ad resource in background, e.g. at begining of game level 
    if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );

}

function isTestDevice() {
    var flgTestDevice = false;
    var deviceUUID = device.uuid;
    if(deviceUUID == testDevice) {
      //console.log("Test Device : " + device.uuid);
      flgTestDevice = true;
    }
    //flgTestDevice = false;
    return flgTestDevice;
}

//Load AdMob Interstitial Ad
function showInterstitial() {
    if(!isTestDevice() && !interDisplayed) {
        if(AdMob) {
            AdMob.showInterstitial();
            interDisplayed = true;
        }   
    }    
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
    var message = {
        subject: 'Try this great App',
        text: "Tamil Status & Quotes -",
        url: "https://play.google.com/store/apps/details?id=com.smart.droidies.tamil.quotes"
    };
    window.socialmessage.send(message);
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


//Initialize Google Clould Messaging
function initializeGCM() {
  window.GCMPush.register(successHandlerGCM, errorHandlerGCM, {
      "senderId" : GCMSenderId,
      "jsCallback" : "onNotification"
  });

}

//Success Handler for GCM Resgistration
function successHandlerGCM(result) {
  console.log("GCM Successfully Registered. Token: " + result.gcm);
}

//Failure Handler for GCM Resgistration
function errorHandlerGCM(error) {
  console.log("GCM Registration Error: " + error);
}

//GCM Notification Recieved
function onNotification(id) {
  console.log("Event Received: " + id);  
  if(!isNaN(id)) {
    console.log("Go to quote : " + id);
    //var landingPath = "#/article/" + id;
    //window.location = landingPath;
  }  
}

