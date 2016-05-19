(function() {
    angular
        .module("datingApp")
        .config(config)
        .run(run)
        .service("AuthInterceptor", AuthInterceptor);

    function config($stateProvider, $urlRouterProvider, $httpProvider) {

      $httpProvider.interceptors.push("AuthInterceptor");

      $stateProvider.state('home',{
        url: '/',
        templateUrl: "templates/home.html",
        controller: "HomeController",
        controllerAs: "Home",
        preventWhenLoggedIn: false
      })
      .state("signup", {
        url: '/signup',
        templateUrl: "templates/signup.html",
        controller: "SignupController",
        controllerAs: "Signup",
        preventWhenLoggedIn: true,
        signup: true
      })
      .state("login", {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: "LoginController",
        controllerAs: "Login",
        preventWhenLoggedIn: true
      })
      .state("members", {
        url: '/members',
        templateUrl: "templates/members.html",
        controller: "MembersController",
        controllerAs: "Members",
        restricted: true,
        resolve: {
          members: function(UserService){
            return UserService.getMembers();
          }
        }
      })
      .state("members.landing", {
        url: '/landing',
        templateUrl: "templates/landing.html"
      })
      .state("members.member", {
        url: '/member/:id',
        templateUrl: "templates/member.html"
      })
      .state("profile", {
        url: '/profile/:id',
        templateUrl: "templates/profile.html",
        controller: "UserController",
        controllerAs: "Profile",
        restricted: true,
        resolve:  {
          user: function(UserService,$stateParams){
            return UserService.getProfile($stateParams.id);
          }
        }
      })
      .state("logout", {
        url: '/logout',
        restricted: true,
        resolve: {
          app: function(UserService, $state){
            UserService.logout();
            $state.go("home");
          }
        }
      });
    }

    function AuthInterceptor($location,$q) {
      return {
        request: function(config){
          // prevent browser bar tampering
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          var token = localStorage.getItem("token");
          if(token)
            config.headers.Authorization = "Bearer " + token;
          return config;
        },
        // ui-sref="^users" to go to parent
        responseError: function(err){
          // still need to handle failed login / signup
          // if you mess around with the token, log them out and destroy it
          if(err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed"){
            $q.reject(err);
            // $location.path("/logout");
          }
          // if you try to access a user who is not yourself
          if(err.status === 401){
            // $state.go('/home');
            $q.reject(err);
          }
          return $q.reject(err);
        }
      };
    };

    function run($rootScope, $state) {
      $rootScope.$on('$stateChangeStart', function (event, next, current) {
        // if you try access a restricted page without logging in
        if (next.restricted && !localStorage.getItem("token")) {
          if(current && current.signup)
            $state.go('signup');
          else
            $state.go('login');
        }
        // if you try to log in or sign up once logged in
        if (next.preventWhenLoggedIn && localStorage.getItem("token")) {
          $state.go('home');
        }
      });
    };

})();
