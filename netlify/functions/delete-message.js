const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    try {
        const sql = neon(process.env.DATABASE_URL);
        const { messageId } = event.queryStringParameters;

        const result = await sql`
            DELETE FROM messages WHERE id = ${messageId}
        `;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to delete message' })
        };
    }
};