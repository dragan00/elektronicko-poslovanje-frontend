import React from "react";
import { Tabs } from "antd";

import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import Translate from "../../../../../Translate";

const { TabPane } = Tabs;

function Tab({ location, match, history, setActiveKey }){

  // Variables
  const pathname = location.pathname.slice(match.url.length + 1)
  const tab = TABS.find(item => pathname.startsWith(item.path))?.path || pathname

  // Methods
  function handleClick(key){
    history.replace(key);
    setActiveKey();
  };

  return (
    <div id="main-tabs" style={{ marginBottom: 32, marginTop: 20 }}>
      <Tabs defaultActiveKey={tab} onChange={handleClick}>
        {
          TABS.map(item => 
            <TabPane
              key={item.path}
              tab={
                <NavLink to={`${match.url}/${item.path}`}>
                    { item.name }
                </NavLink>
              }
            />
          )
        }
      </Tabs>
    </div>
  );
};

const TABS = [
    { 
        name: <Translate textKey={"cargo"} />, 
        path: 'cargo', 
    },
    { 
        name: <Translate textKey={"loading_space"} />, 
        path: 'loadingSpace', 
    },
    { 
        name: <Translate  textKey={"warehouses"} />, 
        path: 'warehouses',  
    },
  ]

export default withRouter(Tab);
