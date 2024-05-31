import React, { useState } from "react";
import { useWindowSize } from "react-use";
import { useHistory, useLocation } from "react-router-dom";
import { ROUTES, ROUTE_NAMES } from "../routes";

// UI
import styles from "../navigation.module.css";
import menu from "../../assets/icons/menu.png";
import back from "../../assets/icons/back.png";
import { Layout, Drawer } from "antd";
import { breakpoints } from "../../styles/breakpoints";

// Components
import Menu from "../Menu";
import HitSlop from "../../components/Buttons/HitSlop";
import useDevice from "../../helpers/useDevice";

const { Sider } = Layout;

export default function _Sider({ siderCollapsed, setSiderCollapsed }) {
  // Variables
  const { width } = useWindowSize();
  const [visible, setVisible] = useState(false);
  const device = useDevice();
  const history = useHistory();
  const location = useLocation().pathname || null;
  const route =
    location != null &&
    ROUTE_NAMES.find((route) => route.pathname === `${location}`);

  // Width of drawer
  const drawerWidth = width < breakpoints.lg ? "80vw" : "50vw";

  // Navigation on mobile device
  if (device === "mobile") {
    return (
      <div className={styles.navbar}>
        <HitSlop onClick={() => history.goBack()}>
          <img
            style={{ visibility: location !== "/home" ? "" : "hidden" }}
            className={styles.menuIcon}
            src={back}
            alt="Arrow icon"
          />
        </HitSlop>

        {location != null && route != null && (
          <p className={styles.routeTitle}>{route.title}</p>
        )}
        <HitSlop onClick={() => setVisible(true)}>
          <img className={styles.menuIcon} src={menu} alt="Menu icon" />
        </HitSlop>

        <Drawer
          className="navigationNavbar"
          closable={false}
          placement="left"
          // onClick={() => setVisible(false)}
          onClose={() => setVisible(false)}
          visible={visible}
          width={drawerWidth}
        >
          {/* Rendering menu */}
          <Menu
            device="mobile"
            closeDrawer={() => setVisible(false)}
            width={drawerWidth}
          />
        </Drawer>
      </div>
    );
  }

  // Navigation on desktop
  return (
    <Sider id={styles.sider} theme="light" width={siderCollapsed ? 64 : 240}>
      {/* Rendering menu */}
      <div id={styles.siderContainer}>
        <Menu
          device="desktop"
          width={drawerWidth}
          siderCollapsed={siderCollapsed}
          setSiderCollapsed={setSiderCollapsed}
        />
      </div>
    </Sider>
  );
}
