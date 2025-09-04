import axios, { AxiosProgressEvent } from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
}

export const usersAPI = {
  getAll: () => api.get('/users'),
  getTeachers: () => api.get('/users/teachers'),
  getAdmins: () => api.get('/users/admins'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export const classesAPI = {
  getAll: () => api.get('/classes'),
  getMyClasses: () => api.get('/classes/my-classes'),
  getOne: (id: string) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: string, data: any) => api.patch(`/classes/${id}`, data),
  delete: (id: string) => api.delete(`/classes/${id}`),
  count: () => api.get('/classes/count'),
}

export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
}

export const materialsAPI = {
  uploadStudy: (formData: FormData, onProgress?: (e: AxiosProgressEvent) => void) => api.post('/materials/study', formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: onProgress }),
  uploadAnswers: (formData: FormData) => api.post('/materials/answers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  listStudy: (params: { class?: string; subject?: string; q?: string; page?: number; limit?: number }) =>
    api.get('/materials/study', { params: { ...params, _t: Date.now() } }),
}

export const questionsAPI = {
  generate: (examId: string, payload: { 
    maxMarks: number; 
    weightage: { mcq: number; short: number; long: number }; 
    marksPerQuestion?: { mcq: number; short: number; long: number };
    questionCounts?: { mcqCount: number; shortCount: number; longCount: number };
    context?: string; 
    classId?: string; 
    subjectId?: string; 
    title?: string; 
    duration?: number; 
    materialId?: string; 
    vectorCollectionID?: string; 
    collectionId?: string 
  }) =>
    api.post(`/questions/generate/${examId}`, payload),
  byExam: (examId: string) => api.get(`/questions/by-exam/${examId}`),
  pdf: (examId: string) => api.get(`/questions/pdf/${examId}`, { responseType: 'blob' }),
  update: (id: string, body: any) => api.post(`/questions/update/${id}`, body),
  regenerate: (id: string) => api.post(`/questions/regenerate/${id}`, {}),
}

export const examsAPI = {
  list: (params: { q?: string; page?: number; limit?: number }) => api.get('/exams', { params }),
}
