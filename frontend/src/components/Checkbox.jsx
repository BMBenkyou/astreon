import React from "react";
import "./Checkbox.css"; // Import the external CSS file

const Checkbox = ({ onChange }) => {
  return (
    <div className="checkbox-wrapper">
      <label className="burger" htmlFor="burger">
        <input type="checkbox" id="burger" onChange={onChange} />
        <span />
        <span />
        <span />
      </label>
    </div>
  );
};

export default Checkbox;
