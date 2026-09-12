import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../theme';

type Props = {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
};

export function Botao({ titulo, onPress, carregando }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [s.botao, pressed && s.pressionado]}
      onPress={onPress}
      disabled={carregando}
    >
      {carregando ? (
        <ActivityIndicator color={cores.fundo} />
      ) : (
        <Text style={s.texto}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  botao: {
    backgroundColor: cores.acento,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  pressionado: { opacity: 0.75 },
  texto: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },
});