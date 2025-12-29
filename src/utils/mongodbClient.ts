const API_BASE_URL = 'http://localhost:5000/api';

// ==================== EXAMS ====================
export const examsAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/exams`);
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/exams/${id}`);
      if (!response.ok) throw new Error('Failed to fetch exam');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(exam: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam),
      });
      if (!response.ok) throw new Error('Failed to create exam');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id: string, exam: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam),
      });
      if (!response.ok) throw new Error('Failed to update exam');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete exam');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// ==================== SUMMARIES ====================
export const summariesAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/summaries`);
      if (!response.ok) throw new Error('Failed to fetch summaries');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/summaries/${id}`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(summary: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/summaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      });
      if (!response.ok) throw new Error('Failed to create summary');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id: string, summary: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/summaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      });
      if (!response.ok) throw new Error('Failed to update summary');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/summaries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete summary');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// ==================== VIDEOS ====================
export const videosAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`);
      if (!response.ok) throw new Error('Failed to fetch video');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(video: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
      if (!response.ok) throw new Error('Failed to create video');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id: string, video: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
      if (!response.ok) throw new Error('Failed to update video');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete video');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// ==================== LIVES ====================
export const livesAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/lives`);
      if (!response.ok) throw new Error('Failed to fetch live sessions');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/lives/${id}`);
      if (!response.ok) throw new Error('Failed to fetch live session');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(live: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/lives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(live),
      });
      if (!response.ok) throw new Error('Failed to create live session');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id: string, live: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/lives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(live),
      });
      if (!response.ok) throw new Error('Failed to update live session');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/lives/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete live session');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
