'use strict';

angular.module('uvicApp').controller('edit-course-controller', function ($scope, $stateParams, $timeout, courseFactory) {

    // variables
    var i;
    var offset;

    $scope.courseId = $stateParams.courseId;
    $scope.saved = false;
    $scope.rightnow = moment();
    $scope.selections = {
        selectedStudent: null
    };

    // load info when page loads
    courseFactory.getCourseInfo($scope.courseId).then(function(data) {
        $scope.course = data.course;

        // convert from utc to local
        $scope.course.When = moment($scope.course.When).format('DD-MMM-YYYY h:mm A');

        $scope.students = data.students;

        $scope.registeredStudents = data.registeredStudents;

        // figure out which students should be in dropdown
        // ie. ones that are not registered
        $scope.dropdownStudents = $scope.students.filter(function(item1) {
            for (i in $scope.registeredStudents) {
                if (item1.student_id === $scope.registeredStudents[i].student_id) { return false; }
            };
            return true;
        });
    });

    // add student to registrations table
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

            // add to array so view updates
            for (i = 0; i < $scope.students.length; i = i + 1) {
                if ($scope.registration.student_id === $scope.students[i].student_id) {
                    $scope.registeredStudents.push($scope.students[i]);
                    break;
                }
            }

            // remove from dropdown
            for (i = 0; i < $scope.dropdownStudents.length; i = i + 1) {
                if ($scope.dropdownStudents[i].student_id === parseInt($scope.selections.selectedStudent)) {
                    $scope.dropdownStudents.splice(i, 1);
                    break;
                }
            }
        });
    };

    // delete entry from registrations table
    $scope.deleteStudent = function(student) {

        var body = {
            student: student,
            courseId: $scope.courseId
        }

        courseFactory.deleteStudent(body).then(function(data) {
            $scope.registration = data.rows[0];

            // delete from list
            for(i = 0; i < $scope.registeredStudents.length; i = i + 1) {
                if ($scope.registeredStudents[i].student_id === $scope.registration.student_id) {
                    $scope.registeredStudents.splice(i, 1);
                    break;
                }
            }

            // add to dropdown
            $scope.dropdownStudents.push(student);
        });
    };

    // save course info
    $scope.saveCourse = function() {

        courseFactory.updateCourseInfo($scope.course).then(function(data) {
            $scope.course = data.rows[0];

            // convert from utc to local
            $scope.course.When = moment($scope.course.When).format('DD-MMM-YYYY h:mm A');

            $scope.saved = true;

            // show saved for 3 seconds
            $timeout(function () {
                $scope.saved = false;
            }, 3000);
        });
    };

});
