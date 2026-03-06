import { useQuery, useMutation } from '@tanstack/react-query';
import { submitAttempt, fetchLeaderboard, fetchHistory } from '../services/quizService.js';
import toast from 'react-hot-toast';

export const useSubmitAttempt = () =>
  useMutation({
    mutationFn: submitAttempt,
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit quiz'),
  });

export const useLeaderboard = (quizId) =>
  useQuery({ queryKey: ['leaderboard', quizId], queryFn: () => fetchLeaderboard(quizId), enabled: !!quizId });

export const useHistory = (params) =>
  useQuery({ queryKey: ['history', params], queryFn: () => fetchHistory(params) });
