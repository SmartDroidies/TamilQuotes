'use strict';

/* Controllers */
var tamilQuotesControllers = angular.module('tamilQuotesControllers', []);


tamilQuotesControllers.controller('HomeCtrl', ['$scope', '$http',  'CategoryService', 'StorageService', '$location',
  function($scope, $http,  categoryService, storageService ,$location) {
	
	$scope.displayHome = function () {       
		//console.log('Display Home Screen');
		window.plugins.spinnerDialog.show();
		var promise =  categoryService.collectCategories();
		promise.then (
  			function(data) {
			 	$scope.categories = data.categories;
  			},
  			function(error) {
  				//FIXME - Display Error
    			console.log('No Categories Found.');
  			});

		//Sync Local Data
		storageService.syncDate();
    	window.plugins.spinnerDialog.hide();

    	$location.path('/list');  
	};

	$scope.showList = function () {       
		window.plugins.spinnerDialog.show();
    	console.log('Show List');
    	window.plugins.spinnerDialog.hide();
	};

	//Show Home
	$scope.displayHome();
  }]
);


tamilQuotesControllers.controller('QuoteListCtrl', ['$scope', '$http',  'QuoteService', 
  function($scope, $http,  quoteService) {
	
	$scope.showList = function () {       
		//window.plugins.spinnerDialog.show();
    	//window.plugins.spinnerDialog.hide();

	};

	//List All new quptes
	$scope.listNewQuotes = function () {
		var quotes = quoteService.collectNewQuotes();
		if (quotes === undefined || quotes === null) {
			console.log('JSON is empty. Display Error');
			//FIXME - Display Message
		} else {
			$scope.quotes = quotes;
		}
	};
	

	//Show List
	$scope.listNewQuotes();

  }]
);

