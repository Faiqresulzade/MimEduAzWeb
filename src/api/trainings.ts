import { api } from './client';
import type {
  CreateTrainingRequest,
  MyTraining,
  Training,
  TrainingDetail,
} from '../types';

export const trainingsApi = {
  async list() {
    const { data } = await api.get<Training[]>('/trainings');
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<TrainingDetail>(`/trainings/${id}`);
    return data;
  },

  async mine() {
    const { data } = await api.get<MyTraining[]>('/trainings/mine');
    return data;
  },

  async create(payload: CreateTrainingRequest) {
    const { data } = await api.post<TrainingDetail>('/trainings', payload);
    return data;
  },
};
