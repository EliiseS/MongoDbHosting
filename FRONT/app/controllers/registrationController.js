myApp.controller('RegistrationController',
  ['$rootScope','$scope', 'Authentication',function($rootScope,$scope, Authentication) {

  $scope.login = function() {
    Authentication.login($scope.credentials);
  }; //login

  $scope.logout = function() {
    console.log("TRYING TO LOGOUT....");
    Authentication.logout();
  }; //logout

  $scope.register = function() {

    if(angular.equals($scope.user.password, $scope.user.password2)){
        var userForBackEnd = jQuery.extend({}, $scope.user); // CLONE OBJECT, TO SOLVE PROBLEMS WITH CAUSED BY DOUBLE BINDING
        Authentication.register(userForBackEnd);
        $scope.errorMessage = null;
        $scope.showHint     = null;
     }else{
      $scope.errorMessage = "Passwords you entered are not equal";
     }
     
  }; // register

  $scope.resetPassword = function() {

    console.log("RESET PASSWORD");

    Authentication.resetPass($scope.credentials)
    .then(function(status){
        if(status===200){
          $scope.errorMessage = null;
          $scope.successMessage = "Your password is reseted. New password is sent to " + $scope.credentials.email + " email";
        }//switch
    },function(status){
        if(status===404){
          $scope.errorMessage = "There is no user with " + $scope.credentials.email + " email";
        }else{
          $scope.errorMessage = "Server is not responding, please try again later";
        }
    });

  }; // resetPassword

  $scope.setActiveMenuItem = function(pageName){
      $rootScope.activeMenuItem = pageName;
  };




}]); // Controller