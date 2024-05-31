import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Helpers
import useDevice from "../../../../helpers/useDevice";

// UI
import { Row, Col, Space, List, message, Button } from "antd";
import styles from "../../routes.module.css";

// Components
import FiltersIcon from "../../../../assets/icons/filters.png";
import Search from "../../../../components/Inputs/Search";
import Filters from "./components/Filters";
import Card from "../../../../components/Cards/Warehouse";
import { connect, useDispatch } from "react-redux";
import { STOCK } from "../../../../redux/modules/Transport/actions";
import CustomVerticalDevider from "../../../../components/CustomVerticalDevider";
import { filterWarhouses, iOS } from "../../../../helpers/functions";
import CustomDrawer from "../../../../components/CustomDrawer";

const Demand = ({ stock, currentUser }) => {
  const dispatch = useDispatch();
  // Variables
  const history = useHistory();
  const device = useDevice();
  const [drawerVisible, setDrawerVisible] = useState();
  const [search, setSearch] = useState("");
  const [blockedUsers, set_blockedUsers] = useState(false);

  // Methods
  function handleOnChange(e) {
    let value = e.target.value;
    setSearch(value);
  }

  function handleOnClear() {
    setSearch("");
  }

  function historyListener(event) {
    setDrawerVisible(false);
  }

  useEffect(() => {
    dispatch({
      type: STOCK,
      errorCallback: () => {
        message.error(<Translate textKey={"fetch_data_error"} />, 6);
      },
    });
  }, []);
  useEffect(() => {
    window.addEventListener("popstate", historyListener, false);

    return () => {
      window.removeEventListener("popstate", null, false);
    };
  }, []);

  function handleOnClick() {
    history.push("#drawer");
    setDrawerVisible(true);
  }

  // Loading

  return (
    <div id={styles.warehouses}>
      {/* Main row */}
      <Row gutter={device === "desktop" && [0]}>
        {/* Cards */}
        <Col lg={24} xl={12} style={{ width: "100%" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "top",
              }}
              className={`${(styles.CTARow, styles.CTARowFilter)}`}
            >
              <div style={{ width: 270 }}>
                <Search
                  value={search}
                  onChange={handleOnChange}
                  onClear={handleOnClear}
                />
              </div>
              {device === "mobile" && (
                <div>
                  <Button
                    style={{ height: 46, width: 46, marginLeft: -46 }}
                    icon={
                      <img
                        src={FiltersIcon}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    shape="circle"
                    onClick={handleOnClick}
                  />
                </div>
              )}
            </div>

            {/* Cards */}
            <div>
              <List
                loading={stock.status === "loading"}
                dataSource={filterWarhouses(stock.data.data, search)}
                footer={<CustomVerticalDevider height={60} />}
                renderItem={(item) => (
                  <Card currentUser={currentUser} item={item} />
                )}
              />
              <CustomVerticalDevider
                height={60}
                bottomExtend={iOS() ? 145 : 0}
              />
            </div>
          </Space>
        </Col>

        {device === "desktop" ? (
          // Filters
          <Col lg={24} xl={12}>
            <Filters />
          </Col>
        ) : (
          <CustomDrawer
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
          >
            {/* Rendering filters */}
            <Filters
              close={() => {
                setDrawerVisible(false);
              }}
            />
          </CustomDrawer>
        )}
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stock: state.Transport.stock,
    currentUser: state.User.user.data,
  };
};

export default connect(mapStateToProps, null)(Demand);
