'use strict';

/* Directive */
var tamilQuotesFilter = angular.module('tamilQuotesFilter',  []);

tamilQuotesFilter.filter('wrap', function() {
  return function(input) {
    var length = 200;
    var out = "";
    if(input.length < 200) {
      out = input;
    } else {
      out = input.substr(1, length);
      var lenSpace = out.lastIndexOf(" ");
      if(lenSpace > 0) { 
        out = out.substr(1, lenSpace) + "...."
        //console.log("Processed String : " + out);
      }  
    }
    return out;
  };  
});
