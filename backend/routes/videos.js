import express from 'express';
import { getDatabase } from '../db.js';
import { validateVideo, validateId } from '../middleware/validation.js';

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const videos = await db.collection('videos').find({}).toArray();
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get video by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const db = getDatabase();
    const video = await db.collection('videos').findOne({ id: req.params.id });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Create video
router.post('/', validateVideo, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('videos').insertOne({
      ...req.body,
      views: 0,
      uploadDate: new Date().toISOString(),
    });
    res.status(201).json({ id: req.body.id, ...req.body });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video
router.put('/:id', validateId, validateVideo, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('videos').updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video
router.delete('/:id', validateId, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('videos').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;
