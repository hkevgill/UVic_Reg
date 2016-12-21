var databaseService = require('../services/database-service');
var csvService = require('../services/csv-service');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    apiRouter.get('/', function(req, res) {
        res.json({ message: 'get works' });
    });

    apiRouter.post('/', function(req, res) {
        console.log(req.body);
        res.json({ message: 'post works!' });
    });

    // get all courses
    apiRouter.get('/courses', function(req, res) {
        databaseService.getCourses(req, res)
    });

    // get specific course and all students attending it and a list of all students
    apiRouter.get('/courses/:courseId', function(req, res) {
        console.log(req.params.courseId);
        databaseService.getEditCourseInfo(req, res);
    });

    // insert courses csv to courses table
    apiRouter.get('/insertcourses', function(req, res) {
        csvService.insertCSV('Courses.csv', 'Courses');
        res.json({ message: 'success' });
    });

    // insert students csv to students table
    apiRouter.get('/insertstudents', function(req, res) {
        csvService.insertCSV('Students.csv', 'Students');
        res.json({ message: 'success' });
    });

    // insert registration csv to registration table
    apiRouter.get('/insertregistration', function(req, res) {
        csvService.insertCSV('Registration.csv', 'Registration');
        res.json({ message: 'success' });
    });

    // insert contact information csv to contact information table
    apiRouter.get('/insertcontactinformation', function(req, res) {
        csvService.insertCSV('Contact_Information.csv', 'Contact_Information');
        res.json({ message: 'success' });
    });

    return apiRouter;
};
