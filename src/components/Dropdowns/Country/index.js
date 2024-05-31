import React, { useState, useRef,} from "react";
import { useToggle } from "react-use";
import { useDetectClickOutside } from "react-detect-click-outside";

// UI
import { Select, Button } from "antd";
import styles from "../dropdown.module.css";
import { connect } from "react-redux";
import CustomInputLabel from "../../Inputs/CustomInputLabel";
import Translate from "../../../Translate";

const { Option } = Select;
const Country = ({
  defaultValue,
  width = "100%",
  onChange,
  value,
  countries,
  showButtonAll = true,
  style,
}) => {
  // Refs
  const selectRef = useRef(null);
  const ref = useDetectClickOutside({ onTriggered: () => setIsOpened(false) });

  // Variables
  const [isOpened, setIsOpened] = useState(false);
  const [allCountries, toggleAllCountries] = useToggle(false);


  return (
    <div
      style={{ ...style, position: "relative", display: "flex" }}
      ref={ref}
      id="country"
    >
      <Select
        ref={selectRef}
        value={value}
        defaultValue={defaultValue}
        onChange={(v) => {
          onChange(v);
          toggleAllCountries(false);
        }}
        onClick={() => setIsOpened((previousState) => !previousState)}
        open={isOpened}
        placeholder={null}
        style={{
          minWidth: 100,
          width: showButtonAll ? `calc(${width} - 66px)` : "100%",
        }}
        showSearch
        optionFilterProp="name"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {countries &&
          countries.map((item, index) => (
            <Option key={index} value={item.id} className={styles.option}>
              {item.name}
            </Option>
          ))}
      </Select>

      {/* All countries */}
      {showButtonAll && (
        <Button
          onClick={(v) => {
            onChange(undefined);
            toggleAllCountries();
          }}
          type={allCountries ? "primary" : "default"}
          className={styles.allCountries}
        >
          <Translate textKey={"all_countries"} />
        </Button>
      )}

      {/* Label */}
      <CustomInputLabel text={<Translate textKey={"country"} />} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    countries: state.User.prepare.data.countries,
  };
};

export default connect(mapStateToProps, null)(Country);
