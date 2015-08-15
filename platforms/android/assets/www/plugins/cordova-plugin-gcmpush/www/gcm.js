cordova.define("cordova-plugin-gcmpush.GCMPush", function(require, exports, module) { "use strict";

var exec = require("cordova/exec");

var GCMPush = {

    register : function (onSuccess, onError, options) {
        cordova.exec( onSuccess, onError, "GCMPush", "register", [options]);
    }


};

module.exports = GCMPush;
});
