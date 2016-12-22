'use strict';

angular.module('uvicApp').controller('course-registration-controller', function ($scope, courseFactory) {

    var i;
    var offset;

    courseFactory.getCourses().then(function(data) {
        $scope.courses = data.rows;

        // convert from utc to local
        for(i = 0; i < $scope.courses.length; i = i + 1) {
            var offset = moment($scope.courses[i].When).utcOffset();
            $scope.courses[i].When = moment($scope.courses[i].When).add(offset, 'minutes').format('DD-MMM-YYYY h:mm A');
        }

    });
});
