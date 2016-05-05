myApp.factory('Authentication',['$rootScope','$http','$location','$q','userPersistenceService', function($rootScope,$http,$location,$q,userPersistenceService) {

  var isAuthenticated = false;

  var authObject = {
    login: function(credentials) {
            $http({
                method: 'POST',
                url: 'http://localhost:7000/login',
                data: credentials
            }).success(function (response) {
                if(response==='404'){
                  $rootScope.erroLogin = "There is no user with provided email";
                }
                else if(response==='401'){
                  $rootScope.erroLogin = "Wrong password, please try again..";
                }
                else{
                  $rootScope.erroLogin = null;
                  $rootScope.currentUser = response;
                  userPersistenceService.setCookieData($rootScope.currentUser);
                  isAuthenticated = true;
                  console.log("$rootScope.currentUser.name: " + $rootScope.currentUser.name);
                  $location.path('/cabinet');
                }
            });           
        
    }, // login
    logout: function() {
      isAuthenticated = false;
      $rootScope.currentUser = null;
      $location.path('/main');
      userPersistenceService.clearCookieData();
    }, //logout

    register: function(user) {
        $http({
            url: "http://localhost:7000/register",
            method: "POST",
            data: user
        }).success(function (response) {
            if(response==='200'){
              $rootScope.succesRegistration = "New user Successfully created. Please login using you username and password";
            }
            if(response==='409'){
              $rootScope.errorRegistration = "Error! Email: " + user.email + " is already in use";
            }
        });
    }, // register

    resetPass: function(credentials) {
            var deffered = $q.defer();

            $http({
                method: 'POST',
                url: 'http://localhost:7000/reset-pass',
                data: credentials
            }).success(function (response) {
                deffered.resolve(response);
            }).error(function(data, status) {
               deffered.reject("505");
            });

            return deffered.promise;
    }, //resetPass

    isAuthenticated: function(){
        return isAuthenticated;
    },

  setAuthentication: function(status){
        isAuthenticated = status;
    }
  };

  return authObject;
}]); //factory
