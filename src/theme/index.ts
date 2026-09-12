import { Platform } from 'react-native';

export const cores = {
  fundo: '#0F1524',
  campo: '#1A2136',
  borda: '#2A3350',
  texto: '#F2F0EB',
  suave: '#7C87A3',
  acento: '#E8B04B',
  erro: '#E07A5F',
};

export const fontes = {
  mono: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
};