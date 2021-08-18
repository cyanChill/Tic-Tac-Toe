const Player = (name) => {
  let playerName = name;
  let score = 0;

  function addWin() {
    score++;
    DisplayController.updateScoreboard();
  }

  function changeName(newName) {
    playerName = newName;
  }

  function getName() {
    return playerName;
  }

  function getScore() {
    return score;
  }

  return { changeName, getName, addWin, getScore };
};

const Player1 = Player("Player 1");
const Player2 = Player("Player 2");

const GameBoard = (function (players) {
  const _gameboard = ["", "", "", "", "", "", "", "", ""];
  const { Player1, Player2 } = players;
  let turn = true;

  function init() {
    console.log("initializing");
    bindEvents();
    currentTurn();
  }

  // cached DOM
  const gamesquares = document.querySelectorAll(".gamesquare");
  const turnDisplay = document.getElementById("turn");

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
        turn = !turn;
        currentTurn();
      }
    }
  }

  function currentTurn() {
    if (turn) {
      turnDisplay.textContent = `${Player1.getName()}'s Turn`;
    } else {
      turnDisplay.textContent = `${Player2.getName()}'s Turn`;
    }
  }

  function checkWin() {
    if (
      (_gameboard[0] === _gameboard[1] &&
        _gameboard[1] === _gameboard[2] &&
        _gameboard[0] !== "") ||
      (_gameboard[3] === _gameboard[4] &&
        _gameboard[4] === _gameboard[5] &&
        _gameboard[3] !== "") ||
      (_gameboard[6] === _gameboard[7] &&
        _gameboard[7] === _gameboard[8] &&
        _gameboard[6] !== "") ||
      (_gameboard[0] === _gameboard[3] &&
        _gameboard[3] === _gameboard[6] &&
        _gameboard[0] !== "") ||
      (_gameboard[1] === _gameboard[4] &&
        _gameboard[4] === _gameboard[7] &&
        _gameboard[1] !== "") ||
      (_gameboard[2] === _gameboard[5] &&
        _gameboard[5] === _gameboard[8] &&
        _gameboard[2] !== "") ||
      (_gameboard[0] === _gameboard[4] &&
        _gameboard[4] === _gameboard[8] &&
        _gameboard[0] !== "") ||
      (_gameboard[2] === _gameboard[4] &&
        _gameboard[4] === _gameboard[6] &&
        _gameboard[2] !== "")
    ) {
      return "win";
    }
    if (_gameboard.includes("")) {
      return "none";
    } else {
      return "tie";
    }
  }

  init();

  return {
    reset,
    currentTurn,
  };
})({ Player1, Player2 });

const DisplayController = (function (players) {
  const { Player1, Player2 } = players;

  function init() {
    bindEvents();
  }

  // cached DOM
  const p1 = document.getElementById("player1");
  const p1Name = p1.querySelector(".name");
  const p1Score = p1.querySelector(".score");
  const p2 = document.getElementById("player2");
  const p2Name = p2.querySelector(".name");
  const p2Score = p2.querySelector(".score");
  const reset = document.getElementById("reset-game");
  const resultScreen = document.getElementById("results-screen");
  const resultMsg = resultScreen.querySelector("h2");

  // bind events
  function bindEvents() {
    p1Name.addEventListener("change", (e) => {
      Player1.changeName(e.target.value);
      GameBoard.currentTurn();
    });
    p2Name.addEventListener("change", (e) => {
      Player2.changeName(e.target.value);
      GameBoard.currentTurn();
    });
    reset.addEventListener("click", () => {
      resultScreen.classList = "";
      GameBoard.reset();
    });
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

  init();

  return { updateScoreboard, displayResults };
})({ Player1, Player2 });
