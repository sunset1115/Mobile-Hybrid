angular.module('starter.controllers', [])

.controller('NavCtrl', function($rootScope, $scope, $state, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    var now = new Date();
    var obj = {date: new Date(), flag: "thank"};
    $state.go('tab.boats', {param: angular.toJson(obj)});
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };

  $rootScope.showPlus = function(flag) {
    if(flag) return "ion-plus";
    else return "";
  }
})

.controller('DashCtrl', function ($rootScope, $scope, $http, $location, $state, LSFactory) {
  "use strict";

  $rootScope.showPlus(true);
  //angular.element(document.querySelector(".mynavbar .ion-plus")).removeClass("hidePlus").addClass("showPlus");
  //set the options of flexcalendar
  $scope.options = {
    eventClick: function(date) { // called before dateClick and only if clicked day has events
      //$state.go('tab.boats', {date: date});
    },
    dateClick: function(tdate) { // called every time a day is clicked

      var flag = false;
      if(events_arr && events_arr.length > 0)
        events_arr.forEach(function(obj) {
          var a = new Date(obj.date);
          var b = new Date(tdate.date);
          var temp_a = Math.round(parseInt(a.getTime())/(24*60*60*1000));
          var temp_b = Math.round(parseInt(b.getTime())/(24*60*60*1000));

          if(temp_a == temp_b){
            flag = true;
          }
        });

      //angular.element(document.querySelector(".selected")).removeClass("selected");
      var obj = {date: tdate, flag: true};
      $state.go('tab.boats', {param: angular.toJson(obj)});
    },
    changeMonth: function(month, year) {
      return;
    },
    filteredEventsChange: function(filteredEvents) {
      return;
    }
  };

  var username = LSFactory.get("user");
  var events_arr = LSFactory.get("events");

  console.log(events_arr);
  if(username)
    $scope.events = events_arr;
  else
    $location.path('/login');
  //alert(JSON.stringify(events_arr));

})

.controller('BoatCtrl', function($rootScope, $scope, $http, $stateParams, LSFactory, Yachts) {

  $rootScope.showPlus(true);
  //angular.element(document.querySelector(".mynavbar .ion-plus")).removeClass("hidePlus").addClass("showPlus");
  var param = JSON.parse($stateParams.param);
  var reservation = LSFactory.get("reservation");
  $scope.ldatas = LSFactory.get("locdata");
  $scope.bdatas = LSFactory.get("boats");
  console.log($scope.ldatas);
  console.log(param);
  var temp_boat = [];
  var reserv_for_boat = [];
  var dds = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  $scope.isShowed = param.flag;
  var cur_date = new Date();
  $scope.ship = {};
  var myftime = "";
  var myttime = "";

  function timePickerCallback(val, flag) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      var selectedTime = new Date(val * 1000);
      console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
      if(flag) myftime = selectedTime.getUTCHours()+":"+selectedTime.getUTCMinutes()+":"+selectedTime.getUTCSeconds();
      else myttime = selectedTime.getUTCHours()+":"+selectedTime.getUTCMinutes()+":"+selectedTime.getUTCSeconds();

      setTimeout(function(){
        $scope.myftime = myftime;
        $scope.myttime = myttime;
        $scope.$apply();
      });
    }
  }



  if(param.flag !== "thank")
    cur_date = new Date(param.date.date);
  else
    $scope.isShowed = false;
  init();
  /*
   * @name: init screen
   */

  function init() {
    $scope.cur_date = cur_date.getFullYear()+" 年 " + (parseInt(cur_date.getMonth()) + 1)+" 月" + cur_date.getDate()+" 日";
    temp_boat = [];
    $scope.boats = [];
    console.log(reservation);
    var fftime = 0;
    var tttime = 0;
    if(reservation && reservation.length > 0)
      reservation.forEach( function(row) {
        var fdate = new Date(row.fromdate);
        var tdate = new Date(row.todate);
        var ct = Math.round(cur_date.getTime()/(1000*60*60*24));
        var ft = Math.round(fdate.getTime()/(1000*60*60*24));
        var tt = Math.round(tdate.getTime()/(1000*60*60*24));

        if(ct >= ft && ct <= tt){
          var obj = {};
          reserv_for_boat.push(row);
          obj.id = row.id;
          obj.name = row.boatname;
          obj.ftime = convertTime(row.fromtime);
          obj.ttime = convertTime(row.totime);

          if(obj.ftime.indexOf("a.m") > 0){
            obj.iconClass = "ion-ios-sunny";
            obj.cusClass = "day";
          }else{
            obj.iconClass = "ion-ios-moon";
            obj.cusClass = "night";
          }
          obj.fpos = row.boardinglocation;
          obj.tpos = row.offlocation;
          obj.psrc = row.contactphone;
          obj.img_src = "http://www.landtechnology.com.hk/projects/codeigniter/uploads/boat/boat-"+ row.bid +".png";
          temp_boat.push(obj);
        }
      });

    $scope.ftimePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 10,  //Optional
      format: 12,  //Optional
      titleLabel: 'Select start time',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val, true);
      }
    };

    $scope.ttimePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 10,  //Optional
      format: 12,  //Optional
      titleLabel: 'Select finish time',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val, false);
      }
    };
    setTimeout(function() {
      $scope.boats = temp_boat;
      $scope.$apply();
    });
  };

  /*
   * @name: convertTime
   * @param: a string
   * @return: b object
   */
  function convertTime(a) {
    var ret = null;
    var temp = a.substr(0, a.indexOf(":"));
    ret = parseInt(temp) % 12;
    ret += a.substr(a.indexOf(":"));
    if(parseInt(temp)/12) ret += " a.m";
    else ret += " p.m"
    return ret;
  }

  /*
   * @name: prevDate
   */
  $scope.prevDate = function() {
    cur_date = new Date(cur_date.getTime() - 24*60*60*1000 );
    init();
  };

  $scope.nextDate = function() {
    cur_date = new Date(cur_date.getTime() + 24*60*60*1000 );
    init();
  };

  $scope.edit = function(index) {

    if(index < 10000){
      var ldata = LSFactory.get("locdata");
      var temp = reserv_for_boat[index];
      $scope.dayval = dds[cur_date.getDay()];
      $scope.cur_date = cur_date.getFullYear()+" 年 " + (parseInt(cur_date.getMonth()) + 1)+" 月" + cur_date.getDate()+" 日";
      var obj = {};
      obj.boatname = temp.boatname;
      console.log(ldata);
      for(var i=0; i<ldata.length;i++){
        var ktemp = ldata[i];
        console.log(ktemp.newlocation + "/" + temp.boardinglocation);
        if(ktemp.newlocation == temp.boardinglocation){
          obj.fposition = ktemp.id;
          console.log("newloacation");
        }else if(ktemp.newlocation == temp.offlocation){
          obj.tposition = ktemp.id;
          console.log("tah");
        }
      }
      //obj.fposition = temp.boardinglocation;
      obj.fromtimeValue = new Date(temp.fromdate + " " + temp.fromtime);
      //obj.tposition = temp.offlocation;
      obj.totimeValue = new Date(temp.todate + " " + temp.totime);
      obj.contact = temp.clientname;
      obj.phone = temp.contactphone;
      $scope.ship = obj;

      //day or night
      var tday = new Date(temp.fromdate + " " + "18:00:00");
      $scope.stoggle(tday.getTime() >= obj.fromtimeValue);
    }
    $scope.isShowed = false;
  }

  $scope.ring = function(href) {
    window.open("tel:" + href);
  }

  $scope.stoggle = function(bflag) {
    if(bflag){
      angular.element(document.querySelector(".frontdiv")).css("background-color","#0c60ee");
      angular.element(document.querySelector(".frontdiv")).css("color","white");
      angular.element(document.querySelector(".backdiv")).css("background-color","white");
      angular.element(document.querySelector(".backdiv")).css("color","#F16B1F");
    }else{
      angular.element(document.querySelector(".backdiv")).css("background-color","#0c60ee");
      angular.element(document.querySelector(".backdiv")).css("color","white");
      angular.element(document.querySelector(".frontdiv")).css("background-color","white");
      angular.element(document.querySelector(".frontdiv")).css("color","#F16B1F");
    }
  }
  $scope.delete = function(id) {
    var url = "http://www.landtechnology.com.hk/projects/connectionapi/connection.php?method_type=delete_reservation&id=" + id;
    $http.get(url)
      .success(function(res) {
        if(res.result){//success
          var username = LSFactory.get("user");
          Yachts.getDataFromServer(username);
        }else{//error
          var alertPopup = $ionicPopup.alert({
            title: 'Delete reservation failed!',
            template: 'Please again later!'
          });
        }
      })
      .error(function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Delete reservation failed!',
          template: 'Please again later!'
        });
      })
  }

  $scope.register = function() {
    var temp = $scope.ship;
    var obj = "";
    obj += 'boatname=' + temp.boatname;
    obj += '&boardingposition=' + temp.fposition;
    obj += '&offposition=' + temp.tposition;
    var tempdate = new Date(temp.fromtimeValue);
    obj += '&fromdate=' + cur_date.getFullYear() + "-" + (cur_date.getMonth()+1) + "-" +cur_date.getDate();
    obj += '&fromtime=' + myftime; //tempdate.getHours()+":"+tempdate.getMinutes()+":"+tempdate.getSeconds();
    tempdate = new Date(temp.totimeValue);
    obj += '&todate=' + cur_date.getFullYear() + "-" + (cur_date.getMonth()+1) + "-" +cur_date.getDate();
    obj += '&totime=' + myttime; //tempdate.getHours()+":"+tempdate.getMinutes()+":"+tempdate.getSeconds();
    obj += '&contact=' + temp.contact;
    obj += '&contactphone=' + temp.phone;
    obj += "&boat_owner=" + LSFactory.get("user");

    //console.log(obj);
    var url = 'http://www.landtechnology.com.hk/projects/connectionapi/connection.php?method_type=add_reservation_data&'+obj;
    $http.post(encodeURI(url))
      .success(function(result){
        if(result.data){
          var alertPopup = $ionicPopup.alert({
            title: 'Saveing data!',
            template: 'Success saved!'
          });
        }
      })
      .error(function(err) {
        console.log(err);
      });
  }
})

.controller('ChatsCtrl', function($rootScope, $scope, $http, LSFactory, Yachts) {

  //Yachts.init();
  $rootScope.showPlus(false);
  //angular.element(document.querySelector(".mynavbar .ion-plus")).removeClass("showPlus").addClass("hidePlus");
  var username = LSFactory.get("user");
  var url = "http://www.landtechnology.com.hk/projects/connectionapi/connection.php?method_type=view_yoauts&owner="+username;
  var option = LSFactory.get("option");
  var yacht = null;

  /* @name: init
   * @param: $http,
   * @return: json data
   * @func: get data from serve with json type
   */
  function init() {
    $http.get(encodeURI(url))
      .success(function(data) {
        LSFactory.set("data", data.data);
        LSFactory.set("option", true);
        yacht = data.data;
        initScreen();
      })
      .error( function(err) {
        console.log(err);
      });
  }

  /* @name: initScreen();
   * @param: yacht data,
   * @return: item list
   * @func: show yachts in ion-list by lists
   */
  function initScreen() {
    setTimeout(function() {
      $scope.yachts = yacht;
      $scope.$apply();
    }, 10);
  }

  /* @name: getImagePath
   * @param: index of list,
   * @return: path string image path, if image, the path is for defalut image.
   * @func: get image path from server or local
   */
  $scope.getImagePath = function(index) {
    return "http://www.landtechnology.com.hk/projects/codeigniter/uploads/boat/boat-"+ index +".png";

  }

  console.log(option);
  if(option){  //having already data.//haven't data yet.
    yacht = LSFactory.get("data");
    initScreen();
  }else{    //haven't data yet.
    init();
  }

  $scope.isShowIcon = function(res) {
    if(res == "yes") return "show-div";
    else return "hide-div";
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Yachts) {
  $scope.chat = Yachts.getYacht($stateParams.chatId);
})

.controller('AccountCtrl', function($rootScope, $scope, $http, $stateParams, LSFactory) {

  $rootScope.showPlus(false);// = "hidePlus";
  //angular.element(document.querySelector(".mynavbar .ion-plus")).removeClass("showPlus").addClass("hidePlus");
  var selShip = $stateParams.shipId;
  var user = LSFactory.get("userdata");
  user.face = 'img/mike.png';
  $scope.users = user;
  console.log(user);
  /*
   * @name: getUserData
   * @param: $http
   * @return: json user data
   * @func: getting user data from server
   */

  function getUserData() {


  }
})

.controller('LoginCtrl', function($scope, $http, LoginService, $ionicPopup, $state, LSFactory, Yachts) {
  $scope.user = {};

  $scope.login = function(user) {
    LoginService.loginUser(user.username, user.pw).success(function(res) {
      if(res.result){
        LSFactory.set('user', user.username);
        LSFactory.set('userdata', res.data[0]);
        LSFactory.set("option", false);
        Yachts.getOtherData(user.username);
        Yachts.getDataFromServer(user.username);
      }else{
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      }
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
      });
    });
  }
})
;
