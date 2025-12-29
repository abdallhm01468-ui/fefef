// ⚠️ DEPRECATED: Supabase no longer used in this project
// =========================================================
// All data operations are now handled through MongoDB backend API:
// - POST /api/summaries
// - POST /api/videos  
// - POST /api/lives
// - POST /api/exams
//
// This file is kept only for backwards compatibility
// Do NOT use this in new code
// =========================================================

import { createClient } from '@supabase/supabase-js'

// Disabled - use MongoDB backend instead
// const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || ""
// const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

const projectId = ""
const publicAnonKey = ""

console.warn('⚠️ Supabase client is disabled. Using MongoDB backend API instead.')

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
