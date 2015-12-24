'use strict';

/* App Module */
var tamilQuotesApp = angular.module('tamilQuotesApp', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'jm.i18next', 'underscore', 'tamilQuotesControllers', 'tamilQuotesServices', 'cacheService', 'tamilQuotesFilter']); 

tamilQuotesApp.config(['$routeProvider', 
		function ($routeProvider) {
			$routeProvider.when('/home', {
				templateUrl : 'partials/home.html',
				controller : 'HomeCtrl'
			}).
      when('/list', {
        templateUrl : 'partials/list.html',
        controller : 'QuoteListCtrl'
      }).
      when('/quotes/:cat', {
        templateUrl : 'partials/quotes.html',
        controller : 'QuotesCtrl'
      }).
      when('/quote/:cat/:index', {
        templateUrl : 'partials/quote.html',
        controller : 'QuoteCtrl'
      }).
      when('/quote/:id', {
        templateUrl : 'partials/quote.html',
        controller : 'QuoteCtrl'
      }).
			otherwise({
				redirectTo : '/home'
			});
		}
	]);

//ng-i18next - use i18next with Angularjs
angular.module('jm.i18next').config(['$i18nextProvider', function ($i18nextProvider) {
    $i18nextProvider.options = {
        lng: 'ta',
        useCookie: false,
        useLocalStorage: false,
        fallbackLng: 'en',
        resGetPath: 'locales/__lng__/__ns__.json',
        defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
    };
}]);