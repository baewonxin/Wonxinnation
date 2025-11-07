const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    try {
        const sql = neon(process.env.DATABASE_URL);
        const { messageId } = event.queryStringParameters;
        const data = JSON.parse(event.body);

        if (!data.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Reply content is required' })
            };
        }

        const reply = {
            id: Date.now(),
            author: data.author || 'Anonymous',
            content: data.content,
            timestamp: new Date().toISOString()
        };

        // Get current message to update replies
        const currentMessage = await sql`
            SELECT replies FROM messages WHERE id = ${messageId}
        `;

        if (currentMessage.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Message not found' })
            };
        }

        const currentReplies = currentMessage[0].replies || [];
        const updatedReplies = [...currentReplies, reply];

        // Update the message with new reply
        await sql`
            UPDATE messages 
            SET replies = ${JSON.stringify(updatedReplies)}::jsonb
            WHERE id = ${messageId}
        `;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                reply: reply
            })
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to add reply' })
        };
    }
};