import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// Helpers
import useDevice from "../../../../helpers/useDevice";

// UI
import { Row, Col, Space, List, message } from "antd";
import styles from "../../add.module.css";

// Components
import { Add } from "../../../../components/Buttons/Premade";
import Search from "../../../../components/Inputs/Search";
import Card from "../../../../components/Cards/Warehouse";
import Form from "./components/Form";
import Loader from "../../../../components/Loaders/Page";
import { connect, useDispatch } from "react-redux";
import { MY_STOCKS } from "../../../../redux/modules/Transport/actions";
import CustomVerticalDevider from "../../../../components/CustomVerticalDevider";
import { filterWarhouses, iOS } from "../../../../helpers/functions";
import CustomDrawer from "../../../../components/CustomDrawer";
import Translate from "../../../../Translate";

const Offer = ({ myStocks }) => {
  // Variables
  const history = useHistory();
  const dispatch = useDispatch();
  const device = useDevice();
  const [drawerVisible, setDrawerVisible] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch({
      type: MY_STOCKS,
      errorCallback: () => {
        message.error("Upsss dogodila se greška kod dohvata podataka", 3);
      },
    });
  }, []);

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
  if (myStocks.status === "loading") {
    return <Loader />;
  }

  return (
    <div id={styles.warehouses}>
      {/* Main row */}
      <Row gutter={device === "desktop" && [24]}>
        {/* Cards */}
        <Col lg={24} xl={10} style={{ width: "100%" }}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {
              device === "desktop" ? (
                <h1 className="header"> <Translate textKey={"my_warehouses"} /></h1>
              ) : (
                <div />
              ) // For spacing
            }

            <div className={styles.CTARow}>
              <Search
                value={search}
                onChange={handleOnChange}
                onClear={handleOnClear}
              />
              {device === "mobile" && (
                <div style={{ marginLeft: 20 }}>
                  <Add size="extraLarge" onClick={handleOnClick} round />
                </div>
              )}
            </div>

            {/* Cards */}
            <List
              dataSource={filterWarhouses(myStocks.data, search)}
              renderItem={(item) => <Card item={item} />}
            />
            <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
          </Space>
        </Col>

        {device === "desktop" ? (
          // Form
          <Col lg={24} xl={14}>
            <Form />
          </Col>
        ) : (
          <CustomDrawer
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
          >
            {/* Rendering filters */}
            <Form
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
    myStocks: state.Transport.myStocks,
  };
};

export default connect(mapStateToProps, null)(Offer);
