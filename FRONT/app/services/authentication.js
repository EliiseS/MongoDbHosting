myApp.factory('Authentication',['$rootScope','$http', function($rootScope,$http) {

  var user = true;

  var myObject = {
    login: function(credentials) {
            $http({
                method: 'POST',
                url: 'http://localhost:7000/login',
                data: credentials
            }).success(function (data) {
                console.log("5 FROM SERVER: " + JSON.stringify(data));
            });
        ///////////////////////

//TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING             
            //$rootScope.user = {name: "Nikolai Kalistratov"};
            //user = {name: "Nikolai Kalistratov"};
//TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING           
        
    }, // login
    logout: function() {
      console.log("logout");
    }, //logout

    requireAuth: function() {
      return auth.$requireAuth();
    }, //require Authentication

    register: function(user) {
        $http({
            url: "http://localhost:7000/register",
            method: "POST",
            data: user
        }).success(function (response) {
            var data = JSON.parse(JSON.stringify(response));
            console.log("RESPONSE FROM SERVER: " + data.msg);
        });
    }, // register

    isAuthenticated: function(){
        return user;
    }
  };

  return myObject;
}]); //factory
