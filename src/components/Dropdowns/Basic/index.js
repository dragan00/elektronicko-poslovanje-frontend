import React, { useState, useRef } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";

// UI
import { Select } from "antd";
import styles from "../dropdown.module.css";
import { getTranslation } from "../../../helpers/functions";
import { useSelector } from "react-redux";
 

const { Option } = Select;

export default function Basic({
  data = [],
  defaultValue,
  placeholder = "",
  width = "100%",
  marginBottom = 0,
  marginLeft = 0,
  onChange,
  value,
  mode,
  disabled,
  shortLabel = true,
  onFocus,
  loading,
  style,

  ...props
}) {
  // Refs
  const selectRef = useRef(null);
  const ref = useDetectClickOutside({ onTriggered: () => setIsOpened(false) });
  const {appLang} = useSelector(state => state.User);

  // Variables
  const [isOpened, setIsOpened] = useState(false);
  const showLabel =
    value !== [] && value !== null && value !== undefined && value != "";

  // Methods
  function onLabelFocus() {
    selectRef.current.focus();
  }

  function handleOnClick() {
    setIsOpened((previousState) => !previousState);
  }

  return (
    <div ref={ref} style={{ ...style, position: "relative" }}>
      <Select
        allowClear={true}
        {...props}
        loading={loading}
        onFocus={onFocus}
        disabled={disabled}
        ref={selectRef}
        mode={mode}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        onClick={handleOnClick}
        open={isOpened}
        style={{
          minWidth: 120,
          width,
          marginBottom,
          marginLeft,
        }}
        showSearch
        optionFilterProp="name"
        filterOption={(input, option) => {
          return (
            option.props.children?.toLowerCase().indexOf(input?.toLowerCase()) >=
            0
          );
        }}
      >
        {data.map((item, index) => (
          <Option key={index} value={item.id} className={styles.option}>
            {typeof item === "object"
              ? Array.isArray(item.name)
                ? getTranslation(item.name, appLang)?.name
                : item.name
              : item}
          </Option>
        ))}
      </Select>

      {/* Label */}
      {true && (
        <p
          onClick={onLabelFocus}
          className={styles.filterLabel}
          style={{ width: shortLabel ? "max-content" : "90%" }}
        >
          {placeholder}
        </p>
      )}
    </div>
  );
}
