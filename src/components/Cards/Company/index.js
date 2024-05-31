import React, { useState, useRef } from "react";
import useDevice from "../../../helpers/useDevice";

// UI
import styles from "../card.module.css";
import Tag from "../../Tags/Basic";

// Icons
import { Link, useHistory } from "react-router-dom";
import Button from "antd/es/button";
import {
  CheckCircleOutlined,
  ExceptionOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { getApiEndpoint, getFilesRoute } from "../../../axios/endpoints";
import { message, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Companies from "../../../screens/Companies";
import { GET_COMPANIES_SUCCESS } from "../../../redux/modules/Transport/actions";
import Translate from "../../../Translate";

const MEDIAS_URL = getFilesRoute();

export default function Company({ item }) {
  // References
  const buttonRef = useRef(null);

  // Variables
  const dispatch = useDispatch();
  const device = useDevice();
  const history = useHistory();
  const [loading, set_loading] = useState(false);
  const companies = useSelector((state) => [
    ...state.Transport.getCompanies.data.data,
  ]);

  // Methods
  function handleOnNavigate() {
    history.push(`/companies/${item.id}`);
  }

  return (
    <div className={styles.company} onClick={handleOnNavigate}>
      <div className={styles.left}>
        <img
          src={`${MEDIAS_URL + item.avatar}`}
          alt="Company"
          className={styles.icon}
        />
        <div className={styles.info}>
          <p className={styles.name}>{item.name}</p>
          <p
            className={styles.description}
          >{`${item.country.name}, ${item.city.name}`}</p>
        </div>
      </div>

      {device === "desktop" && (
        <div style={{ marginRight: 20 }}>
          <Tag text={item.year} size="medium" />
        </div>
      )}
      <div>
        <Tooltip
          title={`${item.blocked ? "Odblokiraj" : "Blokiraj"} korisnika`}
        >
          <Button
            ref={buttonRef}
            loading={loading}
            shape="circle"
            onClick={async (event) => {
              event.stopPropagation();
              set_loading(true);
              const token = await localStorage.getItem("token");
              axios
                .post(
                  `${getApiEndpoint()}transport/block_company/`,
                  {
                    block: !item.blocked,
                    company: item.id,
                  },
                  {
                    headers: {
                      Authorization: "Token " + token,
                    },
                  }
                )
                .then((res) => {
                  set_loading(false);
                  //update redux
                  let index = companies.findIndex((x) => x.id === item.id);
                  companies[index] = {
                    ...companies[index],
                    blocked: !item.blocked,
                  };

                  dispatch({
                    type: GET_COMPANIES_SUCCESS,
                    data: { data: companies },
                  });
                })
                .catch((err) => {
                  set_loading(false);
                  console.log(err);
                  message.error(<Translate textKey={"save_error"}  />, 6);
                });

              buttonRef.current.blur();
            }}
            icon={
              item.blocked ? (
                <CheckCircleOutlined />
              ) : (
                <ExclamationCircleOutlined />
              )
            }
          />
        </Tooltip>
      </div>
    </div>
  );
}
