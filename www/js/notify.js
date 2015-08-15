document.addEventListener('deviceready', onDeviceReady, true);
var pushNotification;
var gsmKey = 'gsm-key';

function onDeviceReady() {
	var version = device.platform;	
	var senderId = "210482740085";
	if(version == "Android") {
		var gsmKeyLocal = window.localStorage.getItem(gsmKey);
		if(!gsmKeyLocal) {
			GCMPush.register(successHandler, errorHandler, {"senderId":senderId});
		}	
	}	
}	

function successHandler(regid) {
	registerDevice(regid);
}

function errorHandler(error) {
	console.log("Error: " + error);
}


// Your GCM push server needs to know the regID before it can push to this device
//Send the regid to the GSM Server
function registerDevice(regId) {
	var url = "http://smartdroidies.com/tamilquotes/gcm/register.php";
	//console.log("Device ID : " + device.uuid)
	$.post( url, { dName: device.name, 
					dcordova: device.cordova, 
					dplatform: device.platform, 
					duuid: device.uuid, 
					dversion:device.version, 
					dmodel:device.model, 
					regid: regId}, 
				function( data ) {
					window.localStorage.setItem(gsmKey, true);
				}
			);
}