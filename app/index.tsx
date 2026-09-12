import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { estaAutenticado } from '../src/services/authService';
import { cores } from '../src/theme';


export default function Entrada() {
  useEffect(() => {
    async function verificar() {
      const autenticado = await estaAutenticado();
      router.replace(autenticado ? '/cotacao' : '/login');
    }
    verificar();
  }, []);

  return (
    <View style={s.tela}>
      <ActivityIndicator color={cores.acento} size="large" />
    </View>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
});