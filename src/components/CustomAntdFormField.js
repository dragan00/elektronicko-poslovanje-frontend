import React from "react";

import { Form } from "antd";
import CustomInputLabel from "./Inputs/CustomInputLabel";

const { Item } = Form;

const CustomAntdFormField = ({ children, name, label, style, aditionalInputProps, rules=[]  }) => {
  return (
    <div style={{ position: "relative", ...style }}>
      <Item
        rules={rules}
        name={name}
        {...aditionalInputProps}
        // label=""
      >
        {children}
      </Item>
      <CustomInputLabel text={label} />
    </div>
  );
};

export default CustomAntdFormField;
