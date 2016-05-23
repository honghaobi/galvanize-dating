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

      vm.search = function() {
        var interestedInString = "";

        if (vm.search.interestedInArray.op0) {
          interestedInString = "0";
        }
        if (vm.search.interestedInArray.op1) {
          interestedInString.concat(",1");
          interestedInString += ",1";
        }
        if (vm.search.interestedInArray.op2) {
          interestedInString.concat(",2");
          interestedInString += ",2";
        }
        if (vm.search.interestedInArray.op3) {
          interestedInString.concat(",3");
          interestedInString += ",3";
        }
        console.log('yo');

        var searchQueryString = "username=" + vm.search.username + "&" +      "email=" + vm.search.email + "&" + "gender=" + vm.search.gender + "&" + "maxAge=" + vm.search.maxAge + "&" + "minAge=" + vm.search.minAge + "&" + "interestedIn[]=" + interestedInString + "&" + "exclusive=" + vm.search.exclusive

        console.log(searchQueryString);

        UserService.search(searchQueryString).then(function(result){
          console.log(result);
          vm.searchResult = result;
        });
      };
    };

})();
