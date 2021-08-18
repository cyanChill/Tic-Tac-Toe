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
  }

  // cached DOM
  const gamesquares = document.querySelectorAll(".gamesquare");

  // bind events
  function bindEvents() {
    gamesquares.forEach((square) => {
      square.addEventListener("click", changeSquare);
    });
  }

  function startGame() {
    reset();
  }

  function reset() {
    gamesquares.forEach((square) => {
      square.textContent = "";
    });
    _gameboard.fill("");
  }

  function getBoardState() {
    return _gameboard;
  }

  function changeSquare() {
    if (!this.textContent) {
      this.textContent = turn ? "X" : "O";
      _gameboard[this.dataset.idx] = this.textContent;
      let victory = checkWin();
      console.log(victory);
      if (victory === "win") {
        turn ? Player1.addWin() : Player2.addWin();
        reset();
      } else if (victory == "tie") {
      } else {
        turn = !turn;
      }
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
    startGame,
    getBoardState,
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

  // bind events
  function bindEvents() {
    p1Name.addEventListener("change", (e) =>
      Player1.changeName(e.target.value)
    );
    p2Name.addEventListener("change", (e) =>
      Player2.changeName(e.target.value)
    );
  }

  function updateScoreboard() {
    p1Score.textContent = Player1.getScore();
    p2Score.textContent = Player2.getScore();
  }

  init();

  return { updateScoreboard };
})({ Player1, Player2 });
