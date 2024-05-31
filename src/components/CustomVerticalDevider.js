import React, { useState } from "react";
import useDevice from "../helpers/useDevice";

//bottomExtend radi iphone da se produyi scroll

const CustomVerticalDevider = ({ height, bottomExtend }) => {
  const device = useDevice();

  let _addedHeight = +bottomExtend || 0;

  if (device === "mobile") {
    _addedHeight += 45;
  }

  if (height && !bottomExtend) {
    return <div style={{ height: height + _addedHeight }} />;
  }

  return <div style={{ height: 15 + _addedHeight }} />;
};

export default CustomVerticalDevider;
