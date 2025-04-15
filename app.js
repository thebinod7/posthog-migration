const mysql = require('mysql2');
const { PostHog } = require('posthog-node');
const dotenv = require('dotenv');

dotenv.config();

const PROJECT_ID = process.env.POSTHOG_LIVE_PROJECT_ID;
const HOST_URL = 'https://us.i.posthog.com';

const ph_client = new PostHog(PROJECT_ID, {
    host: HOST_URL,
    requestTimeout: 10000,
});

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

// Add by chunk size of 500
async function fetchAndMigrateUsers() {
    const limit = 50;
    const offset = 0;
    try {
        const query = `
            SELECT ID, user_email, user_registered, display_name 
            FROM \`76a_users\` 
            LIMIT ? OFFSET ?
        `;

        const [results] = await connection
            .promise()
            .query(query, [limit, offset]);

        return migrateToPosthog(results);
    } catch (err) {
        console.error('Error fetching users:', err.message);
    } finally {
        connection.end();
    }
}

async function main() {
    await fetchAndMigrateUsers();
}

async function migrateToPosthog(users) {
    let counter = 0;
    const filteredUsers = users.filter(
        (user) => user.user_email && user.display_name
    );
    if (!filteredUsers.length) {
        console.log('==No users to migrate==');
        return;
    }

    for (const user of filteredUsers) {
        const payload = {
            distinctId: user.user_email,
            properties: {
                email: user.user_email,
                name: user.display_name,
                registered_at: user.user_registered,
                total_impact_kg: {
                    personal: 0,
                    professional: 0,
                },
            },
        };
        await addToPosthog(payload);
        counter++;
    }
    ph_client.flush();
    ph_client.shutdown();
    console.log(
        `===${counter}/${filteredUsers.length} users added to Posthog===`
    );
}

async function addToPosthog(payload) {
    console.log('===Adding to Posthog===', payload);
    return ph_client.identify(payload);
}

main().catch((err) => {
    console.error('Error in main function:', err.message);
});
