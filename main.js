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
  this.name = name;
  this.isAI = isAI;
  this.score = 0;

  function updateInfo(newName, ai) {
    this.name = newName;
    this.isAI = ai;
  }

  function getName() {
    return this.name;
  }

  function win() {
    this.score++;
  }

  function getScore() {
    return this.score;
  }

  function resetScore() {
    this.score = 0;
  }

  function isPlayerAI() {
    return this.isAI;
  }

  return { updateInfo, getName, win, getScore, resetScore, isPlayerAI };
};

/* Module that deals with the gameboard */
const GameBoard = (function () {
  const _gameboard = ["", "", "", "", "", "", "", "", ""];
  let _turn = true; // "true" - Player 1's turn; "false" - Player 2's turn
  let _makingMove = false; // Make sure that the player can't make a move for the computer

  function _bindEvents() {
    DOMElements.gamesquares.forEach((square) => {
      square.addEventListener("click", trySquareUpdate);
    });
  }

  function trySquareUpdate() {
    changeSquare(this.dataset.idx);
  }

  function reset() {
    DOMElements.gamesquares.forEach((square) => {
      square.textContent = "";
    });
    _gameboard.fill("");

    // If AI Turn
    if (!_turn) {
      GameLogic.AITurn();
    }
  }

  function changeSquare(idx) {
    if (GameLogic.isAI() && _makingMove) return;

    if (_gameboard[idx] === "") {
      const squareVal = _turn ? "X" : "O";
      DOMElements.gamesquares[idx].innerHTML = `<span class="pop-in-anim">${squareVal}</span>`;
      _gameboard[idx] = squareVal;

      const result = GameLogic.checkWin(idx, squareVal);

      _turn = !_turn;
      if (result !== "win" && result !== "tie") {
        DisplayController.displayTurn();

        if (!_turn) {
          _makingMove = true;
          setTimeout(() => {
            _makingMove = false;
            GameLogic.AITurn();
          }, 500);
        }
      }
    }
  }

  function getGameState() {
    return _gameboard;
  }

  function getTurn() {
    return _turn;
  }

  function totalReset() {
    _turn = true;
    reset();
  }

  _bindEvents();

  return { reset, getGameState, changeSquare, getTurn, totalReset };
})();

/* Module that controls what's on the screen */
const DisplayController = (function () {
  const _Player1 = Player("Player 1");
  const _Player2 = Player("Player 2");

  function _bindEvents() {
    DOMElements.pve.addEventListener("click", _changeOpponentMode.bind(DOMElements.pve));
    DOMElements.pvp.addEventListener("click", _changeOpponentMode.bind(DOMElements.pvp));
    DOMElements.startBtn.addEventListener("click", _startGame);

    DOMElements.reset.addEventListener("click", () => {
      DOMElements.resultScreen.classList = "";
      GameBoard.reset();
      _updateScoreBoard();
    });

    DOMElements.newGame.addEventListener("click", () => {
      DOMElements.resultScreen.classList = "";
      GameLogic.totalReset();
      _switchScreen();
    });
  }

  function _changeOpponentMode() {
    if (!this.classList.contains("selected")) {
      DOMElements.pve.classList.toggle("selected");
      DOMElements.pvp.classList.toggle("selected");
    }
  }

  function _switchScreen() {
    DOMElements.startScreen.classList.toggle("hidden");
    DOMElements.gameScreen.classList.toggle("hidden");
  }

  function _startGame() {
    let p1Name = DOMElements.pveInputs[0].value || "Player 1";
    let p2Name = DOMElements.pveInputs[1].value || "Computer";
    let p2isAI = true;

    if (!DOMElements.pve.classList.contains("selected")) {
      p1Name = DOMElements.pvpInputs[0].value || "Player 1";
      p2Name = DOMElements.pvpInputs[1].value || "Player 2";
      p2isAI = false;
    }

    _Player1.updateInfo(p1Name, false);
    _Player1.resetScore();
    _Player2.updateInfo(p2Name, p2isAI);
    _Player2.resetScore();

    _initializeScoreboard();
    _switchScreen();
  }

  function _initializeScoreboard() {
    DOMElements.p1Name.textContent = _Player1.getName();
    DOMElements.p2Name.textContent = _Player2.getName();
    _updateScoreBoard();
    DOMElements.userType.classList = GameLogic.isAI() ? "fas fa-desktop" : "fas fa-user";
  }

  function _updateScoreBoard() {
    DOMElements.p1Score.textContent = _Player1.getScore();
    DOMElements.p2Score.textContent = _Player2.getScore();
    displayTurn();
  }

  function displayTurn() {
    if (GameBoard.getTurn()) {
      DOMElements.turnDisplay.textContent = `${_Player1.getName()}'s Turn`;
    } else {
      DOMElements.turnDisplay.textContent = `${_Player2.getName()}'s Turn`;
    }
  }

  function displayResults(gameResult) {
    if (gameResult === "player1" || gameResult === "player2" || gameResult === "tie") {
      let msg = "It's a tie!";
      console.log(gameResult);
      if (gameResult === "player1") {
        msg = `${_Player1.getName()} won!`;
      } else if (gameResult === "player2") {
        msg = `${_Player2.getName()} won!`;
      }
      DOMElements.resultMsg.textContent = msg;

      DOMElements.resultScreen.classList.add("enter");
      setTimeout(() => {
        DOMElements.resultScreen.classList.add("active");
      }, 150);
    }
  }

  function getPlayers() {
    return { _Player1, _Player2 };
  }

  _bindEvents();

  return { displayTurn, displayResults, getPlayers };
})();

/* Game Logic Controller */
const GameLogic = (function (players) {
  const _Player1 = players._Player1;
  const _Player2 = players._Player2;

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

  function checkWin(idx, symbol) {
    const gb = GameBoard.getGameState();
    let winResult = winCombo
      .filter((combo) => combo.includes(parseInt(idx)))
      .some((possCombo) => possCombo.every((idx) => gb[idx] === symbol));

    if (winResult) {
      _handleGameResults("win");
      return "win";
    } else if (!gb.includes("")) {
      _handleGameResults("tie");
      return "tie";
    } else {
      return;
    }
  }

  function AITurn() {
    const gb = GameBoard.getGameState();

    if (isAI()) {
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
      currTurn ? _Player1.win() : _Player2.win();
    }

    DisplayController.displayResults(
      gameResult === "tie" ? "tie" : currTurn ? "player1" : "player2"
    );
  }

  function totalReset() {
    GameBoard.totalReset();
    _Player1.resetScore();
    _Player2.resetScore();
  }

  function isAI() {
    return _Player2.isPlayerAI();
  }

  return { checkWin, isAI, AITurn, totalReset };
})(DisplayController.getPlayers());
