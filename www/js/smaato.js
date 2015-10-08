var ad_units = {
    publisherId: "1100012715",    
    iosadid: "",
    iosadtracking: true,
    googleadid: "",
    googlednt: false,
    android: {
        banner: '130050176',            // Phones and Tablets 320 x 50 
        skyscraper: '130050177'         // Tablets 120 x 600 
    }

    /*
    android: {
        tiny_banner: '101002696',       // Phones and Tablets 120 x 20 
        puny_banner: '101002695',       // Phones and Tablets 168 x 28 
        little_banner: '101002694',     // Phones and Tablets 216 x 36 
        small_banner: '101002693',      // Tablets 300 x 50 
        banner: '101002692',            // Phones and Tablets 320 x 50 
        medium_rectangle: '101002697',  // Phones and Tablets 300 x 250 
        leaderboard: '101002669',       // Tablets 728 x 90 
        interstitial: '101002659',      // Phones and Tablets 100% 
        skyscraper: '101002698'         // Tablets 120 x 600 
    }
    ,
    ios: {
        tiny_banner: '101002696',       // Phones and Tablets 120 x 20 
        puny_banner: '101002695',       // Phones and Tablets 168 x 28 
        little_banner: '101002694',     // Phones and Tablets 216 x 36 
        small_banner: '101002693',      // Tablets 300 x 50 
        banner: '101002692',            // Phones and Tablets 320 x 50 
        medium_rectangle: '101002697',  // Phones and Tablets 300 x 250 
        leaderboard: '101002669',       // Tablets 728 x 90 
        interstitial: '101002659',      // Phones and Tablets 100% 
        skyscraper: '101002698'         // Tablets 120 x 600 
    },
    wp8: {
        tiny_banner: '101002675',       // Phones and Tablets 120 x 20 
        puny_banner: '101002358',       // Phones and Tablets 168 x 28 
        little_banner: '101002359',     // Phones and Tablets 216 x 36 
        small_banner: '101002362',      // Tablets 300 x 50 
        banner: '101002353',            // Phones and Tablets 320 x 50 
        medium_rectangle: '101002354',  // Phones and Tablets 300 x 250 
        leaderboard: '101002218',       // Tablets 728 x 90 
        interstitial: '101002361',      // Phones and Tablets 100% 
        skyscraper: '101002360'         // Tablets 120 x 600 
    },
    web: {
        tiny_banner: '101002675',       // Phones and Tablets 120 x 20 
        puny_banner: '101002358',       // Phones and Tablets 168 x 28 
        little_banner: '101002359',     // Phones and Tablets 216 x 36 
        small_banner: '101002362',      // Tablets 300 x 50 
        banner: '101002353',            // Phones and Tablets 320 x 50 
        medium_rectangle: '101002354',  // Phones and Tablets 300 x 250 
        leaderboard: '101002218',       // Tablets 728 x 90 
        interstitial: '101002361',      // Phones and Tablets 100% 
        skyscraper: '101002360'         // Tablets 120 x 600 
    }
    */
};
 
// select the right Ad Id according to platform 
var adid = (/(android)/i.test(navigator.userAgent)) ? ad_units.android : ad_units.ios;

//Device Ready Event
document.addEventListener("deviceready", onDeviceReadyLoadAd, false);
function onDeviceReadyLoadAd() {

    // it will display leaderboard banner at bottom center, using the default options 
    /*
    var div = document.createElement("div");
    document.appendChild(div);
    var simpleAd = new Smaato(div, {
        publisherId: ad_units.publisherId,
        adId: adid.skyscraper
    });
    */

    // or, show a default banner at top 
    var div = document.createElement("div");
    document.body.appendChild(div);
    var banner = new Smaato(div, {
        publisherId: ad_units.publisherId,
        adId: adid.banner, 
        position:SMAATO_AD_POSITION.TOP_CENTER, 
        adSize: SMAATO_AD_SIZE.BANNER,
        autoShow: true,
        isTesting: true 
    });
}


