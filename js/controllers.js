(function() {
    'use strict';

    angular
        .module("datingApp")
        .controller("MenuController", MenuController)
        .controller("HomeController", HomeController)
        .controller("SignupController", SignupController)
        .controller("LoginController", LoginController)
        .controller("UserController", UserController)
        .controller("MembersController", MembersController)
        .controller("ConversationController", ConversationController);

    function MenuController($rootScope, UserService){
      var vm = this;
      $rootScope.$on('$locationChangeSuccess', function(){
        UserService.getCurrentUser().then(function(data){
          vm.currentUser = data;
        });
      });
      vm.showModal = function(){
        vm.modal = true;
      }
      $rootScope.$on('modal-close', function(event, args){
        vm.modal = false;
      });
    };

    function HomeController(UserService, $state){
      var vm = this;
    };

    function SignupController(UserService, $state){
      var vm = this;
      vm.signup = function(user){
        UserService.signup(user).then(function(data){
          $state.go('home');
        }).catch(function(error){
          console.log(error);
        });
      };
    };

    function LoginController(UserService, $state, $window){
      var vm = this;
      vm.login = function(user){
        UserService.login(user).then(function(data){
          $state.go('members');
        }).catch(function(error){
          console.log(error);
        });
      };
    };

    function UserController(UserService, $state, $window, user){
      var vm = this;
      vm.currentUser = user;
      vm.editProfile = function(){
        UserService.editUser(vm.currentUser).then(function(data){
          $state.go('profile', {id: vm.currentUser._id}, {reload: true});
        }).catch(function(error){
          console.log(error);
        });
      };

      vm.deleteProfile = function(id){
        UserService.removeUser(id).then(function(data){
          $state.go('home');
        }).catch(function(error){
          console.log(error);
        });
      };
    };

    function MembersController (UserService, $state, members, $rootScope){
      var vm = this;
      vm.members = members;
      $rootScope.$broadcast('modal-close');

      UserService.getCurrentUser().then(function(data){
        vm.currentUser = data;
        vm.getClosestMembers();
        vm.getPopularMembers(8);
        vm.getAllConversations();

        UserService.getCurrentUserMatches(vm.currentUser._id).then(function(data){
          vm.matches = data._matches;
          vm.currentUserMatches = data.matches;
        });
      });

      vm.popularMembers = [];

      vm.getPopularMembers = function(quantity){
        members.sort(function(a,b){
          return b._matches.length - a._matches.length
        });
        for (var i = 0; i < quantity; i++) {
          vm.popularMembers.push(members[i]);
        }
      };

      vm.getClosestMembers = function(quantity){
        vm.closestMembers = members.filter(function(obj){
          return (obj.address.geo.lat == vm.currentUser.address.geo.lat &&
                  obj.address.geo.lng == vm.currentUser.address.geo.lng);
        });
      };


      vm.getMember = function(id){
        UserService.getMember(id).then(function(member){
          $state.go('members.member');
          vm.selectedMember = member;
        }).catch(function(error){
          console.log(error);
        });
      };

      vm.matchMember = function(matchId){
        UserService.matchMember(vm.currentUser._id, matchId).then(function(matches){
          vm.matches = matches;
          UserService.getCurrentUserMatches(vm.currentUser._id).then(function(data){
            vm.currentUserMatches = data.matches;
          });
        }).catch(function(error){
          console.log(error);
        });
      };

      vm.unmatchMember = function(unmatchId){
        UserService.unmatchMember(vm.currentUser._id, unmatchId).then(function(matches){
          vm.matches = matches;
          UserService.getCurrentUserMatches(vm.currentUser._id).then(function(data){
            vm.currentUserMatches = data.matches;
          });
        }).catch(function(error){
          console.log(error);
        });
      };

      vm.search = function() {
        var searchQueryString = '?';

        if (vm.search.username) {
          searchQueryString = searchQueryString.concat("username=", vm.search.username, "&");
        }
        if (vm.search.email) {
          searchQueryString = searchQueryString.concat("email=", vm.search.email, "&");
        }
        if (vm.search.gender) {
          searchQueryString = searchQueryString.concat("gender=", vm.search.gender, "&");
        }
        if (vm.search.maxAge) {
          searchQueryString = searchQueryString.concat("maxAge=", vm.search.maxAge, "&");
        }
        if (vm.search.minAge) {
          searchQueryString = searchQueryString.concat("minAge=", vm.search.minAge, "&");
        }
        if (vm.search.interested0) {
          searchQueryString = searchQueryString.concat("interestedIn[]=", "0", "&");
        }
        if (vm.search.interested1) {
          searchQueryString = searchQueryString.concat("interestedIn[]=", "1", "&");
        }
        if (vm.search.interested2) {
          searchQueryString = searchQueryString.concat("interestedIn[]=", "2", "&");
        }
        if (vm.search.interested3) {
          searchQueryString = searchQueryString.concat("interestedIn[]=", "3", "&");
        }
        if (vm.search.exclusive) {
          searchQueryString = searchQueryString.concat("exclusive=", vm.search.exclusive);
        }

        UserService.search(searchQueryString).then(function(result){
          vm.searchResult = result;
        });
      };
      vm.clearSearchResult = function(){
        vm.searchResult = false;
      };
      vm.getAllConversations = function(){
        UserService.getAllConversations(vm.currentUser._id).then(function(conversations){
          vm.allConversations = conversations;
        });
      };
      vm.sendMessage = function(_recipient){
        UserService.sendMessage(_recipient, vm.message, vm.currentUser._id).then(function(data){
          $state.go('members.chatone',({recipientId:_recipient}));
        });
      }
    };
    function ConversationController (UserService, $state, conversation){
      var vm = this;
      vm.conversation = conversation;
      UserService.getCurrentUser().then(function(data){
        vm.currentUser = data;
      });

      vm.sendMessage = function(_recipient){
        UserService.sendMessage(_recipient, vm.message, vm.currentUser._id).then(function(data){
          UserService.getConversation(vm.currentUser._id, $state.params.recipientId).then(function(conversation){
            vm.conversation = conversation;
          });
        });
      }
    };
})();
