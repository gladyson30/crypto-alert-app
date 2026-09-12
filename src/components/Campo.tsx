import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores } from '../theme';

type Props = TextInputProps & {
  rotulo: string;
};

export function Campo({ rotulo, ...props }: Props) {
  return (
    <View style={s.wrapper}>
      <Text style={s.rotulo}>{rotulo}</Text>
      <TextInput
        style={s.input}
        placeholderTextColor={cores.suave}
        {...props}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { marginBottom: 18 },
  rotulo: {
    color: cores.suave,
    fontSize: 13,
    marginBottom: 7,
  },
  input: {
    backgroundColor: cores.campo,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: cores.texto,
    fontSize: 16,
  },
});