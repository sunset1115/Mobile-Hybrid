// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic-ratings', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('search', {
    url: '/search',
    abstract: true,
    templateUrl: "templates/search.html"
  })

  .state('search.main', {
    url: '/main',
    views: {
      'search': {
        templateUrl: 'templates/search/main.html',
        controller: 'SearchMainCtrl'
      }
    }
  })

  .state('search.toronto', {
    url: '/main/:seed',
    views: {
      'search': {
        templateUrl: 'templates/search/toronto.html',
        controller: 'TorontoCtrl'
      }
    }
  })

  .state('search.detail', {
    url: '/map',
    views: {
      'search': {
        templateUrl: 'templates/detail.html',
        controller: 'DetailCtrl'
      }
    }
  })

  .state('search.discover', {
    url: '/discover',
    views: {
      'discover': {
        templateUrl: 'templates/search/discover.html',
        controller: 'SearchDiscoverCtrl'
      }
    }
  })

  .state('favorite', {
    url: '/favorite',
    abstract: true,
    templateUrl: "templates/favorite.html"
  })
  .state('favorite.main', {
    url: '/main',
    views: {
      'favorite': {
        templateUrl: 'templates/favorite/main.html',
        controller: 'FavoriteMainCtrl'
      }
    }
  })
  .state('favorite.search', {
  url: '/search',
  views: {
    'search': {
      templateUrl: 'templates/favorite/search.html',
      controller: 'FavoriteSearchCtrl'
    }
  }
});

  $urlRouterProvider.otherwise('/search/main');
});
