(function() {
    'use strict';

    angular
        .module("datingApp")
        .controller("HomeController", HomeController)
        .controller("SignupController", SignupController)
        .controller("LoginController", LoginController)
        .controller("UserController", UserController)
        .controller("EditController", EditController)
        .controller("UsersController", UsersController);

    function HomeController(UserService, $state){
      var vm = this;

    };

    function SignupController(UserService, $state){
      var vm = this;
      vm.signup = function(user){
        console.log(user);
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
          $state.go('home');
        }).catch(function(data){
          vm.user = {};
        });
      };
    };

    function UserController(UserService, $state, $window, currentUser, user){
      var vm = this;
      vm.currentUser = currentUser;
      vm.user = user;
    };

    function EditController (UserService, $state, $window, currentUser, user){
      var vm = this;
      vm.editUser = function(user){
        UserService.editUser(user).then(function(data){
          $window.localStorage.removeItem("user");
          $window.localStorage.setItem("user",JSON.stringify(data.data));
          $state.go('home');
        }).catch(function(err){
          vm.errors = "Looks like someone already has that username!";
          vm.user = {};
        });
      };

      vm.removeUser = function(id){
        UserService.removeUser(id).then(function(data){
          $window.localStorage.clear();
          $state.go('login');
        }).catch(function(err){
          vm.errors = err;
        });
      };
    };

    function UsersController (currentUser,users){
      var vm = this;
      vm.users = users;
      vm.currentUser = currentUser;
    };

})();
