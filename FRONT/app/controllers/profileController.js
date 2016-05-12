myApp.controller('ProfileController',function($rootScope,$scope, ProfileSevice) {
  
  $scope.test = "Profile controiller is connected - Enviroment established!";

  $scope.changePass = function(){

  	//console.log($scope.profile);
  	    if(angular.equals($scope.profile.newPassword, $scope.profile.newPassword2)){
  	    	var credentials = {};
  	    	credentials.password = $scope.profile.newPassword;
  	    	credentials.email = $rootScope.currentUser.email;
	        ProfileSevice.changePassword(credentials).then(function(data,status){
				    if(status===200){
				    $scope.errorMessage = null;
				    $scope.successMessage = "Your password is successfully updated!";
				    }
				},function(error){
				  $scope.errorMessage = "Operation aborted, server not responding.";
				});
	     }else{
	      $scope.errorMessage = "Passwords are not equal. Try again";
	     }

  };

  $scope.changeEmail = function(){
  	    
  	    if(angular.equals($scope.profile.email, $scope.profile.email2)){
  	    	var credentials = {};
  	    	credentials.email = $scope.profile.email;
  	    	credentials._id    = $rootScope.currentUser._id;
	        ProfileSevice.changeEmail(credentials).then(function(data,status){
				    if(status===200){
				    $scope.errorMessage = null;
				    $scope.successMessage = "Your email is successfully updated to " + $scope.profile.email;
				    $rootScope.currentUser.email = credentials.email;
				    }
				    if(data===409){
				    $scope.errorMessage = "Email " + $scope.profile.email + " is already in use, please choose new one";
				    $scope.successMessage = null;
				    }
				},function(error){
				  $scope.errorMessage = "Operation aborted, server not responding.";
				});
	     }else{
	      $scope.errorMessage = "Emails are not equal. Try again";
	     }
  };
  
 
}); // Controller