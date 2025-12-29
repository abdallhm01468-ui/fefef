import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db.js';

const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const exams = await db.collection('exams').find({}).toArray();
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get exam by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const exam = await db.collection('exams').findOne({ _id: req.params.id });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create exam
router.post('/', async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('exams').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    res.status(201).json({ _id: result.insertedId, ...req.body });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update exam
router.put('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('exams').updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ _id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete exam
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('exams').deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
