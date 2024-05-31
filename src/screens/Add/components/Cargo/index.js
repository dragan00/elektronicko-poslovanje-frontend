import React, { useEffect, useState } from "react";

// Helpers
import useDevice from "../../../../helpers/useDevice";

// UI
import { Row, Col, Space, message, List, Button } from "antd";
import styles from "../../add.module.css";
import AddIcon from "../../../../assets/icons/add.png";

// Components
import Card from "../../../../components/Cards/Cargo";
import Form from "./components/Form";
import { connect, useDispatch } from "react-redux";
import { GET_MY_CARGO } from "../../../../redux/modules/Transport/actions";
import CargoHeader from "../../../../components/Cards/Cargo/CargoHeader";
import { useRouteMatch, useHistory } from "react-router-dom";
import CustomVerticalDevider from "../../../../components/CustomVerticalDevider";
import { iOS } from "../../../../helpers/functions";
import CustomDrawer from "../../../../components/CustomDrawer";
import Translate from "../../../../Translate";
const Offer = ({ cargo, currentUser }) => {
  const dispatch = useDispatch();

  // Variables
  const device = useDevice();
  const [drawerVisible, set_drawerVisible] = useState();
  const history = useHistory();

  const setDrawerVisible = (visible) => {
    set_drawerVisible(visible);
  };

  function historyListener(event) {
    set_drawerVisible(false);
  }

  useEffect(() => {
    dispatch({
      type: GET_MY_CARGO,
      queryParams: { status: "active|closed" },
      errorCallback: () => {
        message.error("Upss dogodila se greška kod dohvata podataka", 3);
      },
    });
  }, []);

  // drawer back buttobn

  function historyListener(event) {
    setDrawerVisible(false);
  }

  useEffect(() => {
    window.addEventListener("popstate", historyListener, false);

    return () => {
      window.removeEventListener("popstate", null, false);
    };
  }, []);

  function handleOnClick(update) {
    history.push("#drawer");
    setDrawerVisible(true);
  }

  // drawer back buttobn

  // Loading

  return (
    <div id={styles.warehouses}>
      {/* Main row */}
      <div style={{ width: "100%" }}>
        <Row gutter={device === "desktop" && [0]}>
          {/* Cards */}
          <Col span={24} style={{ width: "100%" }}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Button
                type="dashed"
                style={{
                  height: 80,
                  padding: "0 32px",
                  width: device === "mobile" && "100%",
                  marginTop: device === 'mobile' && 16
                }}
                onClick={handleOnClick}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      textAlign: "left",
                      marginRight: 52,
                      color: "#434343",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        opacity: 0.65,
                        fontSize: device === "mobile" ? 12 : 14,
                      }}
                    >
                     <Translate textKey={"add_butt"}  />
                    </span>
                    <span
                      style={{
                        opacity: 1,
                        fontSize: device === "mobile" ? 14 : 20,
                        marginTop: -6,
                      }}
                    >
                      <Translate textKey={"cargo"} />
                    </span>
                  </div>
                  <img src={AddIcon} style={{ width: 60 }} />
                </div>
              </Button>

              <List
                loading={cargo.status === "loading"}
                header={<CargoHeader />}
                dataSource={cargo.data}
                renderItem={(item) => (
                  <Card id={item.id} item={item} currentUser={currentUser} />
                )}
              />
              <CustomVerticalDevider
                height={60}
                bottomExtend={iOS() ? 145 : 0}
              />
            </Space>
          </Col>

          <CustomDrawer
            onClose={() => {
              setDrawerVisible(false);
            }}
            visible={drawerVisible}
          >
            {/* Rendering filters */}
            <Form
              visible={drawerVisible}
              closeDrawer={() => {
                setDrawerVisible(false);
              }}
            />
          </CustomDrawer>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cargo: state.Transport.getMyCargo,
    currentUser: state.User.user.data,
  };
};

export default connect(mapStateToProps, null)(Offer);
