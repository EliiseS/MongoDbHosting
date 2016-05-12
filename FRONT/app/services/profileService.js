myApp.factory('ProfileSevice',['$rootScope','$http','$q', function($rootScope,$http,$q) {

  var profileObject = {

        changePassword: function(credentials) {

            var deffered = $q.defer();

            $http({
                method: 'POST',
                url: 'http://localhost:7000/change-password',
                data: credentials
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(data, status) {
                deffered.reject(status);
            }); 

            return deffered.promise;
        },// End of changePassword

        changeEmail: function(credentials) {

            var deffered = $q.defer();

            $http({
                method: 'POST',
                url: 'http://localhost:7000/change-email',
                data: credentials
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(data, status) {
                deffered.reject(status);
            }); 

            return deffered.promise;
        }// End of changeEmail        
  };
  return profileObject;
}]); //factory
