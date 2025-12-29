import clientPromise from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'eduflow');
    const collection = db.collection('videos');

    if (req.method === 'GET') {
      const videos = await collection.find({}).toArray();
      return res.status(200).json(videos);
    }

    if (req.method === 'POST') {
      const result = await collection.insertOne({
        ...req.body,
        views: 0,
        uploadDate: new Date().toISOString(),
      });
      return res.status(201).json({ success: true, id: req.body.id });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const result = await collection.updateOne({ id }, { $set: req.body });
      return res.status(200).json({ success: result.matchedCount > 0 });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const result = await collection.deleteOne({ id });
      return res.status(200).json({ success: result.deletedCount > 0 });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Videos error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
}
