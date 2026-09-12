import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Botao } from '../src/components/Botao';
import { Campo } from '../src/components/Campo';
import { login } from '../src/services/authService';
import { cores } from '../src/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await login({ email: email.trim(), senha });
      router.replace('/');
    } catch (e: any) {
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        setErro('E-mail ou senha incorretos.');
      } else {
        setErro('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={cores.fundo} />

      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={s.titulo}>Entrar</Text>
        <Text style={s.subtitulo}>Acesse seus alertas de preço</Text>

        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Campo
          rotulo="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
          onSubmitEditing={entrar}
          returnKeyType="go"
        />

        {erro !== '' && <Text style={s.erro}>{erro}</Text>}

        <View style={s.espaco}>
          <Botao titulo="Entrar" onPress={entrar} carregando={carregando} />
        </View>

        <Pressable onPress={() => router.push('/cadastro')}>
          <Text style={s.link}>Criar uma conta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  titulo: {
    color: cores.texto,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitulo: {
    color: cores.suave,
    fontSize: 15,
    marginBottom: 32,
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
    marginBottom: 4,
  },
  espaco: {
    marginTop: 14,
    marginBottom: 20,
  },
  link: {
    color: cores.acento,
    fontSize: 15,
    textAlign: 'center',
  },
});