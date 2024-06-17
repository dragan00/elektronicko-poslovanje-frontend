import React, { useState, useMemo, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import useDevice from "../../../helpers/useDevice";
import moment from "moment";

// UI
import styles from "./loadingspace.module.css";
import { Row, Col, message, Button as AntdButton, Divider, Button } from "antd";
import Collapse from "../../../components/Collapse";
import User from "../../../components/Cards/User";
import Loader from "../../../components/Loaders/Page";
import Destination from "../../../components/Cards/Destinations/OnePlace";

import { connect, useDispatch, useSelector } from "react-redux";
import { ONE_LOAD_SPACE } from "../../../redux/modules/Transport/actions";
import {
  ADD_STATUSES,
  COMPANY_STATUSES,
  LOAD_SPACE_PLACE_TYPE,
} from "../../../helpers/consts";
import { getTranslation, iOS } from "../../../helpers/functions";
import { getApiEndpoint } from "../../../axios/endpoints";
import axios from "axios";
import CompanyInformations from "../../../components/CompanyInformations";
import AdHeader from "../../../components/AdHeader";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import BasicButton from "../../../components/Buttons/Basic";
import LoadingSpaceForm from "../../Add/components/LoadingSpace/components/Form";
import CustomDrawer from "../../../components/CustomDrawer";
import { unstable_batchedUpdates } from "react-dom";
import DestionationCountLabel from "../../../components/DestinationCountLabel";
import Translate from "../../../Translate";
import useWebSocket from "react-use-websocket";

const COL_SETUP = {
  xxl: 8,
  xl: 8,
  lg: 12,
  sm: 24,
  xs: 24,
};

const Profile = ({ oneLoadSpace, currentUser }) => {
  const dispatch = useDispatch();
  // Variables
  const { id, back } = useParams();
  const device = useDevice();
  const history = useHistory();
  const collapsed = device === "mobile";
  const [loadingRemove, set_loadingRemove] = useState(false);
  const [renew, set_renew] = useState(false);
  const {appLang  } = useSelector(state => state.User);

  const [drawerVisible, setDrawerVisible] = useState();

  const [load, set_load] = useState([
    {
      country: {
        name: "",
        alpha2Code: "",
      },
      city: "",
      zip_code: "",
      date: "",
    },
  ]);

  const [unload, set_unload] = useState([
    {
      country: {
        name: "",
        alpha2Code: "",
      },
      city: "",
      zip_code: "",
      date: "",
    },
  ]);

  useEffect(() => {
    set_unload(
      parseLoadUnload(
        oneLoadSpace.data.starting_point_destination?.filter(
          (x) => x.type === LOAD_SPACE_PLACE_TYPE.DESTINATION
        )
      )
    );
    set_load(
      parseLoadUnload(
        oneLoadSpace.data.starting_point_destination?.filter(
          (x) => x.type === LOAD_SPACE_PLACE_TYPE.START
        )
      )
    );
  }, [oneLoadSpace]);

  useEffect(() => {
    if (currentUser.account.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.replace("/profile/about/");
    } else {
      dispatch({
        type: ONE_LOAD_SPACE,
        id,
        errorCallback: () => {
          message.error("Upss dogodila se greška kod dohvata podataka...", 3);
        },
      });
    }
    setDrawerVisible(false);
  }, [id]);

  const socketInfo = useWebSocket(process.env.REACT_APP_WS_URL, {
    onMessage: (event) => {
      let data = JSON.parse(event.data);
      if (data.type === "details" && data.part_of_app === "loading_space") {
        dispatch({
          type: ONE_LOAD_SPACE,
          id,
          errorCallback: () => {
            message.error("Upss dogodila se greška kod dohvata podataka...", 3);
          },
        });
      }
    },
    shouldReconnect: (closeEvent) => true,
  });

  // drawer back buttobn

  function historyListener(event) {
    setDrawerVisible(false);
  }

  useEffect(() => {
    window.addEventListener("popstate", historyListener, false);

    return () => {
      window.removeEventListener("popstate", null, false);
    };
  }, []);

  function handleOnClick(update, renew) {
    history.push("#drawer");

    unstable_batchedUpdates(() => {
      set_renew(!!renew);
      setDrawerVisible(true);
    }, []);
  }

  // drawer back buttobn

  const removeLoadingSpace = async () => {
    set_loadingRemove(true);
    const token = await localStorage.getItem("token");

    axios
      .post(`${getApiEndpoint()}transport/loading_space/${id}/close/`, null, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        history.push("/new/loadingSpace");
      })
      .catch((err) => {
        console.log(err);
        message.error("Dogodila se greška...", 3);
        set_loadingRemove(false);
      });
  };

  // Loading
  if (oneLoadSpace.status === "loading") {
    return <Loader />;
  }
  const _basicButton = oneLoadSpace.data.status !== ADD_STATUSES.CLOSED && (
    <BasicButton
      text={<Translate textKey={"finish"} />}
      noIcon
      width={device === "desktop" ? 180 : "100%"}
      style={{ height: 46 }}
      loading={loadingRemove && !renew}
      onClick={() => {
        removeLoadingSpace();
      }}
    />
  );

  const _button_renew = (
    <BasicButton
      text={<Translate textKey={"copy"} />}
      noIcon
      width={device === "desktop" ? 180 : "100%"}
      style={{ height: 46 }}
      loading={loadingRemove && renew}
      onClick={() => {
        handleOnClick(undefined, true);
      }}
    />
  );

  const _edit_button = oneLoadSpace.data.status !== ADD_STATUSES.CLOSED && (
    <div>
      <Button
        style={{ width: device === "mobile" && "100%", height: 46, marginRight: device === "desktop" && 24 }}
        type="dashed"
        onClick={() => {
          handleOnClick();
        }}
      >
         <Translate textKey={"edit"} />
      </Button>
    </div>
  );

  return (
    <>
      <div className={"profile"}>
        <AdHeader
          title={<Translate textKey={"cargo_add_title"}  />}
          company={oneLoadSpace.data.company}
          extra={
            device === "desktop" &&
            currentUser.account.company.id === oneLoadSpace.data.company.id && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div>{_edit_button}</div>
                <div style={{ marginRight: 21 }}>{_basicButton}</div>
                <div style={{ marginRight: 21 }}>{_button_renew}</div>
              </div>
            )
          }
        />
        {device === "desktop" && <Divider dashed type="horizontal" />}

        {/* Main row */}
        <Row gutter={device === "desktop" && [0, 24]}>
          {/* First row */}
          <Row>
            {/* Mjesta utovara i istovara */}
            <Col span={24}>
            <Collapse header={<Translate textKey={"load_unload_places"}  />}>
                <DestionationCountLabel label={<Translate textKey={"load_places"} />} count={load.length} />
                {oneLoadSpace.data.starting_point_destination
                  .filter((item) => item.type === "starting")
                  .map((destination) => (
                    <Destination item={destination} />
                  ))}
                <Divider
                  style={{ margin: device === "mobile" && 0 }}
                  type="horizontal"
                />
                <DestionationCountLabel
                  label={<Translate  textKey={"unload_places"} />}
                  count={unload.length}
                />
                {oneLoadSpace.data.starting_point_destination
                  .filter((item) => item.type === "destination")
                  .map((destination) => (
                    <Destination item={destination} />
                  ))}

                {device === "mobile" &&
                  currentUser.account.company.id ===
                    oneLoadSpace.data.company.id && (
                    <div
                      style={{
                        height: 160,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>{_edit_button}</div>
                      <div>{_basicButton}</div>
                      <div>{_button_renew}</div>
                    </div>
                  )}
              </Collapse>
            </Col>
          </Row>

          <Row>
            <Col {...COL_SETUP}>
              <Collapse header={<Translate textKey={"vehicle_sort"} />} collapsed={collapsed}>
                <Row>
                  <Col span={12}>
                    {Information(oneLoadSpace.data.vehicle_length, <Translate textKey={"length"}  />)}
                  </Col>
                  <Col span={12}>
                    {Information(
                      oneLoadSpace.data.vehicle_load_capacity,
                      <Translate textKey={"weight"} />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    {Information(
                      getTranslation(
                        oneLoadSpace.data.vehicle_type?.name,
                        appLang
                      )?.name,

                      <Translate textKey={"vehicle_sort"} />,
                      true
                    )}
                  </Col>
                  <Col span={12}>
                    {Information(
                      oneLoadSpace.data.vehicle_upgrades
                        .map((x) => getTranslation(x.name, appLang)?.name)
                        .join(", "),
                        <Translate textKey={"vehicle_upgrades"} />,
                      true
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    {Information(
                      oneLoadSpace.data.vehicle_equipment
                        .map((x) => getTranslation(x.name, appLang)?.name)
                        .join(", "),
                        <Translate textKey={"vehicle_equipment"} />,
                      true
                    )}
                  </Col>
                  <Col span={12}>
                    {Information(
                      oneLoadSpace.data.connected_vehicle_length,
                      <Translate textKey={"trailer_length"}  />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    {" "}
                    <Col span={8}>
                      {Information(
                        oneLoadSpace.data.connected_vehicle_load_capacity,
                        <Translate textKey={"trailer_weight"}  />
                      )}
                    </Col>
                  </Col>
                </Row>

                <Row>
                  {" "}
                  <Col>
                    {Information(
                     oneLoadSpace.data.vehicle_note[0].vehicle_note,
                        <Translate textKey={"description"}  />
                    )}
                  </Col>{" "}
                </Row>
              </Collapse>
            </Col>
            {/* Osnovne informacije */}
            <Col {...COL_SETUP}>
              <Collapse header={<Translate textKey={"basic_info"} />} collapsed={collapsed}>
                <CompanyInformations company={oneLoadSpace.data.company} />
              </Collapse>
            </Col>

            {/* Kontakt osoba */}
            <Col {...COL_SETUP}>
              <Collapse header={<Translate textKey={"contact_person"} />} collapsed={collapsed}>
                <User
                  user={oneLoadSpace.data.contact_accounts[0]}
                  name={oneLoadSpace.data.contact_accounts[0]?.name}
                  collapsed
                />
              </Collapse>
            </Col>
          </Row>
        </Row>
        <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
      </div>

      <CustomDrawer
        onClose={() => {
          setDrawerVisible(false);
        }}
        visible={drawerVisible}
      >
        {" "}
        <LoadingSpaceForm
          renew={renew}
          update={oneLoadSpace.data}
          visible={drawerVisible}
          closeDrawer={() => {
            setDrawerVisible(false);
            history.goBack();
          }}
        />
      </CustomDrawer>
    </>
  );
};

const parseLoadUnload = (data) => {
  if (!data) {
    return [
      {
        country: {
          name: "",
          alpha2Code: "",
        },
        city: "",
        zip_code: "",
        date: "",
      },
    ];
  }

  let array = [];

  data.map((item) =>
    array.push({
      country: {
        name: item.country.name,
        alpha2Code: item.country.alpha2Code,
      },
      city: item.city.name,
      zip_code: item.zip_code.name,
      date: moment(item.departure_datetime).format("YY-MM-DD hh:mm"),
    })
  );

  return array;
};

const Information = (
  value = "",
  label = "",
  wrap = false,
  containerStyle = {}
) => (
  <div
    className={styles.information}
    style={{ width: wrap ? "100%" : "max-content", ...containerStyle }}
  >
    <p className={styles.label}>{label || "-"}</p>
    <p className={styles.value}> {value || "-"}</p>
  </div>
);

const mapStateToProps = (state) => {
  return {
    oneLoadSpace: state.Transport.oneLoadSpace,
    currentUser: state.User.user.data,
  };
};

export default connect(mapStateToProps, null)(Profile);
