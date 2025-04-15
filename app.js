const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'demo_db',
    port: 9001,
});

connection.connect((err) => {
    if (err) return console.error('Error connecting to DB:', err.message);
    console.log('Connected to MySQL!');
});

async function fetchUsers() {
    const limit = 10;
    const offset = 2;
    try {
        const query = `
            SELECT ID, user_email, user_registered, display_name 
            FROM \`76a_users\` 
            LIMIT ? OFFSET ?
        `;

        // Execute the query with LIMIT and OFFSET passed as parameters
        const [results, fields] = await connection
            .promise()
            .query(query, [limit, offset]);

        console.table(results);
    } catch (err) {
        console.error('Error fetching users:', err.message);
    } finally {
        connection.end();
    }
}

async function main() {
    await fetchUsers();
}

main().catch((err) => {
    console.error('Error in main function:', err.message);
});
