(function() {
    'use strict';

    angular
        .module("datingApp")
        .service("UserService", UserService);

    function UserService($http, $location, $q, $window, $state){
      var baseUrl = 'http://galvanize-student-apis.herokuapp.com/gdating/';
      return {
        signup: function(user){
          return $http.post(baseUrl + 'auth/register', user).then((result)=>{
            this.setCurrentUser(result.data.data.token, result.data.data.data);
          });
        },
        login: function(user){
          return $http.post(baseUrl + 'auth/login', user).then((result)=>{
            this.setCurrentUser(result.data.data.token, result.data.data.user);
          });
        },
        setCurrentUser: function(token, user){
          $window.localStorage.setItem("token", token);
          $window.localStorage.setItem("user", JSON.stringify(user));
        },
        getCurrentUser: function(){
          var dfd = $q.defer();
          var logedInUser = $window.localStorage.getItem("user");
          dfd.resolve(JSON.parse(logedInUser));
          return dfd.promise;
        },
        logout: function(){
          localStorage.clear();
        },
        getMembers: function(){
          return $http.get(baseUrl + "members").then((result)=>{
            return result.data.data;
          });
        },
        getProfile: function(id){
          return $http.get(baseUrl + "members/" + id);
        },
        editUser: function(user){
          return $http.put(baseUrl + "members/" + user._id, user).then((result)=>{
            $window.localStorage.removeItem("user");
            $window.localStorage.setItem("user", JSON.stringify(result.data.data));
          })
        },
        removeUser: function(id){
          return $http.delete(baseUrl + "members/" + id).then((result)=>{
            $window.localStorage.clear();
          });
        }
      };
    };
})();
