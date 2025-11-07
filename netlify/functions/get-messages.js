const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    try {
        const sql = neon(process.env.DATABASE_URL);
        
        const messages = await sql`
            SELECT id, author, content, timestamp, replies 
            FROM messages 
            ORDER BY timestamp DESC
        `;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages)
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load messages' })
        };
    }
};