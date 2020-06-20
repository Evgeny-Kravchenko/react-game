import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const classes = ["board"];
    if (this.props.active) {
      classes.push("active-board");
    }
    let board = new Array(3).fill(null);
    let countSquare = -1;
    board = board.map((item, indexR) => {
      let squares = new Array(3).fill(null);
      squares = squares.map(() => {
        countSquare += 1;
        return this.renderSquare(countSquare);
      });
      return (
        <div key={indexR} className="board-row">
          {squares}
        </div>
      );
    });
    return (
      <div className={classes.join(" ")}>
        <div>{board}</div>
      </div>
    );
  }
}

class History extends React.Component {
  render() {
    const stepNumber = this.props.stepNumber;
    const moves = this.props.history.map((step, move) => {
      let active = move === stepNumber;
      return (
        <Board
          key={move}
          squares={step.squares}
          onClick={() => this.props.onClick(move)}
          active={active}
        />
      );
    });
    return <div className={"history-board"}>{moves}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    };
    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const stepNumber = this.state.stepNumber;
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = "Победитель: " + winner;
    } else if (!current.squares.includes(null)) {
      status = "Ничья";
    } else {
      status = "Следующий игрок: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className={"game-status"}>{status}</div>
          <History
            history={history}
            jumpTo={this.jumpTo}
            onClick={(move) => this.jumpTo(move)}
            stepNumber={stepNumber}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}
