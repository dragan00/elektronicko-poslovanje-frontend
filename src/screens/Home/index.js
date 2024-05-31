import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import useDevice from "../../helpers/useDevice";
import axios from "axios";
import { getApiEndpoint } from "../../axios/endpoints";

// UI
import styles from "./styles.module.css";
import { iOS } from "../../helpers/functions";
import { message, Spin } from "antd";
import CustomVerticalDevider from "../../components/CustomVerticalDevider";

// Components
import Box from "./components/Box";
import Company from "./components/CompanyCard";
import User from "./components/UserCard";
import { COMPANY_STATUSES } from "../../helpers/consts";
import Translate from "../../Translate";

export default function Home() {
  // Variables
  const device = useDevice();
  const isMobile = device === "mobile";
  const history = useHistory();
  const currentUser = useSelector((state) => state.User.user.data.account);
  const [firstPageData, set_firstPageData] = useState({
    status: "",
    data: {
      cargo: {
        total_published_count: 0,
        my_active_sum: 0,
      },
      loading_space: {
        total_published_count: 0,
        my_active_sum: 0,
      },
      stock: {
        total_published_count: 0,
        my_active_sum: 0,
      },
    },
  });

  // Methods
  useEffect(async () => {
    if (currentUser.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.push("profile/about/");
      return;
    }

    set_firstPageData({ ...firstPageData, status: "loading" });
    const token = await localStorage.getItem("token");
    axios
      .get(`${getApiEndpoint()}transport/first_page_data/`, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        set_firstPageData({
          data: res.data,
          status: "",
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          message.warning("Potrebna prijava", 3, () => history.push("/logout"));
          return;
        }
        message.error(<Translate textKey={"fetch_data_error"} />);
      });
  }, []);

  return (
    <>
      <div id="homeContainer" className={`profile ${styles.container}`}>
        {/* Wrapper */}
        <div className={styles.wrapper}>
          {/* Cards */}
          <div className={styles.cards}>
            {/* Company card */}
            <Company name={currentUser.company.name} />
            {/* UserCard */}
            <User name={currentUser.name} />
          </div>
        </div>

        {/* Boxes */}
        <Spin
          spinning={firstPageData.status === "loading"}
          className={styles.spinner}
        >
          <div className={styles.boxContainer}>
            <Box
              style={{ order: isMobile && -2 }}
              url="/routes/cargo"
              label={<Translate textKey={"published_cargo"} />}
              value={firstPageData.data.cargo.total_published_count}
            />

            <Box
              style={{ order: isMobile && -1 }}
              url="/routes/loadingSpace"
              label={<Translate textKey={"published_load_space"} />}
              value={firstPageData.data.loading_space.total_published_count}
            />

            <Box
              style={{ order: isMobile && 0 }}
              url="/routes/warehouses"
              label={<Translate textKey={"published_warehouses"} />}
              value={firstPageData.data.stock.total_published_count}
            />

            <Box
              style={{ order: isMobile && -3 }}
              url="/new/cargo"
              label={<Translate textKey={"my_cargo"} />}
              value={firstPageData.data.cargo.my_active_sum}
            />

            <Box
              style={{ order: isMobile && -2 }}
              url="/new/loadingSpace"
              label={<Translate textKey={"my_load_space"} />}
              value={firstPageData.data.loading_space.my_active_sum}
            />

            <Box
              style={{ order: isMobile && -1 }}
              url="/new/warehouses"
              label={<Translate textKey={"my_warehouses"} />}
              value={firstPageData.data.stock.my_active_sum}
            />

            <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
          </div>
        </Spin>
      </div>
    </>
  );
}
