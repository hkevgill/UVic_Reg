var pg      = require('pg');
var csv     = require('csv');
var fs      = require('fs');
var moment  = require('moment');

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

// connection pool for db
var pool = new pg.Pool(config);

// parse insert given csv file into given table
module.exports.insertCSV = function(file, table) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var row, j, value, query, date;

        // read the csv file
        fs.readFile('./server/csv/' + file, 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            
            // use csv library to parse
            csv.parse(data, function(err, data) {

                // get column names
                var columns = data[0];

                // remove column names from array
                data.splice(0, 1);

                // build insert statement
                query = 'INSERT INTO ' + table + '(';

                // when and where are keywords, need quotes around them
                for (i of columns) {
                    if (i === 'When' || i === 'Where') {
                        query += ('"' + i + '",');
                        continue;
                    }
                    query += i;
                    query += ','
                }

                // strip last comma
                query = query.substring(0, query.length - 1);

                query += ') VALUES';

                for (row of data) {
                    // make sure row has pk
                    if (row[0] !== '' && row[0] !== null && row[0] !== undefined) {
                        query += '(';
                        for (j = 0; j < row.length; j = j + 1) {
                            if (row[j] === '') {
                                query += '\'\',';
                                continue;
                            }

                            // pk is a serial value, use DEFAULT to auto increment
                            if (j === 0) {
                                query += 'DEFAULT,';
                                continue;
                            }

                            // strings need quotes
                            if(isNaN(row[j])) {
                                query += '\'';
                            }

                            // deal with the only time field (in the courses table)
                            if (columns[0] === 'Course_ID' && j === 4) {
                                query = query.substring(0, query.length - 1);
                                value = moment(row[j]).unix();
                                query += ('to_timestamp(' + value + '),');
                                continue
                            }
                            else {
                                query += row[j];
                            }

                            // closing quote on strings
                            if(isNaN(row[j])) {
                                query += '\'';
                            }

                            query += ',';
                        }

                        // strip of final comma and close bracket
                        query = query.substring(0, query.length - 1);
                        query += '), ';
                    }
                }

                // strip off space and comma and end the sql statement
                query = query.substring(0, query.length - 2);
                query += ';';

                // insert into the database
                var insertResult = client.query(query, function(err, result) {
                    if (err) {
                        console.log(err);

                    //call `done()` to release the client back to the pool
                    done();

                    if(err) {
                        return console.error('error running query', err);
                    }
                    }
                });

            });

        });
    });
}
