import React, { useEffect, useRef, useState } from "react";

// UI
import styles from "../input.module.css";
import { Input } from "antd";
import CustomInputLabel from "../CustomInputLabel";

export default function BasicInput({
  value = "",
  label = "",
  name = "",
  type = "",
  shortLabel = true,
  width = "100%",
  autofocus = false,
  onChange,
  disabled,
  onKeyPress,
  style = {},
  containerStyle = {},
  ...props
}) {
  // Variables
  const inputRef = useRef(null);

  function onLabelFocus() {
    inputRef.current.focus();
  }

  return (
    <div style={{ width, position: "relative", ...containerStyle }}>
      {/* Input */}
      <Input
        {...props}
        disabled={disabled}
        className={styles.filterInput}
        value={value}
        name={name}
        type={type}
        onChange={onChange}
        onKeyPress={onKeyPress}
        autoFocus={autofocus}
        ref={inputRef}
        style={{ backgroundColor: disabled && "#f5f5f5", height: 39, ...style }}
      />
      {/* Label */}
      <CustomInputLabel text={label} />
    </div>
  );
}
