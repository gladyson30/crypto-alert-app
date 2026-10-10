import * as SecureStore from 'expo-secure-store';
import { CadastroRequest, LoginRequest } from '../types';
import { api } from './api';

const CHAVE_TOKEN = 'token';

export async function cadastrar(dados: CadastroRequest): Promise<void> {
  await api.post('/usuarios', dados);
}

export async function login(dados: LoginRequest): Promise<void> {
  const response = await api.post('/usuarios/login', dados);
  await SecureStore.setItemAsync(CHAVE_TOKEN, String(response.data).trim());
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}

export async function obterToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function estaAutenticado(): Promise<boolean> {
  const token = await obterToken();
  return token !== null && token !== '';
}
export async function deletarConta(): Promise<void> {
  await api.delete('/usuarios/deletar');
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}