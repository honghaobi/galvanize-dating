(function() {
    'use strict';

    angular
        .module("datingApp")
        .controller("MenuController", MenuController)
        .controller("HomeController", HomeController)
        .controller("SignupController", SignupController)
        .controller("LoginController", LoginController)
        .controller("UserController", UserController)
        .controller("MembersController", MembersController);

    function MenuController($rootScope, UserService){
      var vm = this;
      $rootScope.$on('$locationChangeSuccess', function(){
        UserService.getCurrentUser().then(function(data){
          vm.currentUser = data;
        });
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

    function MembersController (UserService, $state, members){
      var vm = this;
      vm.members = members;
      console.log(vm.members);

      UserService.getCurrentUser().then(function(data){
        vm.currentUser = data;

        vm.getClosestMembers();
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
      vm.getPopularMembers(8);

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
    };

})();
