myApp.controller('TesteriumController',function($rootScope,$http,$scope, Authentication) {
  
  $scope.test = "Testeirum controiller is connected - Enviroment established!";
  
  $scope.sendEmail = function(){
  	console.log("sending email....");

            $http({
                method: 'POST',
                url: 'http://localhost:7000/reset-pass'
            }).success(function (data) {
                console.log(".....");
            });     
     };

}); // Controller