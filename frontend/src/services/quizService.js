import api from './api.js';

export const fetchQuizzes = async (params = {}) => {
  const { data } = await api.get('/quizzes', { params });
  return data;
};

export const fetchQuizById = async (id) => {
  const { data } = await api.get(`/quizzes/${id}`);
  return data;
};

export const createQuiz = async (formData) => {
  const { data } = await api.post('/quizzes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateQuiz = async ({ id, formData }) => {
  const { data } = await api.put(`/quizzes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteQuiz = async (id) => {
  const { data } = await api.delete(`/quizzes/${id}`);
  return data;
};

export const fetchAdminQuizzes = async () => {
  const { data } = await api.get('/quizzes/admin/all');
  return data;
};

export const fetchQuizAnalytics = async (id) => {
  const { data } = await api.get(`/quizzes/${id}/analytics`);
  return data;
};

export const fetchQuestions = async (quizId) => {
  const { data } = await api.get(`/questions/${quizId}`);
  return data;
};

export const fetchQuestionsAdmin = async (quizId) => {
  const { data } = await api.get(`/questions/${quizId}/admin`);
  return data;
};

export const addQuestion = async (formData) => {
  const { data } = await api.post('/questions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateQuestion = async ({ id, formData }) => {
  const { data } = await api.put(`/questions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteQuestion = async (id) => {
  const { data } = await api.delete(`/questions/${id}`);
  return data;
};

export const submitAttempt = async (attemptData) => {
  const { data } = await api.post('/attempt', attemptData);
  return data;
};

export const fetchLeaderboard = async (quizId) => {
  const { data } = await api.get(`/leaderboard/${quizId}`);
  return data;
};

export const fetchHistory = async (params = {}) => {
  const { data } = await api.get('/history', { params });
  return data;
};
