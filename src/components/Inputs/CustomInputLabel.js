import React from "react";

import styles from "../Dropdowns/dropdown.module.css";

const CustomInputLabel = ({ text, style }) => {
  return (
    <p
      className={`${styles.filterLabel}`}
      style={{ ...style, width: 'max-content' }}
    >
      <div
        style={{ 
          position: "relative", 
          zIndex: 1234, 
          display: "inline-block"
        }}
      >
        {" "}
        {text}
      </div>
      <div
        style={{
          position: "relative",
          top: -9,
          left: -6,
          height: 2,
          backgroundColor: "white",
          padding: "0 10px",
          width: 'calc(100% + 20px)',
        }}
      />
    </p>
  );
};

export default CustomInputLabel;
