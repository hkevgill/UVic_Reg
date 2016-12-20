var databaseService = require('../services/database-service');

module.exports = function(app, express) {

    var apiRouter = express.Router();

    apiRouter.get('/', function(req, res) {
        res.json({ message: 'get works' });
    });

    apiRouter.post('/', function(req, res) {
        console.log(req.body);
        res.json({ message: 'post works!' });
    });

    return apiRouter;
};
