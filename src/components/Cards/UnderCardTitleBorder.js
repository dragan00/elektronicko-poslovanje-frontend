import React, { memo } from "react";

const UnderCardTitleBorder = ({title}) => {
  return (
    <span style={{ borderBottom: "2px solid #f27b60", paddingRight: 12 }}>
      {title}
    </span>
  );
};

export default memo(UnderCardTitleBorder);
