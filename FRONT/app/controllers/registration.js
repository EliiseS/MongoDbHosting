myApp.controller('RegistrationController',
  ['$scope', 'Authentication',function($scope, Authentication) {
  
  $scope.login = function() {
    Authentication.login($scope.credentials);
  }; //login

  $scope.logout = function() {
    Authentication.logout($scope.login);
  }; //logout

  $scope.register = function() {
    if(angular.equals($scope.user.password, $scope.user.password2)){
        Authentication.register($scope.user);
     }else{
      console.log("User passwords are not equal");
     }
  }; // register

}]); // Controller