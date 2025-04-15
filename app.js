// app.js

const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost', // or your Docker host IP
    user: 'root', // your MySQL user
    password: 'root', // your MySQL password
    database: 'demo_db', // your database name
    port: 9001, // MySQL port
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        return console.error('Error connecting to DB:', err.message);
    }
    console.log('Connected to MySQL!');
});

// Query the users table
connection.query(
    'SELECT ID,user_email,user_registered,display_name FROM 76a_users LIMIT 10',
    (err, results) => {
        if (err) {
            return console.error('Error fetching users:', err.message);
        }

        console.log('Users:');
        console.table(results);

        // Close the connection after query
        connection.end();
    }
);
