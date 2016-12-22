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

    factory.updateCourseInfo = function(courseId, body) {
        var url = 'api/courses/' + courseId;

        return utilsFactory.postRequest(url, body);
    };

    return factory;
});
