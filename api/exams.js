import { MongoClient, ServerApiVersion } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'eduflow';

function validateId(id) {
  if (!id || typeof id !== 'string' || id.length === 0) {
    return { valid: false, error: 'Invalid ID' };
  }
  return { valid: true };
}

async function connectAndQuery(operation) {
  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    retryWrites: true,
    w: "majority",
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    return await operation(db);
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET /api/exams - Get all exams
    if (req.method === 'GET' && !req.query.id) {
      const exams = await connectAndQuery(async (db) => {
        return await db.collection('exams').find({}).toArray();
      });
      return res.status(200).json(exams);
    }

    // GET /api/exams?id=xxx - Get exam by ID
    if (req.method === 'GET' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const exam = await connectAndQuery(async (db) => {
        return await db.collection('exams').findOne({ _id: req.query.id });
      });

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      return res.status(200).json(exam);
    }

    // POST /api/exams - Create exam
    if (req.method === 'POST') {
      const result = await connectAndQuery(async (db) => {
        return await db.collection('exams').insertOne({
          ...req.body,
          createdAt: new Date(),
        });
      });

      return res.status(201).json({ _id: result.insertedId, ...req.body });
    }

    // PUT /api/exams?id=xxx - Update exam
    if (req.method === 'PUT' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await connectAndQuery(async (db) => {
        return await db.collection('exams').updateOne(
          { _id: req.query.id },
          { $set: req.body }
        );
      });

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

      const result = await connectAndQuery(async (db) => {
        return await db.collection('exams').deleteOne({ _id: req.query.id });
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
