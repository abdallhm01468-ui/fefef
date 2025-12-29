import { createClient } from '@supabase/supabase-js'

const projectId = "fambaooexrffkkljsnsu"
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhbWJhb29leHJmZmtrbGpzbnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTc2MTAsImV4cCI6MjA4MjU3MzYxMH0.GcdhRcqYmDZvY41BIu8cg_74c8J8Zqgt5zCzpfUBWck"

const supabaseUrl = `https://${projectId}.supabase.co`

export const supabase = createClient(supabaseUrl, publicAnonKey)

// Exams Management
export const examsAPI = {
  async getAll() {
    const { data, error } = await supabase.from('exams').select('*')
    return { data, error }
  },

  async create(exam: any) {
    const { data, error } = await supabase.from('exams').insert([exam]).select()
    return { data, error }
  },

  async update(id: string, exam: any) {
    const { data, error } = await supabase.from('exams').update(exam).eq('id', id).select()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase.from('exams').delete().eq('id', id)
    return { error }
  }
}

// Summaries Management
export const summariesAPI = {
  async getAll() {
    const { data, error } = await supabase.from('summaries').select('*')
    return { data, error }
  },

  async create(summary: any) {
    const { data, error } = await supabase.from('summaries').insert([summary]).select()
    return { data, error }
  },

  async update(id: string, summary: any) {
    const { data, error } = await supabase.from('summaries').update(summary).eq('id', id).select()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase.from('summaries').delete().eq('id', id)
    return { error }
  }
}

// Videos Management
export const videosAPI = {
  async getAll() {
    const { data, error } = await supabase.from('videos').select('*')
    return { data, error }
  },

  async create(video: any) {
    const { data, error } = await supabase.from('videos').insert([video]).select()
    return { data, error }
  },

  async update(id: string, video: any) {
    const { data, error } = await supabase.from('videos').update(video).eq('id', id).select()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase.from('videos').delete().eq('id', id)
    return { error }
  }
}

// Live Sessions Management
export const livesAPI = {
  async getAll() {
    const { data, error } = await supabase.from('live_sessions').select('*')
    return { data, error }
  },

  async create(session: any) {
    const { data, error } = await supabase.from('live_sessions').insert([session]).select()
    return { data, error }
  },

  async update(id: string, session: any) {
    const { data, error } = await supabase.from('live_sessions').update(session).eq('id', id).select()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase.from('live_sessions').delete().eq('id', id)
    return { error }
  }
}

// Categories Management
export const categoriesAPI = {
  async getAll() {
    const { data, error } = await supabase.from('categories').select('*')
    return { data, error }
  },

  async create(category: any) {
    const { data, error } = await supabase.from('categories').insert([category]).select()
    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    return { error }
  }
}
