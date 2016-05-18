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
          UserService.setCurrentUser(data);
          $state.go('home');
        }).catch(function(data){
          console.log(data.data);
          vm.user = {};
        });
      };
    };

    function LoginController(UserService, $state, $window){
      var vm = this;
      vm.login = function(user){
        UserService.login(user).then(function(data){
          UserService.setCurrentUser(data);
          $state.go('members');
        }).catch(function(data){
          vm.user = {};
        });
      };
    };

    function UserController(UserService, $state, $window, currentUser, user){
      var vm = this;
      UserService.getCurrentUser().then(function(data){
        vm.currentUser = data;
        console.log(data);
      });

      vm.editProfile = function(user){
        user.id = currentUser._id;
        console.log(user);
        UserService.editUser(user).then(function(data){
          $window.localStorage.removeItem("user");
          $window.localStorage.setItem("user",JSON.stringify(data.data));
          $state.go('home');
        }).catch(function(err){
          vm.errors = "Looks like someone already has that username!";
          vm.user = {};
        });
      };

      vm.deleteProfile = function(id){
        UserService.removeUser(id).then(function(data){
          $window.localStorage.clear();
          $state.go('login');
        }).catch(function(err){
          vm.errors = err;
        });
      };
    };

    function MembersController (currentUser,members){
      var vm = this;
      vm.members = members.data.data;
      console.log(vm.members);
      vm.currentUser = currentUser;
    };

})();
