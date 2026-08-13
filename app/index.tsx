import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  Animated,
} from 'react-native';

type Player = 'X' | 'O' | null;

export default function Index() {
  const { width, height } = useWindowDimensions();

  const tamanhoTabuleiro = Math.min(
    width - 40,
    height < 700 ? 270 : 320
  );

  const [tabuleiro, setTabuleiro] = useState<Player[]>(
    Array(9).fill(null)
  );

  const [jogadorAtual, setJogadorAtual] =
    useState<'X' | 'O'>('X');

  const [mensagem, setMensagem] =
    useState('Vez do jogador X');

  const [vencedor, setVencedor] =
    useState<Player>(null);

  const [casasVencedoras, setCasasVencedoras] =
    useState<number[]>([]);

  const [placar, setPlacar] = useState({
    X: 0,
    O: 0,
    empate: 0,
  });

  const [partidas, setPartidas] = useState(0);

  const [ultimaJogada, setUltimaJogada] =
    useState<number | null>(null);

  const animacao = useRef(
    new Animated.Value(0)
  ).current;

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

  useEffect(() => {
    if (ultimaJogada !== null) {
      animacao.setValue(0);

      Animated.spring(animacao, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [ultimaJogada]);

  const verificarVencedor = (
    quadrados: Player[]
  ): {
    jogador: Player;
    combinacao: number[];
  } => {
    for (const combinacao of combinacoesVitoria) {
      const [a, b, c] = combinacao;

      if (
        quadrados[a] &&
        quadrados[a] === quadrados[b] &&
        quadrados[a] === quadrados[c]
      ) {
        return {
          jogador: quadrados[a],
          combinacao,
        };
      }
    }

    return {
      jogador: null,
      combinacao: [],
    };
  };

  const jogar = (indice: number) => {
    if (vencedor) return;

    if (tabuleiro[indice] !== null) return;

    const novoTabuleiro = [...tabuleiro];

    novoTabuleiro[indice] = jogadorAtual;

    setTabuleiro(novoTabuleiro);
    setUltimaJogada(indice);

    const resultado =
      verificarVencedor(novoTabuleiro);

    if (resultado.jogador) {
      setVencedor(resultado.jogador);

      setCasasVencedoras(
        resultado.combinacao
      );

      setMensagem(
        `Jogador ${resultado.jogador} venceu!`
      );

      setPlacar((placarAtual) => ({
        ...placarAtual,
        [resultado.jogador!]:
          placarAtual[resultado.jogador!] + 1,
      }));

      setPartidas(
        (partidasAtuais) => partidasAtuais + 1
      );

      return;
    }

    if (
      novoTabuleiro.every(
        (celula) => celula !== null
      )
    ) {
      setMensagem('Deu empate!');

      setPlacar((placarAtual) => ({
        ...placarAtual,
        empate: placarAtual.empate + 1,
      }));

      setPartidas(
        (partidasAtuais) => partidasAtuais + 1
      );

      return;
    }

    const proximoJogador =
      jogadorAtual === 'X' ? 'O' : 'X';

    setJogadorAtual(proximoJogador);

    setMensagem(
      `Vez do jogador ${proximoJogador}`
    );
  };

  const reiniciarJogo = () => {
    setTabuleiro(Array(9).fill(null));
    setJogadorAtual('X');
    setMensagem('Vez do jogador X');
    setVencedor(null);
    setCasasVencedoras([]);
    setUltimaJogada(null);
  };

  const zerarPlacar = () => {
    setPlacar({
      X: 0,
      O: 0,
      empate: 0,
    });

    setPartidas(0);

    reiniciarJogo();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudo}>

          {/* TOPO */}

          <View style={styles.linhaDecorativa}>
            <View style={styles.linha} />

            <Text style={styles.diamante}>
              ✦
            </Text>

            <View style={styles.linha} />
          </View>

          <Text
            style={[
              styles.titulo,
              height < 650 &&
                styles.tituloPequeno,
            ]}
          >
            JOGO DA VELHA
          </Text>

          <Text style={styles.subtitulo}>
            X  •  VS  •  O
          </Text>

          {/* PLACAR */}

          <View
            style={[
              styles.placar,
              {
                width: Math.min(
                  width - 40,
                  350
                ),
              },
            ]}
          >

            <View style={styles.placarItem}>
              <View style={styles.bolinhaX}>
                <Text style={styles.simboloX}>
                  X
                </Text>
              </View>

              <Text style={styles.numeroPlacar}>
                {placar.X}
              </Text>

              <Text style={styles.nomePlacar}>
                Jogador X
              </Text>
            </View>

            <View style={styles.linhaPlacar} />

            <View style={styles.placarItem}>
              <View style={styles.bolinhaEmpate}>
                <Text style={styles.simboloEmpate}>
                  =
                </Text>
              </View>

              <Text style={styles.numeroPlacar}>
                {placar.empate}
              </Text>

              <Text style={styles.nomePlacar}>
                Empates
              </Text>
            </View>

            <View style={styles.linhaPlacar} />

            <View style={styles.placarItem}>
              <View style={styles.bolinhaO}>
                <Text style={styles.simboloO}>
                  O
                </Text>
              </View>

              <Text style={styles.numeroPlacar}>
                {placar.O}
              </Text>

              <Text style={styles.nomePlacar}>
                Jogador O
              </Text>
            </View>
          </View>

          {/* PARTIDAS */}

          <View style={styles.partidasContainer}>
            <Text style={styles.partidasTexto}>
              PARTIDAS
            </Text>

            <Text style={styles.partidasNumero}>
              {partidas}
            </Text>
          </View>

          {/* MENSAGEM */}

          <View
            style={[
              styles.mensagemContainer,
              vencedor
                ? styles.mensagemVitoria
                : styles.mensagemNormal,
            ]}
          >
            {vencedor ? (
              <Text style={styles.mensagemVitoriaTexto}>
                🏆 {vencedor} VENCEU!
              </Text>
            ) : (
              <>
                <View
                  style={[
                    styles.indicador,
                    jogadorAtual === 'X'
                      ? styles.indicadorX
                      : styles.indicadorO,
                  ]}
                />

                <Text style={styles.mensagem}>
                  {mensagem}
                </Text>
              </>
            )}
          </View>

          {/* TABULEIRO */}

          <View
            style={[
              styles.tabuleiro,
              {
                width: tamanhoTabuleiro,
                height: tamanhoTabuleiro,
              },
            ]}
          >
            {tabuleiro.map((celula, indice) => {
              const casaVencedora =
                casasVencedoras.includes(
                  indice
                );

              const estaAnimando =
                ultimaJogada === indice;

              return (
                <TouchableOpacity
                  key={indice}
                  activeOpacity={0.75}
                  onPress={() => jogar(indice)}
                  style={[
                    styles.celula,
                    casaVencedora &&
                      styles.celulaVencedora,
                  ]}
                >
                  {estaAnimando && celula ? (
                    <Animated.Text
                      style={[
                        styles.textoCelula,
                        {
                          fontSize:
                            tamanhoTabuleiro *
                            0.17,

                          transform: [
                            {
                              scale:
                                animacao,
                            },
                          ],
                        },

                        celula === 'X' &&
                          styles.textoX,

                        celula === 'O' &&
                          styles.textoO,
                      ]}
                    >
                      {celula}
                    </Animated.Text>
                  ) : (
                    <Text
                      style={[
                        styles.textoCelula,
                        {
                          fontSize:
                            tamanhoTabuleiro *
                            0.17,
                        },

                        celula === 'X' &&
                          styles.textoX,

                        celula === 'O' &&
                          styles.textoO,
                      ]}
                    >
                      {celula}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BOTÕES */}

          <View style={styles.botoes}>
            <TouchableOpacity
              style={styles.botao}
              activeOpacity={0.8}
              onPress={reiniciarJogo}
            >
              <Text style={styles.textoBotao}>
                ↻ Nova Partida
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoSecundario}
              activeOpacity={0.8}
              onPress={zerarPlacar}
            >
              <Text
                style={styles.textoBotaoSecundario}
              >
                Limpar placar
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  /* FUNDO */

  container: {
    flex: 1,
    backgroundColor: '#F6F3F4',
  },

  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  conteudo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  /* TOPO */

  linhaDecorativa: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  linha: {
    flex: 1,
    height: 2,
    backgroundColor: '#D8C7CE',
  },

  diamante: {
    color: '#D85F91',
    fontSize: 15,
    marginHorizontal: 8,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 2,
    textAlign: 'center',
  },

  tituloPequeno: {
    fontSize: 26,
  },

  subtitulo: {
    fontSize: 15,
    color: '#333333',
    marginTop: 4,
    marginBottom: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },

  /* PLACAR */

  placar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,

    borderWidth: 1,
    borderColor: '#E2D5DA',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  placarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 65,
  },

  linhaPlacar: {
    width: 1,
    height: 50,
    backgroundColor: '#E1D7DB',
  },

  bolinhaX: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FBE5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bolinhaO: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bolinhaEmpate: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#F1E9EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  simboloX: {
    fontSize: 19,
    fontWeight: '900',
    color: '#D65388',
  },

  simboloO: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111111',
  },

  simboloEmpate: {
    fontSize: 17,
    fontWeight: '900',
    color: '#555555',
  },

  numeroPlacar: {
    fontSize: 21,
    fontWeight: '900',
    color: '#111111',
    marginTop: 2,
  },

  nomePlacar: {
    color: '#333333',
    fontSize: 10,
    fontWeight: '700',
  },

  /* PARTIDAS */

  partidasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E7EA',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  partidasTexto: {
    color: '#333333',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginRight: 7,
  },

  partidasNumero: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '900',
  },

  /* MENSAGEM */

  mensagemContainer: {
    minWidth: 190,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 13,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mensagemNormal: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0D3D8',
  },

  mensagemVitoria: {
    backgroundColor: '#F7DDE7',
    borderWidth: 1,
    borderColor: '#D85F91',
  },

  indicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  indicadorX: {
    backgroundColor: '#D65388',
  },

  indicadorO: {
    backgroundColor: '#111111',
  },

  mensagem: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },

  mensagemVitoriaTexto: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },

  /* TABULEIRO */

  tabuleiro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#D65388',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 3,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
  },

  celula: {
    width: '33.3333%',
    height: '33.3333%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D65388',
  },

  celulaVencedora: {
    backgroundColor: '#F9D6E3',
  },

  textoCelula: {
    fontWeight: '900',
  },

  textoX: {
    color: '#D65388',
  },

  textoO: {
    color: '#111111',
  },

  /* BOTÕES */

  botoes: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },

  botao: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: '#111111',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  botaoSecundario: {
    width: '100%',
    maxWidth: 330,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 11,
    borderRadius: 16,
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#D65388',
  },

  textoBotaoSecundario: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '900',
  },

  /* RODAPÉ */

  rodape: {
    color: '#444444',
    fontSize: 10,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '700',
  },
});