(function() {
    'use strict';

    angular
        .module("datingApp")
        .service("UserService", UserService);

    function UserService($http, $location, $q, $window, $state){
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
          var logedInUser = $window.localStorage.getItem("user");
          if (logedInUser) {
            dfd.resolve(JSON.parse(logedInUser));
          } else {
            dfd.resolve(null);
          }
          return dfd.promise;
        },
        logout: function(){
          localStorage.clear();
          $state.go('home');
        },
        getAllUsers: function(){
          return $http.get(baseUrl + "members");
        },
        getProfile: function(id){
          return $http.get(baseUrl + "members/" + id);
        },
        editUser: function(user){
          console.log(user.id);
          return $http.put(baseUrl + "members/" + user.id, user);
        },
        removeUser: function(id){
          return $http.delete("/api/users/" + id);
        }
      };
    };
})();
