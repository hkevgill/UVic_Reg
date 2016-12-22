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

        var body = {
            studentId: $scope.selections.selectedStudent,
            courseId: $scope.courseId
        };

        courseFactory.addStudent(body).then(function(data) {
            console.log(data);
        });
    };

    $scope.deleteStudent = function(student) {

        var body = {
            student: student,
            courseId: $scope.courseId
        }

        courseFactory.deleteStudent(body).then(function(data) {
            console.log(data);
        });
    };

    $scope.saveCourse = function() {

        courseFactory.updateCourseInfo($scope.course).then(function(data) {
            console.log(data);
        });
    };

});
