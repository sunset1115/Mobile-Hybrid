angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $timeout) {

  $scope.appClass = "searchmain" || "";
  $scope.headClass = " bar-energized searchbar" || "";

  $scope.topHeader = true;
  $rootScope.$on("menuShow",function(key) {
    $scope.topHeader = key;
  });

  $rootScope.$on("searchmain", function() {
    setTimeout(function() {
      $scope.appClass = "bar-energized searchbar";
      $scope.$apply();
    });
  });

  $rootScope.$on("toronto", function(flag) {
    if(flag){
      setTimeout(function() {
        $scope.appClass = "bar-dark toronto";
        $scope.$apply();
      })
    }
  });

  $rootScope.$on("hidetab", function(flag) {
    if(flag) angular.element(document.querySelector(".thank .tab-nav")).addClass("hide");
    else angular.element(document.querySelector(".thank .tab-nav")).removeClass("hide");
  })

  $scope.toggleSideMenu = function() {
    if ($ionicSideMenuDelegate.isOpen()) {
      $ionicSideMenuDelegate.toggleLeft(false); // close
    } else {
      $ionicSideMenuDelegate.toggleLeft(); // open
    }
  };
})

.controller('SearchMainCtrl', function($scope, $state, $location) {
  $scope.isSearchResult = true;
  angular.element(document.querySelector(".thank .tab-nav")).removeClass("hide");
  var sheight = parseInt(window.screen.height);
  sheight -= 189;
  angular.element(document.querySelector(".mysearch")).css("height", sheight + "px");
  /*angular.element(document.querySelector(".thank")).addClass("search");*/
  $scope.toronto = {searchtxt: '', seed: ''};
  var short_items = [
    [
      {id: 1, name: "RESTAURANTS", iurl:"img/restaurant.png"},
      {id: 2, name: "BANKS", iurl:"img/bank.png"},
      {id: 3, name: "COFFEE", iurl:"img/coffee.png"}
    ],
    [
      {id: 4, name: "PIZA", iurl:"img/kpiza.png"},
      {id: 5, name: "HOTELS", iurl:"img/hotel.png"},
      {id: 6, name: "TAXI", iurl:"img/taxi.png"}
    ]
  ];

  var more_items = [
    [
      {id: 1, name: "RESTAURANTS", iurl:"img/restaurant.png"},
      {id: 2, name: "BANKS", iurl:"img/bank.png"},
      {id: 3, name: "COFFEE", iurl:"img/coffee.png"}
    ],
    [
      {id: 1, name: "PIZA", iurl:"img/kpiza.png"},
      {id: 2, name: "HOTELS", iurl:"img/hotel.png"},
      {id: 3, name: "TAXI", iurl:"img/taxi.png"}
    ],
    [
      {id: 1, name: "RESTAURANTS", iurl:"img/restaurant.png"},
      {id: 2, name: "BANKS", iurl:"img/bank.png"},
      {id: 3, name: "COFFEE", iurl:"img/coffee.png"}
    ],
    [
      {id: 1, name: "PIZA", iurl:"img/kpiza.png"},
      {id: 2, name: "HOTELS", iurl:"img/hotel.png"},
      {id: 3, name: "TAXI", iurl:"img/taxi.png"}
    ]
  ];

  $scope.cat_items = short_items;
  $scope.leisure = [
    [
      {face:"img/bay.png", des:"The Bay Deal of the Day:T..", name: "The Bay", iconClass: "ion-tshirt"},
      {face:"img/stuff.png", des:"Kitchen Stuff Pluss Red Hot...", name: "Kitchen Stuff Plus", iconClass: "ion-ios-home"}
    ],
    [
      {face:"img/bay.png", des:"The Bay Deal of the Day:T..", name: "The Bay", iconClass: "ion-tshirt"},
      {face:"img/stuff.png", des:"Kitchen Stuff Pluss Red Hot...", name: "Kitchen Stuff Plus", iconClass: "ion-ios-home"}
    ]
  ];

  $scope.search_results = [
    {toronto: "Nikko Sushi", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"},
    {toronto: "EDO Deliver & Take-Out", address:"431 Spadina Rd, Toronto, ON, MSP 2W3"},
    {toronto: "Asian Cuisine", address:""},
    {toronto: "Spas", address:""},
    {toronto: "Groceries", address:""},
    {toronto: "Nikko Sushi1", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"},
    {toronto: "Nikko Sushi2", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"},
    {toronto: "Nikko Sushi3", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"}
  ];

  $scope.showSearch = function() {
    setTimeout(function() {
      $scope.isSearchResult = $scope.length > 0;
      $scope.$apply();
    });
  }

  $scope.search = function() {
    var toronto = $scope.toronto;
    //if(toronto.seed.length > 0){
      //$state.go('search.toronto', {seed: 'sun'});
      $location.path('/search/main/sun');
    //}
  };

  var flag = false;
  $scope.showMore = function() {
    flag = !flag;
    if(flag){
      setTimeout(function() {
        $scope.cat_items = short_items;
        $scope.$apply();
      });
    }else{
      setTimeout(function() {
        $scope.cat_items = more_items;
        $scope.$apply();
      });
    }
  }
})

.controller('TorontoCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $state) {
  var seed = $stateParams.seed;

  //$rootScope.$emit("toronto", true);
  angular.element(document.querySelector(".thank .tab-nav")).addClass("hide");
  /*angular.element(document.querySelector(".search .tab-content")).css("top", "0px");*/

  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor:  'rgb(200, 100, 100)',
    rating:  2,
    minRating:1,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };

  $scope.rows = [
    {url: 'img/bank.png',title:'Honeybee Restaurant', des: '2028 Queen St E, Toronto, ON, M4L 1J4'},
    {url: 'img/bay.png',title:'Maki My Way', des: '293 King St W, Toronto, ON, M5V 1J5'},
    {url: 'img/coffee.png',title:'Blowfish Restaurant', des: '333 Bay St, Toronto, ON, MSH 2R2'}

  ];

  $scope.lrows = [
    {url: 'img/hotel.png',title:'Saigon Flower Restaurant', des: '1138 Queen St W, Toronto, ON, M6J 1J3'},
    {url: 'img/piza.png',title:'Honeybee Restaurant', des: '2028 Queen St E, Toronto, ON..'},
    {url: 'img/stuff.png',title:'Sushi Gen', des: '1502 Younge St, Toronto, ON, M4T 1Z6'},
    {url: 'img/taxi.png',title:'Oriental Taste Restaurant', des: '329 Queen St E, Toronto, ON, M5A 1S9'}
  ];

  $scope.backState = function() {
    $rootScope.$emit("hidetab",false);
    $state.go("search.main");
  }

  var mapPopup = null;
  $scope.showMapModal = function(index){
    mapPopup = $ionicPopup.show({
      templateUrl: 'hint-popup.html',
      title: 'Asian Cuisine',
      subTitle: 'in this area',
      scope: $scope,
      cssClass: 'formodal'
    });
  };

  $scope.selrow = $scope.rows[0];

  $scope.backModalState = function(flag){
    if(flag) mapPopup.close();
  };

  var detailPopup = null;
  $scope.detail = function() {
    $state.go("search.detail");
    mapPopup.close();
  };
  $scope.init = function() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });
    $scope.map = map;
  }
  //google.maps.event.addDomListener(window, 'load', initialize);
})
  .controller('DetailCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, $state) {
    var seed = $stateParams.seed;

    angular.element(document.querySelector(".thank .tab-nav")).addClass("hide");

    $scope.hrs = [
      {day: 'Monday', hr:'12:00pm - 9:00pm'},
      {day: 'Tuesday', hr:'12:00pm - 9:00pm'},
      {day: 'Wednesday', hr:'12:00pm - 9:00pm'},
      {day: 'Thursday', hr:'12:00pm - 9:00pm'},
      {day: 'Friday', hr:'12:00pm - 10:00pm'},
      {day: 'Saturday', hr:'12:00pm - 10:00pm'},
      {day: 'Sunday', hr:'12:00pm - 9:00pm'},
    ];

    $scope.backState = function() {
      $rootScope.$emit("hidetab",false);
      $state.go("search.main");
    };

    $scope.ratingsObject = {
      iconOn : 'ion-ios-star',
      iconOff : 'ion-ios-star-outline',
      iconOnColor: '#e6b500',
      iconOffColor:  '#ccc',
      rating:  2,
      minRating:1,
      callback: function(rating) {
        $scope.ratingsCallback(rating);
      }
    };

    $scope.ratingsCallback = function(rating) {
      console.log('Selected rating is : ', rating);
    };

    $scope.init = function() {
      var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("mapdetail"),
        mapOptions);

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Uluru (Ayers Rock)'
      });
      $scope.map = map;
    }

  })
.controller('SearchDiscoverCtrl', function($scope) {
  //content view height controlling
  var sheight = parseInt(window.screen.height);
  sheight -= 189;
  angular.element(document.querySelector(".discover")).css("height", sheight + "px");

  $scope.cat_items = [
    {toronto: "Nikko Sushi", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"},
    {toronto: "EDO Deliver & Take-Out", address:"431 Spadina Rd, Toronto, ON, MSP 2W3"},
    {toronto: "Asian Cuisine", address:""},
    {toronto: "Spas", address:""},
    {toronto: "Groceries", address:""},
    {toronto: "Nikko Sushi1", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"},
    {toronto: "Nikko Sushi2", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"},
    {toronto: "Nikko Sushi3", address:"376 Eglinton Ave W, Toronto. ON, M5N 1A2"}
  ]
})

.controller('FavoriteMainCtrl', function($scope, $state, $rootScope) {
  angular.element(document.querySelector(".menu-content .searchbar")).css("display", "none");
  /*angular.element(document.querySelector(".thank .tab-nav")).css("background-color", "transparent");
  angular.element(document.querySelector(".thank .tab-nav")).css("color", "transparent");
  angular.element(document.querySelector(".thank .tab-nav")).css("background-color", "transparent");
*/
  $scope.rows = [
    {head:'Tim Hortons', des: '210 Princes Blvd, Toronto, ON, M6K 3C3', tel:'416-603-2366'},
    {head:'Nohohon Tea Room', des: '467 Queen St W, Toronto, ON, M5V 2A9', tel:'416-603-2366'}
  ]

  $scope.backState = function() {
    $rootScope.$emit("hidetab",false);
    $state.go("search.main");
  };
})

.controller('FavoriteSearchCtrl', function($scope, $stateParams) {
  angular.element(document.querySelector(".menu-content .searchbar")).css("display", "none");
  /*angular.element(document.querySelector(".thank .tab-nav")).css("background-color", "transparent");
   angular.element(document.querySelector(".thank .tab-nav")).css("color", "transparent");
   angular.element(document.querySelector(".thank .tab-nav")).css("background-color", "transparent");
   */
  $scope.rows = [
    {head:'Tim Hortons', des: 'Toronto, ON, M6K 3C3', tel:'416-603-2366'},
    {head:'Nohohon Tea Room', des: '', tel:'416-603-2366'},
    {head:'Tim Hortons', des: 'Toronto, ON, M6K 3C3', tel:'416-603-2366'},
    {head:'Nohohon Tea Room', des: '', tel:'416-603-2366'},
    {head:'Tim Hortons', des: 'Toronto, ON, M6K 3C3', tel:'416-603-2366'},
    {head:'Nohohon Tea Room', des: '', tel:'416-603-2366'}
  ];
  console.log("search");
});
