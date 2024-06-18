import React, { useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
// UI
import { Menu, Button, Tooltip, Dropdown } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import styles from "../navigation.module.css";
import LogoutIcon from "../../assets/icons/mobile_logout.png";

// Routes
import { ROUTES } from "../routes";
import { colors } from "../../styles/colors";
import { getFilesRoute } from "../../axios/endpoints";
import { useDispatch, useSelector } from "react-redux";
import Translate from "../../Translate";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { SET_APP_LANG } from "../../redux/modules/User/actions";

// Constants
const { Item, SubMenu } = Menu;
const rootSubmenuKeys = ["sub1", "sub2"];

export default function MenuComponent({ device, closeDrawer, siderCollapsed, setSiderCollapsed }) {
  // Variables
  const history = useHistory();
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];
  const currentTab = location.pathname.split("/")[2];
  const defaultMenuKey = `/${currentPage}`;
  const company = useSelector((state) => state.User.user.data.account.company);
  const [openKeys, setOpenKeys] = useState([currentPage === "routes" ? "sub1" : "sub2"]);

  const prepare = useSelector((state) => state.User.prepare);
  const appLang = useSelector((state) => state.User.appLang);

  const dispatch = useDispatch();

  function setAppLanguage(lang) {
    dispatch({ type: SET_APP_LANG, data: lang?.alpha2Code || "hr" });
    localStorage.setItem("app_language", lang?.alpha2Code || "hr");
    window.location.reload();
  }

  // Methods
  function handleNavigate(page, tab) {
    history.push(`${page}/${tab}`);
    closeDrawer();
  }

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };


  return (
    <Menu
      id="siderMenu"
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      defaultSelectedKeys={[defaultMenuKey]}
      style={{
        height: "100%",
        position: "relative",
        backgroundColor: "#fff",
        width: siderCollapsed ? 63 : 239, // border
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
      }}
    >
      {/* Logo */}
      {device === "mobile" && (
        <Item key="logo" disabled className={styles.logoWrapper}>
          <div className={styles.logo}>JOKER</div>
        </Item>
      )}

      {/* Routes */}
      {device === "desktop"
        ? ROUTES.map((item) => (
            // Menu item
            <Item key={item.pathname} title={item.title} className={styles.menuStyle}>
              {/* Link to route */}
              <Link to={item.pathname} className={styles.linkStyle}>
                {/* Route icon */}
                <img
                  src={defaultMenuKey === item.pathname ? item.active_icon : item.icon}
                  alt={item.title}
                  className={styles.siderIcon}
                />
                <h2
                  className={styles.routeName}
                  style={{
                    color: defaultMenuKey === item.pathname ? colors.black : colors.grey,
                  }}
                >
                  {item.title}
                </h2>
              </Link>
            </Item>
          ))
        : ROUTES.map((item, index) =>
            item.sub_routes ? (
              <SubMenu
                key={`sub${index + 1}`}
                title={
                  <h2
                    className={styles.routeName}
                    style={{
                      color: defaultMenuKey === item.pathname ? colors.black : colors.grey,
                      marginLeft: 10,
                    }}
                  >
                    {item.title}
                  </h2>
                }
                icon={
                  <img
                    src={defaultMenuKey === item.pathname ? item.active_icon : item.icon}
                    alt={item.title}
                    className={styles.siderIcon}
                    style={{ padding: 0 }}
                  />
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                  }}
                >
                  {item.sub_routes.map((sub_route) => (
                    <Button
                      onClick={() => handleNavigate(item.pathname, sub_route.pathname)}
                      type="link"
                      to={sub_route.pathname}
                      style={{
                        textAlign: "left",
                        color:
                          currentTab === sub_route.pathname && defaultMenuKey === item.pathname
                            ? colors.purple
                            : colors.grey,
                        paddingLeft: 52,
                        marginBottom: 8,
                        backgroundColor: "#fff",
                      }}
                    >
                      - {sub_route.name}
                    </Button>
                  ))}
                </div>
              </SubMenu>
            ) : (
              <Item key={item.pathname} title={item.title} className={styles.menuStyle} onClick={closeDrawer}>
                {/* Link to route */}
                <Link to={item.pathname} className={styles.linkStyle}>
                  {/* Route icon */}
                  <img
                    src={defaultMenuKey === item.pathname ? item.active_icon : item.icon}
                    alt={item.title}
                    className={styles.siderIcon}
                  />
                  <h2
                    className={styles.routeName}
                    style={{
                      color: defaultMenuKey === item.pathname ? colors.black : colors.grey,
                    }}
                  >
                    {item.title}
                  </h2>
                </Link>
              </Item>
            )
          )}

      <Item disabled style={{ flex: 1, cursor: "default" }} />

      {device === "desktop" && (
        <Item disabled className={styles.expand}>
          <Tooltip
            title={siderCollapsed ? <Translate textKey={"expand"} /> : <Translate textKey={"hide"} />}
            placement="topLeft"
          >
            <div className={styles.flexRow} onClick={() => setSiderCollapsed((prevState) => !prevState)}>
              <Button
                type="link"
                shape="circle"
                icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                style={{ border: "1px solid #d9d9d9", color: colors.purple }}
              />
              <h2 className={styles.companyName}>
                <Translate textKey={"hide"} />
              </h2>
            </div>
          </Tooltip>
        </Item>
      )}

      {/* User avatar */}
      <Item
        key="avatar"
        className={styles.avatarWrapper}
        style={{ width: device === "desktop" ? "100%" : "min-content" }}
        onClick={closeDrawer}
      >
        <Link to="/profile/about" title="Profil">
          <div>
            <Tooltip title={company.name} placement="topLeft">
              <div className={styles.avatarContainer}>
                <img src={getFilesRoute() + company.avatar} alt="" className={styles.avatar} />{" "}
                <h2 className={styles.companyName}>{company.name}</h2>
              </div>
            </Tooltip>
          </div>
        </Link>
      </Item>

      {device === "mobile" && (
        <Item disabled className={styles.expand} onClick={closeDrawer}>
          <Button
            icon={
              <img
                src={LogoutIcon}
                alt="Logout"
                className={styles.logoutIcon}
                style={{ marginRight: 4, marginLeft: -10 }}
              />
            }
            type="link"
            onClick={() => {
              history.replace("/logout");
            }}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: "#909090" }} className={styles.routeName}>
              Odjava
            </h2>
          </Button>
        </Item>
      )}
    </Menu>
  );
}
