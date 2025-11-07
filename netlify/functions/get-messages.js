const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  // Allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('wonxin');
    const messages = await db.collection('messages').find({}).sort({ timestamp: -1 }).toArray();
    
    await client.close();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(messages)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
