import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
            onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, key) {
    return (<Square key={ key }
                    value={ this.props.squares[i] }
                    onClick={ () => this.props.onClick(i) } />);
  }

  render() {
    return (
      <div>
        {
          [0, 3, 6].map((value_col, i) => {
            return (
              <div key={(i + 1) * 10} className="board-row">
                {
                  [0, 1, 2].map((value_row, j) => {
                    return (this.renderSquare(value_col + value_row, value_col + value_row))
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coup: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const row     = i < 3 ? '1' : i < 6 ? '2' : '3';
    const col     = (i % 3 === 0 ? '1' : i === 1 || i === 4 || i === 7 ? '2' : '3');

    if (calculateWinner(current.squares, this.state.stepNumber) || squares[i])
      return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({ 
      history: history.concat([{
        squares: squares,
        coup: '(' + col + ',' + row + ')',
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares, this.state.stepNumber);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go back to turn n°' + move + ' ' + history[move].coup : 'Begin a new game';

      return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              { this.state.stepNumber === move ? <b>{desc}</b> : desc }
            </button>
          </li>
      );
    });

    let status;
    if (winner === 'X' || winner === 'O')
      status = winner + ' won!';
    else if (winner === 'nul')
      status = ' Nobody won!';
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
                 onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, step) {
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
  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
       return squares[a];
  }

  if (step < 9)
    return null;
  else
    return 'nul';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
