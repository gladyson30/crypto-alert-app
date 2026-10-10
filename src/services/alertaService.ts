import { Alerta, CriarAlertaRequest } from '../types';
import { api } from './api';

export async function listarAlertas(): Promise<Alerta[]> {
  const response = await api.get<Alerta[]>('/alerta');
  return response.data;
}

export async function criarAlerta(dados: CriarAlertaRequest): Promise<void> {
  await api.post('/alerta', dados);
}

export async function deletarAlerta(id: string): Promise<void> {
  await api.delete(`/alerta/${id}`);
}