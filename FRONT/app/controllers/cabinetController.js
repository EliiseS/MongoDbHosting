myApp.controller('CabinetController',function($rootScope,$scope,$state, CollectionsService) {
  
  $scope.test = "Cabinet controiller is connected - Enviroment established!";

// TESTING VARIABLE //////////////////////////////////////////////////////////

  $scope.collections = [];

  $scope.displayMode = 'tableView';
  $scope.showAddCollectionForm = false;
  $scope.addCollectionBtnText = 'Add new Collection';

  $scope.getCollections = function() {

    CollectionsService.getCollections()
    .then(function(data){
      $scope.collections = data;
    },function(error){
      console.log("ERROR while GETTING COLLECTIONS....");
    });

  }; // getCollections

  $scope.getCollections();

   $scope.selectCollection = function(data){
   		$scope.selectedCollection = data;
   		$scope.collectionAsJson = makeJsonView(data);
   };

    function makeJsonView(collection){

   		console.log("INSIDE makeJsonView");

   		var tempString = '';

   		for(var i=0; i<collection.Elements.length-1; i++){
   			var element = collection.Elements[i];
   			delete element.$$hashKey;
   			element = JSON.stringify(element);
   			tempString = tempString +  element + ', \n';
   		}
   		tempString = tempString +  element + '\n';

   		return tempString;
   };


   $scope.addNewCollection = function(name){
   		$scope.newCollectionName = '';

   		var collection      = {};
   		collection.name     = name;
   		collection.user_id  = $rootScope.currentUser._id;
   		collection.Elements = [];

   		CollectionsService.createCollection(collection)
   		.then(function(data){
      	$scope.collections = data;
	    },function(error){
	      console.log("ERROR while GETTING COLLECTIONS....");
	    });
   		
	};

   $scope.showCollectionForm = function(){
   	$scope.showAddCollectionForm =! $scope.showAddCollectionForm;

   	if($scope.showAddCollectionForm === true){
   		$scope.addCollectionBtnText = 'Close Form';
   	}
   	if($scope.showAddCollectionForm === false){
   		$scope.addCollectionBtnText = 'Add new Collection';
   	}
   	
   };


// TESTING VARIABLE //////////////////////////////////////////////////////////


}); // Controller