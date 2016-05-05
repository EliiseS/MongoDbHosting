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
        Authentication.register($scope.user);
        $scope.errorMessage = null;
     }else{
      $scope.errorMessage = "Passwords you entered are not equal";
     }
  }; // register

  $scope.resetPassword = function() {

    Authentication.resetPass($scope.credentials)
    .then(function(data){
      switch(data){
        case '200':
        $scope.successMessage = "Your password is reseted. New password is sent to " + $scope.credentials.email + " email";
        break;
        case '404':
        $scope.errorMessage = "There is no user with " + $scope.credentials.email + " email";
        break;
      }//switch
    },function(error){
      $scope.errorMessage = "Server is not responding, please try again later";
    });

  }; // resetPassword

}]); // Controller