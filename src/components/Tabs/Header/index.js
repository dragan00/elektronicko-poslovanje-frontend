import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import { useHistory, useLocation } from "react-router";
import { colors } from "../../../styles/colors";
import Translate from "../../../Translate";

const { TabPane } = Tabs;

function Tab({}) {
  // Variables

  const location = useLocation();

  const [tabKey, set_tabKey] = useState("cargo");
  const history = useHistory();

  useEffect(() => {
    set_tabKey(location.pathname.split("/").slice(-1)[0]);
  }, [location]);

  // Methods
  function handleClick(key) {
    history.push(key);
  }

  return (
    <div id="main-tabs" className="header-tabs">
      <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={handleClick}>
        {TABS.map((item) => (
          <TabPane
            key={item.path}
            tab={
              <div
                className="tab-item"
                style={{
                  color:
                    `${location.pathname.split("/")[2] === item.path && colors.lightPurple} !important`,
                  opacity: location.pathname.split("/")[2] === item.path && 1
                }}
                to={`${location.pathname.split("/")[1]}/${item.path}`}
              >
                {item.name}
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}

const TABS = [
  {
    name: <Translate textKey={"cargo"} />,
    path: "cargo",
  },
  {
    name: <Translate textKey={"loading_space"} />,
    path: "loadingSpace",
  },
  {
    name: <Translate textKey={"warehouses"} />,
    path: "warehouses",
  },
];

export default Tab;
