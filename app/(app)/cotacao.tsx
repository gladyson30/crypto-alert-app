import { buscarCotacao } from '../../src/services/criptoService';
import { cores, fontes } from '../../src/theme';
import { Cripto } from '../../src/types';

import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function formatar(valor: number, padrao: 'br' | 'us') {
  const [inteiro, decimal] = valor.toFixed(2).split('.');
  const milhar = padrao === 'br' ? '.' : ',';
  const virgula = padrao === 'br' ? ',' : '.';
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, milhar);
  return `${comMilhar}${virgula}${decimal}`;
}

export default function Cotacao() {
  const [moeda, setMoeda] = useState('');
  const [consultada, setConsultada] = useState('');
  const [cotacao, setCotacao] = useState<Cripto | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function consultar() {
    const termo = moeda.trim().toLowerCase();
    if (!termo) return;

    setCarregando(true);
    setErro('');
    setCotacao(null);

    try {
      const dados = await buscarCotacao(termo);
      setCotacao(dados);
      setConsultada(termo);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setErro(`Não encontramos "${termo}". Tente bitcoin ou ethereum.`);
      } else {
        setErro('Sem conexão com o servidor.');
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

      <View style={s.painel}>
        {carregando && <ActivityIndicator color={cores.acento} size="large" />}

        {!carregando && cotacao && (
          <>
            <Text style={s.moedaNome}>{consultada}</Text>

            <View style={s.linhaValor}>
              <Text style={s.simbolo}>R$</Text>
              <Text style={s.principal}>{formatar(cotacao.brl, 'br')}</Text>
            </View>

            <View style={s.linhaSecundaria}>
              <Text style={s.simboloSec}>US$</Text>
              <Text style={s.secundario}>{formatar(cotacao.usd, 'us')}</Text>
            </View>
          </>
        )}

        {!carregando && !cotacao && !erro && (
          <Text style={s.vazio}>Digite uma moeda para ver a cotação</Text>
        )}

        {!carregando && erro !== '' && <Text style={s.erro}>{erro}</Text>}
      </View>

      <View style={s.rodape}>
        <TextInput
          style={s.input}
          value={moeda}
          onChangeText={setMoeda}
          onSubmitEditing={consultar}
          placeholder="bitcoin"
          placeholderTextColor={cores.suave}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        <Pressable
          style={({ pressed }) => [s.botao, pressed && s.botaoPressionado]}
          onPress={consultar}
        >
          <Text style={s.botaoTexto}>Consultar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  painel: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  moedaNome: {
    color: cores.suave,
    fontSize: 13,
    letterSpacing: 3,
    marginBottom: 14,
  },
  linhaValor: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  simbolo: {
    color: cores.acento,
    fontSize: 20,
    fontFamily: fontes.mono,
    marginRight: 8,
  },
  principal: {
    color: cores.texto,
    fontSize: 46,
    fontFamily: fontes.mono,
    letterSpacing: -1,
  },
  linhaSecundaria: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 10,
  },
  simboloSec: {
    color: cores.suave,
    fontSize: 13,
    fontFamily: fontes.mono,
    marginRight: 6,
  },
  secundario: {
    color: cores.suave,
    fontSize: 22,
    fontFamily: fontes.mono,
  },
  vazio: {
    color: cores.suave,
    fontSize: 15,
    lineHeight: 22,
  },
  erro: {
    color: cores.erro,
    fontSize: 15,
    lineHeight: 22,
  },
  rodape: {
    paddingHorizontal: 28,
    paddingBottom: 34,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  input: {
    backgroundColor: cores.campo,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: cores.texto,
    fontSize: 16,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: cores.acento,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  botaoPressionado: {
    opacity: 0.75,
  },
  botaoTexto: {
    color: cores.fundo,
    fontSize: 16,
    fontWeight: '600',
  },
});