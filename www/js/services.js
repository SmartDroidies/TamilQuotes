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
		var fileURLVersion =  "files/version.json";	
		var version = window.localStorage.getItem(keySyncVersion);

		jQuery.getJSON(fileURLVersion, function (data) {
			//console.log("Checking for Data Version in Filesystem");
		}).done(function(data) {
			//console.log("Version : " + JSON.stringify(data.quotes));
			var quotesVersion =  data.quotes;
			if(!version || quotesVersion > version) {
				console.log("Loading Quotes from FileSystem");
				self.loadInitialData(quotesVersion);
			} else {
				//console.log("Syncing Latest Quotes from Server");
				self.syncLatestData();	
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("Show Error Message - " + textStatus);
		}).always(function() {
			
		});
	}

	//Load Initial Data
	storageFactory.loadInitialData = function(version) {
		var self = this;
		var fileURL =  "files/quotes.json";

		jQuery.getJSON(fileURL, function (data) {
			//console.log("Loading Quotes from FileSystem");
		}).done(function(data) {
			//console.log("Updating Local Storage : " + version);
			window.localStorage.setItem(keySyncTime, data.time);
			window.localStorage.setItem(keyQuotes, JSON.stringify(data.quotes));
			window.localStorage.setItem(keySyncVersion, version);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("Show Error Message - " + textStatus);
		}).always(function() {
			
		});
	}	

	//Sync Latest Data from server
	storageFactory.syncLatestData = function() {
		var self = this;
		var uri = encodeURI("http://whatsappstatus.careerwrap.com/?json=y");
		var lastSyncTime = window.localStorage.getItem(keySyncTime);
		if(lastSyncTime) {
			lastSyncTime = lastSyncTime - 18000;
			uri = encodeURI("http://whatsappstatus.careerwrap.com/?json=y&ts=" + lastSyncTime);
		} 
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
						//console.log ("Replace Existing Object for : " + item.id); 
						localJSON[rwIdx] = item;
						newQuote = false; 
						return true;
					}; 
				});
				//If new tip
				if(newQuote) {
					//console.log("New Object for : " + key + " - " + JSON.stringify(item));
					//FIXME - Implement this after unread quotes is implemented
					item.new = false;
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
tamilQuotesServices.factory ('QuoteService', function (StorageService, _, cacheService, FavouriteService) {
	var factory = {}; 

	//Collect new quotes
	factory.collectNewQuotes = function() {
		var quotesAll = StorageService.collectQuotes();	
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

	//Fetch Quotes from cache
	factory.fetchQuotes = function() {
		var key = 'QUOTES';
		var quotes = cacheService.get(key);
		if(!quotes) {
			var quotes = StorageService.collectQuotes();
		}
		return quotes;
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

    //Collect Favourite Quotes 
	factory.collectFavourites = function() {
		var self = this;
		var quotes = self.collectNewQuotes();
		//console.log("Total Quotes : " + quotes.length);
		var favourites = FavouriteService.collectFavourite();
		//console.log("Favourite Quotes : " + favourites);

		quotes = _.filter(quotes, function(item) { 
			var bFavourite = false;
			
			if(favourites != null) {
				var index = favourites.indexOf(item.id.toString());
				//console.log("Comparision : " + item.id + " : " + index);
				if (index > -1) {
	    			bFavourite = true;
	    			//console.log("Favourite Found : " + item.id);
				}			
			}
			return bFavourite; 
		});

		return quotes;
	}

	// Collect indexed Quote for a category
	factory.collectSingleQuote = function(quoteid) {
		var self = this;
		var quotes = self.fetchQuotes();
		var quote = null; 
		console.log("Quotes Size : " + _.size(quotes))
		quote = _.find(quotes, function(item) {  
			return item.id == quoteid;
		});
		if(quote) {
			quote.swipe = false;
		}	
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

//Factory for managing favourite
tamilQuotesServices.factory ('FavouriteService', function () {
	var favouriteFactory = {}; 
	
	//Add Tip to favourite 
	favouriteFactory.addTip = function(tipID) {
		//console.log('Adding Tip to favourite list : ' + tipID);
		var favourite = null;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored == null) {
			favourite = new Array();
			favourite.push(tipID);
		} else {
			//console.log("Favourite Stored : " + favouriteStored);	
			favourite = new Array(favouriteStored);
			favourite.push(tipID);
		}
		//console.log("Favourite : " + favourite);	
		if(favourite != null) {
			window.localStorage.setItem("favourite", favourite);	
		}
	}

	//Remove Tip from favourite 
	favouriteFactory.removeTip = function(tipID) {
		console.log('Remove Tip from favourite list : ' + tipID);
		var favourite = null;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored != null) {
			console.log("Favourite Stored : " + favouriteStored);	
			favourite = favouriteStored.split(",");
			var index = favourite.indexOf(tipID.toString());
			if (index > -1) {
    			favourite.splice(index, 1);
			}			
		}
		console.log("Favourite : " + favourite);	
		if(favourite != null) {
			window.localStorage.setItem("favourite", favourite);	
		}
	}


	//Check for favourite 
	favouriteFactory.isFavourite = function(tipID) {
		//console.log('Check Favourite for : ' + tipID);
		var flgFavourite = false;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored != null) {
			//console.log("Favourite Stored : " + favouriteStored);	
			var favourites = favouriteStored.split(",");
			var stored = _.find(favourites, function(id) { 
				//console.log("Cmparisison : " + id + " - " +  tipID);
				return id == tipID; 
			});
			//console.log("Stored  ID : " + stored);
			if(stored) {
				flgFavourite = true;		
			}
		}
		//console.log("Favourite : " + flgFavourite);
		return flgFavourite;
	}

	//Collect favourites 
	favouriteFactory.collectFavourite = function(tipID) {
		//console.log('Adding Tip to favourite list : ' + tipID);
		var favourite = null;
		var favouriteStored = window.localStorage.getItem("favourite"); 
		if(favouriteStored != null) {
			favourite = favouriteStored.split(",");
		}
		return favourite;
	}
	
	
	return favouriteFactory;
}); 

/*
//Factory for managing articles
tamiltipsServices.factory ('ArticleService', function (StorageService, _, cacheService, FavouriteService) {
	var factory = {}; 
	
	//Fetch All Articles 
	factory.fetchArticles = function() {
		var key = 'sd-tt-articles';
		var tips = cacheService.get(key);
		if(!tips) {
			tips = StorageService.collectTips();
			if(tips) {
				cacheService.put(key, tips);
			}
		}
		return tips;
	}

	//Fetch Articles By Category
	factory.fetchArticlesByCategory = function(category) {
		var key = 'CTGRY' + category;
		var tipsByCtgry = cacheService.get(key);
		if(!tipsByCtgry) {
			var tipsAll = StorageService.collectTips();
			if(tipsAll) {
				var filtered = [];
				if(category) {
					tipsByCtgry = _.filter(tipsAll, function(item) {  
						var bCtgryMatch = false;
						for (var j = 0, length = item.category.length; j < length; j++) {
							if(item.category[j] == category) {
								bCtgryMatch = true;
							}
						}
						return bCtgryMatch; 
					});
				}	
				tipsByCtgry = _.sortBy(tipsByCtgry, "post_date").reverse();
				//console.log("Filtered Article Length : " + tipsByCtgry.length);
				cacheService.put(key, tipsByCtgry);
			}
		}
		return tipsByCtgry;
	}
	
	// Collect all Articles for a category
    factory.collectArticles = function(category) {
		var self = this;
		var articles = self.fetchArticles();
		if(articles) {
			if(category) {
				articles = _.filter(articles, function(item) { 
					var bCtgryMatch = false;
					for (var j = 0, length = item.category.length; j < length; j++) {
						if(item.category[j] == category) {
							bCtgryMatch = true;
						}
					}
					return bCtgryMatch; 
				});
			}	
			articles = _.sortBy(articles, "post_date").reverse();
			console.log("Filtered Article Length : " + articles.length);
		}
		console.log('Service Method to Collect Article by Category : ' + category);
		return articles;
    }
	
	// Collect indexed Article for a category
	factory.collectArticle = function(category, index) {
		var self = this;
		var article;
		var articles = self.fetchArticlesByCategory(category);
		article = articles[index];
		article.favourite = FavouriteService.isFavourite(article.id);
		article.position = parseInt(index) + 1;
		article.size = articles.length;
		return article;
    }

	//Collect Stats for all category 
	factory.collectStats = function() {
		var self = this;
		var articles = self.fetchArticles();
		var stats ;
		if(articles) {
			stats = {'health' : _.chain(articles).filter(function(item){ return item.cat_ID == '1';}).size().value(), 
				'fitness' : _.chain(articles).filter(function(item){ return item.cat_ID == '25';}).size().value(),
				'beauty' : _.chain(articles).filter(function(item){ return item.cat_ID == '5';}).size().value(),
				'remedy' : _.chain(articles).filter(function(item){ return item.cat_ID == '406';}).size().value(),
				'general' : _.chain(articles).filter(function(item){ return item.cat_ID == '878';}).size().value()};	
		}
		return stats;
    }

    //Collect Favourite Articles 
	factory.collectFavourites = function() {
		var self = this;
		var articles = self.fetchArticles();
		//console.log("Total Articles : " + articles.length);
		var favourites = FavouriteService.collectFavourite();
		//console.log("Favourite Articles : " + favourites);

		articles = _.filter(articles, function(item) { 
			var bFavourite = false;
			
			if(favourites != null) {
				var index = favourites.indexOf(item.id.toString());
				//console.log("Comparision : " + item.id + " : " + index);
				if (index > -1) {
	    			bFavourite = true;
	    			//console.log("Favourite Found : " + item.id);
				}			
			}
			return bFavourite; 
		});

		return articles;

	}

    //Collect New Tips 
	factory.collectNewTips = function() {
		var self = this;
		var articles = self.fetchArticles();

		articles = _.filter(articles, function(item) { 
			//console.log("New Tips Search : " + item.id + " - " + item.new);
			return item.new; 
		});
		//console.log("New Tip Count : " + _.size(articles));
		return articles;
	}
	
	//Fetch Articles By Tip ID
	factory.collectArticleByTipId = function(id) {
		var selectedTip = null;
		var tipsAll = StorageService.collectTips();
		if(tipsAll) {
			selectedTip = _.find(tipsAll, function(item) {  
				//console.log("Comparision : " + item.id + " : " + id);
				return (item.id == id); 
			});
		}
		//console.log("Selected Tip : " + selectedTip);
		if(selectedTip != null)  { 
			selectedTip.favourite = FavouriteService.isFavourite(id);
		}
		return selectedTip;
	}

    return factory;
}); 



//Factory for managing category
tamiltipsServices.factory ('CategoryService', function (_, cacheService, $http, $q) {
	var factory = {}; 

	//Load Categories into Cache
	factory.loadCategories = function() {
		//console.log('Load Categories From Filesystem');
		return $http.get('files/category.json');
	};


	//Collect Categories from cache
	factory.collectCategories = function() {
		var deferred = $q.defer();
		var key = 'tt-categories';
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
					//console.log('Categories ' + JSON.stringify(categories));
          		},
          		function(errorPayload) {
          			console.log('Failure loading movie ' + errorPayload);
          			deferred.reject(errorPayload);
          		});
		} else {
			deferred.resolve({categories: categories});
		}
		return deferred.promise;
	} 

	//Collect Category for an ID
	factory.collectCategory = function(catID) {
		var key = 'tt-categories';
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

*/

/* Cache Services */
var cacheServices = angular.module('cacheService', []);
cacheServices.factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
			return $cacheFactory('quotes-cache');
		}
	]);

