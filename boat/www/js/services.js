angular.module('starter.services', [])

.factory('Yachts', function($http, LSFactory, $state) {
  // Might use a resource here that returns a JSON array
  /*
   * @name: makeEventObject
   * @param: bt - time begintime, tempd - date tempdate
   * @return: event obj
   */
  function makeEventObject(a, b) {
    var temp = {date: b};
    var now = new Date();
    var bb = new Date(b);
    if(bb.getTime() >= now.getTime()) temp.eventClass = "expired";
    else temp.eventClass = "night";
    return temp;
  };

  return {
    getDataFromServer: function(username) {

      var url = 'http://www.landtechnology.com.hk/projects/connectionapi/connection.php?method_type=view_reservation&client=' + username;
      $http.get(encodeURI(url))
        .success(function(result) {
          //$scope.events = {}

          LSFactory.delete("reservation");
          LSFactory.delete("events");
          var data = result.data;
          var kkg = [];
          var t_arr = [];
          var events_arr = [];
          console.log(result);
          if(data.length > 0)
            data.forEach(function(row) {
              kkg.push(row);

              var bt = new Date(row.fromdate);
              var et = new Date(row.todate);

              var dif = Math.round(Math.abs(bt.getTime() - et.getTime())/(24*60*60*1000));
              if(t_arr.indexOf(row.fromdate) < 0){
                t_arr.push(row.fromdate);
                events_arr.push(makeEventObject(row.fromtime, row.fromdate));
              }

              for(var i = 1; i <= dif; i++){
                var temp_d = new Date(bt.getTime() + i*24*60*60*1000);

                if(t_arr.indexOf(temp_d) < 0){
                  t_arr.push(temp_d);
                  events_arr.push(makeEventObject(row.fromtime, temp_d));
                }
              }
            });

          LSFactory.set("reservation", kkg);
          LSFactory.set("events", events_arr);
          $state.go('tab.dash');
          //$scope.$broadcast('scroll.refreshComplete');
        })
        .error( function(err) {
          console.log(err);
        });
    },
    getOtherData: function(username) {
      var url = 'http://www.landtechnology.com.hk/projects/connectionapi/connection.php?method_type=view_location&owner='+username;
      $http.get(encodeURI(url))
        .success(function(result) {
          //$scope.events = {}

          LSFactory.delete("locdata");
          LSFactory.delete("boats");
          var data = result.data;
          LSFactory.set("locdata", result.ldata);
          LSFactory.set("boats", result.Bdata);
          //console.log(result);
        })
        .error( function(err) {
          console.log(err);
        });
    }
  };
})
.service('LoginService', function($q, $http) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var url = 'http://www.landtechnology.com.hk/projects/connectionapi/connection.php?method_type=get_Auth&username=' + name+"&password="+pw;

           $http.get(encodeURI(url))
           .success(function(data) {
              if(data.result)
                deferred.resolve(data);
              else
                deferred.reject(data)                          ;
           })
           .error(function(error) {
              deferred.reject(error);
           });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
.factory('LSFactory', [function() {

  var LSAPI = {

    clear: function() {
      return localStorage.clear();
    },

    get: function(key) {
      return JSON.parse(localStorage.getItem(key));
    },

    set: function(key, data) {
      return localStorage.setItem(key, JSON.stringify(data));
    },

    delete: function(key) {
      return localStorage.removeItem(key);
    },

    getAll: function() {
      var books = [];
      var items = Object.keys(localStorage);

      for (var i = 0; i < items.length; i++) {
        if (items[i] !== 'user' || items[i] != 'token') {
          books.push(JSON.parse(localStorage[items[i]]));
        }
      }

      return books;
    }

  };

  return LSAPI;

}]);
