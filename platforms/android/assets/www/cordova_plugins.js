cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/hu.dpal.phonegap.plugins.SpinnerDialog/www/spinner.js",
        "id": "hu.dpal.phonegap.plugins.SpinnerDialog.SpinnerDialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "hu.dpal.phonegap.plugins.SpinnerDialog": "1.3.1"
}
// BOTTOM OF METADATA
});