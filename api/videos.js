import { MongoClient, ServerApiVersion } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'eduflow';

// Validation functions
function validateVideo(data) {
  const { title, titleAr, description, videoUrl, thumbnail, category, duration } = data;
  
  if (!title || !titleAr || !description || !videoUrl || !category || !duration) {
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
  if (typeof videoUrl !== 'string' || videoUrl.length > 500) {
    return { valid: false, error: 'Invalid video URL' };
  }
  if (thumbnail && (typeof thumbnail !== 'string' || thumbnail.length > 500)) {
    return { valid: false, error: 'Invalid thumbnail URL' };
  }
  if (typeof category !== 'string' || category.length > 50) {
    return { valid: false, error: 'Invalid category' };
  }
  if (typeof duration !== 'string' || duration.length > 20) {
    return { valid: false, error: 'Invalid duration' };
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
    // GET /api/videos - Get all videos
    if (req.method === 'GET' && !req.query.id) {
      const videos = await connectAndQuery(async (db) => {
        return await db.collection('videos').find({}).toArray();
      });
      return res.status(200).json(videos);
    }

    // GET /api/videos?id=xxx - Get video by ID
    if (req.method === 'GET' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const video = await connectAndQuery(async (db) => {
        return await db.collection('videos').findOne({ id: req.query.id });
      });

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      return res.status(200).json(video);
    }

    // POST /api/videos - Create video
    if (req.method === 'POST') {
      const validation = validateVideo(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      await connectAndQuery(async (db) => {
        return await db.collection('videos').insertOne({
          ...req.body,
          views: 0,
          uploadDate: new Date().toISOString(),
        });
      });

      return res.status(201).json({ id: req.body.id, ...req.body });
    }

    // PUT /api/videos?id=xxx - Update video
    if (req.method === 'PUT' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const videoValidation = validateVideo(req.body);
      if (!videoValidation.valid) {
        return res.status(400).json({ error: videoValidation.error });
      }

      const result = await connectAndQuery(async (db) => {
        return await db.collection('videos').updateOne(
          { id: req.query.id },
          { $set: req.body }
        );
      });

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      return res.status(200).json({ id: req.query.id, ...req.body });
    }

    // DELETE /api/videos?id=xxx - Delete video
    if (req.method === 'DELETE' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await connectAndQuery(async (db) => {
        return await db.collection('videos').deleteOne({ id: req.query.id });
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
