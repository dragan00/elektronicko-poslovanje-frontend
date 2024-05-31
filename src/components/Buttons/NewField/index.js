import React from "react";

// UI
import { Button } from "antd";
import styles from "../button.module.css";

// Icons
import icon from "../../../assets/icons/new_field.png";

export default function NewField({
  text = "",
  loading = false,
  onClick,
  disabled,
  style = {}
}) {
  return (
    <div id={styles.newField} style={{ ...style, transition: '250ms ease' }}>
      <Button
        disabled={disabled}
        onClick={onClick}
        loading={loading}
        className={styles.style}
      >
        <div className={styles.icon}>
          <img src={icon} alt="Button icon" />
        </div>
        {text}
      </Button>
    </div>
  );
}
