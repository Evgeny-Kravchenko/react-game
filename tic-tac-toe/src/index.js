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

function SortButton(props) {
  return <button className="sort-button" onClick={props.onReverse}></button>;
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
    return (
      <div>
        <div className="history-title-container">
          <h2 className={"history-title"}>История ходов</h2>
          <SortButton onReverse={() => this.props.onSort()} />
        </div>
        <div className={"history-board"}>{moves}</div>
      </div>
    );
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
      isReverse: false,
    };
    this.jumpTo = this.jumpTo.bind(this);
  }

  sort() {
    const step = this.state.history.length - this.state.stepNumber - 1;
    this.setState({
      stepNumber: step,
      history: this.state.history.reverse(),
      isReverse: !this.state.isReverse,
    });
  }

  handleClick(i) {
    let history;
    let current;
    if (!this.state.isReverse) {
      history = this.state.history.slice(0, this.state.stepNumber + 1);
      current = history[history.length - 1];
    } else {
      history = this.state.history.slice(
        -(this.state.history.length - this.state.stepNumber)
      );
      current = history[0];
    }
    const squares = [...current.squares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    let result;
    if (!this.state.isReverse) {
      result = [
        ...history,
        {
          squares: squares,
        },
      ];
    } else {
      result = [
        {
          squares: squares,
        },
        ...history,
      ];
    }
    this.setState({
      history: result,
      stepNumber: this.state.isReverse ? 0 : history.length,
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
        <div className={"game-status"}>{status}</div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <History
            history={history}
            jumpTo={this.jumpTo}
            onClick={(move) => this.jumpTo(move)}
            stepNumber={stepNumber}
            onSort={() => this.sort()}
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
