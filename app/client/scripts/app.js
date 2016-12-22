'use strict'

var uvicApp = angular.module('uvicApp', ['ui.router', 'moment-picker']);

uvicApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('registration', {
            url: '/',
            controller: 'course-registration-controller',
            templateUrl: 'scripts/sections/course-registration-page/course-registration.html'
        })
        .state('edit', {
            url: '/edit/:courseId',
            controller: 'edit-course-controller',
            templateUrl: 'scripts/sections/edit-course-page/edit-course.html'
        });

    $locationProvider.html5Mode(true);
});
