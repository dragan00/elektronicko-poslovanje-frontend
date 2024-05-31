import React from "react";

const CloseElement = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 100 * 100 * 3123,
        width: "100%",
        background: "transparent",
        zIndex: 1000,
      }}
    />
  );
};

export default CloseElement;
