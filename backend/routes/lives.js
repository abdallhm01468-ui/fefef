import express from 'express';
import { getDatabase } from '../db.js';
import { validateLiveSession, validateId } from '../middleware/validation.js';

const router = express.Router();

// Get all live sessions
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const lives = await db.collection('lives').find({}).toArray();
    res.json(lives);
  } catch (error) {
    console.error('Error fetching lives:', error);
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});

// Get live session by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const db = getDatabase();
    const live = await db.collection('lives').findOne({ id: req.params.id });
    if (!live) {
      return res.status(404).json({ error: 'Live session not found' });
    }
    res.json(live);
  } catch (error) {
    console.error('Error fetching live session:', error);
    res.status(500).json({ error: 'Failed to fetch live session' });
  }
});

// Create live session
router.post('/', validateLiveSession, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('lives').insertOne({
      ...req.body,
      attendees: 0,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ id: req.body.id, ...req.body });
  } catch (error) {
    console.error('Error creating live session:', error);
    res.status(500).json({ error: 'Failed to create live session' });
  }
});

// Update live session
router.put('/:id', validateId, validateLiveSession, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('lives').updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Live session not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating live session:', error);
    res.status(500).json({ error: 'Failed to update live session' });
  }
});

// Delete live session
router.delete('/:id', validateId, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('lives').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Live session not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting live session:', error);
    res.status(500).json({ error: 'Failed to delete live session' });
  }
});

export default router;
