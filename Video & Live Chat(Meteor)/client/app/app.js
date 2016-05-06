'use strict';

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
};

angular.module('jabbrApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider,
                    $httpProvider,$sceProvider, $sceDelegateProvider,JabbrSocketProvider) {
    $urlRouterProvider.when('/dashboard', '/dashboard/overview', '/room', '/room/:roomId');
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'app/base.html'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $sceProvider.enabled(false)
    // $sceDelegateProvider.resourceUrlWhitelist([
    //   // Allow same origin resource loads.
    //   'self',
    //   // Allow loading from outer templates domain.
    //   'https://s3-us-west-1.amazonaws.com/hr-mytunes/data/**',
    //   'https://avatars3.githubusercontent.com/**',
    //   'https://avatars2.githubusercontent.com/**',
    //   'https://avatars1.githubusercontent.com/**',
    //   'https://avatars0.githubusercontent.com/**',
    //   'http://localhost:9000/**'
    // ]);
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })


  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    $rootScope.$on('$viewContentLoaded', function() {
      var windowHeight = $(window).height();
      var pageHeight = $(document).height();
      if (pageHeight > windowHeight) {
        $('.sidePanel').css('height', pageHeight);
      } else {
        $('.sidePanel').css('height', windowHeight);
      }
    });

  });
