import clientPromise from './_db.js';

const dbName = process.env.DB_NAME || 'eduflow';

function validateId(id) {
  if (!id || typeof id !== 'string' || id.length === 0) {
    return { valid: false, error: 'Invalid ID' };
  }
  return { valid: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('exams');

    // GET /api/exams - Get all exams
    if (req.method === 'GET' && !req.query.id) {
      const exams = await collection.find({}).toArray();
      return res.status(200).json(exams);
    }

    // GET /api/exams?id=xxx - Get exam by ID
    if (req.method === 'GET' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const exam = await collection.findOne({ _id: req.query.id });
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      return res.status(200).json(exam);
    }

    // POST /api/exams - Create exam
    if (req.method === 'POST') {
      const result = await collection.insertOne({
        ...req.body,
        createdAt: new Date(),
      });

      return res.status(201).json({ _id: result.insertedId, ...req.body });
    }

    // PUT /api/exams?id=xxx - Update exam
    if (req.method === 'PUT' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await collection.updateOne(
        { _id: req.query.id },
        { $set: req.body }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      return res.status(200).json({ _id: req.query.id, ...req.body });
    }

    // DELETE /api/exams?id=xxx - Delete exam
    if (req.method === 'DELETE' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await collection.deleteOne({ _id: req.query.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Exams API error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
