import React from "react";
import "./square.css";

// ------------------------ Square Component ------------------------
const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default Square;
