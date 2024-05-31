import React, { useState } from "react";
import useDevice from "../../../helpers/useDevice";

// UI
import { Collapse, Checkbox } from "antd";
import styles from "../collapse.module.css";

const { Panel } = Collapse;

export default function CheckboxCollapse({
  header = "",
  onChange,
  children,
  collapsed = false,
  checked,
}) {
  // Variables
  const device = useDevice();
  const [isCollapsed, setIsCollapsed] = useState(
    device === "desktop" ? false : collapsed
  );
  const activeKey =
    device === "desktop" ? "opened" : isCollapsed ? "collapsed" : "opened";

  // Methods
  function handleOnChange() {
    if (device === "mobile") {
      setIsCollapsed((previousState) => !previousState);
    }
  }

  function handlePrevent(e) {
    e.stopPropagation();
  }

  const cardIcon = (
    <div onClick={handlePrevent} className={styles.multipleIcon}>
      <Checkbox value={"value.active"} checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <Collapse
      bordered={false}
      className="site-collapse-custom-collapse-checkbox"
      expandIconPosition="right"
      defaultActiveKey={["opened"]}
      onChange={handleOnChange}
      activeKey={activeKey}
    >
      <Panel
        header={header}
        key={"opened"}
        className="site-collapse-custom-panel-checkbox"
        extra={cardIcon}
      >
        {children}
      </Panel>
    </Collapse>
  );
}
