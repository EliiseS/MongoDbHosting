myApp.factory('CollectionsService',['$rootScope','$http','$q', function($rootScope,$http,$q) {

  var collectionObject = {

        getCollections: function() {
            var deffered = $q.defer();

            $http({
                url: "http://localhost:7000/collections/" + $rootScope.currentUser._id,
                method: "GET"
            }).success(function (response) {
                deffered.resolve(response);
            }).error(function(data, status) {
               deffered.reject("505");
            });

            return deffered.promise;
        },
        createCollection: function(collection) {

            var deffered = $q.defer();

            $http({
                url: "http://localhost:7000/collections",
                method: "POST",
                data: collection
            }).success(function (response) {
                deffered.resolve(response);
            }).error(function(data, status) {
               deffered.reject("505");
            });
        }
    };

  return collectionObject;
}]); //factory
