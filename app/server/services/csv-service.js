var pg      = require('pg');
var csv     = require('csv');
var fs      = require('fs');

var connection = 'postgres://dlbbsvuarifngz:b194a723dfe33f623dd721b44bf064bb82ca7a9554947a1f7f943a533f7636cb@ec2-54-163-233-89.compute-1.amazonaws.com:5432/dl6islujmsp1u?ssl=true';
var pg = new pg.Client(connection);

module.exports.insertCSV = function(file, table) {
    pg.connect();

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
                if (i === 'When' || i === 'Where' || i === 'Name') {
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
                            value = new Date(row[j]).toISOString();
                            query += value;
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

            console.log(query);

            // insert into the database
            var insertResult = pg.query(query, function(err) {
                if (err) {
                    console.log(err);
                }
            });

            insertResult.on('end', function() { pg.end(); });
        });

    });
}
