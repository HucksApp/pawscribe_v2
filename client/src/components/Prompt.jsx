import React from "react";
import PropTypes from "prop-types";

const Prompt = ({ user, root }) => (
  <span className="prompt">
    <span style={{ color: "#4CAF50" }}>{user}</span>
    <span>@</span>
    <span style={{ color: "#FF9800" }}>pawscribe</span>
    <span>:</span>
    <span style={{ color: "#2196F3" }}>{root}</span>
    <span>$</span>
  </span>
);

Prompt.propTypes = {
  user: PropTypes.string.isRequired,
  root: PropTypes.string.isRequired,
};

export default Prompt;
