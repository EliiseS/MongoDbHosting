myApp.controller('CabinetController',function($rootScope,$scope, Authentication) {
  
  $scope.test = "Cabinet controiller is connected - Enviroment established!";

// TESTING VARIABLE //////////////////////////////////////////////////////////

  $scope.collections = [];

  $scope.collections.push({
  	name:'Cats',
  	elements:[
  	{name:'Cat1'},
  	{name:'Cat2'},
  	{name:'Cat3'},
  	{name:'Cat4'},
  	{name:'Cat5'},
  	{name:'Cat6'},
  	{name:'Cat7'},
  	]
  });

   $scope.collections.push({
  	name:'Dogs',
  	elements:[
  	{name:'Dog1'},
  	{name:'Dog2'},
  	{name:'Dog3'}
  	]
  });

   $scope.collections.push({
  	name:'Birds',
  	elements:[
  	{name:'Bird1'},
  	{name:'Bird2'},
  	{name:'Bird3'},
  	{name:'Bird4'},
  	{name:'Bird5'}
  	]
  });



// TESTING VARIABLE //////////////////////////////////////////////////////////


}); // Controller