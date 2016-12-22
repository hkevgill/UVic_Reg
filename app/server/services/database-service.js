var pg = require('pg');
var moment = require('moment');

// database settings
var config = {
    user: 'dlbbsvuarifngz',
    database: 'dl6islujmsp1u',
    password: 'b194a723dfe33f623dd721b44bf064bb82ca7a9554947a1f7f943a533f7636cb',
    host: 'ec2-54-163-233-89.compute-1.amazonaws.com', // Server hosting the postgres database
    port: 5432,
    ssl: true,
    max: 15, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

// use a connection pool
var pool = new pg.Pool(config);

// create the database tables
module.exports.create = function(req, res) {
    pool.connect(function(err, client, done) {

        client.query('CREATE TABLE Courses(Course_ID SERIAL PRIMARY KEY, Name VARCHAR(300), Description VARCHAR(800), "Where" VARCHAR(300), "When" TIMESTAMP);', function(err, results) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            client.query('CREATE TABLE Students(Student_ID SERIAL PRIMARY KEY, First_Name VARCHAR(100), Last_Name VARCHAR(100));', function(err, results) {
                
                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    return console.error('error running query', err);
                }

                client.query('CREATE TABLE Registration(Registration_ID SERIAL PRIMARY KEY, Course_ID INTEGER REFERENCES Courses(Course_ID) ON DELETE CASCADE, Student_ID INTEGER REFERENCES Students(Student_ID) ON DELETE CASCADE);', function(err, results) {
                    
                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        return console.error('error running query', err);
                    }

                    client.query('CREATE TABLE Contact_Information(Contact_Information_ID SERIAL PRIMARY KEY, Student_ID INTEGER REFERENCES Students(Student_ID) ON DELETE CASCADE, Email VARCHAR(200), Primary_YN VARCHAR(5));', function(err, results) {
                        
                        //call `done()` to release the client back to the pool
                        done();

                        if(err) {
                            return console.error('error running query', err);
                        }
                    });

                });

            });

        });

    });
}

// get a list of all courses
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

// get everything needed for the edit course page
// the course, students registered, and a list of all students for the dropdown
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

// save new course information
module.exports.updateCourse = function(req, res) {

    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        req.body.When = moment(req.body.When).utc().unix();;

        client.query('UPDATE Courses SET name = $1::text, description = $2::text, "Where" = $3::text, "When" = to_timestamp(' + req.body.When + ') WHERE Course_ID = $4::int RETURNING *', [req.body.name, req.body.description, req.body.Where, req.body.course_id], function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            res.json(result);
        });
    });
}

// insert new student into registrations table
module.exports.addStudent = function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var query = client.query('INSERT INTO Registration(Course_ID, Student_ID) VALUES($1::int, $2::int) RETURNING *', [req.body.courseId, req.body.studentId], function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            res.json(result);
        });
    });
}

// delete student from registrations table
module.exports.deleteStudent = function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query('DELETE FROM Registration WHERE Student_ID = $1::int AND Course_ID = $2 RETURNING *', [req.body.student.student_id, req.body.courseId], function(err, result) {

            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            res.json(result);
        });
    });
}
