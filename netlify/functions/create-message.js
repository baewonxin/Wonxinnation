const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    try {
        const sql = neon(process.env.DATABASE_URL);
        const data = JSON.parse(event.body);
        
        if (!data.author || !data.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Author and content are required' })
            };
        }

        const result = await sql`
            INSERT INTO messages (author, content, replies) 
            VALUES (${data.author}, ${data.content}, '[]'::jsonb)
            RETURNING id, author, content, timestamp, replies
        `;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                message: result[0]
            })
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save message' })
        };
    }
};