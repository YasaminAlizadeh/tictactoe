import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/countdown.css";

import Board from "./components/Board";

// ------------------------ Game Component ------------------------
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      sqaureLocations: [{ locationRow: null, locationCol: null }],
      gameInfo: {
        shouldGameStart: false,
        player: null,
        playerIsFirst: null,
        playerIsNext: null,
        round: 1,
        stepNumber: 0,
        selectedBtn: -1,
        isListSortedAscending: true,
        scores: { x: 0, o: 0 },
      },
    };
  }

  choosePlayer = (e) => {
    if (!this.state.gameInfo.player) {
      if (e.target.value === "x") {
        this.setState({
          gameInfo: {
            ...this.state.gameInfo,
            player: "x",
          },
        });
      } else {
        this.setState({
          gameInfo: {
            ...this.state.gameInfo,
            player: "o",
          },
        });
      }

      setTimeout(() => {
        let randomPlayer = ["o", "x"][Math.floor(Math.random() * 2)];

        this.setState({
          gameInfo: {
            ...this.state.gameInfo,
            playerIsFirst:
              this.state.gameInfo.player === randomPlayer ? true : false,
            playerIsNext:
              this.state.gameInfo.player === randomPlayer ? true : false,
          },
        });
      }, 5000);

      document
        .getElementsByClassName("choose-player")[0]
        .classList.add("countdown-container");

      setTimeout(() => {
        document
          .getElementsByClassName("first-player")[0]
          .classList.add("hidden");
        document
          .getElementsByClassName("dark-shadow")[0]
          .classList.add("hidden");
      }, 7000);

      setTimeout(() => {
        this.setState({
          gameInfo: {
            ...this.state.gameInfo,
            shouldGameStart: true,
          },
        });
      }, 8000);
    }
  };

  // handleClick
  handleClick = (i) => {
    if (
      this.state.gameInfo.stepNumber === this.state.history.length - 1 &&
      this.state.gameInfo.playerIsNext
    ) {
      let history = this.state.history.slice(
        0,
        this.state.gameInfo.stepNumber + 1
      );
      let current = history[history.length - 1];
      let squares = [...current.squares];

      if (calculateWinner(current.squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.gameInfo.player === "x" ? "X" : "O";

      this.findLocation(i);

      this.setState({
        history: [...history, { squares: squares }],
        gameInfo: {
          ...this.state.gameInfo,
          playerIsNext: !this.state.gameInfo.playerIsNext,
          stepNumber: history.length,
        },
      });
    }
  };

  // AutoPlayer
  componentDidUpdate = () => {
    setTimeout(() => {
      if (
        this.state.gameInfo.stepNumber === this.state.history.length - 1 &&
        !this.state.gameInfo.playerIsNext &&
        this.state.gameInfo.shouldGameStart
      ) {
        let history = this.state.history.slice(
          0,
          this.state.gameInfo.stepNumber + 1
        );
        let current = history[history.length - 1];
        let squares = [...current.squares];
        let index = 0;
        let DidOPlay = false;

        let opponent = this.state.gameInfo.player
          ? this.state.gameInfo.player === "x"
            ? "O"
            : "X"
          : "";

        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];

        if (!calculateWinner(current.squares)) {
          // Method 1: if O has two squares in a row and can complete them to win
          loop1: for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            // Check if two squares in a row are full and equal and if they are O
            if (
              [squares[a], squares[b], squares[c]].filter(Boolean).length ===
                2 &&
              (squares[a] === squares[b] ||
                squares[a] === squares[c] ||
                squares[b] === squares[c]) &&
              (squares[a] === opponent || squares[b] === opponent)
            ) {
              let arr = [a, b, c];
              for (let i = 0; i < 3; i++) {
                // play in the empty square
                if (!squares[arr[i]]) {
                  squares[arr[i]] = opponent;
                  DidOPlay = true;
                  break loop1;
                }
              }
            }
          }

          // Method 2: if X has two squares in a row and O should stop it from winning
          loop2: for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            // Check if two squares in a row are full and equal (They're not O)
            if (
              !DidOPlay &&
              [squares[a], squares[b], squares[c]].filter(Boolean).length ===
                2 &&
              (squares[a] === squares[b] ||
                squares[a] === squares[c] ||
                squares[b] === squares[c])
            ) {
              let arr = [a, b, c];
              for (let i = 0; i < 3; i++) {
                // play in the empty square
                if (!squares[arr[i]]) {
                  squares[arr[i]] = opponent;
                  DidOPlay = true;
                  break loop2;
                }
              }
            }
          }

          // Method 3: if no row is near to win so O should play a random square
          if (!DidOPlay) {
            index = Math.floor(Math.random() * 9);

            // if the square is empty, play
            if (!squares[index]) {
              squares[index] = opponent;

              DidOPlay = true;
              // else: look for an empty square to play
            } else {
              while (squares[index]) {
                if (
                  squares.every(
                    (element) => element != null && typeof element != undefined
                  )
                ) {
                  break;
                }
                index = Math.floor(Math.random() * 9);
                if (!squares[index]) {
                  squares[index] = opponent;
                  DidOPlay = true;
                  break;
                }
              }
            }
          }

          this.findLocation(index);

          this.setState({
            history: [...history, { squares: squares }],
            gameInfo: {
              ...this.state.gameInfo,
              playerIsNext: !this.state.gameInfo.playerIsNext,
              stepNumber: history.length,
            },
          });
        }
      }
    }, 500);
  };

  // Find Location
  findLocation = (i) => {
    const location = { x: null, y: null };
    const board = {
      rows: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      columns: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ],
    };
    for (let index1 = 0; index1 < board.rows.length; index1++) {
      if (board.rows[index1].includes(i)) {
        location.y = index1 + 1;
        for (let index2 = 0; index2 < board.columns.length; index2++) {
          if (board.columns[index2].includes(i)) {
            location.x = index2 + 1;
          }
        }
      }
    }

    this.setState({
      sqaureLocations: [
        ...this.state.sqaureLocations,
        { locationRow: location.y, locationCol: location.x },
      ],
    });
  };

  // JumpTo + Highlight Selected Button
  jumpTo = (e, step) => {
    this.setState({
      gameInfo: {
        ...this.state.gameInfo,
        stepNumber: step,
        playerIsNext: this.state.gameInfo.playerIsFirst
          ? step % 2 === 0
          : step % 2 === 1,
        selectedBtn: e.target.id,
      },
    });

    if (step !== this.state.history.length - 1) {
      if (document.getElementsByClassName("game")[0]) {
        document
          .getElementsByClassName("game")[0]
          .classList.remove("game-finished");
      }

      if (document.getElementsByClassName("winner-square")[0]) {
        for (let i = 0; i < 3; i++) {
          document
            .getElementsByClassName("winner-square")[0]
            .classList.remove("winner-square");
        }
      }
    }
  };

  // Sort List
  sortMovesList = () => {
    this.setState({
      gameInfo: {
        ...this.state.gameInfo,
        isListSortedAscending: !this.state.gameInfo.isListSortedAscending,
      },
    });
  };

  // Next Round
  NextRound = () => {
    const history = this.state.history;
    const current = history[this.state.gameInfo.stepNumber];
    const winner =
      calculateWinner(current.squares) &&
      calculateWinner(current.squares).winner;

    let randomPlayer = ["o", "x"][Math.floor(Math.random() * 2)];
    this.setState({
      history: [{ squares: Array(9).fill(null) }],
      gameInfo: {
        ...this.state.gameInfo,
        round: this.state.gameInfo.round + 1,
        stepNumber: 0,
        selectedBtn: -1,
        isListSortedAscending: true,
        playerIsNext: winner
          ? this.state.gameInfo.player === winner.toLowerCase()
            ? true
            : false
          : randomPlayer === this.state.gameInfo.player
          ? true
          : false,
        playerIsFirst: winner
          ? this.state.gameInfo.player === winner.toLowerCase()
            ? true
            : false
          : randomPlayer === this.state.gameInfo.player
          ? true
          : false,
        shouldGameStart: true,
        scores: winner
          ? {
              ...this.state.gameInfo.scores,
              [winner.toLowerCase()]:
                Number(this.state.gameInfo.scores[winner.toLowerCase()]) + 1,
            }
          : {
              ...this.state.gameInfo.scores,
              x: Number(this.state.gameInfo.scores.x),
              o: Number(this.state.gameInfo.scores.o),
            },
      },
      sqaureLocations: [{ locationRow: null, locationCol: null }],
    });

    document
      .getElementsByClassName("game")[0]
      .classList.remove("game-finished");

    if (winner) {
      for (let i = 0; i < 3; i++) {
        document
          .getElementsByClassName("winner-square")[0]
          .classList.remove("winner-square");
      }
    }
  };

  restartGame = () => {
    let confirm = window.confirm(
      "Are you sue you want to restart the game? \nNote: all the progress will be lost"
    );
    if (confirm) {
      window.location.reload();
    }
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.gameInfo.stepNumber];

    const winner =
      calculateWinner(current.squares) &&
      calculateWinner(current.squares).winner;

    // ------------ Moves (moves' list li's) ------------
    const moves = history.map((step, move) => {
      let difference =
        history[move - 1] &&
        history[move].squares.filter(
          (element, index) => element !== history[move - 1].squares[index]
        );

      const desc = move
        ? "move " +
          move +
          ": " +
          (Array.isArray(difference) && difference[0]) +
          " (" +
          this.state.sqaureLocations[move].locationRow +
          ", " +
          this.state.sqaureLocations[move].locationCol +
          ")"
        : "Go to game start";

      return (
        <li key={move}>
          {Number(move) === Number(this.state.gameInfo.selectedBtn) ? (
            <button
              id={move}
              className="list-btn selected-list-btn"
              onClick={(e) => this.jumpTo(e, move)}
            >
              {desc}
            </button>
          ) : (
            <button
              id={move}
              className="list-btn"
              onClick={(e) => this.jumpTo(e, move)}
            >
              {desc}
            </button>
          )}
        </li>
      );
    });

    // Update Status
    let status;
    let first_player;
    if (winner) {
      status = "Winner: " + winner;
      const winnerSquares = [...calculateWinner(current.squares).winnerSquares];
      for (let i = 0; i < winnerSquares.length; i++) {
        document
          .getElementsByClassName("game")[0]
          .classList.add("game-finished");
        document
          .getElementsByClassName("square")
          [winnerSquares[i]].classList.add("winner-square");
      }
    } else if (current.squares.includes(null)) {
      status =
        this.state.gameInfo.playerIsNext !== null
          ? this.state.gameInfo.playerIsNext
            ? "You"
            : "Your opponent"
          : "";
      first_player =
        this.state.gameInfo.playerIsFirst !== null
          ? this.state.gameInfo.playerIsFirst
            ? "You"
            : "Your opponent"
          : "";
    } else {
      status = "It's a Tie!";
      document.getElementsByClassName("game")[0].classList.add("game-finished");
    }

    // -----------
    return (
      <>
        <div className="dark-shadow"></div>
        <div className="menu">
          <button
            onClick={() => {
              document.getElementsByClassName("menu")[0].style.display = "none";

              document.getElementsByClassName(
                "choose-player"
              )[0].style.display = "grid";
            }}
          >
            Start!
          </button>
          <p className="instructions">
            Welcome! :)
            <br />
            To start playing, hit the button <span>"Start!"</span>. After
            selecting your player, the game will randomly choose who will go
            first.
            <br />
            In order to win the game, a player must place three of their marks
            in a horizontal, vertical, or diagonal row.
            <br />
            whoever wins is going to start the next round. In case of a "Tie",
            the game will choose who will start.
            <br />
            <span>Happy Gaming! :)</span>
          </p>
        </div>
        <>
          {!this.state.gameInfo.player ? (
            <div className="choose-player">
              <h2>Choose Player:</h2>
              <div className="choose-first-player">
                <button value="x" onClick={(e) => this.choosePlayer(e)}>
                  X
                </button>
                <button value="o" onClick={(e) => this.choosePlayer(e)}>
                  O
                </button>
              </div>
            </div>
          ) : (
            <>
              {this.state.gameInfo.playerIsNext !== null ? (
                <div className="first-player">
                  <h2>
                    {this.state.gameInfo.playerIsNext
                      ? "You will start the game!"
                      : "Your opponent will start the game!"}
                  </h2>
                </div>
              ) : (
                <div className="choose-player">
                  <div className="countdown"></div>
                </div>
              )}
            </>
          )}
        </>
        <section className="page">
          <div className="scores">
            <div className="round">Round {this.state.gameInfo.round}</div>X{" "}
            <span>{this.state.gameInfo.scores.x}</span> -{" "}
            <span>{this.state.gameInfo.scores.o}</span> O
          </div>
          <div>
            <button className="restart-btn" onClick={() => this.restartGame()}>
              Restart Game
            </button>
          </div>
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              {winner || status === "It's a Tie!" ? (
                <div>
                  <h2 className="status winner">{status}</h2>
                  <button
                    className="nextround-btn"
                    onClick={() => this.NextRound()}
                  >
                    Next Round
                  </button>
                </div>
              ) : (
                <div className="status-div">
                  <div className="status">
                    Start: <span>{first_player}</span>
                  </div>
                  <div className="status">
                    Next Move: <span>{status}</span>
                  </div>
                </div>
              )}

              <div className="game-history">
                <h3 className="title">Game history:</h3>
                <button
                  className="sort-btn"
                  onClick={() => this.sortMovesList()}
                >
                  Sort
                  {this.state.gameInfo.isListSortedAscending ? (
                    <span> (Oldest to Newest)</span>
                  ) : (
                    <span> (Newest to Oldest)</span>
                  )}
                </button>
              </div>

              <ol className="history-list">
                {this.state.gameInfo.isListSortedAscending
                  ? moves
                  : moves.reverse()}
              </ol>
            </div>
          </div>
        </section>
      </>
    );
  }
}

// Calculate Winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerSquares: [a, b, c] };
    }
  }
  return null;
};
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
