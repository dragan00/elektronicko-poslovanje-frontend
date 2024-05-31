import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useDevice from "../../../helpers/useDevice";
import moment from "moment";

// UI
import styles from "./cargo.module.css";
import {
  Row,
  Col,
  Statistic,
  message,
  Button,
  InputNumber,
  Popover,
  Avatar,
  Divider,
} from "antd";
import Collapse from "../../../components/Collapse";
import User from "../../../components/Cards/User";
import Loader from "../../../components/Loaders/Page";
import BasicButton from "../../../components/Buttons/Basic";
import Destination from "../../../components/Cards/Destinations/OnePlace";
import CargoForm from "../../Add/components/Cargo/components/Form";

// import { RiAuctionLine } from 'react-icons/ri'
import auction from "../../../assets/icons/auction.png";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ONE_CARGO,
  ONE_CARGO_SUCCESS,
} from "../../../redux/modules/Transport/actions";
import {
  ADD_STATUSES,
  CARGO_PLACE_TYPE,
  COMPANY_STATUSES,
} from "../../../helpers/consts";
import { getTranslation, iOS } from "../../../helpers/functions";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { getApiEndpoint } from "../../../axios/endpoints";
import { useHistory } from "react-router-dom";
import CompanyInformations from "../../../components/CompanyInformations";
import AdHeader from "../../../components/AdHeader";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import { unstable_batchedUpdates } from "react-dom";
import CustomDrawer from "../../../components/CustomDrawer";
import DestionationCountLabel from "../../../components/DestinationCountLabel";
import Translate from "../../../Translate";

const { Countdown } = Statistic;

const Profile = ({ oneCargo, currentUser }) => {
  const dispatch = useDispatch();
  // Variables
  const { id } = useParams();
  const device = useDevice();
  const history = useHistory();
  const collapsed = device === "mobile";
  const [drawerVisible, setDrawerVisible] = useState();
  const [loading, set_loading] = useState(false);
  const [deleteLoading, set_deleteLoading] = useState(false);
  const [auctionValue, set_auctionValue] = useState("");
  const [auctionFinished, set_auctionFinished] = useState(false);
  const [renew, set_renew] = useState(false);
  const {appLang} = useSelector(state => state.User);
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
      parseCargo(
        oneCargo.data.load_unload?.filter(
          (x) => x.type === CARGO_PLACE_TYPE.UNLOAD
        )
      )
    );
    set_load(
      parseCargo(
        oneCargo.data.load_unload?.filter(
          (x) => x.type === CARGO_PLACE_TYPE.LOAD
        )
      )
    );
  }, [oneCargo]);

  useEffect(() => {
    if (currentUser.account.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.replace("/profile/about/");
    } else {
      dispatch({
        type: ONE_CARGO,
        id,
        errorCallback: () => {
          message.error("Upss dogodila se greška kod dohvata podataka...", 3);
        },
      });
    }
  }, [id]);

  const auctionLastPriceInfo = (item) => {
    return (
      <div>
        {Information(moment(item.timestamp).format("YYYY-MM-DD HH:mm"), " ")}
        {Information(item.account.name, " ")}
        {Information(item.account.email, " ")}
        {Information(item.account.phone_number, " ")}
        {Information(item.account.company.name, " ")}
      </div>
    );
  };

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
      setDrawerVisible(true);
      set_renew(!!renew);
    }, []);
  }

  // drawer back buttobn

  // Styles
  const auctionWidth = device === "mobile" ? "100%" : "95%";
  const auctionButtonWidth =
    device === "mobile" ? "100%" : "calc(100% - 42px - 20px)"; // 42px => width of auction button, 20px => margin

  const countdown = useMemo(() => {
    function onFinish() {
      set_auctionFinished(true);
    }

    return (
      <Countdown
        value={new Date(oneCargo.data.auction_end_datetime)}
        onFinish={onFinish}
        title={<p className={styles.countdownLabel}>Istek ponude</p>}
        format="DD [D] HH:mm:ss"
        valueStyle={{
          fontWeight: 500,
          fontFamily: "inherit",
          fontSize: "18px",
          padding: 0,
          margin: 0,
          marginTop: -4,
          width: "100%",
          overflow: "auto",
        }}
      />
    );
  }, [oneCargo.data]);

  // Loading
  if (oneCargo.status === "loading") {
    return <Loader />;
  }

  const setAuction = async () => {
    set_loading(true);
    const token = await localStorage.getItem("token");
    axios
      .post(
        `${getApiEndpoint()}transport/auctions/`,
        {
          cargo: oneCargo.data.id,
          price: +auctionValue,
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

        const cargo = { ...oneCargo.data };
        cargo.auctions = res.data.auctions;
        set_auctionValue("");
        dispatch({ type: ONE_CARGO_SUCCESS, data: cargo });
      })
      .catch((err) => {
        message.error("Dogodila se greška kod postavljanja ponude", 6);
        set_loading(false);
      });
  };

  const removeCargo = async () => {
    set_deleteLoading(true);
    const token = await localStorage.getItem("token");

    axios
      .post(`${getApiEndpoint()}transport/cargo/${id}/close/`, null, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        history.push("/new/cargo");
      })
      .catch((err) => {
        console.log(err);
        message.error("Dogodila se greška...", 3);
        set_deleteLoading(false);
      });
  };

  if (oneCargo.message === "Ne postoji") {
    message.info("Oglas ne postoji...", 3, () => {
      history.back();
    });
  }

  const _basicButton = oneCargo.data.status !== ADD_STATUSES.CLOSED && (
    <BasicButton
      text={<Translate textKey={"finish"} />}
      noIcon
      width={device === "desktop" ? 180 : "100%"}
      style={{ height: 46 }}
      loading={deleteLoading && !renew}
      onClick={() => {
        removeCargo();
      }}
    />
  );

  const _button_renew = (
    <BasicButton
      text={<Translate textKey={"copy"} />}
      noIcon
      width={device === "desktop" ? 180 : "100%"}
      style={{ height: 46 }}
      loading={deleteLoading && renew}
      onClick={() => {
        handleOnClick(undefined, true);
      }}
    />
  );

  const editAdd = oneCargo.data.status !== ADD_STATUSES.CLOSED && (
    <Button
      style={{
        height: 46,
        width: device === "mobile" && "100%",
        display: oneCargo.data.status === ADD_STATUSES.CLOSED && "none",
      }}
      type="dashed"
      onClick={() => {
        handleOnClick();
      }}
    >
      <Translate textKey={"edit"} />
    </Button>
  );

  return (
    <>
      <div className={"profile"}>
        <AdHeader
          title={<Translate textKey={"cargo_add_title"}  />}
          company={oneCargo.data.company}
          extra={
            <>
              {device === "desktop" &&
                currentUser.account.company.id === oneCargo.data.company.id && (
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <div style={{ marginRight: 21 }}>{editAdd}</div>
                    <div style={{ marginRight: 21 }}>{_basicButton}</div>
                    <div>{_button_renew}</div>
                  </div>
                )}
            </>
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

                {oneCargo.data.load_unload
                  .filter((item) => item.type === "load")
                  .map((destination, index) => (
                    <div key={index}>
                      <Destination item={destination} />
                    </div>
                  ))}
                <Divider
                  style={{ margin: device === "mobile" && 0 }}
                  type="horizontal"
                />
                <DestionationCountLabel
                  label={<Translate  textKey={"unload_places"} />}
                  count={unload.length}
                />

                {oneCargo.data.load_unload
                  .filter((item) => item.type === "unload")
                  .map((destination, index) => (
                    <div key={index}>
                      <Destination item={destination} />
                    </div>
                  ))}

                {device === "mobile" &&
                  currentUser.account.company.id ===
                    oneCargo.data.company.id && (
                    <div
                      style={{
                        height: 160,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>{editAdd}</div>
                      <div>{_basicButton}</div>
                      <div>{_button_renew}</div>
                    </div>
                  )}
              </Collapse>
            </Col>
          </Row>

          {/* Second row */}
          <Row>
            {/* Opis tereta */}
            <Col xs={24} lg={12} xl={8}>
              <Collapse header={<Translate textKey={"cargo_spec"} />} collapsed={collapsed}>
                <Row>
                  <Col span={8}>
                    {Information(oneCargo.data.length, <Translate textKey={"length"} />)}
                  </Col>
                  <Col span={8}>
                    {Information(oneCargo.data.width, <Translate textKey={"width"} />)}
                  </Col>
                  <Col span={8}>
                    {Information(oneCargo.data.weight,<Translate textKey={"weight"} />)}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        maxWidth: 270,
                      }}
                    >
                      {Information(
                        oneCargo.data.exchange ? <Translate textKey={"yes_flag"} /> : <Translate textKey={"no_flag"} />,
                        <Translate textKey="cargo_equip_exchange" />,
                        true
                      )}
                      {Information(oneCargo.data.price || "-" + " €", <Translate textKey={"price"} />)}
                    </div>
                  </Col>
                  <Col>
                    {Information(
                      oneCargo.data.goods_types
                        ?.map((x) => getTranslation(x.name, appLang).name)
                        .join(", "),
                        <Translate textKey={"cargo_type"}  />,
                      true
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {" "}
                    {Information(
                     oneCargo.data.vehicle_note[0]?.vehicle_note,
                        <Translate textKey={"description"}  />
                    )}
                  </Col>
                </Row>
              </Collapse>
            </Col>

            {/* Potreban tip vozila */}
            <Col xs={24} lg={12} xl={8}>
              <Collapse header={<Translate  textKey={"vehicle_type_required"} />} collapsed={collapsed}>
                <Row>
                  <Col span={24}>
                    {Information(
                      oneCargo.data.vehicle_types
                        ?.map((x) => getTranslation(x.name, appLang).name)
                        .join(", "),
                      <Translate textKey={"vehicle_sort"} />,
                      true
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Information(
                      oneCargo.data.vehicle_equipment
                        ?.map((x) => getTranslation(x.name, appLang).name)
                        .join(", "),
                      <Translate textKey={"vehicle_equipment"} />,
                      true
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Information(
                      oneCargo.data.vehicle_upgrades
                        .map((x) => getTranslation(x.name, appLang).name)
                        .join(", "),
                        <Translate textKey={"vehicle_upgrades"} />,
                      true
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    {Information(
                      oneCargo.data.cargo_note[0].cargo_note,
                        <Translate textKey={"description"}  />,
                      true
                    )}
                  </Col>
                </Row>
              </Collapse>
            </Col>

            {/* Aukcija */}
            {oneCargo.data.auction &&
              !!oneCargo.data.auctions.length &&
              !auctionFinished && (
                <Col xs={24} lg={12} xl={8}>
                  <Collapse header={  <Translate textKey={"auction"} />} collapsed={collapsed}>
                    <Row>
                      <Col span={12}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          {Information(
                            oneCargo.data.auctions[
                              oneCargo.data.auctions.length - 1
                            ]?.price + " €",
                            "Zadnja ponuda"
                          )}
                          <div>
                            <Popover
                              content={auctionLastPriceInfo(
                                oneCargo.data.auctions[
                                  oneCargo.data.auctions.length - 1
                                ]
                              )}
                            >
                              <Avatar shape="square" icon={<UserOutlined />} />
                            </Popover>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>{countdown}</Col>
                    </Row>
                    <Row>
                      <div
                        className={styles.auctionFlexRow}
                        style={{ marginBottom: 24, width: auctionWidth }}
                      >
                        {currentUser.account.company.id !==
                          oneCargo.data.company.id && (
                          <div
                            style={{
                              width: "300px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                              flexDirection: "row",
                              position: "relative",
                            }}
                          >
                            <InputNumber
                              min={1}
                              value={auctionValue}
                              onChange={(value) => {
                                if (isNaN(+value)) {
                                  return;
                                }

                                set_auctionValue(value);
                              }}
                              label="Ponudi"
                              name="entry_price"
                              type="number"
                              width={auctionButtonWidth}
                            />
                            <Button
                              onClick={() => {
                                if (
                                  !(
                                    +auctionValue <=
                                    +oneCargo.data.auctions[
                                      oneCargo.data.auctions.length - 1
                                    ].price
                                  )
                                ) {
                                  message.warn("Nepravilan unos...", 3);
                                  return;
                                }

                                if (
                                  +oneCargo.data.auctions[
                                    oneCargo.data.auctions.length - 1
                                  ].price -
                                    +auctionValue <
                                  +oneCargo.data.min_down_bind_percentage
                                ) {
                                  message.warn(
                                    "Macimalni iznos za ponuditi je " +
                                      Math.abs(
                                        +oneCargo.data.auctions[
                                          oneCargo.data.auctions.length - 1
                                        ].price -
                                          +oneCargo.data
                                            .min_down_bind_percentage
                                      ) +
                                      ".",
                                    3
                                  );
                                  return;
                                }
                                setAuction();
                              }}
                              disabled={!auctionValue}
                              loading={loading}
                              text="Ponudi"
                              width={auctionWidth}
                              style={{
                                borderRadius: "50%",
                                lineHeight: 0,
                                marginLeft: 12,
                              }}
                              icon={
                                <img
                                  src={auction}
                                  alt="Auction button"
                                  style={{
                                    width: 18,
                                    height: 18,
                                  }}
                                />
                              }
                            />
                            <span
                              style={{
                                position: "absolute",
                                fontSize: 12,
                                top: 34,
                              }}
                            >
                              Max. ponuda:{" "}
                              {+oneCargo.data.auctions[
                                oneCargo.data.auctions.length - 1
                              ].price - +oneCargo.data.min_down_bind_percentage}
                            </span>
                          </div>
                        )}
                      </div>
                    </Row>
                  </Collapse>
                </Col>
              )}
          </Row>

          {/* Fourth row */}
          <Row>
            {/* Osnovne informacije */}
            <Col xs={24} lg={12} xl={8}>
              <Collapse header={<Translate textKey={"basic_info"} />} collapsed={collapsed}>
                <CompanyInformations company={oneCargo.data.company} />
              </Collapse>
            </Col>

            {/* Kontakt osoba */}
            <Col xs={24} lg={12} xl={8}>
              <Collapse header={<Translate textKey={"contact_person"} />} collapsed={collapsed}>
                {oneCargo.data.contact_accounts?.map((u) => {
                  return <User user={u} name={u} collapsed />;
                })}
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
        <CargoForm
          renew={renew}
          update={oneCargo.data}
          visible={drawerVisible}
          closeDrawer={() => {
            {
              setDrawerVisible(false);
              history.goBack();
            }
          }}
        />
      </CustomDrawer>{" "}
    </>
  );
};

const parseCargo = (data) => {
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
  <div className={styles.information} style={{ width: 300, ...containerStyle }}>
    <p className={styles.label}>{label || "-"}</p>
    <p className={styles.value} style={{ fontSize: 16 }}>
      {" "}
      {value || "-"}
    </p>
  </div>
);

const mapStateToProps = (state) => {
  return {
    oneCargo: state.Transport.oneCargo,
    currentUser: state.User.user.data,
    cargoList: state.Transport.cargo.data,
  };
};

export default connect(mapStateToProps, null)(Profile);
