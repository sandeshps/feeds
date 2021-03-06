'use strict';

angular.module('feedsApp', [
  'feedsApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'ui.bootstrap',
  'once',
  'wu.masonry',
  'hj.scrollify'
])
.directive('bindOnce', function() {
    return {
        scope: true,
        link: function( $scope, $element ) {
            setTimeout(function() {
                $scope.$destroy();
                $element.removeClass('ng-binding ng-scope');
            }, 0);
        }
    }
})

.directive('hashing', function() {
    return {
        scope: {
            hashing:'='
        },
        link: function( scope, element ) {
          
          scope.$watch('hashing',function(text){
              if(text)
                element.html(text.replace(/#[a-z0-1A-Z]+/g, '<span class="style_tag">$&</span>'));
          })               
        }
    }
})


.filter('filterparagraph', function() {
  return function (input) {
   //  console.log(input);
    var input_array = [];
    if(input !== undefined)
     input_array = input.split('.');
    var finalParagraph = '';
    input_array.length = 5;
    input_array.forEach(function (paragraph, index) {
     //  console.log(paragraph);
      if(paragraph !== '') {
        finalParagraph += (paragraph.replace(/[^A-Za-z0-9-/{},|"'#<>' '[]/g, '') + '.');
      }
    });
   //  console.log('final');
    return finalParagraph;
  }
})
.config(function($stateProvider, $routeProvider, $locationProvider, $urlRouterProvider) {
  $routeProvider
    .when('/admin', {
      templateUrl : 'app/views/admin/admin.html',
      controller : 'Admin.RulesCtrl',
      resolve : {
        loggedin : checkIfLoggedin
      }
    })
    .when('/login', {
      templateUrl : 'app/views/login.html',
      controller : 'LoginCtrl',
      resolve : {
        loggedin : checkIfLoggedin
      }
    })
    .when('/logout', {
      templateUrl : 'app/views/login.html',
      controller : 'LogoutCtrl'
    })
    .when('/approved/:name/:per_page', {
      templateUrl : 'app/views/listData.html',
      controller : 'ListDataCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  $stateProvider

      .state('admin', {
        templateUrl: 'app/views/admin/partials/admin-home.html',
        controller : 'Admin.RulesCtrl'
      })
      .state('dashboard', {
        templateUrl: 'app/views/admin/partials/add-handler.html',
        controller : 'Admin.RulesCtrl'
      })
      .state('datafetch', {
        templateUrl: 'app/views/admin/partials/data-fetch.html',
        controller : 'Admin.ActivityCtrl'
      })

  $locationProvider.html5Mode(true);
});




var checkIfLoggedin = function($q, User, $location, $cookies) {
        var deferred = $q.defer();
        if($cookies.get('email') !== '' && $cookies.get('email') !== undefined) {
                deferred.resolve();
                $location.path('/admin');
        }
        else {
                deferred.reject();
                $location.path('/login');
        }
}
