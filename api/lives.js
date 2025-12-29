import clientPromise from './_db.js';

const dbName = process.env.DB_NAME || 'eduflow';

// Validation functions
function validateLiveSession(data) {
  const { title, titleAr, description, instructor, instructorAr, date, time, duration, platform, meetingUrl } = data;
  
  if (!title || !titleAr || !description || !instructor || !instructorAr || !date || !time || !duration || !platform || !meetingUrl) {
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
  if (typeof instructor !== 'string' || instructor.length > 100) {
    return { valid: false, error: 'Invalid instructor name' };
  }
  if (typeof instructorAr !== 'string' || instructorAr.length > 100) {
    return { valid: false, error: 'Invalid Arabic instructor name' };
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { valid: false, error: 'Invalid date format (use YYYY-MM-DD)' };
  }
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    return { valid: false, error: 'Invalid time format (use HH:MM)' };
  }
  if (typeof duration !== 'string' || duration.length > 20) {
    return { valid: false, error: 'Invalid duration' };
  }
  if (typeof platform !== 'string' || platform.length > 50) {
    return { valid: false, error: 'Invalid platform' };
  }
  if (typeof meetingUrl !== 'string' || meetingUrl.length > 500) {
    return { valid: false, error: 'Invalid meeting URL' };
  }
  
  return { valid: true };
}

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
    const collection = db.collection('lives');

    // GET /api/lives - Get all live sessions
    if (req.method === 'GET' && !req.query.id) {
      const lives = await collection.find({}).toArray();
      return res.status(200).json(lives);
    }

    // GET /api/lives?id=xxx - Get live session by ID
    if (req.method === 'GET' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const live = await collection.findOne({ id: req.query.id });
      if (!live) {
        return res.status(404).json({ error: 'Live session not found' });
      }
      return res.status(200).json(live);
    }

    // POST /api/lives - Create live session
    if (req.method === 'POST') {
      const validation = validateLiveSession(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      await collection.insertOne({
        ...req.body,
        attendees: 0,
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({ id: req.body.id, ...req.body });
    }

    // PUT /api/lives?id=xxx - Update live session
    if (req.method === 'PUT' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const liveValidation = validateLiveSession(req.body);
      if (!liveValidation.valid) {
        return res.status(400).json({ error: liveValidation.error });
      }

      const result = await collection.updateOne(
        { id: req.query.id },
        { $set: req.body }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Live session not found' });
      }

      return res.status(200).json({ id: req.query.id, ...req.body });
    }

    // DELETE /api/lives?id=xxx - Delete live session
    if (req.method === 'DELETE' && req.query.id) {
      const validation = validateId(req.query.id);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await collection.deleteOne({ id: req.query.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Live session not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Lives API error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
