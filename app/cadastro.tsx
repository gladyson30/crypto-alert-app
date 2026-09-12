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
import { cadastrar } from '../src/services/authService';
import { cores } from '../src/theme';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function validar(): string {
    if (!nome.trim()) return 'Informe seu nome.';
    if (!email.trim()) return 'Informe seu e-mail.';
    if (!email.includes('@')) return 'E-mail inválido.';
    if (senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
    if (senha.length > 16) return 'A senha pode ter no máximo 16 caracteres.';
    return '';
  }

  async function enviar() {
    const problema = validar();
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await cadastrar({ nome: nome.trim(), email: email.trim(), senha });
      router.replace('/login');
    } catch (e: any) {
      if (e?.response?.status === 409) {
        setErro('Este e-mail já está cadastrado.');
      } else {
        setErro('Não foi possível criar a conta. Tente novamente.');
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
        <Text style={s.titulo}>Criar conta</Text>
        <Text style={s.subtitulo}>
          Cadastre-se para criar alertas de preço
        </Text>

        <Campo
          rotulo="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome"
        />

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
          placeholder="8 a 16 caracteres"
          secureTextEntry
          autoCapitalize="none"
        />

        {erro !== '' && <Text style={s.erro}>{erro}</Text>}

        <View style={s.espaco}>
          <Botao titulo="Criar conta" onPress={enviar} carregando={carregando} />
        </View>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={s.link}>Já tenho conta</Text>
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