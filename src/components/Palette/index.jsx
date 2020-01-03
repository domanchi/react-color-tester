import React from "react";

import "./palette.scss";
import Swatch from "components/Swatch";

export default class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [
        "red",
        "blue",
        "yellow",
        "beige",
        "purple",
        "green",
      ],
    };
  }

  render() {
    const swatches = [];
    this.state.colors.forEach((color, index) => {
      swatches.push(
        <Swatch color={color} key={index} />
      );
    })

    return (
      <div className="palette">
        {swatches}
      </div>
    );
  }
}