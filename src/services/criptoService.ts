import { Cripto } from '../types';
import { api } from './api';

export async function buscarCotacao(moeda: string): Promise<Cripto> {
  const response = await api.get<Cripto>(`/cripto/${moeda}`);
  return response.data;
}