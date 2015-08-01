'use strict';

/* App Module */
/* var tamilQuotesApp = angular.module('tamilQuotesApp', ['ngRoute', 'ngSanitize', 'pascalprecht.translate', 'tamilPaarvaiControllers', 'parvaiServices', 'parvaiFilters', 'underscore', 'cacheService']); */
var tamilQuotesApp = angular.module('tamilQuotesApp', ['ngRoute', 'ngSanitize', 'jm.i18next', 'underscore', 'tamilQuotesControllers', 'tamilQuotesServices', 'cacheService']); 

tamilQuotesApp.config(['$routeProvider', 
		function ($routeProvider) {
			$routeProvider.when('/home', {
				templateUrl : 'partials/home.html',
				controller : 'HomeCtrl'
			}).
      /*
      when('/articles/:cat', {
        templateUrl : 'partials/articles.html',
        controller : 'ArticlesCtrl'
      }).
      when('/article/:cat/:id/:index', {
        templateUrl : 'partials/article.html',
        controller : 'ArticleCtrl'
      }).
      when('/article/:id', {
        templateUrl : 'partials/article.html',
        controller : 'ArticleDirectCtrl'
      }).
      */
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