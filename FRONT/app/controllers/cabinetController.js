myApp.controller('CabinetController',function($rootScope,$scope,$state,clipboard, CollectionsService) {
  
  $scope.test = "Cabinet controiller is connected - Enviroment established!";

// TESTING VARIABLE //////////////////////////////////////////////////////////

  
  $scope.displayMode = 'tableView';
  $scope.showAddCollectionForm = false;

  $scope.urlOfWebsite = 'http://localhost:7000/collections/';

  $scope.newItem =  {
  	"name":"Bob",
  	"lastName":"Jensen",
  	"age":23,
  	"email":"bjens@mail.dk"
  };

  $scope.newItems = [
	   {
	  	"name":"Bob",
	  	"lastName":"Jensen",
	  	"age":23,
	  	"email":"bjens@mail.dk"
	  },
	  {
	  	"name":"Alice",
	  	"lastName":"Hansen",
	  	"age":22,
	  	"email":"alice.hansen@gmail.com"
	  },
	  {
	  	"name":"John",
	  	"lastName":"Galt",
	  	"age":45,
	  	"email":"jg@hotmail.com"
	  }
  ];

  $scope.getCollections = function() {

    CollectionsService.getCollections()
    .then(function(data){
      $scope.collections = data;
    },function(error,status){
      console.log("ERROR while GETTING COLLECTIONS...." + error + ", status = " + status);
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

   $scope.reloadItems = function(){
   		var copiedObject = jQuery.extend({}, $scope.selectedCollection);
   		delete copiedObject.user_id;
   		$scope.collectionAsJson = copiedObject;
   };

   $scope.addNewCollection = function(name){
   		$scope.newCollectionName = '';

   		var collection      = {};
   		collection.name     = name.trim();
   		collection.user_id  = $rootScope.currentUser._id;
   		collection.Elements = [];

   		CollectionsService.createCollection(collection)
   		.then(function(status){
		     $scope.getCollections();
		     $scope.showAddCollectionForm = false;
		     $scope.newCollectionSuccess  = "New Collection successfully created!";
		    },function(status){
		     console.log("COLLECTION NOT CREATED, STATUS = ");
		     
		     console.log(error);
		      console.log(status);
		      console.log("ERROR while GETTING COLLECTIONS....");
		    });
   		
	};


   $scope.previewObject = function(element,index){
   	 $scope.selectedElement = element;
   	 $scope.elementIndex    = index+1;
   };

   $scope.addNewItem = function(){

   		//TEST IF STRING IS IN JSON FORMAT
   		
   		var formatIsCorect = IsJsonString($scope.newItemsForInsertion);
   		
		if($scope.selectedCollection === undefined){
			$scope.errorMessage = "Error! Collection is not selected!";
		}
		else{
			if(formatIsCorect){
				var items = JSON.parse($scope.newItemsForInsertion);
				var isArray = Object.prototype.toString.call(items) === '[object Array]'; //TEST IF OBJECT IS ARRAY

				console.log("CORRECT FORMAT INSIDE ADD NEW ITEM");

			//DETECT WHAT USER TRYING TO PUSH : ARRAY OR SINGLE OBJECT
	   		if(!isArray) {
				//IF NEW ITEM IS OBJECT --> convert to array
				var tempItem = $scope.newItemsForInsertion;
				$scope.newItemsForInsertion = [];
				$scope.newItemsForInsertion.push(JSON.parse(tempItem));
			}
			
			CollectionsService.pushNewItem($scope.newItemsForInsertion,$scope.selectedCollection._id)
			.then(function(status){

				    $scope.getCollections();
					$scope.ShowAddNewItemForm = false;
					if(isArray){
						for(var i = 0; i<items.length; i++){
							$scope.selectedCollection.Elements.push(items[i]);
						}
						$scope.successMessage =   + " new items added into your collection";	
					}else{
						$scope.selectedCollection.Elements.push(items);
						$scope.successMessage = "New item added into your collection";	
					}
					$scope.newItemsForInsertion = $scope.newItem2;
					
					
					//findAndUpdateCollection($scope.newItem);
		    },function(error){
		      console.log("ERROR while ADDING NEW ITEM INTO COLLECTION..." + error);
		    });
			
			$scope.errorMessage = false;
		}else{
			console.log("WRONG FORMAT INSIDE ADD NEW ITEM");
			$scope.errorMessage = "Wrong JSON format...Please check syntaxis of you object";
		}
		}

		
   };//end of addNewItem()

   $scope.deleteItem = function(element,indexOfElement){
   		var itemForDeletion = element;
		delete itemForDeletion.$$hashKey;

		console.log("WE ARE IN DELETEITEM METHOD OF CONTROLLE");
	    console.log(itemForDeletion);

		CollectionsService.removeItem(itemForDeletion,$scope.selectedCollection._id)
		.then(function(status){
				if(status===200){
					$scope.selectedCollection.Elements.splice(indexOfElement, 1);
					$scope.successMessage = "Item removed from your collection";
					$state.go('cabinet.collection');
				}
				$scope.getCollections();
				//findAndUpdateCollection($scope.newItem);
	    },function(error){
	      console.log("ERROR while ADDING NEW ITEM INTO COLLECTION..." + error);
	    });
   };

   //UPDATE ITEM
   $scope.updateItem = function(indexOfItem){
   		var firstItemFormatTest = IsJsonString(JSON.stringify($scope.selectedElement));
		var secondItemFormatTest = IsJsonString($scope.itemForUpdate);

		delete $scope.selectedElement.$$hashKey;

   		if(firstItemFormatTest && secondItemFormatTest){
			//we can update item in db
			var items = {};
			items.originalItem = $scope.selectedElement;
			items.updatedItem  = JSON.parse($scope.itemForUpdate);

			console.log("ITEMS = ");
			console.log(items);

			CollectionsService.updateItem(items,$scope.selectedCollection._id)
			.then(function(status){
				console.log("INSIDE UPDATE COLLECTION, STATUS = " + status);

					if(status===200){
						//inform user that Item is uccessfully removed from collection
						$scope.selectedCollection.Elements.splice(indexOfItem,1);
						$scope.selectedCollection.Elements.splice(indexOfItem,0,items.updatedItem);
						$scope.itemUpdateSuccess = "Successfull operation! Item UPDATED";
						$scope.itemUpdateError = undefined;
					}
		    },function(error,status){
		      console.log("ERROR while UPDATING NEW ITEM INTO COLLECTION..." + error);
		    });

		}else{
			$scope.itemUpdateError = "ERROR! WRONG JSON FORMAT!";
		}

   };

   $scope.updateCollection = function(){
   		
        var collection = document.getElementById('CollectionTextArea').value;
        var formatTest = IsJsonString(collection);
        console.log("formatTest = " + formatTest);
        console.log("BEFORE IF");

        if(formatTest){
        	console.log("Correct format INSODE IF");
			//we can update item in db
			var updatedCollection = JSON.parse(collection);

			CollectionsService.updateCollection(updatedCollection.Elements,$scope.collectionAsJson._id)
			.then(function(status){
					if(status===200){
						//inform user that Item is uccessfully removed from collection
						$scope.CollectionUpdateError = null;
						$scope.CollectionUpdateSuccess= "Collection successfully Updated!";
						$scope.selectedCollection.Elements = updatedCollection.Elements;
						$scope.showUpdateArea = false;

					}
		    },function(error){
		      $scope.CollectionUpdateError = "ERROR while UPDATING COLLECTION...";
			
		    });

		}else{

			$scope.CollectionUpdateError = "Wrong JSON format, please review your code.";
			console.log("WRONG SUKA! NOT FOLLOWING THE FORMAT BLEADJ!");
		}

   		
		
   };

   $scope.getObjectAsText = function (itemToBeShownInTextarea) {
   	    delete itemToBeShownInTextarea.$$hashKey;
   		//delete $scope.selectedElement.$$hashKey;
   		var str = JSON.stringify(itemToBeShownInTextarea, undefined, 4);
		document.getElementById('itemTextArea').innerHTML = str;
	};

	$scope.getArraytAsText = function () {
   		//delete $scope.selectedElement.$$hashKey;
   		for(var i = 0; i<$scope.collectionAsJson.Elements.length; i++){
   			delete $scope.collectionAsJson.Elements[i].$$hashKey;
			}//object loop

		var copiedObject = jQuery.extend({}, $scope.collectionAsJson); // CLONE OBJECT, TO SOLVE PROBLEMS WITH CAUSED BY DOUBLE BINDING
		delete copiedObject._id;
		delete copiedObject.name;
		delete copiedObject.$$hashKey;
	    // REMOVE HASHKEY
        //REMOVE COLLECTION ID -- "_id": "572f52f1dca365700b5f409a" ---> Because we don't want user to play with it
   		var str = JSON.stringify(copiedObject, undefined, 4);
		document.getElementById('CollectionTextArea').innerHTML = str;
   		
	};


   function IsJsonString(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	};

	//ALLOW USERS TO COPY TEXT TO CLIPBOARD -- used in API DOCS section for copying urls
	
 
        $scope.clickHandler = function (id,urlParams) {
        	if (!clipboard.supported) {
	            console.log('Sorry, copy to clipboard is not supported');
	        }
            clipboard.copyText($scope.urlOfWebsite + "" + id + urlParams);
        };

        $scope.test = function(){
        	var xxx = JSON.stringify($scope.newItem, undefined, 4);
		    document.getElementById('abcdefg').innerHTML = xxx;
		};

// TESTING VARIABLE /////////////////////////////////////////////////////////

}); // Controller

