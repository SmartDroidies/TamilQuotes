/* Services */
var tamilQuotesServices = angular.module('tamilQuotesServices', ['ngResource']);


//Factory for loading the feed from Local Storage
tamilQuotesServices.factory ('StorageService', function () {
	var storageFactory = {}; 
	var keyQuotes =  "quotes";
	var keySyncTime =  "sync_time";
	var keySyncVersion =  "sync_version";
	var synced;

	//Collect all tips 
	storageFactory.syncDate = function() {
		var self = this;
		var fileURL =  "files/quotes.json";
		//var syncTime =  window.localStorage.getItem(keySyncTime);
		var version = window.localStorage.getItem(keySyncVersion);
		
		//FIXME - Check if the data check has been done already
		jQuery.getJSON(fileURL, function (data) {
			//console.log("Loading Quotes from FileSystem");
		}).done(function(data) {
			if(!version || data.version > version) {
				console.log("Updating Local Storage");
				window.localStorage.setItem(keySyncTime, data.time);
				window.localStorage.setItem(keySyncVersion, data.version);
				window.localStorage.setItem(keyQuotes, JSON.stringify(data.quotes));
			}	
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("Show Error Message - " + textStatus);
		}).always(function() {
			
		});

		//FIXME - Do it one for each session
		if(!synced) {
			var uri = encodeURI("http://whatsappstatus.careerwrap.com/?json=y");
			var lastSyncTime = window.localStorage.getItem(keySyncTime);
			if(lastSyncTime) {
				uri = encodeURI("http://whatsappstatus.careerwrap.com/?json=y&ts=" + lastSyncTime);
			} 
			console.log("Download URL : " + uri);
			console.log("Synced Flag : " + synced);
			jQuery.getJSON(uri, function (data) {
				//console.log("Loading Latest Articles from Server");
			}).done(function(data) {
				//console.log("Fresh Data " + JSON.stringify(data));
				self.syncLocalStorage(data);
				synced = true;
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log("Show Error Message - " + textStatus);
			}).always(function() {
				
			});
		}	
	}

	//Sync Temp JSON
	storageFactory.syncLocalStorage = function(remoteJSON) {	
		var localQuotes =  window.localStorage.getItem(keyQuotes);
		var localJSON = JSON.parse(localQuotes);
		//console.log("Modified Array Size : " + _.size(remoteJSON));		
		//console.log("Local Array Size : " + _.size(localJSON));		
		if(_.size(remoteJSON) >  0) {
			$.each(remoteJSON.quotes, function(key, item) {
				var newQuote = true;
				_.find(localJSON,function(rw, rwIdx) { 
					if(rw.id == item.id) { 
						//console.log ("Replace Existing Object for : " + key); 
						localJSON[rwIdx] = item;
						newQuote = false; 
						return true;
					}; 
				});
				//If new tip
				if(newQuote) {
					console.log("New Object for : " + key + " - " + JSON.stringify(item));
					item.new = true;
					localJSON.push(item);
				} 
			});
			window.localStorage.setItem(keyQuotes, JSON.stringify(localJSON));
			var modifiedTime = remoteJSON.time;
			if(typeof modifiedTime != 'undefined') {
				window.localStorage.setItem(keySyncTime, remoteJSON.time);
			}
		}	
	}

	//Collect all quotes 
	storageFactory.collectQuotes = function() {
		//console.log('Collecting Quotes from Local Storage');
		var data =  window.localStorage.getItem(keyQuotes);
		return JSON.parse(data);
	}
	

	return storageFactory;
});


//Factory for managing articles
tamilQuotesServices.factory ('QuoteService', function (StorageService, _, cacheService) {
	var factory = {}; 

	//Collect new quotes
	factory.collectNewQuotes = function() {
		var quotesAll = StorageService.collectQuotes();	

		//FIXME - Collect new quotes
		return quotesAll;
	}

	//Fetch Quotes By Category
	factory.fetchQuotesByCategory = function(category) {
		var key = 'CTGRY' + category;
		//console.log("CTGRY : " + key);
		var quotesByCtgry = cacheService.get(key);
		if(!quotesByCtgry) {
			var quotesAll = StorageService.collectQuotes();
			quotesByCtgry = quotesAll;
			if(quotesAll) {
				var filtered = [];
				if(category) {
					quotesByCtgry = _.filter(quotesAll, function(item) {  
						var bCtgryMatch = false;
						for (var j = 0, length = item.category.length; j < length; j++) {
							if(item.category[j] == category) {
								bCtgryMatch = true;
							}
						}
						return bCtgryMatch; 
					});
				}	
				quotesByCtgry = _.sortBy(quotesByCtgry, "post_date").reverse();
				cacheService.put(key, quotesByCtgry);
			}
		}
		return quotesByCtgry;
	}

	// Collect indexed Quote for a category
	factory.collectQuote = function(category, index) {
		var self = this;
		var quote;
		var quotes = self.fetchQuotesByCategory(category);
		quote = quotes[index];
		quote.position = parseInt(index) + 1;
		quote.size = quotes.length;
		return quote;
    }
	
    return factory;
});


//Factory for managing category
tamilQuotesServices.factory ('CategoryService', function (_, cacheService, $http, $q) {
	var factory = {}; 

	//Load Categories into Cache
	factory.loadCategories = function() {
		//console.log('Load Categories From Filesystem');
		return $http.get('files/category.json');
	};


	//Collect Categories from cache
	factory.collectCategories = function() {
		var deferred = $q.defer();
		var key = 'tq-categories';
		var categories = cacheService.get(key);
		if(!categories) {
			var promise = this.loadCategories();
       		promise.then(
          		function(payload) { 
              		categories = payload.data;
					if(categories) {
						cacheService.put(key, categories);
					}
              		deferred.resolve({categories: categories});
          		},
          		function(errorPayload) {
          			console.log('Failure loading categories ' + errorPayload);
          			deferred.reject(errorPayload);
          		});
		} else {
			deferred.resolve({categories: categories});
		}
		return deferred.promise;
	} 

	//Collect Category for an ID
	factory.collectCategory = function(catID) {
		var key = 'tq-categories';
		var categories = cacheService.get(key);
		var category = {};
		if(categories) {
			category = _.find(categories, function(ctgry) { 
				return ctgry.id == catID; 
			});
		} 
		return category;
	} 
	
    return factory;
}); 




/* Cache Services */
var cacheServices = angular.module('cacheService', []);
cacheServices.factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
			return $cacheFactory('quotes-cache');
		}
	]);

