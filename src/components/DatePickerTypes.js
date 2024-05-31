import { DatePicker, Form, TimePicker } from "antd";
import React from "react";
import useDevice from "../helpers/useDevice";
import "moment/locale/hr";
import locale from "antd/es/date-picker/locale/hr_HR";
import moment from "moment";

export default function PickerWithType({
  type = "hour",
  onChange,
  value,
  name,
}) {
  // Variables
  const device = useDevice();

  // Styles
  const smallDropdownWidth =
    device === "desktop" ? "calc(50% - 12px)" : "calc(50% - 6px)";

  if (type === "hour") {
    return (
      <Form.Item name={name}>
        <TimePicker
          name={name}
          format={"HH"}
          // value={value}
          style={{ width: "100%" }}
          // onChange={(v) => {
          //   onChange(v, type);
          // }}
          locale={locale}
          inputReadOnly
          onChange={onChange}
        />
      </Form.Item>
    );
  }
  if (type === "date") {
    return (
      <Form.Item name={name}>
        <DatePicker
          // value={value}
          disabledDate={(current) => {
            return moment().add(-1, "days") >= current;
          }}
          style={{ width: "100%" }}
          // onChange={(v) => {
          //   onChange(v, type);
          // }}
          locale={locale}
          onChange={onChange}
          inputReadOnly
        />
      </Form.Item>
    );
  }
  return (
    <Form.Item name={name}>
      <DatePicker
        // value={value}
        disabledDate={(current) => {
          return moment().add(-1, "days") >= current;
        }}
        style={{ width: "100%" }}
        picker={type}
        // onChange={(v) => {
        //   onChange(v, type);
        // }}
        locale={locale}
        onChange={onChange}
        inputReadOnly
      />
    </Form.Item>
  );
}


