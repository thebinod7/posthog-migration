const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'demo_db',
    port: 9001,
});

connection.connect((err) => {
    if (err) {
        return console.error('Error connecting to DB:', err.message);
    }
    console.log('Connected to MySQL!');
});

connection.query(
    'SELECT ID,user_email,user_registered,display_name FROM 76a_users LIMIT 10',
    (err, results) => {
        if (err) {
            return console.error('Error fetching users:', err.message);
        }

        console.table(results);

        connection.end();
    }
);
