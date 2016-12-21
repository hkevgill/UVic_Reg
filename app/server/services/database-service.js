var pg = require('pg');

var config = {
    user: 'dlbbsvuarifngz',
    database: 'dl6islujmsp1u',
    password: 'b194a723dfe33f623dd721b44bf064bb82ca7a9554947a1f7f943a533f7636cb',
    host: 'ec2-54-163-233-89.compute-1.amazonaws.com', // Server hosting the postgres database
    port: 5432,
    ssl: true,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

// var connection = 'postgres://dlbbsvuarifngz:b194a723dfe33f623dd721b44bf064bb82ca7a9554947a1f7f943a533f7636cb@ec2-54-163-233-89.compute-1.amazonaws.com:5432/dl6islujmsp1u?ssl=true';
// var pg = new pg.Client(connection);

var pool = new pg.Pool(config);

module.exports.create = function(req, res) {
    pg.connect();

    var createCourses = pg.query(
        'CREATE TABLE Courses(Course_ID SERIAL PRIMARY KEY, Name VARCHAR(300), Description VARCHAR(800), "Where" VARCHAR(300), "When" TIMESTAMP);'
    );

    var students = function() {
        var createStudents = pg.query(
            'CREATE TABLE Students(Student_ID SERIAL PRIMARY KEY, First_Name VARCHAR(100), Last_Name VARCHAR(100));'
        );

        createStudents.on('end', registration);
    }

    var registration = function() {
        var createRegistration = pg.query(
            'CREATE TABLE Registration(Registration_ID SERIAL PRIMARY KEY, Course_ID INTEGER REFERENCES Courses(Course_ID) ON DELETE CASCADE, Student_ID INTEGER REFERENCES Students(Student_ID) ON DELETE CASCADE);'
        );

        createRegistration.on('end', contactInformation);
    }

    var contactInformation = function() {
        var createContactInformation = pg.query(
            'CREATE TABLE Contact_Information(Contact_Information_ID SERIAL PRIMARY KEY, Student_ID INTEGER REFERENCES Students(Student_ID) ON DELETE CASCADE, Email VARCHAR(200), Primary_YN VARCHAR(5));'
        );

        createContactInformation.on('end', function() { pg.end(); });
    }

    createCourses.on('end', students);
}

module.exports.getCourses = function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('SELECT * FROM Courses', function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            res.json(result);
        });
    });
}

module.exports.getEditCourseInfo = function(req, res) {

    var data = {};

    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('SELECT * FROM Courses WHERE Course_ID = $1::int', [req.params.courseId], function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            data.course = result.rows[0];

            // get registered students
            client.query('SELECT * FROM Students NATURAL JOIN (SELECT R.Student_ID FROM Courses as C NATURAL JOIN Registration as R WHERE C.Course_ID = $1::int) AS derivedTable', [req.params.courseId], function(err, result) {

                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    return console.error('error running query', err);
                }

                data.registeredStudents = result.rows;

                // get list of all students
                client.query('SELECT * FROM Students', function(err, result) {

                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        return console.error('error running query', err);
                    }

                    data.students = result.rows;

                    res.json(data);
                });
            });

        });
    });
}
