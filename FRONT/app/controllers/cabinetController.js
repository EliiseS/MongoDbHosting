myApp.controller('CabinetController',function($rootScope,$scope,$state, CollectionsService) {
  
  $scope.test = "Cabinet controiller is connected - Enviroment established!";

// TESTING VARIABLE //////////////////////////////////////////////////////////

  $scope.collections = [];

  $scope.displayMode = 'tableView';
  $scope.showAddCollectionForm = false;
  $scope.newItem = '{\n "name" : "Bob",\n "age" : 23,\n "education" : "Computer Science AP",\n "school" : "KEA"\n}';
  $scope.xxx     = '{\n "name" : "Bob",\n "age" : 23,\n "education" : "Computer Science AP",\n "school" : "KEA"\n}';
  $scope.newItems = '[\n    {\n    "name" : "Bob",\n    "age" : 23,\n    "education" : "Computer Science AP",\n    "school" : "KEA"\n    },\n    {\n    "name" : "Alice",\n    "age" : 23,\n    "education" : "Computer Science AP",\n    "school" : "KEA"\n    },\n    {\n    "name" : "John",\n    "age" : 23,\n    "education" : "Computer Science AP",\n    "school" : "KEA"\n    }\n]';
  $scope.jsonFormat = '{\n "name" : "Bob",\n "age" : 23,\n "education" : "Computer Science AP",\n "school" : "KEA"\n}';


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
   		var tempVar = data;
   		delete tempVar.user_id;
   		$scope.collectionAsJson = tempVar;
   		//delete $scope.collectionAsJson._id;
   		//delete $scope.collectionAsJson.user_id;
   		//$scope.collectionAsJson = makeJsonView(data);
   };

   $scope.addNewCollection = function(name){
   		$scope.newCollectionName = '';

   		var collection      = {};
   		collection.name     = name;
   		collection.user_id  = $rootScope.currentUser._id;
   		collection.Elements = [];

   		CollectionsService.createCollection(collection).then(function(data){
		     $scope.getCollections();
		     $scope.showAddCollectionForm = false;
		     $scope.newCollectionSuccess  = "New Collection successfully created!";
		    },function(error){
		      console.log("ERROR while GETTING COLLECTIONS....");
		    });
   		
	};


   $scope.previewObject = function(element,index){
   	 $scope.selectedElement = element;
   	 $scope.elementIndex    = index+1;
   };

   $scope.addNewItem = function(){

   		//TEST IF STRING IS IN JSON FORMAT
   		var item = JSON.parse($scope.xxx);
   		var formatIsCorect = IsJsonString($scope.xxx);
   		var isArray = Object.prototype.toString.call(item) === '[object Array]';

		if($scope.selectedCollection === undefined){
			$scope.errorMessage = "Error! Collection is not selected!";
		}
		else{
			if(formatIsCorect){

			//DETECT WHAT USER TRYING TO PUSH : ARRAY OR SINGLE OBJECT
	   		if(!isArray) {
				//IF NEW ITEM IS OBJECT --> convert to array
				var tempItem = $scope.xxx;
				$scope.xxx = [];
				$scope.xxx.push(JSON.parse(tempItem));
			}
			
			CollectionsService.pushNewItem($scope.xxx,$scope.selectedCollection._id)
			.then(function(data){
					$scope.ShowAddNewItemForm = false;
					if(isArray){
						$scope.successMessage = "Successfull operation! New items added into your collection";	
					}else{
						$scope.successMessage = "Successfull operation! New item added into your collection";	
					}
					$scope.xxx = $scope.jsonFormat;
					//$scope.getCollections();
					//findAndUpdateCollection($scope.newItem);
		    },function(error){
		      console.log("ERROR while ADDING NEW ITEM INTO COLLECTION..." + error);
		    });
			
			$scope.errorMessage = false;
		}else{
			$scope.errorMessage = "Wrong JSON format...Please check syntaxis of you object";
		}
		}

		
   };//end of addNewItem()

   $scope.deleteItem = function(element){

   		console.log(element);
   		delete element.$$hashKey;
   		element = JSON.stringify(element);
   		//TEST IF STRING IS IN JSON FORMAT
   		var formatIsCorect = IsJsonString(element);

		if(formatIsCorect)
		{
				//we can add item into dbpushNewItem
			CollectionsService.removeItem(element,$scope.selectedCollection._id)
			.then(function(data){
					if(data.status==='200'){
						//inform user that Item is uccessfully removed from collection
						$scope.successMessage = "Successfull operation! Item removed from your collection";
						reloadCollection();
						$state.go('cabinet.collection');
					}
					$scope.getCollections();
					//findAndUpdateCollection($scope.newItem);
		    },function(error){
		      console.log("ERROR while ADDING NEW ITEM INTO COLLECTION..." + error);
		    });
		}else{
			console.log("WRONG FORMAT");
		}
	

   };

   //UPDATE ITEM
   $scope.updateItem = function(){
   		console.log("Tryiing to update items.... ");
   		var firstItemFormatTest = IsJsonString(JSON.stringify($scope.selectedElement));
		var secondItemFormatTest = IsJsonString($scope.itemForUpdate);

		delete $scope.selectedElement.$$hashKey;

   		if(firstItemFormatTest && secondItemFormatTest){
			//we can update item in db
			var items = {};
			items.originalItem = $scope.selectedElement;
			items.updatedItem  = JSON.parse($scope.itemForUpdate)

			CollectionsService.updateItem(items,$scope.selectedCollection._id)
			.then(function(data){
					if(data==='200'){
						//inform user that Item is uccessfully removed from collection
						$scope.itemUpdateSuccess = "Successfull operation! Item UPDATED";
						$scope.itemUpdateError = undefined;
					}
					console.log(data);
		    },function(error){
		      console.log("ERROR while UPDATING NEW ITEM INTO COLLECTION..." + error);
		    });

		}else{
			$scope.itemUpdateError = "ERROR! WRONG JSON FORMAT!";
		}

   };

   $scope.getObjectAsText = function () {
   		delete $scope.selectedElement.$$hashKey;

   		var FileAsString = "{\n";
   		for(var propt in $scope.selectedElement){
   			var typeTest = typeof $scope.selectedElement[propt];
   			if(typeTest==='string'){
   				// IF OBJECT's PROPERTY IS STRING");
   				FileAsString += '    "' + propt + '" : "' + $scope.selectedElement[propt] + '",\n';
   			}else{
   				// IF OBJECT's PROPERTY IS NOT STRING");
   				FileAsString += '    "' + propt + '" : ' + $scope.selectedElement[propt] + ',\n';
   			}
   			
		    console.log(propt + ': ' + $scope.selectedElement[propt]);
		}
		var indexOfComa = FileAsString.lastIndexOf(',');
		FileAsString = FileAsString.substring(0,indexOfComa);
		FileAsString+= "\n}";

		$scope.itemForUpdate = FileAsString;
	};

   function IsJsonString(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	};

	function findAndUpdateCollection(item){
		for(var i=0; i<$scope.collections.length; i++){
			var currentCollection = $scope.collections[i];
			if(currentCollection.name===$scope.selectedCollection.name){
				 console.log(JSON.parse(item));
				 $scope.collections[i].Elements.push(JSON.parse(item));
			}
		}
	};

	function reloadCollection(){
		$scope.getCollections();
	};


// TESTING VARIABLE //////////////////////////////////////////////////////////


}); // Controller