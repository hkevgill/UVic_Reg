'use strict';

angular.module('uvicApp').factory('utilsFactory', function($http, $q) {
    var factory = {};

    factory.getRequest = function(url) {
        var deferred = $q.defer();

        $http.get(url).success(function(data) {
            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.postRequest = function(url, body) {
        var deferred = $q.defer();

        $http.post(url, body).success(function(data) {
            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.putRequest = function(url, body) {
        var deferred = $q.defer();

        $http.put(url, body).success(function(data) {
            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    factory.deleteRequest = function(url) {
        var deferred = $q.defer();

        $http.delete(url).success(function(data) {
            deferred.resolve(data);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return factory;
});
