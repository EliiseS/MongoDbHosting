    var module = angular.module("myApp");

    module.run(['$rootScope', '$location', 'userPersistenceService','Authentication', function($rootScope, $location, userPersistenceService,Authentication) {
        var cookies = userPersistenceService.getCookieData();

        if(cookies.name===undefined){
            Authentication.setAuthentication(false);
            $rootScope.currentUser = undefined;
        }else{
            $rootScope.currentUser = cookies;
            Authentication.setAuthentication(true);
        }
      }]); //run

    
    module.config(function($stateProvider, $urlRouterProvider) {

    //LOGIN
    $stateProvider.state('login', {
        url: '/login', // if user changes url
        templateUrl: 'app/views/login.html',
        controller: 'RegistrationController'
    });

    //RESET PASS
    $stateProvider.state('reset-pass', {
        url: '/reset-pass', // if user changes url
        templateUrl: 'app/views/reset-pass.html',
        controller: 'RegistrationController'
    });

    //REGISTER
    $stateProvider.state('register', {
        url: '/register', // if user changes url
        templateUrl: 'app/views/register.html',
        controller: 'RegistrationController'
    });

    //ABOUT
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

    //MAIN
    $stateProvider.state('main', {
        url: '/', // if user changes url
        templateUrl: 'app/views/main.html',
        controller: 'MainController'
    });

    //TESTERIUM
    $stateProvider.state('testerium', {
        url: '/testerium', // if user changes url
        templateUrl: 'app/views/testerium.html',
        controller: 'TesteriumController'
    });

    //=====================================================================================
    //BELOW ROUTES THAT REQUIRES AUTHENTICATION

    //CABINET
    $stateProvider.state('cabinet', {
        url: '/cabinet',
        templateUrl: 'app/views/cabinet.html',
        controller: 'CabinetController',
        resolve: { authenticate: authenticate }
      });

    $stateProvider.state('cabinet.collection', {
        url: '/collection',
        templateUrl: 'app/views/collection.html',
        controller: 'CabinetController',
        resolve: { authenticate: authenticate }
      });

    //PROFILE -----------------------------------------------------------
    $stateProvider.state('profile', {
        abstract: true,
        url: '/profile',
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileController',
        params: {
            autoActivateChild: 'profile.default'
        },
        resolve: { authenticate: authenticate }
      });

     $stateProvider.state('profile.default', {
        url: '/default',
        templateUrl: 'app/views/profile-default.html',
        controller: 'ProfileController',
        resolve: { authenticate: authenticate }
      });

    $stateProvider.state('profile.change-password', {
        url: '/change-password',
        templateUrl: 'app/views/profile-change-password.html',
        controller: 'ProfileController',
        resolve: { authenticate: authenticate }
      });

    $stateProvider.state('profile.change-email', {
        url: '/change-email',
        templateUrl: 'app/views/profile-change-email.html',
        controller: 'ProfileController',
        resolve: { authenticate: authenticate }
      });

     function authenticate($rootScope, $q, Authentication, $state, $timeout) {
      if (Authentication.isAuthenticated()==false) {
        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('main');
        })
        // Reject the authentication promise to prevent the state from loading
        return $q.reject();
      }else{
        $q.when();
      }
    };

    
    $urlRouterProvider.otherwise('/');
    
});