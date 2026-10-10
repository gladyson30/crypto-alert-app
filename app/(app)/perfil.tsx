import { router } from 'expo-router';
import {
    Alert as AlertNativo,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { deletarConta, logout } from '../../src/services/authService';
import { cores } from '../../src/theme';

export default function Perfil() {
  function confirmarSaida() {
    AlertNativo.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  }

  function confirmarExclusao() {
    AlertNativo.alert(
      'Excluir conta',
      'Seus alertas serão apagados e esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarConta();
              router.replace('/login');
            } catch (e) {
              AlertNativo.alert('Erro', 'Não foi possível excluir a conta.');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={s.tela}>
      <StatusBar barStyle="light-content" backgroundColor={cores.fundo} />

      <Text style={s.titulo}>Conta</Text>

      <Pressable style={s.item} onPress={confirmarSaida}>
        <Text style={s.itemTexto}>Sair da conta</Text>
      </Pressable>

      <Pressable style={s.item} onPress={confirmarExclusao}>
        <Text style={s.itemPerigo}>Excluir minha conta</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: (StatusBar.currentHeight ?? 0) + 24,
    paddingHorizontal: 24,
  },
  titulo: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 28,
  },
  item: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  itemTexto: {
    color: cores.texto,
    fontSize: 16,
  },
  itemPerigo: {
    color: cores.erro,
    fontSize: 16,
  },
});