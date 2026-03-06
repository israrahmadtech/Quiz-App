import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchQuestions, fetchQuestionsAdmin, addQuestion, deleteQuestion } from '../services/quizService.js';
import toast from 'react-hot-toast';

export const useQuestions = (quizId) =>
  useQuery({ queryKey: ['questions', quizId], queryFn: () => fetchQuestions(quizId), enabled: !!quizId });

export const useQuestionsAdmin = (quizId) =>
  useQuery({ queryKey: ['questionsAdmin', quizId], queryFn: () => fetchQuestionsAdmin(quizId), enabled: !!quizId });

export const useAddQuestion = (quizId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addQuestion,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['questionsAdmin', quizId] }); qc.invalidateQueries({ queryKey: ['quiz', quizId] }); toast.success('Question added!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add question'),
  });
};

export const useDeleteQuestion = (quizId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['questionsAdmin', quizId] }); qc.invalidateQueries({ queryKey: ['quiz', quizId] }); toast.success('Question deleted!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete question'),
  });
};
