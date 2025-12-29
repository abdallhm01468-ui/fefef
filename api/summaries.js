import { MongoClient, ServerApiVersion } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'eduflow';

// Validation functions
function validateSummary(data) {
  const { title, titleAr, description, fileUrl, subjectCode } = data;
  
  if (!title || !titleAr || !description || !fileUrl || !subjectCode) {
    return { valid: false, error: 'Missing required fields' };
  }
  
  if (typeof title !== 'string' || title.length > 200) {
    return { valid: false, error: 'Invalid title' };
  }
  if (typeof titleAr !== 'string' || titleAr.length > 200) {
    return { valid: false, error: 'Invalid Arabic title' };
  }
  if (typeof description !== 'string' || description.length > 1000) {
    return { valid: false, error: 'Invalid description' };
  }
  if (typeof fileUrl !== 'string' || fileUrl.length > 500) {
    return { valid: false, error: 'Invalid file URL' };
  }
  if (typeof subjectCode !== 'string' || subjectCode.length > 20) {
    return { valid: false, error: 'Invalid subject code' };
  }
  
  return { valid: true };
}

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
    // GET /api/summaries - Get all summaries
    if (req.method === 'GET' && !req.query.id) {
      const summaries = await connectAndQuery(async (db) => {
        return await db.collection('summaries').find({}).toArray();
      });
      return res.status(200).json(summaries);
    }

    // GET /api/summaries?id=xxx - Get summary by ID
    if (req.method === 'GET' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const summary = await connectAndQuery(async (db) => {
        return await db.collection('summaries').findOne({ id: req.query.id });
      });

      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }
      return res.status(200).json(summary);
    }

    // POST /api/summaries - Create summary
    if (req.method === 'POST') {
      const validation = validateSummary(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      await connectAndQuery(async (db) => {
        return await db.collection('summaries').insertOne({
          ...req.body,
          downloads: 0,
          uploadDate: new Date().toISOString(),
        });
      });

      return res.status(201).json({ id: req.body.id, ...req.body });
    }

    // PUT /api/summaries?id=xxx - Update summary
    if (req.method === 'PUT' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const summaryValidation = validateSummary(req.body);
      if (!summaryValidation.valid) {
        return res.status(400).json({ error: summaryValidation.error });
      }

      const result = await connectAndQuery(async (db) => {
        return await db.collection('summaries').updateOne(
          { id: req.query.id },
          { $set: req.body }
        );
      });

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      return res.status(200).json({ id: req.query.id, ...req.body });
    }

    // DELETE /api/summaries?id=xxx - Delete summary
    if (req.method === 'DELETE' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await connectAndQuery(async (db) => {
        return await db.collection('summaries').deleteOne({ id: req.query.id });
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Summary not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
