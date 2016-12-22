'use strict';

angular.module('uvicApp').controller('course-registration-controller', function ($scope, courseFactory) {
    courseFactory.getCourses().then(function(data) {
        $scope.courses = data.rows;
    });
});
