import { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { buscarCotacao } from '../../src/services/criptoService';
import { Cripto } from '../../src/types';

export default function Home() {
  const [moeda, setMoeda] = useState('bitcoin');
  const [cotacao, setCotacao] = useState<Cripto | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function consultar() {
    setCarregando(true);
    setErro('');
    setCotacao(null);

    try {
      const dados = await buscarCotacao(moeda.trim().toLowerCase());
      setCotacao(dados);
    } catch (e) {
      setErro('Não foi possível buscar a cotação.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cotação de criptomoedas</Text>

      <TextInput
        style={styles.input}
        value={moeda}
        onChangeText={setMoeda}
        placeholder="bitcoin, ethereum..."
        autoCapitalize="none"
      />

      <Button title="Consultar" onPress={consultar} />

      {carregando && <ActivityIndicator style={styles.espaco} />}

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      {cotacao && (
        <View style={styles.espaco}>
          <Text style={styles.valor}>R$ {cotacao.brl.toLocaleString('pt-BR')}</Text>
          <Text style={styles.valor}>US$ {cotacao.usd.toLocaleString('en-US')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  espaco: { marginTop: 24 },
  valor: { fontSize: 20, textAlign: 'center', marginBottom: 8 },
  erro: { color: 'red', marginTop: 16, textAlign: 'center' },
});