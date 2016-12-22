'use strict';

angular.module('uvicApp').controller('edit-course-controller', function ($scope, $stateParams, $timeout, courseFactory) {

    $scope.courseId = $stateParams.courseId;

    $scope.saved = false;

    var i;

    $scope.selections = {
        selectedStudent: null
    }

    courseFactory.getCourseInfo($scope.courseId).then(function(data) {
        $scope.course = data.course;
        $scope.students = data.students;

        $scope.registeredStudents = data.registeredStudents;

        $scope.dropdownStudents = $scope.students.filter(function(item1) {
            for (i in $scope.registeredStudents) {
                if (item1.student_id === $scope.registeredStudents[i].student_id) { return false; }
            };
            return true;
        });
    });

    $scope.addStudent = function() {

        if ($scope.selections.selectedStudent === null) {
            return;
        }

        var body = {
            studentId: $scope.selections.selectedStudent,
            courseId: $scope.courseId
        };

        courseFactory.addStudent(body).then(function(data) {
            $scope.registration = data.rows[0];

            for (i = 0; i < $scope.students.length; i = i + 1) {
                if ($scope.registration.student_id === $scope.students[i].student_id) {
                    $scope.registeredStudents.push($scope.students[i]);
                    break;
                }
            }

            for (i = 0; i < $scope.dropdownStudents.length; i = i + 1) {
                if ($scope.dropdownStudents[i].student_id === parseInt($scope.selections.selectedStudent)) {
                    $scope.dropdownStudents.splice(i, 1);
                    break;
                }
            }
        });
    };

    $scope.deleteStudent = function(student) {

        var body = {
            student: student,
            courseId: $scope.courseId
        }

        courseFactory.deleteStudent(body).then(function(data) {
            $scope.registration = data.rows[0];

            for(i = 0; i < $scope.registeredStudents.length; i = i + 1) {
                if ($scope.registeredStudents[i].student_id === $scope.registration.student_id) {
                    $scope.registeredStudents.splice(i, 1);
                    break;
                }
            }

            $scope.dropdownStudents.push(student);
        });
    };

    $scope.saveCourse = function() {

        courseFactory.updateCourseInfo($scope.course).then(function(data) {
            $scope.course = data.rows[0];
            $scope.saved = true;
            $timeout(function () {
                $scope.saved = false;
            }, 3000);
        });
    };

});
