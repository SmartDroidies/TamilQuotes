'use strict';

/* Controllers */
var tamilQuotesControllers = angular.module('tamilQuotesControllers', []);

/*
tamilQuotesControllers.controller('HomeCtrl', ['$scope',  
  function($scope) {
	
	$scope.displayHome = function () {       
		$scope.name = 'Chinki';
	};

	//Show Home
	$scope.displayHome();
  }]
);
*/


tamilQuotesControllers.controller('HomeCtrl', ['$scope', '$http',  'CategoryService', 
  function($scope, $http,  categoryService) {
	
	$scope.displayHome = function () {       
		//console.log('Display Home Screen');
		//window.plugins.spinnerDialog.show();
		var promise =  categoryService.collectCategories();
		promise.then (
  			function(data) {
			 	$scope.categories = data.categories;
			 	console.log("Data Collected " + JSON.stringify(data));
  			},
  			function(error) {
  				//FIXME - Display Error
    			console.log('No Categories Found.');
  			});

		//Sync Local Data
		//storageService.syncDate();
    	//window.plugins.spinnerDialog.hide();
	};

	//Show Home
	$scope.displayHome();
  }]
);
