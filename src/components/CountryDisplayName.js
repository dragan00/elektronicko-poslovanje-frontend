import { Tooltip } from "antd";
import React, { memo } from "react";
import useDevice from "../helpers/useDevice";

const CountryDisplayName = ({ country }) => {
  const device = useDevice();


  if (device === "desktop") {
    return country.name;
  }

  return <Tooltip title={country.name}>{country.alpha2Code}</Tooltip>;
};

export default memo(CountryDisplayName);
