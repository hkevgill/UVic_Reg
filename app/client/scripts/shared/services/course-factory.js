'use strict';

angular.module('uvicApp').factory('courseFactory', function(utilsFactory) {
    var factory = {};

    factory.getCourses = function(){
        var url = 'api/courses';

        return utilsFactory.getRequest(url);
    };

    factory.getCourseInfo = function(courseId) {
        var url = 'api/courses/' + courseId;

        return utilsFactory.getRequest(url);
    };

    factory.addStudent = function(body) {
        var url = 'api/addstudent/';

        return utilsFactory.postRequest(url, body);
    };

    factory.deleteStudent = function(body) {
        var url = 'api/deletestudent/';

        return utilsFactory.postRequest(url, body);
    };

    factory.updateCourseInfo = function(body) {
        var url = 'api/updatecourse/';

        return utilsFactory.putRequest(url, body);
    };

    return factory;
});
