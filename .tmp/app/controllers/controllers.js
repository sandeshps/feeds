'use strict';

angular.module('feedsApp').controller('LoginCtrl', function ($scope, $timeout, $cookies, User, $location) {

  $scope.username = '';
  $scope.password = '';
  var credentials = {};
  $scope.error = false;
  $scope.login = function () {
    credentials = {
      email: $scope.email,
      password: $scope.password
    };

    console.log(credentials);

    Stamplay.User.login(credentials, function (err, res) {
      if (err) {
        console.log(err);
        $scope.error = true;
        $timeout(function () {
          $scope.error = false;
        }, 1300);
        $scope.$apply();
      } else {
        console.log(res);
        $cookies.put('email', res.email);
        $cookies.put('name', res.displayName);
        $cookies.put('loggedin', true);
        $location.path('/admin');
        $scope.$apply();
      }
      // console.log(res);
    });
  };
}).controller('LogoutCtrl', function ($scope, $cookies, $location) {
  var cookies = $cookies.getAll();
  angular.forEach(cookies, function (v, k) {
    console.log(k);
    $cookies.remove(k);
  });
  Stamplay.User.logout('true');
  $location.path('/login');
}).controller('Admin.RulesCtrl', function ($scope, Admin, $timeout, $route, $cookies) {

  $scope.loggedin = $cookies.get('loggedin');

  var data = {};

  $scope.handle_sources_array = [];
  var found = '';
  var index = 0;
  var object;
  var temp = [];

  getKeyValuePairs();

  function getHandleSources() {
    Stamplay.Object('handlesources').get({}).then(function (response) {
      $scope.handle_sources_array = response.data;
      console.log($scope.handle_sources_array);
    }, function (error) {});
  }

  getHandleSources();
  // getKeyValuePairs();

  $scope.allKeyValues = [];
  $scope.loaded_key_value = false;
  function getKeyValuePairs() {
    Stamplay.Object('keyvalues').get({}).then(function (response) {

      temp = response.data;

      $scope.$apply(function () {
        $scope.allKeyValues = temp;
        $scope.loaded_key_value = true;
      });
      // $scope.$digest();
    }, function (error) {});
  }

  $scope.handler = '';
  $scope.notification = '';
  $scope.saveHandler = function () {

    found = false;
    getHandleSources();

    for (object in $scope.handle_sources_array) {
      // console.log($scope.handle_sources_array[object]);
      if ($scope.handle_sources_array[object].source === $scope.handler.toLowerCase().trim()) {
        found = true;
        break;
      }
    }

    if ($scope.handler.trim() === '') {
      $scope.notification = "Handle can't be empty!";
      $timeout(function () {
        $scope.notification = '';
      }, 2000);
    } else if (found == false) {
      data = {
        source: $scope.handler.toLowerCase().trim()
      };
      Admin.saveHandler(data).then(function (response) {
        console.log(response);
        $scope.notification = 'Handle saved!';
        $scope.handler = '';
        $timeout(function () {
          $scope.notification = '';
        }, 2000);
        getHandleSources();
        getHandleSources();
      })['catch'](function (error) {});
      // $route.reload();
    } else {
        $scope.notification = 'Handle already exists!';
        $timeout(function () {
          $scope.notification = '';
        }, 2000);
      }
  };

  $scope.handles = false;
  $scope.allhandles = [];
  $('#options-dropdown li a').on('click', function () {
    var text = $(this).text();
    console.log(text);
    $('#search_handle .text').text(text);

    if (text.toLowerCase().trim() === 'search') {
      $scope.$apply(function () {
        $scope.handles = false;
      });
    } else {
      getHandleSources();
      $scope.$apply(function () {
        $scope.handles = true;
        $scope.allhandles = $scope.handle_sources_array;
      });
      console.log($scope.allhandles);
    }
  });

  $scope.selectHandleSource = function (value) {
    $('#handler_source #hsource').text(value);
  };

  $scope.search_handle = $scope.handler_source = $scope.value = '';

  var key = '';
  $scope.sh_value = $scope.key_value_notification = '';
  $scope.saveKeyValue = function () {
    if ($('#search_handle .text').text().toLowerCase().trim() === 'search') key = 'search';else key = $('#handler_source #hsource').text().toLowerCase();

    console.log(key + ',' + $scope.sh_value);
    if ($scope.sh_value.trim() !== '' && key !== 'select') {
      data = {
        key: key,
        value: $scope.sh_value.trim()
      };
      Admin.saveKeyValue(data).then(function (response) {
        $scope.key_value_notification = 'Data added!';
        $timeout(function () {
          $scope.key_value_notification = '';
        }, 1500);
        getKeyValuePairs();
      })['catch'](function (error) {});
    } else {
      $scope.key_value_notification = 'Input error';
      $timeout(function () {
        $scope.key_value_notification = '';
      }, 1500);
    }
  };

  $('#handler_source').on('click', function () {
    getHandleSources();
    $scope.$apply(function () {
      $scope.handles = true;
      $scope.allhandles = $scope.handle_sources_array;
      console.log($scope.allhandles);
    });
  });

  $scope.deleteKeyValue = function (id) {
    Admin.deleteKeyValue(id).then(function (response) {
      getKeyValuePairs();
    })['catch'](function (error) {});
  };
}).controller('Admin.ActivityCtrl', function ($scope, $timeout, Admin, $cookies) {

  $scope.loggedin = $cookies.get('loggedin');
  var data = {};
  var keyValues = ['All'];
  $scope.allKeyValues = [];
  $scope.error = false;

  getKeyValuePairs();

  function getKeyValuePairs() {
    Stamplay.Object('keyvalues').get({}).then(function (response) {
      response.data.forEach(function (row) {
        keyValues.push(row.key + ' - ' + row.value);
      });
      $scope.$apply(function () {
        $scope.allKeyValues = keyValues;
      });
    }, function (error) {});
  }

  var key = '';
  var value = '';
  $scope.allData = [];
  $scope.loading = false;
  var tempArray = [];

  $scope.fetchData = function (record) {
    $scope.loading = true;
    $scope.error = false;
    $('#key_value_source').text(record);

    if (record.toLowerCase().trim() === 'all') {
      console.log(keyValues);
      for (var index = 1; index < keyValues.length; index++) {
        key = keyValues[index].split('-')[0].trim();
        value = keyValues[index].split('-')[1].trim();
        console.log(key + ',' + value);
        if (key === 'search') {} else {

          Admin.fetchDataFromApi(key, value).then(function (response) {
            console.log(response);
            console.log(Object.keys(response)[0]);
            var resObject = Object.keys(response)[0];
            console.log(response[resObject]);
            if (resObject !== 'status') {
              response[resObject].forEach(function (data) {
                tempArray.push(data);
                console.log(tempArray);
              });
            }
          })['catch'](function (error) {});
        }
      }

      $scope.allData = tempArray;
      $scope.loading = false;
    } else {
      key = record.split('-')[0].trim();
      value = record.split('-')[1].trim();
      if (key === 'search') {} else {
        Admin.fetchDataFromApi(key, value).then(function (response) {
          console.log(response);
          console.log(response[key]);
          var resObject = Object.keys(response)[0];
          if (resObject === 'status') {
            $scope.error = true;
            $scope.loading = false;
          } else {
            $scope.allData = response[resObject];
            $scope.loading = false;
          }
        })['catch'](function (error) {
          $scope.error = true;
          $scope.loading = false;
        });
      }
    }
  };

  // function acceptReject() {
  //   var allApiData = $scope.allData;
  //   var allUrls = [];
  //   for(var i=0; i<allApiData.length; i++) {
  //     allUrls.push(allApiData.url);
  //   }
  //
  //   Admin.getKos()
  //     .then(function (response) {
  //       for(var index=0; index<response.data.length; index++) {
  //         for(var i=index; i<$scope.allData.length; i++) {
  //           if(response.data[index].url === $scope.allData[i].url) {
  //             $scope.allData[i].status = 'approved';
  //           }
  //         }
  //       }
  //     })
  //     .catch(function (error) {
  //
  //     });
  //
  //     console.log($scope.allData);
  //     $timeout(function () {
  //       $scope.$apply(function () {
  //         $scope.allData = $scope.allData;
  //       });
  //     },100);
  //
  // }

  $scope.approve = function (data) {
    var object = {};
    var details = data;
    var koowner = $cookies.get('name');
    object.title = details.title;
    object.description = details.description;
    if (details.source === 'instagram') object.image = details.image.url;else {
      object.image = details.image;
    }
    object.source = details.source;
    object.koowner = koowner;
    object.url = details.url;
    object.profileImg = details.profileImg;
    object.user = details.user;
    object.time = details.time;
    object.status = 'approved';
    console.log(object);
    Admin.approveData(object).then(function (response) {
      // $scope.$apply();
      // acceptReject();
      alert("approved");
      console.log(response);
    })['catch'](function (error) {});
    // $scope.$apply();
  };
}).controller('ListDataCtrl', function ($scope, User, $routeParams) {
  var username = $routeParams.name;
  var per_page = $routeParams.per_page;

  var data = {
    koowner: username,
    page: per_page
  };

  console.log(data);

  $scope.allData = [];

  User.listAllData(data).then(function (response) {
    console.log(response);
    $scope.allData = response.data;
  })['catch'](function (error) {});
});
//# sourceMappingURL=controllers.js.map
