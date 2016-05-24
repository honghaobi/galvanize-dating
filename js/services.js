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
        getCurrentUserMatches: function(id){
          return $http.get(baseUrl + "members/" + id).then((result)=>{
            result.data.data.matches = [];
            for (var i = 0; i < result.data.data._matches.length; i++) {
               $http.get(baseUrl + "members/" + result.data.data._matches[i]).then((matched_user)=>{
                 result.data.data.matches.push(matched_user.data.data);
              });
            }
            return result.data.data;
          });
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
          return $http.get(baseUrl + "members/" + id).then((result)=>{
            result.data.data.matches = [];
            for (var i = 0; i < result.data.data._matches.length; i++) {
               $http.get(baseUrl + "members/" + result.data.data._matches[i]).then((matched_user)=>{
                 result.data.data.matches.push(matched_user.data.data);
              });
            }
            return result.data.data;
          });
        },
        editUser: function(user){
          delete user.matches;
          return $http.put(baseUrl + "members/" + user._id, user).then((result)=>{
            $window.localStorage.removeItem("user");
            $window.localStorage.setItem("user", JSON.stringify(result.data.data));
          });
        },
        removeUser: function(id){
          return $http.delete(baseUrl + "members/" + id).then((result)=>{
            $window.localStorage.clear();
          });
        },
        getMember: function(id){
          return $http.get(baseUrl + "members/" + id).then((result)=>{
            result.data.data.matches = [];
            for (var i = 0; i < result.data.data._matches.length; i++) {
               $http.get(baseUrl + "members/" + result.data.data._matches[i]).then((matched_user)=>{
                 result.data.data.matches.push(matched_user.data.data);
              });
            }
            return result.data.data;
          });
        },
        matchMember: function(userId, matchId){
          var matchData = {
            "_match": matchId
          }
          return $http.post(baseUrl + "members/" + userId + "/matches", matchData).then((data)=>{
            return data.data.data._matches;
          });
        },
        unmatchMember: function(userId, unmatchId){
          return $http.delete(baseUrl + "members/" + userId + "/matches/" + unmatchId).then((data)=>{
            return data.data.data._matches;
          });
        },
        search: function(searchQueryString){
          return $http.get(baseUrl + "members/search" + searchQueryString).then((data)=>{
            return data.data.data;
          });
        },
        getAllConversations: function(userId){
          return $http.get(baseUrl + "members/" + userId + "/conversations").then((data)=>{
            function memberRequest(i){
              $http.get(baseUrl + "members/" + data.data.data[i]._members[1]).then((recieverInfo)=>{
                data.data.data[i].reciever = recieverInfo.data.data;
              });
            }
            for (var i = 0; i < data.data.data.length; i++) {
              memberRequest(i);
            }
            return data.data.data;
          });
        },
        getConversation: function(id, recipientId){
          return $http.get(baseUrl + "members/" + id + "/conversations/" + recipientId).then((data)=>{
            return $http.get(baseUrl + "members/" + data.data.data[0]._members[1]).then((recieverInfo)=>{
              data.data.data[0].reciever = recieverInfo.data.data;
              return data.data.data[0];
            });
          });
        },
        sendMessage: function(_recipient, content, senderId){
          return $http.post(baseUrl + "members/" + senderId + "/conversations/", {_recipient, content}).then((data)=>{
            return data.data.data;
          });
        }
      };
    };
})();
