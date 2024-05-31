import React from "react";

// UI
import { Select } from "antd";
import styles from "../dropdown.module.css";


export default function Basic({
  style = {},
  containerStyle = {},
  children,
  shortLabel = true,
  hideLabel = false,
  ...props
}) {
  
  return (
    <div style={{ ...containerStyle, position: "relative" }} >
      <Select 
        {...props}
        placeholder={null}
        style={{ width: '100%', ...style }}
      >
        {/* Rendering options */}
        { children }
      </Select>

      {/* Label */}
      { 
        !hideLabel && (
            <p
                className={styles.filterLabel}
                style={{ width: props.shortLabel ?  "90%" : "max-content" }}
            >
                { props.placeholder }
            </p>
        )}
    </div>
  );
}
