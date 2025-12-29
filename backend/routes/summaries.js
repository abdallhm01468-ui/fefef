import express from 'express';
import { getDatabase } from '../db.js';
import { validateSummary, validateId } from '../middleware/validation.js';

const router = express.Router();

// Get all summaries
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const summaries = await db.collection('summaries').find({}).toArray();
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ error: 'Failed to fetch summaries' });
  }
});

// Get summary by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const db = getDatabase();
    const summary = await db.collection('summaries').findOne({ id: req.params.id });
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Create summary
router.post('/', validateSummary, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('summaries').insertOne({
      ...req.body,
      downloads: 0,
      uploadDate: new Date().toISOString(),
    });
    res.status(201).json({ id: req.body.id, ...req.body });
  } catch (error) {
    console.error('Error creating summary:', error);
    res.status(500).json({ error: 'Failed to create summary' });
  }
});

// Update summary
router.put('/:id', validateId, validateSummary, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('summaries').updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating summary:', error);
    res.status(500).json({ error: 'Failed to update summary' });
  }
});

// Delete summary
router.delete('/:id', validateId, async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('summaries').deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting summary:', error);
    res.status(500).json({ error: 'Failed to delete summary' });
  }
});

export default router;
