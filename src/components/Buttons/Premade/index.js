import React from "react";

// UI
import styles from "../button.module.css";
import { colors } from "../../../styles/colors";

// Icons
import apply from "../../../assets/icons/apply.png";
import auction from "../../../assets/icons/auction.png";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

// Constants

const iconSize = {
  small: 28,
  medium: 36,
  large: 42,
  extraLarge: 48,
};

const imgSize = {
  small: 14,
  medium: 18,
  large: 22,
  extraLarge: 28,
};

function Add({
  size = "small" /* small, medium or large */,
  color = "grey",
  onClick,
  round = false
}) {
  return (
    <div
      onClick={onClick}
      id={styles.iconButton}
      style={{
        width: iconSize[size],
        height: iconSize[size],
        borderRadius: round && 3
      }}
    >
      <AiOutlinePlus
        style={{
          width: imgSize[size],
          height: imgSize[size],
          color: colors[color],
        }}
      />
    </div>
  );
}

function Remove({
  size = "small" /* small, medium or large */,
  color = "grey",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      id={styles.iconButton}
      style={{
        width: iconSize[size],
        height: iconSize[size],
      }}
    >
      <IoClose
        style={{
          width: imgSize[size],
          height: imgSize[size],
          color: colors[color],
        }}
      />
    </div>
  );
}

function SavedTab({
  size = "small" /* small, medium or large */,
  color = "grey",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      id={styles.iconButton}
      style={{
        width: iconSize[size],
        height: iconSize[size],
      }}
    >
      <BsBookmark
        style={{
          width: imgSize[size],
          height: imgSize[size],
          color: colors[color],
        }}
      />
    </div>
  );
}

export function AddButton({ onClick, color = "grey", size = "extraLarge" }) {
  return (
    <Button
      onClick={onClick}
      icon={
        <span style={{ fontSize: 90, position: "absolute", top: -56, left: 6 }}>
          +
        </span>
      }
      style={{
        position: "relative",
        borderRadius: "50%",
        width: 57,
        height: 57,
        color: colors[color],
      }}
    />
  );
}

function Filters({
  size = "extraLarge" /* small, medium or large */,
  color = "grey",
  onClick,
  update,
  moreIcon,
}) {
  return (
    <div
      onClick={onClick}
      id={styles.iconButton}
      style={{
        width: iconSize[size] * 1.8,
        height: iconSize[size] / 1.5,
      }}
    >
      <FiFilter
        style={{
          width: imgSize.medium,
          height: imgSize.medium,
          color: colors[color],
        }}
      />
      {moreIcon}
    </div>
  );
}

function Apply({
  size = "small" /* small, medium or large */,
  color = "grey",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      id={styles.iconButton}
      style={{
        width: iconSize[size],
        height: iconSize[size],
      }}
    >
      <img
        src={apply}
        alt=""
        style={{
          width: imgSize[size],
          height: imgSize[size],
        }}
      />
    </div>
  );
}

function Auction({
  size = "large" /* small, medium or large */,
  color = "grey",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      id={styles.iconButton}
      style={{
        width: iconSize[size],
        height: iconSize[size],
      }}
    >
      <img
        src={auction}
        alt="Auction button"
        style={{
          width: imgSize[size],
          height: imgSize[size],
        }}
      />
    </div>
  );
}

export { Add, Remove, SavedTab, Filters, Apply, Auction };
