myApp.factory('CollectionsService',['$rootScope','$http','$q', function($rootScope,$http,$q) {

  var collectionObject = {

        getCollections: function() {
            var deffered = $q.defer();

            $http({
                url: "http://localhost:7000/collections/" + $rootScope.currentUser._id + "?getAll=true",
                method: "GET"
            }).success(function (response,status) {
                console.log("WE ARE IN GETCOLLECTION = STATUS = " + status);
               deffered.resolve(response);
            }).error(function(data, status) {
               deffered.reject(data);
            });

            return deffered.promise;
        },
        createCollection: function(collection) {

            var deffered = $q.defer();

            $http({
                method: 'POST',
                url: 'http://localhost:7000/collections',
                data: collection
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(status) {
               deffered.reject(response);
            });

            return deffered.promise;
        },
        pushNewItem: function(item,collection_id) {

            var deffered = $q.defer();

            $http({
                method: 'POST',
                url: 'http://localhost:7000/collections/' + collection_id,
                data: item
            }).success(function (response,status) {
                console.log("STATUS IN SUCCESS = " + status);
                deffered.resolve(status);
            }).error(function(data, status) {
                console.log("STATUS IN ERROR = " + status);
               deffered.reject(status);
            });

            return deffered.promise;
        },
        removeCollection: function(collection_id) {

            var deffered = $q.defer();
   
            $http({
                method: 'PATCH',
                url: 'http://localhost:7000/collections/' + collection_id + '?deleteCol=true'
            }).success(function (response,status) {
                deffered.resolve(status);
                console.log(status);
            }).error(function(data, status) {
                deffered.reject(status);
                console.log(status);
            });

            return deffered.promise;
        },
        renameCollection: function(collection_id,newName) {

            var deffered = $q.defer();

            console.log("INSIDE RENAME SERVICE = ");
            console.log(newName);
   
            $http({
                method: 'PUT',
                url: 'http://localhost:7000/collections/' + collection_id + '?updateName=true',
                data:newName
            }).success(function (response,status) {
                deffered.resolve(status);
                console.log(status);
            }).error(function(data, status) {
               deffered.reject(status);
               console.log(status);
            });

            return deffered.promise;
        },
        removeItem: function(itemForDeletion,collection_id) {

            var deffered = $q.defer();
   
            $http({
                method: 'PATCH',
                url: 'http://localhost:7000/collections/' + collection_id,
                //url: urlX,
                data: itemForDeletion
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(data, status) {
               deffered.reject(status);
            });

            return deffered.promise;

            //AJAX METOD CALL
            /*
            $.ajax({ 
                "url":"http://localhost:7000/collections/" + collection_id + "?deleteOne=true",
                "method":"delete",
                "data":itemForDeletion,
                "success":function(data,status){
                    console.log(data);
                    console.log(status);
                },
                "error":function(status){
                    console.log(status);
                },
             });
            */
        },
        updateItem: function(items,collection_id) {

            var deffered = $q.defer();

            $http({
                method: 'PUT',
                url: 'http://localhost:7000/collections/' + collection_id + '?updateOne=true',
                data: items
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(error, status) {
               deffered.reject(status);
            });

            return deffered.promise;
        },//updateItem
        updateCollection: function(collection,collection_id) {

            console.log("collection_id = " + collection_id);

            var deffered = $q.defer();

            $http({
                method: 'PUT',
                url: 'http://localhost:7000/collections/' + collection_id + '?updateAll=true',
                data: collection
            }).success(function (response,status) {
                console.log(response);
                console.log(status);
                deffered.resolve(status);
            }).error(function(error, status) {
               deffered.reject(status);
            });

            return deffered.promise;
        }//updateCollection
    };

  return collectionObject;
}]); //factory
