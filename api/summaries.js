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
    const collection = db.collection('summaries');

    // GET - Get all summaries
    if (req.method === 'GET') {
      const summaries = await collection.find({}).toArray();
      return res.status(200).json(summaries);
    }

    // POST - Create summary
    if (req.method === 'POST') {
      const { id, title, titleAr, description, fileUrl, subjectCode } = req.body;
      
      if (!id || !title || !titleAr || !description || !fileUrl || !subjectCode) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await collection.insertOne({
        id,
        title,
        titleAr,
        description,
        fileUrl,
        subjectCode,
        downloads: 0,
        uploadDate: new Date().toISOString(),
      });

      return res.status(201).json({ success: true, id });
    }

    // PUT - Update summary
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing ID' });
      }

      const result = await collection.updateOne(
        { id },
        { $set: req.body }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      return res.status(200).json({ success: true });
    }

    // DELETE - Delete summary
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing ID' });
      }

      const result = await collection.deleteOne({ id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Summaries error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
}
