import React, { Component } from "react";
import Boards from "./Board";
import "../style.scss";


class MainGame extends Component {
  render() {
    return (
      <div>
        <Boards />
      </div>
    );
  }
}

export default MainGame;
