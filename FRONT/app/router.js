    var module = angular.module("myApp");
    
    module.config(function($stateProvider, $urlRouterProvider) {

    //LOGIN
    $stateProvider.state('login', {
        url: '/login', // if user changes url
        templateUrl: 'app/views/login.html',
        controller: 'RegistrationController'
    });

    //REGISTER
    $stateProvider.state('register', {
        url: '/register', // if user changes url
        templateUrl: 'app/views/register.html',
        controller: 'RegistrationController'
    });

    //About
    $stateProvider.state('about', {
        url: '/about', // if user changes url
        templateUrl: 'app/views/about.html',
        controller: 'MainController'
    });

    //CONTACT
    $stateProvider.state('contact', {
        url: '/contact', // if user changes url
        templateUrl: 'app/views/contact.html',
        controller: 'MainController'
    });

    //CONTACT
    $stateProvider.state('main', {
        url: '/', // if user changes url
        templateUrl: 'app/views/main.html',
        controller: 'MainController'
    });

    $stateProvider.state('cabinet', {
        url: '/cabinet',
        templateUrl: 'app/views/cabinet.html',
        controller: 'CabinetController',
        resolve: { authenticate: authenticate }
      });

     function authenticate($q, Authentication, $state, $timeout) {
      if (Authentication.isAuthenticated()==false) {
        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('main');
          console.log("LOGIN REQUIRED! NOT ALLOWED TO SEE THIS PAGE!");
        })

        // Reject the authentication promise to prevent the state from loading
        return $q.reject();
      }
    };

    
    $urlRouterProvider.otherwise('/');
    
});