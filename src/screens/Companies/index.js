import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

// Helpers
import useDevice from "../../helpers/useDevice";

// UI
import { useElementScroll, useTransform } from "framer-motion";
import { Row, Col, List, message, Button, Tooltip } from "antd";
import styles from "./companies.module.css";

// Components
import { Filters as FiltersButton } from "../../components/Buttons/Premade";
import Search from "../../components/Inputs/Search";
import Filters from "./components/Filter";
import Card from "../../components/Cards/Company";
import Loader from "../../components/Loaders/Page";
import { connect, useDispatch } from "react-redux";
import { GET_COMPANIES } from "../../redux/modules/Transport/actions";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { Route } from "react-router-dom";
import { collOptions, COMPANY_STATUSES } from "../../helpers/consts";
import FiltersIcon from "../../assets/icons/filters.png";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { colors } from "../../styles/colors";
import { iOS } from "../../helpers/functions";
import CustomVerticalDevider from "../../components/CustomVerticalDevider";
import CustomDrawer from "../../components/CustomDrawer";
import Translate from "../../Translate";

function Companies({ getCompanies, currentUser }) {
  // Refsg
  const ref = useRef(null);
  const dispatch = useDispatch();

  // Variables
  const { scrollY } = useElementScroll(ref);
  const history = useHistory();
  const device = useDevice();
  const [drawerVisible, set_drawerVisible] = useState();
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

  // Style

  // TODO
  scrollY.onChange((y) => {
  });

  useEffect(() => {
    if (currentUser.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.push("profile/about/");
    } else {
      dispatch({
        type: GET_COMPANIES,
        errorCallback: () => {
          message.error(<Translate textKey={"fetch_data_error"} />, 6);
        },
      });
    }
  }, []);

  const setDrawerVisible = (visible) => {
    set_drawerVisible(visible);
  };

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

  return (
    <div className="profile">
      {/* Main row */}
      <Row gutter={device === "desktop" && [24]} style={{ height: "100%" }}>
        {/* Cards */}
        <Col span={24} xl={12} className={styles.cardsCol}>
          {/* <motion.div style={{ height, opacity, maxWidth: device === 'desktop' && 'calc(50vw - 240px)' }}> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              marginBottom: device === "mobile" && 16,
            }}
          >
            <Search
              value={search}
              onChange={handleOnChange}
              onClear={handleOnClear}
            />
            <Tooltip
              title={
               <Translate textKey={"blocked"} />  }
            >
              <Button
                shape="circle"
                type={blockedUsers ? "primary" : "default"}
                style={{
                  height: 48,
                  width: 48,
                  minWidth: 48,
                  marginLeft: device === "desktop" ? 24 : -48,
                }}
                onClick={() => {
                  set_blockedUsers(!blockedUsers);
                }}
              >
                {blockedUsers ? (
                  <FaUserCheck color={colors.white} />
                ) : (
                  <FaUserTimes color={colors.grey} />
                )}
              </Button>
            </Tooltip>
            {device === "mobile" && (
              <div style={{ padding: "0 6px" }}>
                <Button
                  style={{ height: 48, width: 48 }}
                  shape="circle"
                  icon={
                    <img src={FiltersIcon} style={{ width: 20, height: 20 }} />
                  }
                  onClick={handleOnClick}
                />
              </div>
            )}
          </div>

          {/* </motion.div> */}

          {/* Cards */}
          <div className={styles.cardList} ref={ref}>
            <List
              loading={getCompanies.status === "loading"}
              dataSource={fitlerCompanies(
                getCompanies.data.data,
                search,
                blockedUsers
              )}
              renderItem={(item) => <Card item={item} />}
            />
            <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
          </div>
        </Col>

        {device === "desktop" ? (
          // Filters
          <Col span={24} xl={12}>
            <Filters />
          </Col>
        ) : (
          <CustomDrawer
            visible={drawerVisible}
            onClose={() => set_drawerVisible(false)}
          >
            {/* Rendering filters */}
            <Filters close={() => set_drawerVisible(false)} />
          </CustomDrawer>
        )}
      </Row>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    getCompanies: state.Transport.getCompanies,
    currentUser: state.User.user.data.account,
  };
};

export default connect(mapStateToProps, null)(Companies);

const fitlerCompanies = (arr, value, blocked) => {
  let tmpArr = [...arr];
  if (value) {
    tmpArr = arr.filter((x) =>
      x.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  tmpArr = tmpArr.filter((x) => x.blocked === blocked);
  return tmpArr;
};
