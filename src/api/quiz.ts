import { api } from './client';
import type { QuizAnswer, QuizQuestion, QuizSubmitResult } from '../types';

export const quizApi = {
  async questions(quizId: string) {
    const { data } = await api.get<QuizQuestion[]>(`/quiz/${quizId}/questions`);
    return data;
  },

  async submit(quizId: string, answers: QuizAnswer[]) {
    const { data } = await api.post<QuizSubmitResult>(`/quiz/${quizId}/submit`, {
      answers,
    });
    return data;
  },
};
