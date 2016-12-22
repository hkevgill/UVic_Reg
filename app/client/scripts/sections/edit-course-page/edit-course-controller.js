'use strict';

angular.module('uvicApp').controller('edit-course-controller', function ($scope, $stateParams, courseFactory) {

    $scope.courseId = $stateParams.courseId;

    $scope.selections = {
        selectedStudent: null
    }

    courseFactory.getCourseInfo($scope.courseId).then(function(data) {
        $scope.course = data.course;
        $scope.students = data.students;
        $scope.registeredStudents = data.registeredStudents;
    });

    $scope.addStudent = function() {
        console.log($scope.selections.selectedStudent);
    };

    $scope.deleteStudent = function(student) {
        console.log(student);
    };

    $scope.saveCourse = function() {
        console.log($scope.course);
    };

});
