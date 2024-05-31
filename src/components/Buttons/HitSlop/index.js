import React from "react";

// Ui
import styles from "../button.module.css";

export default function HitSlop({
  children,
  onClick,
  correction = 15,
  parentWidth = 24,
  parentHeight = 24,
  width = 80,
  height = 80,
  style = {},
}) {
  return (
    <div
      id={styles.hitSlop}
      className={styles.parent}
      style={{
        width: parentWidth,
        height: parentHeight,
        ...style,
      }}
    >
      <div
        onClick={onClick}
        className={styles.child}
        style={{
          width,
          height,
          transform: `translateY(calc(-50% + ${correction}px))`,
        }}
      ></div> 
      {children}
    </div>
  );
}
