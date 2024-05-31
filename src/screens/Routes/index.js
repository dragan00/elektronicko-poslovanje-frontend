import React, { useEffect } from "react";
import {
  useLocation,
  useRouteMatch,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

// UI
import styles from "./routes.module.css";

// Components
import Cargo from "./components/Cargo";
import Warehouses from "./components/Warehouses";
import LoadingSpace from "./components/LoadingSpace";
import { COMPANY_STATUSES } from "../../helpers/consts";
import { useSelector } from "react-redux";

export default function Routes() {
  // Variables
  const location = useLocation();
  const match = useRouteMatch().path;
  const history = useHistory();

  const currentUser = useSelector((state) => state.User.user.data.account);

  useEffect(() => {
    if (!currentUser.company) {
      history.replace("/signin");
      return;
    }
    if (currentUser.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.replace("/profile/about");
    }
  }, []);

  return (
    <div className="profile">
      {/* Routes */}
      <Switch>
        {/* Cargo tab */}
        <Route
          render={() => <Cargo />}
          name="Cargo"
          exact
          path={`${match}/cargo`}
        />

        {/* Warehouses tab */}
        <Route
          render={() => <Warehouses />}
          name="Warehouses"
          path={`${match}/warehouses`}
        />

        {/* Loading space tab */}
        <Route
          render={() => <LoadingSpace />}
          name="Loading space"
          path={`${match}/loadingSpace`}
        />

        <Route
          exact
          path="/routes"
          render={() => <Redirect to="/routes/cargo" />}
        />
      </Switch>
    </div>
  );
}
