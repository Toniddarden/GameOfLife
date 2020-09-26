import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import "../style.scss";

// Board.row
// Board.col
const totalBoardRows = 25;
const totalBoardColumns = 25;


const newBoardStatus = (cellStatus = () => Math.random() < 0.3) => {
  // empty table
  const grid = [];
  // iterate through row/cols
  for (let r = 0; r < totalBoardRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalBoardColumns; c++) {
      // update cellStatus()
      grid[r][c] = cellStatus();
    }
  }
  return grid;
};

const BoardGrid = ({ boardStatus, onToggleCellStatus }) => {
  const handleClick = (r, c) => onToggleCellStatus(r, c);

  const tr = [];
  for (let r = 0; r < totalBoardRows; r++) {
    // scss .td handle new board grid
    const td = [];
    for (let c = 0; c < totalBoardColumns; c++) {
      td.push(
        <td
          key={`${r},${c}`}
          className={boardStatus[r][c] ? "alive" : "dead"}
          onClick={() => handleClick(r, c)}
        />
      );
    }
    tr.push(<tr key={r}>{td}</tr>);
  }
  return (
    <table>
      <tbody>{tr}</tbody>
    </table>
  );
};

const MainSlider = ({ speed, onSpeedChange }) => {
  const handleChange = (e) => onSpeedChange(e.target.value);

  return (
    <input
      type="range"
      min="50"
      max="1000"
      step="50"
      value={speed}
      onChange={handleChange}
    />
  );
};

class MainGame extends Component {
  // ------------------------ Game State --------------------------------------------------------------
  state = {
    boardStatus: newBoardStatus(),
    generation: 0,
    isGameRunning: false,
    speed: 500,
  };

  // stop button 
  handleStopButton = () => {
    return this.state.isGameRunning ? (
      <button type="button" onClick={this.handleStop}>
        Stop
      </button>
    ) : (
      <button type="button" onClick={this.handleRun}>
        Start
      </button>
    );
  };

  // clear board
  handleClearBoard = () => {
    this.setState({
      boardStatus: newBoardStatus(() => false),
      generation: 0,
    });
  };

  // new board
  handleNewBoard = () => {
    this.setState({
      boardStatus: newBoardStatus(),
      generation: 0,
    });
  };

  // on.off cell status 
  handleToggleCellStatus = (r, c) => {
    const toggleBoardStatus = (prevState) => {
      const copyBoard = JSON.parse(
        JSON.stringify(prevState.boardStatus)
      );
      // copyBoard row/col = not copyBoard row/col
      copyBoard[r][c] = !copyBoard[r][c];
      return copyBoard;
    };

    this.setState((prevState) => ({
      boardStatus: toggleBoardStatus(prevState),
    }));
  };
  // steps
  handleStep = () => {
    // neighbors = [-1, -1], [-1, 0], [-1, 1], [0, 1],[1, 1], [1, 0], [1, -1], [0, -1],
    const nextStep = (prevState) => {
      const boardStatus = prevState.boardStatus;
      // stringify copyBoord
      const copyBoard = JSON.parse(JSON.stringify(boardStatus));

      const amountTrueNeighbors = (r, c) => {
        const neighbors = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
          [1, 0],
          [1, -1],
          [0, -1],
        ];
        return neighbors.reduce((trueNeighbors, neighbor) => {
          const x = r + neighbor[0];
          const y = c + neighbor[1];
          const isNeighborOnBoard =
            x >= 0 && x < totalBoardRows && y >= 0 && y < totalBoardColumns;
        //  
          if (trueNeighbors < 4 && isNeighborOnBoard && boardStatus[x][y]) {
            return trueNeighbors + 1;
          } else {
            return trueNeighbors;
          }
        }, 0);
      };

      for (let r = 0; r < totalBoardRows; r++) {
        for (let c = 0; c < totalBoardColumns; c++) {
          const totalTrueNeighbors = amountTrueNeighbors(r, c);

          if (!boardStatus[r][c]) {
            if (totalTrueNeighbors === 3) copyBoard[r][c] = true;
          } else {
            if (totalTrueNeighbors < 2 || totalTrueNeighbors > 3)
              copyBoard[r][c] = false;
          }
        }
      }

      return copyBoard;
    };

    this.setState((prevState) => ({
      boardStatus: nextStep(prevState),
      generation: prevState.generation + 1,
    }));
  };

  handleSpeedChange = (newSpeed) => {
    this.setState({ speed: newSpeed });
  };

  handleRun = () => {
    this.setState({ isGameRunning: true });
  };

  handleStop = () => {
    this.setState({ isGameRunning: false });
  };
  // prevProps = !prevState  or prevState... on/off
  componentDidUpdate(prevProps, prevState) {
    const { isGameRunning, speed } = this.state;
    const speedChanged = prevState.speed !== speed;
    const gameStarted = !prevState.isGameRunning && isGameRunning;
    const gameStopped = prevState.isGameRunning && !isGameRunning;

    if ((isGameRunning && speedChanged) || gameStopped) {
      clearInterval(this.timerID);
    }

    if ((isGameRunning && speedChanged) || gameStarted) {
      this.timerID = setInterval(() => {
        this.handleStep();
      }, speed);
    }
  }

  render() {
    const { boardStatus, isGameRunning, generation, speed } = this.state;

    return (
      <div>
        <h1>Game of Life</h1>
        <BoardGrid
          boardStatus={boardStatus}
          onToggleCellStatus={this.handleToggleCellStatus}
        />
        <div className="mainControls">
          <span>
            {" + "}

            <MainSlider
              className="MainSlider"
              speed={speed}
              onSpeedChange={this.handleSpeedChange}
            />

            {" - "}
            <Typography id="discrete-slider-custom" gutterBottom>
              {`Generation: ${generation}`}
            </Typography>
            <br />
          </span>
        </div>
        <div className="">
          {this.handleStopButton()}
          <button
            className=""
            type="button"
            disabled={isGameRunning}
            onClick={this.handleStep}
          >
            Step
          </button>
          <button type="button" onClick={this.handleClearBoard}>
            Clear 
          </button>
          <button type="button" onClick={this.handleNewBoard}>
            Random 
          </button>
        </div>
      </div>
    );
  }
}

export default MainGame;
