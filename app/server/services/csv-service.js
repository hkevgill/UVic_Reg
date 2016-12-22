var pg      = require('pg');
var csv     = require('csv');
var fs      = require('fs');
var moment  = require('moment');

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

var pool = new pg.Pool(config);

module.exports.insertCSV = function(file, table) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        var row, j, value, query, date;

        fs.readFile('./server/csv/' + file, 'utf-8', function (err, data) {
            if (err) {
                console.log(err);
            }
            
            csv.parse(data, function(err, data) {

                // get column names
                var columns = data[0];

                // remove column names from array
                data.splice(0, 1);

                // build insert statement
                query = 'INSERT INTO ' + table + '(';

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
                    if (row[0] !== '' && row[0] !== null && row[0] !== undefined) {
                        query += '(';
                        for (j = 0; j < row.length; j = j + 1) {
                            if (row[j] === '') {
                                query += '\'\',';
                                continue;
                            }

                            if (j === 0) {
                                query += 'DEFAULT,';
                                continue;
                            }

                            if(isNaN(row[j])) {
                                query += '\'';
                            }

                            if (columns[0] === 'Course_ID' && j === 4) {
                                query = query.substring(0, query.length - 1);
                                value = moment(row[j]).utc().unix();
                                query += ('to_timestamp(' + value + '),');
                                continue
                            }
                            else {
                                query += row[j];
                            }

                            if(isNaN(row[j])) {
                                query += '\'';
                            }

                            query += ',';
                        }

                        query = query.substring(0, query.length - 1);
                        query += '), ';
                    }
                }

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
