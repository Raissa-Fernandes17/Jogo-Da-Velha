import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

type Player = 'X' | 'O' | null;

export default function App() {
  const [tabuleiro, setTabuleiro] = useState<Player[]>(
    Array(9).fill(null)
  );

  const [jogadorAtual, setJogadorAtual] = useState<'X' | 'O'>('X');

  const [mensagem, setMensagem] = useState('Vez do jogador X');

  // Verifica quem venceu
  const verificarVencedor = (quadrado: Player[]): Player => {
    const combinacoesVitoria = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of combinacoesVitoria) {
      if (
        quadrado[a] &&
        quadrado[a] === quadrado[b] &&
        quadrado[a] === quadrado[c]
      ) {
        return quadrado[a];
      }
    }

    return null;
  };

  // Quando clicar em uma casa
  const jogar = (indice: number) => {
    // Se a casa já estiver ocupada, não faz nada
    if (tabuleiro[indice] !== null) {
      return;
    }

    // Cria uma cópia do tabuleiro
    const novoTabuleiro = [...tabuleiro];

    // Coloca X ou O
    novoTabuleiro[indice] = jogadorAtual;

    // Atualiza o tabuleiro
    setTabuleiro(novoTabuleiro);

    // Verifica se alguém ganhou
    const vencedor = verificarVencedor(novoTabuleiro);

    if (vencedor) {
      setMensagem(`Jogador ${vencedor} venceu!`);
      return;
    }

    // Verifica empate
    if (novoTabuleiro.every((celula) => celula !== null)) {
      setMensagem('Empate!');
      return;
    }

    // Troca o jogador
    const proximoJogador = jogadorAtual === 'X' ? 'O' : 'X';

    setJogadorAtual(proximoJogador);
    setMensagem(`Vez do jogador ${proximoJogador}`);
  };

  // Reinicia o jogo
  const reiniciarJogo = () => {
    setTabuleiro(Array(9).fill(null));
    setJogadorAtual('X');
    setMensagem('Vez do jogador X');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>🎮 Jogo da Velha</Text>

      <Text style={styles.mensagem}>{mensagem}</Text>

      <View style={styles.tabuleiro}>
        {tabuleiro.map((celula, indice) => (
          <TouchableOpacity
            key={indice}
            style={styles.celula}
            onPress={() => jogar(indice)}
          >
            <Text style={styles.textoCelula}>
              {celula}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={reiniciarJogo}
      >
        <Text style={styles.textoBotao}>
          Reiniciar Jogo
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  mensagem: {
    fontSize: 20,
    marginBottom: 25,
  },

  tabuleiro: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  celula: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoCelula: {
    fontSize: 50,
    fontWeight: 'bold',
  },

  botao: {
    marginTop: 30,
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});