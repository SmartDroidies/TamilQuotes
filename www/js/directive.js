'use strict';

/* Directive */
var tamilQuotesDirective = angular.module('tamilQuotesDirective',  []);

tamilQuotesDirective.directive('formatContent', function() {
	return {
		link: function(scope, element, attr) {
    		//console.log(element);
    		element.css({
        			position: 'relative',
         			border: '1px solid black',
         			backgroundColor: 'lightgrey',
         			cursor: 'pointer',
              		align : 'center'
        		});

        element.on('click', function(event) {
            event.preventDefault();
        });
  	 	}
  	};
});
