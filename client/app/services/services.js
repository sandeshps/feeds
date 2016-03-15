'use strict';

angular.module('feedsApp')

  .factory('User', function ($http, $q, Constants) {

    return {
      login : function (data) {
        var deffered = $q.defer();
  			$http({
  				method : 'POST',
          headers : {
            "x-stamplay-jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6ImZhY3RvciIsImFkbWluIjoiNTYwOTQ1NDdjYTA4ZmIxMzIzNzVlMWUzIiwidHlwZSI6ImFkbWluIiwidXNlciI6bnVsbCwiaWF0IjoxNDU3NzEzNjI3LCJleHAiOjE0NTc3MTU0Mjd9.YRsEFdYi26nIfk0ME8RTd_szlkA_4wETRIAOK8xJa6I",
            "accept": "application/json"
          },
  				url : Constants.DB.url + '/auth/v1/local/login',
          params : data
  			})
  			.success(function (data, status, headers, config) {
          console.log(data);
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
          console.log(data);
  				deffered.reject(data);
  			});
  			return deffered.promise;
      },

      listAllData : function (data) {
        var deffered = $q.defer();
  			$http({
  				method : 'GET',
          // headers : {
          //   "x-stamplay-jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6ImZhY3RvciIsImFkbWluIjoiNTYwOTQ1NDdjYTA4ZmIxMzIzNzVlMWUzIiwidHlwZSI6ImFkbWluIiwidXNlciI6bnVsbCwiaWF0IjoxNDU3NzEzNjI3LCJleHAiOjE0NTc3MTU0Mjd9.YRsEFdYi26nIfk0ME8RTd_szlkA_4wETRIAOK8xJa6I",
          //   "accept": "application/json"
          // },
  				url : Constants.DB.url + '/cobject/v1/knowledgeobject?populate=true&page=1&per_page='+data.page+'',
          params : {
            koowner : data.koowner
          }
  			})
  			.success(function (data, status, headers, config) {
          console.log(data);
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
          console.log(data);
  				deffered.reject(data);
  			});
  			return deffered.promise;
      }
    }

  })

  .factory('Admin', function ($http, $q, Constants) {

    return {
      saveHandler : function (data) {
        var deffered = $q.defer();
  			$http({
  				method : 'POST',
  				url : Constants.DB.url + '/cobject/v1/handlesources',
          data : data
  			})
  			.success(function (data, status, headers, config) {
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
  				deffered.reject(data);
  			});
  			return deffered.promise;
      },

      saveKeyValue : function (data) {
        var deffered = $q.defer();
  			$http({
  				method : 'POST',
  				url : Constants.DB.url + '/cobject/v1/keyvalues',
          data : data
  			})
  			.success(function (data, status, headers, config) {
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
  				deffered.reject(data);
  			});
  			return deffered.promise;
      },

      deleteKeyValue : function (id) {
        var deffered = $q.defer();
  			$http({
  				method : 'DELETE',
  				url : Constants.DB.url + '/cobject/v1/keyvalues/' + id,
  			})
  			.success(function (data, status, headers, config) {
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
  				deffered.reject(data);
  			});
  			return deffered.promise;
      },

      fetchDataFromApi : function (key, value) {
        var deffered = $q.defer();
  			$http({
  				method : 'GET',
  				url : Constants.API.search_url + '/search/' + key + '?q=' + value
  			})
  			.success(function (data, status, headers, config) {
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
  				deffered.reject(data);
  			});
  			return deffered.promise;
      },

      approveData : function (data) {
        var deffered = $q.defer();
  			$http({
  				method : 'POST',
  				url : Constants.DB.url + '/cobject/v1/knowledgeobject',
          data : data
  			})
  			.success(function (data, status, headers, config) {
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
  				deffered.reject(data);
  			});
  			return deffered.promise;
      },

      getKos : function () {
        var deffered = $q.defer();
  			$http({
  				method : 'GET',
  				url : Constants.DB.url + '/cobject/v1/knowledgeobject'
  			})
  			.success(function (data, status, headers, config) {
  				deffered.resolve(data);
  			})
  			.error(function (data, status, headers, config) {
  				deffered.reject(data);
  			});
  			return deffered.promise;
      }
    }

  });
