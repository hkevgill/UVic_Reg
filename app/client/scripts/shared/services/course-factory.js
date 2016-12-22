'use strict';

angular.module('uvicApp').factory('courseFactory', function(utilsFactory) {
    var factory = {};

    // get request for all courses
    factory.getCourses = function(){
        var url = 'api/courses';

        return utilsFactory.getRequest(url);
    };

    // get request for all info for the edit page
    factory.getCourseInfo = function(courseId) {
        var url = 'api/courses/' + courseId;

        return utilsFactory.getRequest(url);
    };

    // add student to registrations table
    factory.addStudent = function(body) {
        var url = 'api/addstudent/';

        return utilsFactory.postRequest(url, body);
    };

    // delete student from registrations table
    factory.deleteStudent = function(body) {
        var url = 'api/deletestudent/';

        return utilsFactory.postRequest(url, body);
    };

    // save new course info
    factory.updateCourseInfo = function(body) {
        var url = 'api/updatecourse/';

        return utilsFactory.putRequest(url, body);
    };

    return factory;
});
