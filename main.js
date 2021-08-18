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
  const reset = document.getElementById("reset-game");
  const resultScreen = document.getElementById("results-screen");
  const resultMsg = resultScreen.querySelector("h2");

  return {
    startScreen,
    pve,
    pveInputs,
    pvp,
    pvpInputs,
    startBtn,
    gameScreen,
  };
})();

const Player = (name, isAI = false) => {
  let score = 0;

  function addWin() {
    score++;
    DisplayController.updateScoreboard();
  }

  function getName() {
    return name;
  }

  function getScore() {
    return score;
  }

  function isPlayerAI() {
    return isAI;
  }

  return {
    getName,
    addWin,
    getScore,
    isPlayerAI,
  };
};

const DisplayController = (function () {
  let Player1 = Player("Player 1");
  let Player2 = Player("Player 2");

  function init() {
    bindEvents();
  }

  // bind events
  function bindEvents() {
    DOMElements.pve.addEventListener("click", changeMode.bind(DOMElements.pve));

    DOMElements.pvp.addEventListener("click", changeMode.bind(DOMElements.pvp));

    DOMElements.startBtn.addEventListener("click", startGame);

    /*
    p1Name.addEventListener("change", (e) => {
      Player1.changeName(e.target.value);
      GameBoard.showCurrentTurn();
    });
    p2Name.addEventListener("change", (e) => {
      Player2.changeName(e.target.value);
      GameBoard.showCurrentTurn();
    });
    */
    reset.addEventListener("click", () => {
      resultScreen.classList = "";
      GameBoard.reset();
    });
  }

  function changeMode() {
    if (!this.classList.contains("selected")) {
      DOMElements.pve.classList.toggle("selected");
      DOMElements.pvp.classList.toggle("selected");
    }
  }

  function startGame() {
    let p1Name =
      DOMElements.pveInputs[0].value || DOMElements.pveInputs[0].placeholder;
    let p2Name =
      DOMElements.pveInputs[1].value || DOMElements.pveInputs[1].placeholder;
    let p2isAI = true;

    if (!DOMElements.pve.classList.contains("selected")) {
      p1Name =
        DOMElements.pvpInputs[0].value || DOMElements.pvpInputs[0].placeholder;
      p2Name =
        DOMElements.pvpInputs[1].value || DOMElements.pvpInputs[1].placeholder;
      p2isAI = false;
    }

    console.log(`Player 1: ${p1Name} Player2: ${p2Name}`);
    //DOMElements.startScreen.classList.add("hidden");
    //DOMElements.gameScreen.classList.remove("hidden");
  }

  function updateScoreboard() {
    p1Score.textContent = Player1.getScore();
    p2Score.textContent = Player2.getScore();
  }

  function displayResults(gameResult) {
    if (
      gameResult === "player1" ||
      gameResult === "player2" ||
      gameResult === "tie"
    ) {
      if (gameResult === "tie") {
        resultMsg.textContent = "It's a tie!";
      } else if (gameResult === "player1") {
        resultMsg.textContent = `${Player1.getName()} won!`;
      } else {
        resultMsg.textContent = `${Player2.getName()} won!`;
      }
      resultScreen.classList.add("enter");
      setTimeout(() => {
        resultScreen.classList.add("active");
      }, 150);
    }
  }

  function getPlayers() {
    return { Player1, Player2 };
  }

  init();

  return { updateScoreboard, displayResults, getPlayers };
})();

/*
const GameBoard = (function (players) {
  const _gameboard = ["", "", "", "", "", "", "", "", ""];
  const { Player1, Player2 } = players;
  let turn = true;

  function init() {
    console.log("initializing");
    bindEvents();
    showCurrentTurn();
  }

  // bind events
  function bindEvents() {
    gamesquares.forEach((square) => {
      square.addEventListener("click", changeSquare);
    });
  }

  function reset() {
    gamesquares.forEach((square) => {
      square.textContent = "";
    });
    _gameboard.fill("");
    switchTurn();
    showCurrentTurn();
  }

  function changeSquare() {
    if (!this.textContent) {
      this.textContent = turn ? "X" : "O";
      _gameboard[this.dataset.idx] = this.textContent;
      let victory = checkWin();
      if (victory === "win" || victory === "tie") {
        victory === "tie"
          ? ""
          : victory === "win" && turn
          ? Player1.addWin()
          : Player2.addWin();
        DisplayController.displayResults(
          victory === "tie" ? "tie" : turn ? "player1" : "player2"
        );
      } else {
        switchTurn();
        showCurrentTurn();
      }
    }
  }

  function showCurrentTurn() {
    if (turn) {
      turnDisplay.textContent = `${Player1.getName()}'s Turn`;
    } else {
      turnDisplay.textContent = `${Player2.getName()}'s Turn`;
    }
  }

  function checkWin() {
    if (
      (_gameboard[0] !== "" &&
        _gameboard[0] === _gameboard[1] &&
        _gameboard[1] === _gameboard[2]) ||
      (_gameboard[3] !== "" &&
        _gameboard[3] === _gameboard[4] &&
        _gameboard[4] === _gameboard[5]) ||
      (_gameboard[6] !== "" &&
        _gameboard[6] === _gameboard[7] &&
        _gameboard[7] === _gameboard[8]) ||
      (_gameboard[0] !== "" &&
        _gameboard[0] === _gameboard[3] &&
        _gameboard[3] === _gameboard[6]) ||
      (_gameboard[1] !== "" &&
        _gameboard[1] === _gameboard[4] &&
        _gameboard[4] === _gameboard[7]) ||
      (_gameboard[2] !== "" &&
        _gameboard[2] === _gameboard[5] &&
        _gameboard[5] === _gameboard[8]) ||
      (_gameboard[0] !== "" &&
        _gameboard[0] === _gameboard[4] &&
        _gameboard[4] === _gameboard[8]) ||
      (_gameboard[2] !== "" &&
        _gameboard[2] === _gameboard[4] &&
        _gameboard[4] === _gameboard[6])
    ) {
      return "win";
    }
    if (_gameboard.includes("")) {
      return "none";
    } else {
      return "tie";
    }
  }

  function getGameState() {
    return _gameboard;
  }

  function switchTurn() {
    turn = !turn;
  }

  init();

  return {
    reset,
    showCurrentTurn,
    getGameState,
  };
})(DisplayController.getPlayers());

*/
