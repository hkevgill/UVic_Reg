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

    apiRouter.get('/insertcourses', function(req, res) {
        csvService.insertCSV('Courses.csv', 'Courses');
        res.json({ message: 'success' });
    });

    apiRouter.get('/insertstudents', function(req, res) {
        csvService.insertCSV('Students.csv', 'Students');
        res.json({ message: 'success' });
    });

    apiRouter.get('/insertregistration', function(req, res) {
        csvService.insertCSV('Registration.csv', 'Registration');
        res.json({ message: 'success' });
    });

    apiRouter.get('/insertcontactinformation', function(req, res) {
        csvService.insertCSV('Contact_Information.csv', 'Contact_Information');
        res.json({ message: 'success' });
    });

    return apiRouter;
};
