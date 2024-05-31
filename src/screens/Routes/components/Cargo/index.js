import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Helpers
import useDevice from "../../../../helpers/useDevice";

// UI
import { Row, Col, Space, message, List, Button } from "antd";
import styles from "../../routes.module.css";
import addFilter from "../../../../assets/icons/add_filter.png";
import editFilter from "../../../../assets/icons/edit_filter.png";
import loadMore from "../../../../assets/icons/load_more.png";

// Components
import DynamicTabs from "../../components/Tabs/Dynamic";
import Filters from "./components/Filters";
import Card from "../../../../components/Cards/Cargo";
import { connect, useDispatch } from "react-redux";
import {
  CARGO,
  SET_CITIES_FILTER,
} from "../../../../redux/modules/Transport/actions";
import CargoHeader from "../../../../components/Cards/Cargo/CargoHeader";
import {
  createQueryParamsFromFilter,
  iOS,
  mapCItiesFilter,
  sortByPostalCode,
} from "../../../../helpers/functions";
import { CARGO_PLACE_TYPE } from "../../../../helpers/consts";
import CustomVerticalDevider from "../../../../components/CustomVerticalDevider";
import { unstable_batchedUpdates } from "react-dom";
import CustomDrawer from "../../../../components/CustomDrawer";
import CitiesFilter from "../../../../components/CitiesFilter";
import Translate from "../../../../Translate";

const Cargo = ({ cargo, panes, activePaneKey, currentUser, citiesFilter }) => {
  // Variables

  const dispatch = useDispatch();
  const history = useHistory();
  const device = useDevice();
  const [drawerVisible, setDrawerVisible] = useState();
  const [updateFilter, set_updateFilter] = useState(false);
  const [citiesFilterVisible, set_citiesFilterVisible] = useState(false);

  useEffect(() => {
    const queryParams =
      activePaneKey !== "tab"
        ? createQueryParamsFromFilter(
            panes.find((x) => x.path === activePaneKey).filters
          )
        : null;
    dispatch({
      type: CARGO,
      queryParams,
      startWithEmptyArr: true,
      errorCallback: () => {
        message.error(<Translate textKey={"fetch_data_error"} />, 6);
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: SET_CITIES_FILTER,
      data: { cities: mapCItiesFilter(cargo.data.data, "load_unload"), citiesIds: [] },
    });
  }, [cargo.data.data]);

  // drawer back buttobn
  function historyListener(event) {
    setDrawerVisible(false);
    set_citiesFilterVisible(false);
  }

  useEffect(() => {
    window.addEventListener("popstate", historyListener, false);

    return () => {
      window.removeEventListener("popstate", null, false);
    };
  }, []);

  function handleOnClick(update) {
    history.push("#drawer");
    unstable_batchedUpdates(() => {
      setDrawerVisible(true);
      set_updateFilter(!!update);
    }, []);
  }

  // drawer back buttobn

  let filtredSortedData = cargo.data.data;

  if (!"sortByZip_code") {
    filtredSortedData = sortByPostalCode(
      cargo.data.data,
      "load_unload",
      CARGO_PLACE_TYPE.LOAD
    );
  }

  if (citiesFilter.citiesIds.length) {
    filtredSortedData = filtredSortedData.filter((x) =>
      !!x.load_unload.filter((y) => citiesFilter.citiesIds.includes(y.city?.id)).length 
    );
  }

  return (
    <div>
      <div className={styles.flexRowSpaceBetween}>
        <DynamicTabs listCollection={"cargo"} />
        {device === "desktop" && (
          <div className={styles.flexRowSpaceBetween}>
            <div>
              <Button
                icon={<img src={addFilter} style={{ width: 24, height: 18 }} />}
                style={{ height: 40, width: 40 }}
                shape="circle"
                onClick={() => handleOnClick(false)}
              />
            </div>
            {activePaneKey !== "tab" && (
              <div style={{ marginLeft: 10 }}>
                <Button
                  icon={
                    <img src={editFilter} style={{ width: 24, height: 18 }} />
                  }
                  style={{ height: 40, width: 40 }}
                  shape="circle"
                  update={true}
                  onClick={() => handleOnClick(true)}
                />
              </div>
            )}
            <div style={{ marginLeft: 12 }}>
              <Button
                icon={
                  <img
                    src={addFilter}
                    style={{ width: 24, height: 18, marginRight: 6 }}
                  />
                }
                update={true}
                onClick={() => {
                  history.push("#drawer");
                  set_citiesFilterVisible(true);
                }}
              >
                <Translate textKey={"cities"} /> <span style={{display: "inline-block", width: 6}} />{ citiesFilter.citiesIds.length}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cargo}>
        {/* Dynamic search tabs */}

        <div style={{ width: "100%" }}>
          <Row>
            <Col span={24} style={{ width: "100%" }}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                {device === "mobile" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className={styles.flexRow}>
                      <div>
                        <Button
                          icon={
                            <img
                              src={addFilter}
                              style={{ width: 24, height: 18 }}
                            />
                          }
                          style={{ height: 40, width: 40 }}
                          shape="circle"
                          onClick={() => handleOnClick(false)}
                        />
                      </div>
                      {activePaneKey !== "tab" && (
                        <div style={{ marginLeft: 10 }}>
                          <Button
                            icon={
                              <img
                                src={editFilter}
                                style={{ width: 24, height: 18 }}
                              />
                            }
                            style={{ height: 40, width: 40 }}
                            shape="circle"
                            update={true}
                            onClick={() => handleOnClick(true)}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Button
                        icon={
                          <img
                            src={addFilter}
                            style={{ width: 24, height: 18, marginRight: 6 }}
                          />
                        }
                        update={true}
                        onClick={() => {
                          history.push("#drawer");
                          set_citiesFilterVisible(true);
                        }}
                      >
                        <Translate textKey={"cities"} /> {citiesFilter.citiesIds.length}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cards */}
                <div>
                  <List
                    header={<CargoHeader />}
                    loading={cargo.status === "loading"}
                    loadMore={
                      cargo.data.cursor.next_cursor && (
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            style={{ marginTop: 20, fontSize: 16 }}
                            type="link"
                            onClick={() => {
                              dispatch({
                                type: CARGO,
                                startWithEmptyArr: false,
                                queryParams: {
                                  ...createQueryParamsFromFilter(
                                    panes.find((x) => x.path === activePaneKey)
                                      ?.filters
                                  ),
                                  next_cursor: cargo.data.cursor.next_cursor,
                                },
                                errorCallback: () => {
                                  message.error(
                                    "Upss dogodila se greška kod dohvata podataka...",
                                    6
                                  );
                                },
                              });
                            }}
                          >
                            <Translate textKey={"upload_butt"}  />  <br />
                            <img
                              src={loadMore}
                              style={{ width: 24, height: 24, marginTop: -16 }}
                            />
                          </Button>
                        </div>
                      )
                    }
                    dataSource={filtredSortedData}
                    renderItem={(item) => {
                      if (item.length === 0) {
                        return null;
                      }
                      return (
                        <div>
                          <Card
                            id={item.id}
                            item={item}
                            currentUser={currentUser}
                          />
                        </div>
                      );
                    }}
                  />
                  <CustomVerticalDevider
                    height={45}
                    bottomExtend={iOS() ? 145 : 0}
                  />
                </div>
              </Space>
            </Col>
            <CustomDrawer
              onClose={() => {
                setDrawerVisible(false);
                set_updateFilter(false);
              }}
              visible={drawerVisible}
            >
              {/* Rendering filters */}
              <Filters
                updateFilter={updateFilter}
                listCollection={"cargo"}
                closeDrawer={() => {
                  setDrawerVisible(false);
                  set_updateFilter(false);
                }}
                visible={drawerVisible}
              />
            </CustomDrawer>
            <CustomDrawer
              onClose={() => {
                set_citiesFilterVisible(false);
              }}
              visible={citiesFilterVisible}
            >
              <CitiesFilter close={() => set_citiesFilterVisible(false)} />
            </CustomDrawer>
          </Row>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cargo: state.Transport.cargo,
    panes: state.Transport.panes.cargo,
    activePaneKey: state.Transport.activePaneKey.cargo,
    currentUser: state.User.user.data,
    citiesFilter: state.Transport.citiesFilter,
  };
};

export default connect(mapStateToProps, null)(Cargo);

const INITIAL_PANES = [
  // {
  //     name: 'Tab 1',
  //     path: "tab-1",
  //     key: '1',
  //     closable: false
  // }
];
