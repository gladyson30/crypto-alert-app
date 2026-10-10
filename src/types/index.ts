export interface Cripto {
  brl: number;
  usd: number;
}
export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}
export interface LoginRequest {
  email: string;
  senha: string;
}
export type Direcao = 'ACIMA' | 'ABAIXO';

export interface Alerta {
  id: string;
  usuarioId: string;
  moeda: string;
  precoAlvo: number;
  direcao: Direcao;
}

export interface CriarAlertaRequest {
  moeda: string;
  precoAlvo: number;
  direcao: Direcao;
}