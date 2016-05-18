(function() {
    'use strict';

    angular
        .module("datingApp")
        .service("UserService", UserService);

    function UserService($http, $location, $q, $window){
      var baseUrl = 'http://galvanize-student-apis.herokuapp.com/gdating/';
      return {
        signup: function(user){
          return $http.post(baseUrl + 'auth/register', user);
        },
        login: function(user){
          return $http.post(baseUrl + 'auth/login', user);
        },
        setCurrentUser: function(data){
          $window.localStorage.setItem("token", data.data.data.token);
          $window.localStorage.setItem("user", JSON.stringify(data.data.data.user));
        },
        getCurrentUser: function(){
          var dfd = $q.defer();
          dfd.resolve(JSON.parse($window.localStorage.getItem("user")));
          return dfd.promise;
        },
        logout: function(){
          localStorage.clear();
        },
        getAllUsers: function(){
          return $http.get(baseUrl + "members");
        },
        // getSingleUser: function(id){
        //   return $http.get("/api/users/" + id);
        // },
        // editUser: function(user){
        //   return $http.put("/api/users/" + user.data.id, user.data);
        // },
        // removeUser: function(id){
        //   return $http.delete("/api/users/" + id);
        // }
      };
    };
})();
