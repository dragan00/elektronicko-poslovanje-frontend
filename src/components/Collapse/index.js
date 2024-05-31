import React, { useState } from "react";
import useDevice from "../../helpers/useDevice";

// UI
import { Collapse } from "antd";

const { Panel } = Collapse;

export default function Collapsible({
  header = "",
  collapsed = false,
  children,
  style,
  specialCollapse = false,
  disableCollapse,
}) {
  // Variables
  const device = useDevice();
  const [isCollapsed, setIsCollapsed] = useState(
    device === "desktop" ? (specialCollapse ? collapsed : false) : collapsed
  );

  const activeKey =
    device === "desktop" ? "opened" : isCollapsed ? "collapsed" : "opened";

  const special = specialCollapse
    ? isCollapsed
      ? "collapsed"
      : "opened"
    : activeKey;

  // Methods
  function handleOnChange() {
    if (device === "mobile" || specialCollapse) {
      setIsCollapsed((previousState) => !previousState);
    }
  }

  return (
    <Collapse
      style={{ ...style }}
      bordered={false}
      className="site-collapse-custom-collapse"
      expandIconPosition="right"
      defaultActiveKey={["opened"]}
      onChange={() => {
        if (disableCollapse) {
          return;
        }
        handleOnChange();
      }}
      activeKey={special}
    >
      <Panel
        showArrow={specialCollapse ? true : device === "mobile"}
        header={header}
        key={"opened"}
        className="site-collapse-custom-panel"
      >
        {/* Rendering children */}
        {children}
      </Panel>
    </Collapse>
  );
}
