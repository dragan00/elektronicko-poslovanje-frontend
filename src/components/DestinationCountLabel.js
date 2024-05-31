import React from "react";

const DestionationCountLabel = ({label, count}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }}
  >
    <div
      style={{
        fontWeight: 200,
        fontSize: 12,
        margin: "0 12px 0 0",
        paddingTop: 5,
        height: 24,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 16,
        height: 24,
      }}
    >
      {count}
    </div>
  </div>
);

export default DestionationCountLabel;
