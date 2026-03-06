import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchQuizzes, fetchQuizById, createQuiz, updateQuiz, deleteQuiz,
         fetchAdminQuizzes, fetchQuizAnalytics } from '../services/quizService.js';
import toast from 'react-hot-toast';

export const useQuizzes = (params) =>
  useQuery({ queryKey: ['quizzes', params], queryFn: () => fetchQuizzes(params) });

export const useQuiz = (id) =>
  useQuery({ queryKey: ['quiz', id], queryFn: () => fetchQuizById(id), enabled: !!id });

export const useAdminQuizzes = () =>
  useQuery({ queryKey: ['adminQuizzes'], queryFn: fetchAdminQuizzes });

export const useQuizAnalytics = (id) =>
  useQuery({ queryKey: ['analytics', id], queryFn: () => fetchQuizAnalytics(id), enabled: !!id });

export const useCreateQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createQuiz,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quizzes'] }); qc.invalidateQueries({ queryKey: ['adminQuizzes'] }); toast.success('Quiz created!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create quiz'),
  });
};

export const useUpdateQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateQuiz,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quizzes'] }); qc.invalidateQueries({ queryKey: ['adminQuizzes'] }); toast.success('Quiz updated!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update quiz'),
  });
};

export const useDeleteQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quizzes'] }); qc.invalidateQueries({ queryKey: ['adminQuizzes'] }); toast.success('Quiz deleted!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete quiz'),
  });
};
