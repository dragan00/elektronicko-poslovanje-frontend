import React, { useEffect, useState } from "react";
import {
  useLocation,
  useRouteMatch,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// UI
import styles from "./add.module.css";

// Components
import Tabs from "./components/Tabs";
import Cargo from "./components/Cargo";
import Warehouses from "./components/Warehouses";
import LoadingSpace from "./components/LoadingSpace";
import { useSelector } from "react-redux";
import { COMPANY_STATUSES } from "../../helpers/consts";
import { useHistory } from "react-router";

export default function Add({}) {
  // Variables
  const location = useLocation();
  const match = useRouteMatch().path;
  const [activeMainKey, setActiveMainKey] = useState("");

  const history = useHistory();
  const currentUser = useSelector((state) => state.User.user.data.account);

  useEffect(() => {
    if (currentUser.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.replace("/profile/about/");
    }
  }, []);

  // Methods
  function setActiveKey() {
    const key = location.pathname.split("/").slice(-1)[0] || "cargo";
    setActiveMainKey(key);
  }

  return (
    <div className="profile">
      {/* Routes */}
      <Switch>
        {/* Cargo tab */}
        <Route name="Cargo" exact path={`${match}/cargo`}>
          <Cargo />
        </Route>

        {/* Warehouses tab */}
        <Route name="Warehouses" path={`${match}/warehouses`}>
          <Warehouses />
        </Route>

        {/* Loading space tab */}
        <Route name="Loading space" path={`${match}/loadingSpace`}>
          <LoadingSpace />
        </Route>

        <Route exact path="/new" render={() => <Redirect to="/new/cargo" />} />
      </Switch>
    </div>
  );
}
