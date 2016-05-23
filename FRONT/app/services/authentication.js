myApp.factory('Authentication',['$rootScope','$http','$location','$q','userPersistenceService', function($rootScope,$http,$location,$q,userPersistenceService) {

  var isAuthenticated = false;

  var authObject = {

            /*
            var deffered = $q.defer();
            deffered.resolve(response,status);
            deffered.reject("505");
            return deffered.promise;
            */
    login: function(credentials) {

            $http({
                method: 'POST',
                url: 'http://localhost:7000/login',
                data: credentials
            }).success(function (response,status) {
                console.log("status in SUCCESS = " + status);
                if (status===200){
                  $rootScope.erroLogin = null;
                  $rootScope.currentUser = response;
                  userPersistenceService.setCookieData($rootScope.currentUser);
                  isAuthenticated = true;
                  $location.path('/cabinet');
                  $rootScope.activeMenuItem = 'cabinet';
                }
            }).error(function(data, status) {
               if(status===404){
                  //console.log("status = " + status);
                  $rootScope.erroLogin = "There is no user with " + credentials.email + " email";
                }
                if(status===401){
                  //console.log("status = " + status);
                  $rootScope.erroLogin = "Wrong password for " + credentials.email + " , please try again..";
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
      delete user.password2;
        $http({
            url: "http://localhost:7000/register",
            method: "POST",
            data: user
        }).success(function (response,status) {
            if(status===200){
              $rootScope.succesRegistration = "New user Successfully created. Please login using you username and password";
              $rootScope.errorRegistration  = null;
              $location.path('/login');
              $rootScope.activeMenuItem = 'login';
            }
        }).error(function(data, status) {
          if(status===409){
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
            }).success(function (response,status) {
                deffered.resolve(status);
            }).error(function(data, status) {
               deffered.reject(status);
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
