import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/quiz/generate/', // Adjust this based on your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Quiz service functions
const quizService = {
  // Generate a new quiz
  generateQuiz: async (formData) => {
    try {
      const response = await api.post('/generate-quiz/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to generate quiz' };
    }
  },
  
  // Get all quizzes for the current user
  getUserQuizzes: async () => {
    try {
      const response = await api.get('/quizzes/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch quizzes' };
    }
  },
  
  // Get a specific quiz by ID
  getQuizById: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch quiz' };
    }
  },
  
  // Submit quiz answers and get results
  submitQuizAnswers: async (quizId, answers) => {
    try {
      const response = await api.post(`/quizzes/${quizId}/submit/`, { answers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to submit answers' };
    }
  },
};

export default quizService;