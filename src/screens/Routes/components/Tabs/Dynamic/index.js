import React, { useEffect, useState, useRef } from "react";

// UI
import { Tabs, message } from "antd";
import { CloseOutlined } from '@ant-design/icons'
import Close from '../../../../../assets/icons/close_outlined.png'

// Sortable tabs
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

// Router
import { NavLink, useRouteMatch } from "react-router-dom";

// Components
// import Plus from "../../../../../components/Buttons/Plus";
// import { SavedTab } from "../../../../../components/Buttons/Premade";
import { connect, useDispatch } from "react-redux";
import {
  CARGO,
  GET_LOADING_SPACE,
  PANES,
  SET_ACTIVE_FILTER,
  SET_ACTIVE_KEY,
  SET_ACTIVE_PANE,
  SET_PANES,
} from "../../../../../redux/modules/Transport/actions";
import { useLocation } from "react-use";
import { createQueryParamsFromFilter } from "../../../../../helpers/functions";
import Translate from "../../../../../Translate";

const { TabPane } = Tabs;

const Tab = ({ setActivePane, panes, activePaneKey, listCollection }) => {
  // Tabs
  const tabsRef = useRef(null);

  // Variables
  const dispatch = useDispatch();
  const match = useRouteMatch();

  //? Adding new pane
 

  //? Removing selected pane
  function remove(targetKey) {
    const activekey = { ...activePaneKey };
    let newPanes = { ...panes };
    let arr = [...newPanes[listCollection]];

    let index = arr.findIndex((x) => x.path === targetKey);

    arr.splice(index, 1);
    newPanes[listCollection] = arr;

    const { filters, path } = arr[arr.length - 1];

    activekey[listCollection] = path;
    dispatch({ type: SET_ACTIVE_KEY, data: activekey });


    dispatch({
      type: listCollection === "cargo" ? CARGO : GET_LOADING_SPACE,
      startWithEmptyArr: true,
      queryParams: {
        ...createQueryParamsFromFilter(filters),
      },
      errorCallback: () => {
        message.error("Upss dogodila se greška kod dohvata podataka...", 6);
      },
    });

    dispatch({
      type: PANES,
      data: { panes: newPanes },
      successCallback: () => {
        dispatch({ type: SET_PANES, data: newPanes });
      },
    });
  }

  // Methods
  function handleClick(key) {
    const activekey = { ...activePaneKey };
    activekey[listCollection] = key;

    dispatch({ type: SET_ACTIVE_KEY, data: activekey });

    const { filters } = panes[listCollection].find((x) => x.path === key);
    dispatch({
      type: listCollection === "cargo" ? CARGO : GET_LOADING_SPACE,
      startWithEmptyArr: true,
      queryParams: key === "tab" ? {} : createQueryParamsFromFilter(filters),
      errorCallback: () => {
        message.error(<Translate textKey={"fetch_data_error"} />, 6);
      },
    });
  }

  return (
    <div
      ref={tabsRef}
      id="dynamic-tabs"
    >
      <Tabs
        defaultActiveKey={activePaneKey[listCollection]}
        onChange={handleClick}
        onEdit={remove}
        type="editable-card"
        hideAdd={true}
        activeKey={activePaneKey[listCollection]}
      >
        {panes[listCollection].map((item, index) => (
          <TabPane
            key={item.path}
            closable={index !== 0}
            closeIcon={
              <img src={Close} style={{ width: 20, height: 20 }} />
            }
            tab={
              <div key={index} index={index} item={item} style={{ paddingRight: index && 48 }}>
                <Translate textKey={item.name} />
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    panes: state.Transport.panes,
    activePaneKey: state.Transport.activePaneKey,
  };
};

export default connect(mapStateToProps, null)(Tab);
