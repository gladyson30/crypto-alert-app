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
import { Botao } from '../../src/components/Botao';
import { Campo } from '../../src/components/Campo';
import { criarAlerta } from '../../src/services/alertaService';
import { cores } from '../../src/theme';
import { Direcao } from '../../src/types';



export default function NovoAlerta() {
  const [moeda, setMoeda] = useState('');
  const [preco, setPreco] = useState('');
  const [direcao, setDirecao] = useState<Direcao>('ACIMA');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

    async function salvar() {
    const nomeMoeda = moeda.trim().toLowerCase();
    const valor = Number(preco.replace(',', '.'));

    if (!nomeMoeda) {
      setErro('Informe a moeda.');
      return;
    }
    if (!valor || valor <= 0) {
      setErro('Informe um preço maior que zero.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await criarAlerta({ moeda: nomeMoeda, precoAlvo: valor, direcao });
      setMoeda('');
      setPreco('');
      router.replace('/alertas');
    } catch (e: any) {
      console.log('ERRO AO CRIAR:', e?.response?.status, e?.response?.data);
      setErro('Não foi possível criar o alerta.');
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
        <Text style={s.titulo}>Novo alerta</Text>
        <Text style={s.subtitulo}>
          Você recebe um e-mail quando o preço chegar ao valor escolhido
        </Text>

        <Campo
          rotulo="Moeda"
          value={moeda}
          onChangeText={setMoeda}
          placeholder="bitcoin"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Campo
          rotulo="Preço alvo (R$)"
          value={preco}
          onChangeText={setPreco}
          placeholder="400000"
          keyboardType="decimal-pad"
        />

        <Text style={s.rotulo}>Avisar quando o preço estiver</Text>

        <View style={s.opcoes}>
          <Pressable
            style={[s.opcao, direcao === 'ACIMA' && s.opcaoAtiva]}
            onPress={() => setDirecao('ACIMA')}
          >
            <Text style={[s.opcaoTexto, direcao === 'ACIMA' && s.opcaoTextoAtivo]}>
              ↑ Acima
            </Text>
          </Pressable>

          <Pressable
            style={[s.opcao, direcao === 'ABAIXO' && s.opcaoAtiva]}
            onPress={() => setDirecao('ABAIXO')}
          >
            <Text style={[s.opcaoTexto, direcao === 'ABAIXO' && s.opcaoTextoAtivo]}>
              ↓ Abaixo
            </Text>
          </Pressable>
        </View>

        {erro !== '' && <Text style={s.erro}>{erro}</Text>}

        <View style={s.espaco}>
          <Botao titulo="Criar alerta" onPress={salvar} carregando={carregando} />
        </View>

        <Pressable onPress={() => router.back()}>
          <Text style={s.cancelar}>Cancelar</Text>
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
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitulo: {
    color: cores.suave,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 32,
  },
  rotulo: {
    color: cores.suave,
    fontSize: 13,
    marginBottom: 10,
  },
  opcoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  opcao: {
    flex: 1,
    backgroundColor: cores.campo,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  opcaoAtiva: {
    borderColor: cores.acento,
    backgroundColor: cores.campo,
  },
  opcaoTexto: {
    color: cores.suave,
    fontSize: 15,
  },
  opcaoTextoAtivo: {
    color: cores.acento,
    fontWeight: '600',
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
    marginBottom: 4,
  },
  espaco: {
    marginTop: 10,
    marginBottom: 20,
  },
  cancelar: {
    color: cores.suave,
    fontSize: 15,
    textAlign: 'center',
  },
});