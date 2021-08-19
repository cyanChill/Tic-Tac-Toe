/* DOM Elements Module */
const DOMElements = (function () {
  const startScreen = document.getElementById("start-screen");
  const pve = document.getElementById("player-ai");
  const pveInputs = pve.querySelectorAll("input");
  const pvp = document.getElementById("player-player");
  const pvpInputs = pvp.querySelectorAll("input");
  const startBtn = document.getElementById("start-btn");

  const gameScreen = document.getElementById("game-screen");
  const gamesquares = document.querySelectorAll(".gamesquare");
  const turnDisplay = document.getElementById("turn");

  const p1 = document.getElementById("player1");
  const p1Name = p1.querySelector(".name");
  const p1Score = p1.querySelector(".score");

  const p2 = document.getElementById("player2");
  const p2Name = p2.querySelector(".name");
  const p2Score = p2.querySelector(".score");
  const userType = document.getElementById("scoreboard-p2-icon");

  const reset = document.getElementById("reset-game");
  const resultScreen = document.getElementById("results-screen");
  const resultMsg = resultScreen.querySelector("h2");

  const newGame = document.getElementById("new-game");

  return {
    startScreen,
    pve,
    pveInputs,
    pvp,
    pvpInputs,
    startBtn,
    gameScreen,
    gamesquares,
    turnDisplay,
    p1Name,
    p1Score,
    p2Name,
    p2Score,
    userType,
    reset,
    resultScreen,
    resultMsg,
    newGame,
  };
})();

/* Player Factory Function */
const Player = (name, isAI = false) => {
  let _score = 0;

  function updateInfo(newName, ai) {
    name = newName;
    isAI = ai;
  }

  function getName() {
    return name;
  }

  function win(didWin) {
    if (didWin) _score++;
  }

  function getScore() {
    return _score;
  }

  function resetScore() {
    _score = 0;
  }

  function isPlayerAI() {
    return isAI;
  }

  return { updateInfo, getName, win, getScore, resetScore, isPlayerAI };
};

/* Module that deals with the gameboard */
const GameBoard = (function () {
  const _gameboard = ["", "", "", "", "", "", "", "", ""];
  let turn = true; // "true" - Player 1's turn; "false" - Player 2's turn
  let makingMove = false;

  function init() {
    console.log("initializing");
    bindEvents();
  }

  // bind events
  function bindEvents() {
    DOMElements.gamesquares.forEach((square) => {
      let idx = square.dataset.idx;
      square.addEventListener("click", () => {
        if (!turn && makingMove) return;
        changeSquare(idx);
      });
    });
  }

  function reset() {
    DOMElements.gamesquares.forEach((square) => {
      square.textContent = "";
    });
    _gameboard.fill("");
    switchTurn();

    // If AI Turn
    if (!turn) {
      GameLogic.AITurn();
    }
  }

  function changeSquare(idx) {
    if (_gameboard[idx] === "") {
      const squareVal = turn ? "X" : "O";
      DOMElements.gamesquares[idx].innerHTML = `<span class="pop-in-anim">${squareVal}</span>`;
      _gameboard[idx] = squareVal;

      let result = GameLogic.checkWin();

      if (result !== "win" && result !== "tie") {
        switchTurn();
        DisplayController.displayTurn();

        if (!turn) {
          makingMove = true;
          setTimeout(() => {
            GameLogic.AITurn();
            makingMove = false;
          }, 500);
        }
      }
    }
  }

  function getGameState() {
    return _gameboard;
  }

  function switchTurn() {
    turn = !turn;
  }

  function getTurn() {
    return turn;
  }

  function totalReset() {
    reset();
    turn = true;
  }

  init();

  return { reset, getGameState, changeSquare, getTurn, totalReset };
})();

/* Module that controls what's on the screen */
const DisplayController = (function () {
  let Player1 = Player("Player 1");
  let Player2 = Player("Player 2");

  function init() {
    bindEvents();
  }

  // bind events
  function bindEvents() {
    DOMElements.pve.addEventListener("click", _changemode.bind(DOMElements.pve));

    DOMElements.pvp.addEventListener("click", _changemode.bind(DOMElements.pvp));

    DOMElements.startBtn.addEventListener("click", _startGame);

    DOMElements.reset.addEventListener("click", () => {
      DOMElements.resultScreen.classList = "";
      GameBoard.reset();
      updateScoreboard();
    });

    DOMElements.newGame.addEventListener("click", () => {
      DOMElements.resultScreen.classList = "";
      GameLogic.totalReset();
      DOMElements.startScreen.classList.remove("hidden");
      DOMElements.gameScreen.classList.add("hidden");
    });
  }

  function _changemode() {
    if (!this.classList.contains("selected")) {
      DOMElements.pve.classList.toggle("selected");
      DOMElements.pvp.classList.toggle("selected");
    }
  }

  function _startGame() {
    let p1Name = DOMElements.pveInputs[0].value || DOMElements.pveInputs[0].placeholder;
    let p2Name = DOMElements.pveInputs[1].value || DOMElements.pveInputs[1].placeholder;
    let p2isAI = true;

    if (!DOMElements.pve.classList.contains("selected")) {
      p1Name = DOMElements.pvpInputs[0].value || DOMElements.pvpInputs[0].placeholder;
      p2Name = DOMElements.pvpInputs[1].value || DOMElements.pvpInputs[1].placeholder;
      p2isAI = false;
    }

    Player1.updateInfo(p1Name, false);
    Player1.resetScore();
    Player2.updateInfo(p2Name, p2isAI);
    Player2.resetScore();

    _initializeScoreboard();
    DOMElements.startScreen.classList.add("hidden");
    DOMElements.gameScreen.classList.remove("hidden");
  }

  function _initializeScoreboard() {
    DOMElements.p1Name.textContent = Player1.getName();
    DOMElements.p2Name.textContent = Player2.getName();
    updateScoreboard();
    DOMElements.userType.classList = Player2.isPlayerAI() ? "fas fa-desktop" : "fas fa-user";
  }

  function updateScoreboard() {
    DOMElements.p1Score.textContent = Player1.getScore();
    DOMElements.p2Score.textContent = Player2.getScore();
    displayTurn();
  }

  function displayTurn() {
    if (GameBoard.getTurn()) {
      DOMElements.turnDisplay.textContent = `${Player1.getName()}'s Turn`;
    } else {
      DOMElements.turnDisplay.textContent = `${Player2.getName()}'s Turn`;
    }
  }

  /* Everything below is unrevised */
  function displayResults(gameResult) {
    if (gameResult === "player1" || gameResult === "player2" || gameResult === "tie") {
      let msg = "It's a tie!";
      console.log(gameResult);
      if (gameResult === "player1") {
        msg = `${Player1.getName()} won!`;
      } else if (gameResult === "player2") {
        msg = `${Player2.getName()} won!`;
      }
      DOMElements.resultMsg.textContent = msg;

      DOMElements.resultScreen.classList.add("enter");
      setTimeout(() => {
        DOMElements.resultScreen.classList.add("active");
      }, 150);
    }
  }

  function getPlayers() {
    return { Player1, Player2 };
  }

  init();

  return { updateScoreboard, displayTurn, displayResults, getPlayers };
})();

/* Game Logic Controller */
const GameLogic = (function (players) {
  const Player1 = players.Player1;
  const Player2 = players.Player2;

  const winCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const gb = GameBoard.getGameState();

  function checkWin() {
    let winResult = winCombo.some((combo) => {
      if (gb[combo[0]] !== "") {
        for (let i = 1; i < 3; i++) {
          if (gb[combo[i]] !== gb[combo[i - 1]]) {
            return false;
          }
        }
        return true;
      }
    });

    if (winResult) {
      _handleGameResults("win");
      return "win";
    } else if (!gb.includes("")) {
      _handleGameResults("tie");
      return "tie";
    } else {
      return "";
    }
  }

  function AITurn() {
    const gb = GameBoard.getGameState();

    if (Player2.isPlayerAI()) {
      const emptyIdx = [];
      gb.forEach((square, idx) => {
        if (square === "") {
          emptyIdx.push(idx);
        }
      });

      const randIdx = Math.floor(Math.random() * emptyIdx.length);
      GameBoard.changeSquare(emptyIdx[randIdx]);
    }
  }

  function _handleGameResults(gameResult) {
    const currTurn = GameBoard.getTurn();
    if (gameResult === "win") {
      currTurn ? Player1.win(true) : Player2.win(true);
    }

    DisplayController.displayResults(
      gameResult === "tie" ? "tie" : currTurn ? "player1" : "player2"
    );
  }

  function totalReset() {
    GameBoard.totalReset();
    Player1.resetScore();
    Player2.resetScore();
  }

  return { checkWin, AITurn, totalReset };
})(DisplayController.getPlayers());
