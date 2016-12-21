var pg = require('pg');

var connection = 'postgres://dlbbsvuarifngz:b194a723dfe33f623dd721b44bf064bb82ca7a9554947a1f7f943a533f7636cb@ec2-54-163-233-89.compute-1.amazonaws.com:5432/dl6islujmsp1u?ssl=true';
var pg = new pg.Client(connection);

module.exports.create = function(req, res) {
    pg.connect();

    var createCourses = pg.query(
        'CREATE TABLE Courses(Course_ID SERIAL PRIMARY KEY, Name VARCHAR(300), Description VARCHAR(800), "Where" VARCHAR(300), "When" TIMESTAMP WITH TIME ZONE);'
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
