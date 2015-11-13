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

    	//$location.path('/list');  
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


//Controller for listing quotes
tamilQuotesControllers.controller('QuotesCtrl', ['$scope', 'QuoteService', 'CategoryService', '$routeParams', '$location',
  function($scope, quoteService, Category, $routeParams, $location) {
	
	//List All new quptes
	$scope.listQuotes = function () {
		
		var categoryId = $routeParams.cat;
		//console.log("Quotes Category : " + categoryId);

		window.plugins.spinnerDialog.show();

		var ctgry = Category.collectCategory(categoryId);

		var quotes = quoteService.fetchQuotesByCategory(categoryId);
		if (quotes === undefined || quotes === null) {
			console.log('JSON is empty. Display Error');
			//FIXME - Display Message
		} else {
			//console.log(JSON.stringify(quotes));
			$scope.quotes = quotes;
		}

		$scope.category = ctgry;
		window.plugins.spinnerDialog.hide();
	};
	
	//Display Quote
	$scope.displayQuote = function (categoryId, index) {
		$location.path('/quote/' + categoryId + "/" + index);  
	};

	//Show Quotes
	$scope.listQuotes();

  }]
);


//Controller for displaying quote detail
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


//Controller to display Quote Detail
tamilQuotesControllers.controller('QuoteCtrl', ['$scope', '$routeParams', 'QuoteService', 'CategoryService', '$sce', '$interval',
	function($scope, $routeParams, Quote,  Category, $sce, $interval) {

	$scope.displaySelectedQuote = function() {
		var categoryId = $routeParams.cat;
		var idx = $routeParams.index;
		$scope.index = idx;
		$scope.categoryId = categoryId;
		$scope.displayQuoteDetail();
		showInterstitial();
	}

	//Method to display quote detail
	$scope.displayQuoteDetail = function () {         
		var ctgry = Category.collectCategory($scope.categoryId);
		var quote = Quote.collectQuote($scope.categoryId, $scope.index);
		if (quote === undefined || quote === null) {
			console.log('JSON is empty. Display Error');
		} else {
			$scope.quote = quote;
		}
		$scope.category = ctgry;
		$scope.size = quote.size;
	}


	//Older Qupte  
	$scope.older = function () {
		console.log('Swipe Older Triggered');
		$scope.index = ($scope.index < $scope.size) ? ++$scope.index : $scope.size;
		$scope.displayQuoteDetail();
	};

	//Newer Quote  
	$scope.newer = function () {
		console.log('Swipe Newer Triggered');
		$scope.index = ($scope.index > 0) ? --$scope.index : 0;
		$scope.displayQuoteDetail();
	};

	//Share Data
	$scope.share = function (quote) {         
		var message = {
    		text: quote.content,
    		url: "https://play.google.com/store/apps/details?id=com.smart.droidies.tamil.quotes"
		};
		window.socialmessage.send(message);
	};

	//Copy Data
	$scope.copy = function (quote) {         
		cordova.plugins.clipboard.copy(quote.content);

		window.plugins.toast.showWithOptions(
    		{
      			message: "Message Copied",
      			duration: "long",
      			position: "bottom",
      			addPixelsY: -90  // added a negative value to move it up a bit (default 0) 
    		}
  		);

  		/*
		window.plugins.toast.showShortTop('Hello there!', 
			function(a) { console.log('toast success: ' + a) }, 
			function(b) { alert('toast error: ' + b) } );
		*/	
	};

	//Loading the Tips
	$scope.displaySelectedQuote();

}]);	
