// Input validation and sanitization middleware

export function validateSummary(req, res, next) {
  const { title, titleAr, description, fileUrl, subjectCode } = req.body;
  
  // Check required fields
  if (!title || !titleAr || !description || !fileUrl || !subjectCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check field types and length
  if (typeof title !== 'string' || title.length > 200) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  if (typeof titleAr !== 'string' || titleAr.length > 200) {
    return res.status(400).json({ error: 'Invalid Arabic title' });
  }
  if (typeof description !== 'string' || description.length > 1000) {
    return res.status(400).json({ error: 'Invalid description' });
  }
  if (typeof fileUrl !== 'string' || fileUrl.length > 500) {
    return res.status(400).json({ error: 'Invalid file URL' });
  }
  if (typeof subjectCode !== 'string' || subjectCode.length > 20) {
    return res.status(400).json({ error: 'Invalid subject code' });
  }
  
  next();
}

export function validateVideo(req, res, next) {
  const { title, titleAr, description, videoUrl, thumbnail, category, duration } = req.body;
  
  // Check required fields
  if (!title || !titleAr || !description || !videoUrl || !category || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check field types and length
  if (typeof title !== 'string' || title.length > 200) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  if (typeof titleAr !== 'string' || titleAr.length > 200) {
    return res.status(400).json({ error: 'Invalid Arabic title' });
  }
  if (typeof description !== 'string' || description.length > 1000) {
    return res.status(400).json({ error: 'Invalid description' });
  }
  if (typeof videoUrl !== 'string' || videoUrl.length > 500) {
    return res.status(400).json({ error: 'Invalid video URL' });
  }
  if (thumbnail && (typeof thumbnail !== 'string' || thumbnail.length > 500)) {
    return res.status(400).json({ error: 'Invalid thumbnail URL' });
  }
  if (typeof category !== 'string' || category.length > 50) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  if (typeof duration !== 'string' || duration.length > 20) {
    return res.status(400).json({ error: 'Invalid duration' });
  }
  
  next();
}

export function validateLiveSession(req, res, next) {
  const { title, titleAr, description, instructor, instructorAr, date, time, duration, platform, meetingUrl } = req.body;
  
  // Check required fields
  if (!title || !titleAr || !description || !instructor || !instructorAr || !date || !time || !duration || !platform || !meetingUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check field types and length
  if (typeof title !== 'string' || title.length > 200) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  if (typeof titleAr !== 'string' || titleAr.length > 200) {
    return res.status(400).json({ error: 'Invalid Arabic title' });
  }
  if (typeof description !== 'string' || description.length > 1000) {
    return res.status(400).json({ error: 'Invalid description' });
  }
  if (typeof instructor !== 'string' || instructor.length > 100) {
    return res.status(400).json({ error: 'Invalid instructor name' });
  }
  if (typeof instructorAr !== 'string' || instructorAr.length > 100) {
    return res.status(400).json({ error: 'Invalid Arabic instructor name' });
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format (use YYYY-MM-DD)' });
  }
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format (use HH:MM)' });
  }
  if (typeof duration !== 'string' || duration.length > 20) {
    return res.status(400).json({ error: 'Invalid duration' });
  }
  if (typeof platform !== 'string' || platform.length > 50) {
    return res.status(400).json({ error: 'Invalid platform' });
  }
  if (typeof meetingUrl !== 'string' || meetingUrl.length > 500) {
    return res.status(400).json({ error: 'Invalid meeting URL' });
  }
  
  next();
}

export function validateId(req, res, next) {
  const { id } = req.params;
  
  // ID should be a string of digits (timestamp-based)
  if (!id || typeof id !== 'string' || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  next();
}
