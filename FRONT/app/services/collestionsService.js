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
                deffered.resolve(status);
            }).error(function(data, status) {
               deffered.reject(status);
            });

            return deffered.promise;
        },
        removeItem: function(itemForDeletion,collection_id) {
            var items = {};
            items.one = itemForDeletion;
            itemForDeletion = JSON.stringify(itemForDeletion);
            items.two = itemForDeletion;
            itemForDeletion = JSON.parse(itemForDeletion);
            items.three = itemForDeletion;
            //console.log(item);
            var deffered = $q.defer();

            $http({
                method: 'DELETE',
                url: 'http://localhost:7000/collections/' + collection_id + '?deleteOne=true',
                data: items
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(data, status) {
               deffered.reject(status);
            });

            return deffered.promise;

        },
        updateItem: function(items,collection_id) {

            var deffered = $q.defer();

            $http({
                method: 'PATCH',
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
                method: 'PATCH',
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
