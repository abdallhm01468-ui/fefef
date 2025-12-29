export const API_BASE_URL = '/functions/v1/make-server-0ba463e1';

export interface ExamResult {
  id?: string;
  studentName: string;
  studentId: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  timestamp: string;
}

export interface StudentHistory {
  studentId: string;
  studentName: string;
  exams: ExamResult[];
}

export interface Question {
  id: number;
  question: string;
  options?: string[];
  correct: string;
  type: 'mcq' | 'truefalse';
}

export interface ExamTemplate {
  id?: string;
  title: string;
  description?: string;
  subject?: string;
  level?: number;
  duration?: number;
  passingScore?: number;
  mcqQuestions: Question[];
  trueFalseQuestions: Question[];
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
}

// Submit exam result
export async function submitExamResult(data: ExamResult): Promise<{ success: boolean; examId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { success: true, examId: `local_${Date.now()}` };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: true, examId: `local_${Date.now()}` };
    }

    const result = await response.json();
    return { success: true, examId: result.examId };
  } catch (error) {
    return { success: true, examId: `local_${Date.now()}` };
  }
}

// Get student history
export async function getStudentHistory(studentId: string): Promise<StudentHistory | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/student/${studentId}`);
    
    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    return null;
  }
}

// Get leaderboard
export async function getLeaderboard(): Promise<ExamResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam/leaderboard`);
    
    if (!response.ok) {
      return [];
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return [];
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
}

// ==================== EXAM TEMPLATE API ====================

// Save exam template
export async function saveExamTemplate(template: ExamTemplate): Promise<{ success: boolean; templateId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam-template/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      // Fallback to localStorage
      return saveExamTemplateLocally(template);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Fallback to localStorage
      return saveExamTemplateLocally(template);
    }

    const result = await response.json();
    
    // Also save to localStorage as backup
    saveExamTemplateLocally(template);
    
    return { success: true, templateId: result.templateId };
  } catch (error) {
    // Fallback to localStorage
    return saveExamTemplateLocally(template);
  }
}

// Local Storage Helper Functions
function saveExamTemplateLocally(template: ExamTemplate): { success: boolean; templateId?: string; error?: string } {
  try {
    const templateId = template.id || `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const templateWithId = { ...template, id: templateId, updatedAt: new Date().toISOString() };
    
    // Get existing templates
    const existingTemplates = getExamTemplatesLocally();
    
    // Update or add new template
    const index = existingTemplates.findIndex(t => t.id === templateId);
    if (index >= 0) {
      existingTemplates[index] = templateWithId;
    } else {
      existingTemplates.push(templateWithId);
    }
    
    // Save to localStorage
    localStorage.setItem('examTemplates', JSON.stringify(existingTemplates));
    
    return { success: true, templateId };
  } catch (error) {
    return { success: false, error: 'Failed to save to local storage' };
  }
}

function getExamTemplatesLocally(): ExamTemplate[] {
  try {
    const stored = localStorage.getItem('examTemplates');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    return [];
  }
}

function deleteExamTemplateLocally(templateId: string): boolean {
  try {
    const existingTemplates = getExamTemplatesLocally();
    const filtered = existingTemplates.filter(t => t.id !== templateId);
    localStorage.setItem('examTemplates', JSON.stringify(filtered));
    return true;
  } catch (error) {
    return false;
  }
}

// Get all exam templates
export async function getExamTemplates(): Promise<ExamTemplate[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam-template/list`);
    
    if (!response.ok) {
      // Fallback to localStorage
      return getExamTemplatesLocally();
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Fallback to localStorage
      return getExamTemplatesLocally();
    }

    const result = await response.json();
    const serverTemplates = result.data || [];
    
    // Merge with local templates
    const localTemplates = getExamTemplatesLocally();
    
    // Create a map to avoid duplicates
    const templatesMap = new Map<string, ExamTemplate>();
    
    // Add server templates first (they have priority)
    serverTemplates.forEach((t: ExamTemplate) => {
      if (t.id) templatesMap.set(t.id, t);
    });
    
    // Add local templates that are not on server
    localTemplates.forEach(t => {
      if (t.id && !templatesMap.has(t.id)) {
        templatesMap.set(t.id, t);
      }
    });
    
    return Array.from(templatesMap.values());
  } catch (error) {
    // Fallback to localStorage
    return getExamTemplatesLocally();
  }
}

// Get single exam template
export async function getExamTemplate(templateId: string): Promise<ExamTemplate | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam-template/${templateId}`);
    
    if (!response.ok) {
      console.warn('Server not available for exam template');
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Server returned non-JSON response');
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching exam template:', error);
    return null;
  }
}

// Delete exam template
export async function deleteExamTemplate(templateId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/exam-template/${templateId}`, {
      method: 'DELETE',
    });

    // Always delete from localStorage
    deleteExamTemplateLocally(templateId);

    if (!response.ok) {
      return { success: true }; // Already deleted locally
    }

    return { success: true };
  } catch (error) {
    // Delete from localStorage anyway
    deleteExamTemplateLocally(templateId);
    return { success: true };
  }
}