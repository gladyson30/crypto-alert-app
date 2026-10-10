import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert as AlertNativo,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { deletarAlerta, listarAlertas } from '../../src/services/alertaService';
import { cores, fontes } from '../../src/theme';
import { Alerta } from '../../src/types';

function formatarPreco(valor: number) {
  const [inteiro, decimal] = valor.toFixed(2).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${comMilhar},${decimal}`;
}

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const dados = await listarAlertas();
      setAlertas(dados);
      setErro('');
    } catch (e) {
      setErro('Não foi possível carregar seus alertas.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  function confirmarExclusao(alerta: Alerta) {
    AlertNativo.alert(
      'Excluir alerta',
      `Deixar de monitorar ${alerta.moeda}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluir(alerta.id),
        },
      ]
    );
  }

  async function excluir(id: string) {
    const anteriores = alertas;
    setAlertas((atual) => atual.filter((a) => a.id !== id));

    try {
      await deletarAlerta(id);
    } catch (e) {
      setAlertas(anteriores);
      AlertNativo.alert('Erro', 'Não foi possível excluir o alerta.');
    }
  }

  if (carregando) {
    return (
      <View style={[s.tela, s.centro]}>
        <ActivityIndicator color={cores.acento} size="large" />
      </View>
    );
  }

  return (
    <View style={s.tela}>
      <StatusBar barStyle="light-content" backgroundColor={cores.fundo} />

      <View style={s.cabecalho}>
        <Text style={s.titulo}>Seus alertas</Text>
        <Pressable onPress={() => router.push('/novo-alerta')}>
          <Text style={s.novo}>+ Novo</Text>
        </Pressable>
      </View>

      <FlatList
        data={alertas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.lista}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              carregar();
            }}
            tintColor={cores.acento}
          />
        }
        ListEmptyComponent={
          <Text style={s.vazio}>
            {erro !== ''
              ? erro
              : 'Você ainda não tem alertas. Crie um para ser avisado por e-mail quando o preço chegar onde você quer.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardInfo}>
              <Text style={s.moeda}>{item.moeda}</Text>
              <View style={s.linhaPreco}>
                <Text style={s.seta}>
                  {item.direcao === 'ACIMA' ? '↑' : '↓'}
                </Text>
                <Text style={s.preco}>R$ {formatarPreco(item.precoAlvo)}</Text>
              </View>
            </View>

            <Pressable onPress={() => confirmarExclusao(item)} hitSlop={12}>
              <Text style={s.excluir}>Excluir</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: StatusBar.currentHeight ?? 0,
  },
  centro: { justifyContent: 'center', alignItems: 'center' },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  titulo: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: '600',
  },
  novo: {
    color: cores.acento,
    fontSize: 16,
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexGrow: 1,
  },
  vazio: {
    color: cores.suave,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: cores.campo,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  moeda: {
    color: cores.suave,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 6,
  },
  linhaPreco: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seta: {
    color: cores.acento,
    fontSize: 18,
    marginRight: 8,
  },
  preco: {
    color: cores.texto,
    fontSize: 20,
    fontFamily: fontes.mono,
  },
  excluir: {
    color: cores.erro,
    fontSize: 14,
  },
});