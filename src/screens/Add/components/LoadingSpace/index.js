import React, { useEffect, useState } from "react";

// Helpers
import useDevice from "../../../../helpers/useDevice";

// UI
import { Row, Col, Space, message, List, Button } from "antd";
import styles from "../../add.module.css";
import AddIcon from "../../../../assets/icons/add.png";

// Components
import Card from "../../../../components/Cards/LoadSpace/index";
import Form from "./components/Form";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { GET_MY_LOADING_SPACES } from "../../../../redux/modules/Transport/actions";
import CardHeader from "../../../../components/Cards/LoadSpace/Header";
import CustomVerticalDevider from "../../../../components/CustomVerticalDevider";
import { iOS } from "../../../../helpers/functions";
import CustomDrawer from "../../../../components/CustomDrawer";
import Translate from "../../../../Translate";

const Offer = ({ getMyLoadingSpaces, currentUser }) => {
  // Variables
  const device = useDevice();
  const history = useHistory();
  const dispatch = useDispatch();
  const [drawerVisible, setDrawerVisible] = useState();

  useEffect(() => {
    dispatch({
      type: GET_MY_LOADING_SPACES,
      queryParams: { status: "active|closed" },
      errorCallback: () => {
        message.error(<Translate textKey={"fetch_data_error"} />, 3);
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

  return (
    <div id={styles.warehouses}>
      {/* Main row */}
      <div style={{ width: "100%" }}>
        <Row gutter={device === "desktop" && [0]}>
          {/* Cards */}
          <Col lg={24} xl={24} style={{ width: "100%" }}>
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
                      <Translate textKey={"loading_space"} />
                    </span>
                  </div>
                  <img src={AddIcon} style={{ width: 60 }} />
                </div>
              </Button>

              {/* Cards */}
              <List
                loading={getMyLoadingSpaces.status === "loading"}
                header={<CardHeader />}
                dataSource={getMyLoadingSpaces.data}
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
    getMyLoadingSpaces: state.Transport.getMyLoadingSpaces,
    currentUser: state.User.user.data,
  };
};

export default connect(mapStateToProps, null)(Offer);
