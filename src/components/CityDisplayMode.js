import { Tooltip } from "antd";
import React, { memo } from "react";
import useDevice from "../helpers/useDevice";

const CityDisplayMode = ({ city }) => {
  const device = useDevice();

  if (device === "desktop") {
    return city.name;
  }

  return <Tooltip title={city.name}>{treeDots(city.name)}</Tooltip>;
};

const treeDots = (word) => {
  if (!word) {
    return "-";
  }
  if (word.length < 16) {
    return word;
  }
  let tmp = "";
  for (let index = 0; index < 15; index++) {
    tmp += word[index] || "";
  }

  if (tmp.length === word.length) {
    return tmp;
  }
  return tmp + "...";
};

export default memo(CityDisplayMode);
