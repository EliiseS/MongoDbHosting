myApp.controller('MainController', function($scope,$rootScope, $http, Authentication) {

  
	$scope.sendMessage = function(contact){
		$http({
                method: 'POST',
                url: 'http://localhost:7000/send-email',
                data: contact
            }).success(function (data,status) {
                if(status===200){
                	$scope.successMsg = "Your message successfully sent!"
                }
            }).error(function(data,status) {
            	if(status===500){
            		$scope.errorMsg = "Error! Your message is not delivered. Please try later.";
            	}
            });
	};
  

}); // Controller