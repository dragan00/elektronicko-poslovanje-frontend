import React from "react";

// UI
import { Button } from "antd";
import styles from "../button.module.css";
import { colors } from "../../../styles/colors";
import Translate from "../../../Translate";

export default function BasicInput({
  icon,
  text = "",
  width = "100%",
  fill = false,
  loading = false,
  noIcon = false,
  color="purple",
  onClick,
  disabled = false,
  htmlType = "button",
  style = {},
  containerStyle = {}
}) {
  // Methods
  // function capitalize(string) {
  //     return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  return (
    <div id={styles.basic} style={{ ...containerStyle }}>
      <Button
        htmlType={htmlType}
        disabled={disabled}
        onClick={onClick}
        loading={loading}
        className={styles.style}
        block={fill}
        style={{
          width,
          backgroundColor: color === "white" ? "#fff" : colors[color],
          color: color === "white" ? "#909090" : "#fff",
          border: color === "white" && "1px solid #d9d9d9",
          opacity: disabled ? .5 : 1,
          ...style
        }}
      >
        {!noIcon && (
          <div className={styles.icon}>
            <img src={icon} alt="Button icon" />
          </div>
        )}
        { loading ? <Translate textKey={"loading"} /> : text}
      </Button>
    </div>
  );
}
