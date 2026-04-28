// Factory
function createPlayer(name, marca, idPontuacao) {
  return {
    name: name,
    marca: marca,
    pontuacao: 0,
    idPontuacao: idPontuacao,
  };
}

//IIFE (execução sozinha)
const Gameboard = (function () {
  let board = Array(9).fill("");

  return {
    mostrarBoard() {
      return board;
    },
    fazerJogada(jogada, posicao) {
      if (board[posicao] == "") {
        board[posicao] = jogada;
      } else {
        console.log(`Posição inválida`);
      }
    },
    limparBoard() {
      board = Array(9).fill("");
    },
  };
})();

//IIFE Controlador da tela
const displayController = (function () {
  const slots = document.querySelectorAll(".slot");
  return {
    displayNaTela() {
      const board = Gameboard.mostrarBoard();
      slots.forEach(function (slot, indice) {
        slot.textContent = board[indice];
      });
    },
    jogadaSlot() {
      slots.forEach(function (slot, indice) {
        slot.addEventListener("click", function () {
          fluxoDoJogo.gerenciarTurnos(indice);
        });
      });
    },
    resetar() {
      const botaoReset = document.getElementById("botao-reset");
      if (botaoReset) {
        botaoReset.addEventListener("click", function () {
          fluxoDoJogo.reiniciarJogo();
          document.getElementById("mensagemX").classList.remove("ativa");
          displayController.displayNaTela();
          /**/
          document.getElementById("pontuacao1").textContent = 0;
          document.getElementById("pontuacao2").textContent = 0;
        });
      }
    },
    pegarDoModal() {
      const modal = document.getElementById("modal");

      const botaoIniciar = document.getElementById("botao-iniciar");
      if (botaoIniciar) {
        botaoIniciar.addEventListener("click", function () {
          const nome1 = document.getElementById("nome1").value || "Jogador 1";
          const nome2 = document.getElementById("nome2").value || "Jogador 2";
          /**/
          document.getElementById("jogador1").textContent = nome1 + ":";
          document.getElementById("jogador2").textContent = nome2 + ":";
          /**/
          fluxoDoJogo.iniciarJogadores(nome1, nome2);
          modal.classList.add("escondido");
        });
      }
    },
    adicionarPonto(jogadorAtual) {
      jogadorAtual.pontuacao++;
      document.getElementById(jogadorAtual.idPontuacao).textContent =
        jogadorAtual.pontuacao;
    },
    contagemNaTela() {
      let tempo = 3;
      document.getElementById("contagem").textContent = tempo + "s";
      const intervalo = setInterval(function () {
        tempo--;
        document.getElementById("contagem").textContent = tempo + "s";
        if (tempo <= 0) {
          clearInterval(intervalo);
          document.querySelector(".mensagem-vitoria").classList.remove("ativa");
          fluxoDoJogo.reiniciarRodada();
          displayController.displayNaTela();
        }
      }, 1000);
    },
  };
})();

//IIFE Controlador do jogo
const fluxoDoJogo = (function () {
  let jogador1;
  let jogador2;
  let jogadorAtual;
  let jogoAtivo = false;

  const boardCheck = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];

  return {
    iniciarJogadores(nome1, nome2) {
      jogador1 = createPlayer(nome1, "x", "pontuacao1");
      jogador2 = createPlayer(nome2, "o", "pontuacao2");
      jogadorAtual = jogador1;
      jogoAtivo = true;
    },
    gerenciarTurnos(posicao) {
      if (!jogoAtivo) return;

      const board = Gameboard.mostrarBoard();
      if (board[posicao] !== "") return; // posição já ocupada

      Gameboard.fazerJogada(jogadorAtual.marca, posicao);
      displayController.displayNaTela();

      //se vhouver vitória, se empatar, se nao houver nenhum nem outro
      if (this.vitoriaNoTabuleiro(board)) {
        /**/
        document.getElementById("mensagem").textContent =
          jogadorAtual.name + " Venceu!";
        displayController.adicionarPonto(jogadorAtual);
        console.log(`Jogador ${jogadorAtual.name} venceu`);
        /**/
        jogoAtivo = false;
        document.getElementById("mensagemX").style.background =
          "linear-gradient(90deg, #2c9b5a, #454448)";
        document.getElementById("mensagemX").classList.add("ativa");
        /**/
        displayController.contagemNaTela();
        /**/
      } else if (this.empateNoTabuleiro(board)) {
        /**/
        document.getElementById("mensagem").textContent = "Empate";
        console.log("Empate");
        /**/
        jogoAtivo = false;
        document.getElementById("mensagemX").style.background =
          "linear-gradient(90deg, #d5b61d, #454448)";
        document.getElementById("mensagemX").classList.add("ativa");
        /**/
        displayController.contagemNaTela();
        /**/
      } else {
        //troca de jogador
        jogadorAtual = jogadorAtual == jogador1 ? jogador2 : jogador1;
      }
    },
    vitoriaNoTabuleiro(board) {
      //Se o tabuleiro bater com alguma combinação de vitoria
      return boardCheck.some(function (combinacao) {
        if (
          board[combinacao[0]] == jogadorAtual.marca &&
          board[combinacao[1]] == jogadorAtual.marca &&
          board[combinacao[2]] == jogadorAtual.marca
        ) {
          return true;
        }
      });
    },
    empateNoTabuleiro(board) {
      //retorna se tem empate ou nao
      let empate = board.every(function (posicao) {
        return posicao != "";
      });
      return empate;
    },
    reiniciarRodada() {
      Gameboard.limparBoard();
      jogadorAtual = jogador1;
      jogoAtivo = true;
    },
    reiniciarJogo() {
      Gameboard.limparBoard();
      jogadorAtual = jogador1;
      jogador1.pontuacao = 0;
      jogador2.pontuacao = 0;
      jogoAtivo = true;
    },
  };
})();

//Chamadas
displayController.pegarDoModal();
displayController.displayNaTela();
displayController.resetar();
displayController.jogadaSlot();
