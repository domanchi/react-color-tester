import PropTypes from "prop-types";
import React from "react";

import "./swatch.scss";

export default class Swatch extends React.Component {
  render() {
    return (
      <div
        className="swatch"
        style={{
          backgroundColor: this.props.color
        }}
      />
    );
  }
}

Swatch.propTypes = {
  color: PropTypes.string.isRequired,
};