import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useRouteMatch,
  Link,
} from "react-router-dom";
import { useLocation } from "react-use";
import useDevice from "./helpers/useDevice";
import { ROUTES_WITHOUT_BACK_BUTTON as ROUTES } from "./navigation/routes";

// UI
import { Layout, message, Button, Menu, Dropdown, Popconfirm } from "antd";
import { FiChevronLeft } from "react-icons/fi";
import Sider from "./navigation/Sider";
import Loader from "./components/Loaders/Page";
import LogoutIcon from "./assets/icons/logout.png";

// import "antd/dist/antd.css";
import "../src/styles/custom-antd.css";
import "antd-mobile/dist/antd-mobile.css";

// Redux
import { connect, useDispatch } from "react-redux";
import { GET_USER, PREPARE, SET_APP_LANG } from "./redux/modules/User/actions";

// Icons
import LogoIcon from "./assets/icons/new_logo.png";

// Components
import Tabs from "./components/Tabs/Header";
//? Home
import Home from "./screens/Home";
//? Auth
import SignIn from "./screens/Auth/SignIn";
import SignUp from "./screens/Auth/SingUp";
//? Pages
import Routes from "./screens/Routes";
import Add from "./screens/Add";
import Companies from "./screens/Companies";
import About from "./screens/About";
//? Profile Pages
import UserProfile from "./screens/Profiles/User";
import CargoProfile from "./screens/Profiles/Cargo";
import LoadingSpaceProfile from "./screens/Profiles/LoadingSpace";
import WarehouseProfile from "./screens/Profiles/Warehouse";
import CompanyProfile from "./screens/Profiles/Company";
import { COMPANY_STATUSES } from "./helpers/consts";
import Backoff from "./screens/Backoff";
import { requestFirebaseNotificationPermission } from "./firebaseInit";
import Logout from "./screens/Auth/Logout";
import { colors } from "./styles/colors";
import CustomVerticalDevider from "./components/CustomVerticalDevider";
import Translate from "./Translate";
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
const { Content, Header } = Layout;

const App = ({ auth, getUser, prepare, appLang, currentUser }) => {
  const [firebaseToken, setToken] = useState("");

  // Variables
  const device = useDevice();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const [activeMainKey, setActiveMainKey] = useState("");

  const isBackOff = location.pathname.includes("backoff");

  const [siderCollapsed, setSiderCollapsed] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      try {
        requestFirebaseNotificationPermission()
          .then((firebaseToken) => {
            // eslint-disable-next-line no-console
            setToken(firebaseToken);
            console.log("FIREBASE TOKEN => ", firebaseToken);
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      } catch (error) {
        console.log(error, "POKUŠAJ FIREBASE MESSAGE");
      }
    }
  }, []);

  const hidePadding =
    device === "desktop" &&
    (history.location.pathname === "/signin" ||
      history.location.pathname === "/signup");

  function setActiveKey() {
    const key = location.pathname.split("/").slice(-1)[0] || "cargo";
    setActiveMainKey(key);
  }

  const _getUser = async () => {
    let token = "";
    try {
      token = await JSON.parse(localStorage.getItem("user")).token;
    } catch (error) {}

   

    dispatch({
      type: GET_USER,
      queryParams: { token },
      successCallback: () => {
        if (isBackOff) {
          history.push("/backoff/dashboard");
        } else {
        
          history.push(location.pathname);
        }
      },
      errorCallback: (e) => {
        
        if(isBackOff){
          history.push("/backoff/singin")
        }
      },
    });
  };

  useEffect(() => {
    if (
      currentUser.company &&
      currentUser.company.status !== COMPANY_STATUSES.ACTIVE.value && // ukoliko kompanija nije odobrena od strane transport tima
      !(getUser.status === "loading" || prepare.status === "loading")
    ) {
      if (!isBackOff) {
        history.push("profile/about/");
      }
    }
  }, [currentUser]);

  useEffect(() => {
    document.body.classList.add("is-scrollLocked");
    document.body.classList.add("is-momentumScrollable");

    const appLanguageFromLocalStorage = localStorage.getItem("app_language");
    dispatch({ type: SET_APP_LANG, data: appLanguageFromLocalStorage || "hr" });

    // When rendering our container

    _getUser();
    dispatch({
      type: PREPARE,
      successCallback: () => {
        if (isBackOff) {
          history.push("/backoff/dashboard");
        } else {
          history.push(location.pathname);
        }
      },
      errorCallback: () => {
        if (!isBackOff) {
          history.replace("/signin");
        } else {
          history.replace("/backoff/signin");
        }
      },
    });
  }, []);

  if (getUser.status === "loading" || prepare.status === "loading") {
    return <Loader />;
  }

  // Handle logout
  function handleLogout() {
    history.replace("/logout");
  }

  function setAppLanguage(lang) {
    dispatch({ type: SET_APP_LANG, data: lang?.alpha2Code || "hr" });
    localStorage.setItem("app_language", lang?.alpha2Code || "hr");
    window.location.reload();
  }

  // DOM
  const showBackButton =
    location != null &&
    !ROUTES.find((route) => route.pathname === `${location.pathname || null}`);

  const showTabs =
    location.pathname.startsWith("/routes") ||
    location.pathname.startsWith("/new");

  const SIDER = currentUser.company?.status === COMPANY_STATUSES.ACTIVE.value &&
    auth && (
      <Sider
        siderCollapsed={siderCollapsed}
        setSiderCollapsed={setSiderCollapsed}
      />
    );

  const HEADER = device === "desktop" && !hidePadding  &&(
    <Header id="header">
      <div className="header-wrapper">
        <div className="container">
          <div
            className="logo"
            onClick={() => history.push("/home")}
            style={{ width: siderCollapsed ? 64 : 240 }}
          >
            <img src={LogoIcon} className="logoIcon" />
            <p className="logoName">EP Transport</p>
          </div>
          {showBackButton && (
            <Button
              onClick={() => history.goBack()}
              icon={<FiChevronLeft color={colors.white} size={24} />}
              type="link"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  marginBottom: 0,
                  color: colors.white,
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                <Translate textKey={"back"}  />
              </p>
            </Button>
          )}
          {showTabs && (
            <>
              <div>
                <Tabs
                  setActiveKey={setActiveKey}
                  activeKey={activeMainKey}
                  match={match.path}
                />
              </div>
            </>
          )}
        </div>

        {currentUser.is_admin &&   <div style={{marginRight: 20}} >
         <Link style={{padding: 12, color: "white"}} to="/backoff/dashboard">Backoffice</Link>
        </div>}

        <div>
          <Popconfirm
            title={<Translate textKey={"want_logout"}  />}
            onConfirm={handleLogout}
            okText={<Translate textKey={"sign_out_butt"} />}
            cancelText={<Translate textKey={"quit"} />}
            placement="bottomRight"
          >
            <Button type="link" className="logoutButton">
              <img src={LogoutIcon} alt="Logout" className="logoutIcon" />
              <p className="logout"><Translate textKey={"sign_out_butt"} /></p>
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Header>
  );

  const contentClass = hidePadding
    ? "hidePadding"
    : siderCollapsed && "siderCollapsed";

  const backoffStyle = {
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100vh"
  };
  if (!auth) {
    return (
      <Layout>
        {/* Sider */}

        {/* Content */}
        <Content
          style={isBackOff ? backoffStyle : {}}
          id="content"
          className={contentClass}
        >
          <Switch>
            {/* Prijava */}
            <Route
              name="Sign In"
              path="/signin"
              render={() => <SignIn firebaseToken={firebaseToken} />}
            />

            {/* Sign up */}
            <Route
              name="Sign Up"
              path="/signup"
              render={() => <SignUp firebaseToken={firebaseToken} />}
            />
            <Route
              name="Backoff"
              path="/backoff/backoff"
              render={() => <Backoff />}
            ></Route>

            <Redirect to="/signin" />
          </Switch>
        </Content>
      </Layout>
    );
  }

  return (
    <>
      <Layout id="layout" style={{ height: isBackOff ? "100vh" : "calc(100vh - 64px)" }}>
        {/* Header */}
        {!isBackOff && HEADER}

        <Layout>
          {/* Sider */}
          {!isBackOff && SIDER}

          {/* Content */}
          <Content
            style={isBackOff ? backoffStyle : {}}
            id="content"
            className={contentClass}
          >
            <Switch>
              {/* Prijava */}
              <Route name="homepage" path="/" exact  >
                <Redirect to={"home"} />
              </Route>

              <Route name="logout" path="/logout" component={Logout} />

              {/* Cargo profile */}
              <Route name="Profil oglasa" path="/cargo/:id">
                <CargoProfile />
              </Route>

              {/* Loading space profile */}
              <Route name="Profil oglasa" path="/loadingspace/:id">
                <LoadingSpaceProfile />
              </Route>

              {/* Warehouse profile */}
              <Route name="Profil skladišta" path="/warehouses/:id">
                <WarehouseProfile />
              </Route>

              {/* Company profile */}
              <Route name="Profil poduzeća" path="/companies/:id">
                <CompanyProfile />
              </Route>

              {/* Home */}
              <Route name={<Translate textKey={"home_page"} />} path="/home">
                <Home />
              </Route>

              {/* Routes */}
              <Route name="Rute" path="/routes">
                <Routes />
              </Route>

              {/* Add */}
              <Route name="Dodavanje oglasa" path="/new">
                <Add />
              </Route>

              {/* Companies */}
              <Route name={<Translate textKey={"company_search"} />} path="/companies">
                <Companies />
              </Route>

              {/* Profile */}
              <Route name="Profil" path="/profile">
                <UserProfile />
              </Route>

              {/* About */}
              <Route name={<Translate textKey={"information"}  />} path="/about">
                <About />
              </Route>

              <Route
                name="Backoff"
                path="/backoff"
                render={() => <Backoff />}
              ></Route>


              {/* Authorized redirect */}
              <Route
                exact
                path="/signin"
                render={() => <Redirect to="/home" />}
              />

           
            </Switch>
          </Content>
        </Layout>
      </Layout>
      <CustomVerticalDevider height={isBackOff ? 0 :60} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.User.user.data.token,
    getUser: state.User.getUser,
    prepare: state.User.prepare,
    appLang: state.User.appLang,
    currentUser: state.User.user.data.account,
  };
};

export default connect(mapStateToProps, null)(App);
