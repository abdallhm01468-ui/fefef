import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Save exam result
app.post('/make-server-0ba463e1/exam/submit', async (c) => {
  try {
    const body = await c.req.json();
    const { studentName, studentId, correctAnswers, totalQuestions, percentage, grade, timestamp } = body;

    if (!studentName || !studentId || correctAnswers === undefined || !totalQuestions) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const examId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const examData = {
      id: examId,
      studentName,
      studentId,
      correctAnswers,
      totalQuestions,
      percentage,
      grade,
      timestamp: timestamp || new Date().toISOString(),
    };

    await kv.set(examId, examData);
    
    const studentKey = `student_${studentId}`;
    const existingData = await kv.get(studentKey);
    
    let studentHistory = existingData ? existingData : { studentId, studentName, exams: [] };
    studentHistory.exams = studentHistory.exams || [];
    studentHistory.exams.push(examData);
    
    await kv.set(studentKey, studentHistory);

    console.log(`Exam saved successfully: ${examId}`);
    return c.json({ success: true, examId, data: examData });
  } catch (error) {
    console.error('Error saving exam result:', error);
    return c.json({ error: 'Failed to save exam result', details: error.message }, 500);
  }
});

// Get student history
app.get('/make-server-0ba463e1/exam/student/:studentId', async (c) => {
  try {
    const studentId = c.req.param('studentId');
    const studentKey = `student_${studentId}`;
    
    const studentData = await kv.get(studentKey);
    
    if (!studentData) {
      return c.json({ success: true, data: null, message: 'No history found' });
    }

    return c.json({ success: true, data: studentData });
  } catch (error) {
    console.error('Error fetching student history:', error);
    return c.json({ error: 'Failed to fetch student history', details: error.message }, 500);
  }
});

// Get all exam results (for leaderboard)
app.get('/make-server-0ba463e1/exam/leaderboard', async (c) => {
  try {
    const allExams = await kv.getByPrefix('exam_');
    
    const sortedExams = allExams.sort((a, b) => b.percentage - a.percentage);
    const topExams = sortedExams.slice(0, 10);

    return c.json({ success: true, data: topExams });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ error: 'Failed to fetch leaderboard', details: error.message }, 500);
  }
});

// Get all students
app.get('/make-server-0ba463e1/exam/students', async (c) => {
  try {
    const allStudents = await kv.getByPrefix('student_');
    
    return c.json({ success: true, data: allStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    return c.json({ error: 'Failed to fetch students', details: error.message }, 500);
  }
});

// ==================== EXAM TEMPLATE ROUTES ====================

// Save exam template
app.post('/make-server-0ba463e1/exam-template/save', async (c) => {
  try {
    const body = await c.req.json();
    const { id, title, description, mcqQuestions, trueFalseQuestions, createdAt, updatedAt } = body;

    if (!title || !mcqQuestions || !trueFalseQuestions) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const templateId = id || `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const templateData = {
      id: templateId,
      title,
      description,
      mcqQuestions,
      trueFalseQuestions,
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(templateId, templateData);

    console.log(`Exam template saved successfully: ${templateId}`);
    return c.json({ success: true, templateId, data: templateData });
  } catch (error) {
    console.error('Error saving exam template:', error);
    return c.json({ error: 'Failed to save exam template', details: error.message }, 500);
  }
});

// Get all exam templates
app.get('/make-server-0ba463e1/exam-template/list', async (c) => {
  try {
    const allTemplates = await kv.getByPrefix('template_');
    
    const sortedTemplates = allTemplates.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return c.json({ success: true, data: sortedTemplates });
  } catch (error) {
    console.error('Error fetching exam templates:', error);
    return c.json({ error: 'Failed to fetch exam templates', details: error.message }, 500);
  }
});

// Get single exam template
app.get('/make-server-0ba463e1/exam-template/:templateId', async (c) => {
  try {
    const templateId = c.req.param('templateId');
    const templateData = await kv.get(templateId);
    
    if (!templateData) {
      return c.json({ success: false, message: 'Template not found' }, 404);
    }

    return c.json({ success: true, data: templateData });
  } catch (error) {
    console.error('Error fetching exam template:', error);
    return c.json({ error: 'Failed to fetch exam template', details: error.message }, 500);
  }
});

// Delete exam template
app.delete('/make-server-0ba463e1/exam-template/:templateId', async (c) => {
  try {
    const templateId = c.req.param('templateId');
    await kv.del(templateId);

    console.log(`Exam template deleted successfully: ${templateId}`);
    return c.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam template:', error);
    return c.json({ error: 'Failed to delete exam template', details: error.message }, 500);
  }
});

export default app;
