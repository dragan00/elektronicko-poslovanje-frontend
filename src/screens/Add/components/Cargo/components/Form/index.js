import React, { useEffect, useRef, useState } from "react";

import { unstable_batchedUpdates } from "react-dom";

// Helpers
import useDevice from "../../../../../../helpers/useDevice";

// UI
import {
  Row,
  Col,
  Space,
  Checkbox,
  DatePicker,
  TimePicker,
  Select,
  Spin,
  message,
  Input,
  Form,
} from "antd";

// Components
import Collapse from "../../../../../../components/Collapse";
import CheckboxCollapse from "../../../../../../components/Collapse/Checkbox";

import BasicButton from "../../../../../../components/Buttons/Basic";

import {
  CARGO_PLACE_TYPE,
  INPUT_MAX_MIN_NUM_RULE,
  INPUT_NUMBER_RULE,
} from "../../../../../../helpers/consts";
import { connect, useDispatch } from "react-redux";
import {
  SAVE_CARGO,
  UPDATE_CARGO,
} from "../../../../../../redux/modules/Transport/actions";
import {
  createLoadUnloadTime,
  DATETIME_PICKER_OPTIONS,
  getTimeDatePlaces,
  selectOptions,
  setPrepareByLang,
} from "../../../../../../helpers/functions";
import moment from "moment";
import CustomVerticalDevider from "../../../../../../components/CustomVerticalDevider";
import CustomAntdFormField from "../../../../../../components/CustomAntdFormField";
import CloseElement from "../../../../../../components/CloseElement";
import PlaceAddForm from "./PlaceAddForm";
import { useHistory, useParams } from "react-router-dom";
import { getApiEndpoint } from "../../../../../../axios/endpoints";
import Translate from "../../../../../../Translate";
const timeFormat = "HH:mm";

const VALIDATION_MESSAGE = "Ovo polje je obavezno";

const { Option } = Select;

function AllForm({
  appLang,
  prepare,
  saveCargo,
  closeDrawer,
  update,
  visible,
  currentUser,
  updateCargo,
  renew,
}) {

  // Variables
  const dispatch = useDispatch();
  const loadPlaceRef = useRef(null);
  const unloadPlaceRef = useRef(null);

  const scrollRef = useRef(null);
  const [exchange, set_exchange] = useState(false);
  const device = useDevice();
  const [itemVisible, set_itemVisible] = useState("");

  const [translatedPrepare, set_translatedPrepare] = useState({});
  const [auctionVisible, set_auctionVisible] = useState(true);

  const [loadPlaces, set_loadPlaces] = useState([]);
  const [unloadPlaces, set_unloadPlaces] = useState([]);

  const [auction, set_auction] = useState(false);
  const scrollRefOnError = useRef();

  const [vehicleForm] = Form.useForm();
  const [cargoForm] = Form.useForm();
  const [auctionForm] = Form.useForm();

  const history = useHistory();
  const params = useParams();

  const createForBackend = (data) => {
    const data_for_backend = {
      load_unload: [...data.loadPlaces, ...data.unloadPlaces].map((x) => ({
        ...x,
        country: x.country?.id || null,
        city: x.city?.id || null,
        zip_code: x.zip_code?.id || null,
        start_datetime: createLoadUnloadTime(x.from_date, x.from_time),
        end_datetime: createLoadUnloadTime(x.to_date, x.to_time),
      })),
      cargo: {
        goods_types: data.goods_types || [],
        cargo_note: [{ lang: appLang, cargo_note: data.cargo_note }],
        length: +data.cargo_length || null,
        width: +data.cargo_width || null,
        weight: +data.cargo_weight || null,
        price: +data.price || null,
        exchange,
      },
      vehicle: {
        vehicle_types: data.vehicle_types || [],
        vehicle_upgrades: data.vehicle_upgrades || [],
        vehicle_equipment: data.vehicle_equipment || [],
        contact_accounts: [currentUser.id],
        vehicle_note: [{ lang: appLang, vehicle_note: data.vehicle_note }],
      },
      auction: {
        auction: auction && auctionVisible,
        start_price: +data.start_price || null,
        min_down_bind_percentage: +data.min_down_bind_percentage || null,
        auction_end_datetime: data.auction_end_datetime,
      },
    };

    return data_for_backend;
  };

  useEffect(() => {
    if (params.back) {
      history.goBack(-2);
    }
  }, []);

  const resetLoadPlace = () => {
    loadPlaceRef.current.resetData();
    set_loadPlaces([]);
  };

  const resetUnloadPlace = () => {
    unloadPlaceRef.current.resetData();
    set_unloadPlaces([]);
  };

  const resetForm = () => {
    resetLoadPlace();
    resetUnloadPlace();

    set_auctionVisible(true);

    cargoForm.resetFields();
    vehicleForm.resetFields();
    auctionForm.resetFields();
  };
  useEffect(() => {
    set_translatedPrepare(setPrepareByLang(prepare.data, appLang));
    console.log("DEV-LOG ~ useEffect ~ appLang:", appLang)
    console.log("DEV-LOG ~ useEffect ~ prepare.data:", prepare.data)
  }, [appLang]);

  useEffect(() => {
    set_translatedPrepare(setPrepareByLang(prepare.data, appLang));
    if (update) {
      set_auction(update.auction);
      set_auctionVisible(!update.price);
      set_loadPlaces(
        update.load_unload
          .filter((x) => x.type === CARGO_PLACE_TYPE.LOAD)
          .map((x) => {
            const date = getTimeDatePlaces(x.start_datetime, x.end_datetime);

            return {
              country: x.country,
              city: x.city,
              zip_code: x.zip_code,
              from_date: !renew ? date.from_date : null,
              to_date: !renew ? date.to_date : null,
              from_time: !renew ? date.from_time : null,
              to_time: !renew ? date.to_time : null,
              type: CARGO_PLACE_TYPE.LOAD,
            };
          })
      );
      set_unloadPlaces(
        update.load_unload
          .filter((x) => x.type === CARGO_PLACE_TYPE.UNLOAD)
          .map((x) => {
            const date = getTimeDatePlaces(x.start_datetime, x.end_datetime);

            return {
              country: x.country,
              city: x.city,
              zip_code: x.zip_code,
              from_date: !renew ? date.from_date : null,
              to_date: !renew ? date.to_date : null,
              from_time: !renew ? date.from_time : null,
              to_time: !renew ? date.to_time : null,
              type: CARGO_PLACE_TYPE.UNLOAD,
            };
          })
      );
    }
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const scrollToTop = () => scrollRef.current.scrollIntoView();


  const scrollToError = () => {
    scrollRefOnError.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };


  // Styles
  const isMobile = device === "mobile";

  const _saveCargo = (data) => {
    dispatch({
      type: update && !renew ? UPDATE_CARGO : SAVE_CARGO,
      data: createForBackend(data),
      id: update?.id,
      renew,
      errorCallback: () => {
        message.error(
          "Upss dogodila se greška prilikom spremanja na server",
          3
        );
      },
      successCallback: (cargo_id) => {
        message.success(<Translate textKey={"success"}  />, 1, () => {
          if (renew) {
            history.push(`/cargo/${cargo_id}`);
          }
        });
        scrollToTop();

        if (renew) {
          history.goBack();
        } else {
          closeDrawer();
        }
      },
    });
  };

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <div className={"pointer dadada"}  ref={scrollRef}>
        <div className="FormUpdateCompanyWraper">
          <Spin
            spinning={
              saveCargo.status === "loading" || updateCargo.status === "loading"
            }
          >
            {device === "mobile" && <span ref={scrollRefOnError}></span>}

            <Space
              direction="vertical"
              size="small"
              style={{
                width: "100%",
              }}
            >
              {/* Call to action buttons */}
              <Row gutter={device === "desktop" && [24, 0]}>
                {/* Od - do */}
                <Col span={device === "mobile" && 24} lg={12} xl={6}>
                  <Collapse disableCollapse={true} header={<Translate textKey={"load_places"} />}>
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <PlaceAddForm
                        ref={loadPlaceRef}
                        data={loadPlaces}
                        type={CARGO_PLACE_TYPE.LOAD}
                      />
                    </Space>
                  </Collapse>
                </Col>

                <Col span={device === "mobile" && 24} lg={12} xl={6}>
                  <Collapse disableCollapse={true} header={<Translate  textKey={"unload_places"} />}>
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <PlaceAddForm
                        ref={unloadPlaceRef}
                        data={unloadPlaces}
                        type={CARGO_PLACE_TYPE.UNLOAD}
                      />
                    </Space>
                  </Collapse>
                </Col>
                {/* Izbor vozila */}
                <Col span={device === "mobile" && 24} lg={12} xl={6}>
                  <Collapse header={<Translate textKey={"vehicle_choice"} />}>
                    <Form
                      layout="vertical"
                      form={vehicleForm}
                      initialValues={{
                        vehicle_types:
                          update?.vehicle_types.map((x) => x.id) || [],
                        vehicle_upgrades:
                          update?.vehicle_upgrades.map((x) => x.id) || [],
                        vehicle_equipment:
                          update?.vehicle_equipment.map((x) => x.id) || [],
                        vehicle_note:
                          update?.vehicle_note.find((x) => x.lang === appLang)?.vehicle_note || "",
                        contact_accounts: [currentUser.id],
                      }}
                    >
                      <CustomAntdFormField
                        label={<Translate textKey={"vehicle_sort"} />}
                        name="vehicle_types"
                        children={
                          <Select
                            showSearch={device === "desktop"}
                            {...selectOptions(set_itemVisible, "vehicle_types")}
                            mode="multiple"
                            open={itemVisible === "vehicle_types"}
                          >
                            {translatedPrepare.vehicle_types &&
                              translatedPrepare.vehicle_types.map((x) => (
                                <Option key={x.id} value={x.id}>
                                  {x.name}
                                </Option>
                              ))}
                          </Select>
                        }
                      />

                      <CustomAntdFormField
                        label={<Translate textKey={"vehicle_equipment"} />}
                        name="vehicle_equipment"
                        children={
                          <Select
                            showSearch={device === "desktop"}
                            {...selectOptions(
                              set_itemVisible,
                              "vehicle_equipment"
                            )}
                            open={itemVisible === "vehicle_equipment"}
                            mode="multiple"
                          >
                            {translatedPrepare.vehicle_equipment &&
                              translatedPrepare.vehicle_equipment.map((x) => (
                                <Option key={x.id} value={x.id}>
                                  {x.name}
                                </Option>
                              ))}
                          </Select>
                        }
                      />

                      <CustomAntdFormField
                        label={<Translate textKey={"vehicle_upgrades"} />}
                        name="vehicle_upgrades"
                        children={
                          <Select
                            mode="multiple"
                            open={itemVisible === "vehicle_upgrades"}
                            {...selectOptions(
                              set_itemVisible,
                              "vehicle_upgrades"
                            )}
                            showSearch={device === "desktop"}
                          >
                            {translatedPrepare.vehicle_upgrades &&
                              translatedPrepare.vehicle_upgrades.map((x) => (
                                <Option key={x.id} value={x.id}>
                                  {x.name}
                                </Option>
                              ))}
                          </Select>
                        }
                      />

                      <CustomAntdFormField
                        label={<Translate textKey={"description"}  />}
                        name="vehicle_note"
                        children={<Input.TextArea rows={5} />}
                      />
                    </Form>
                  </Collapse>
                </Col>
                <Col span={device === "mobile" && 24} lg={12} xl={6}>
                  <Collapse header={<Translate textKey={"cargo"} />}>
                    <Form
                      form={cargoForm}
                      layout="vertical"
                      initialValues={{
                        goods_types: update?.goods_types.map((x) => x.id) || [],
                        cargo_length: update?.length.toString() || "13.6",
                        cargo_width: update?.width.toString() || "2.4",
                        cargo_weight: update?.weight.toString() || "24",
                        cargo_note:
                          update?.cargo_note.find((x) => x.lang === appLang)?.cargo_note || "",
                        price: update?.price || "",
                      }}
                    >
                      <CustomAntdFormField
                        label={<Translate textKey={"cargo_type"}  />}
                        name="goods_types"
                        children={
                          <Select
                            {...selectOptions(set_itemVisible, "goods_types")}
                            open={"goods_types" === itemVisible}
                            showSearch
                            mode={"multiple"}
                          >
                            {translatedPrepare.goods_types &&
                              translatedPrepare.goods_types.map((x) => (
                                <Option key={x.id} value={x.id}>
                                  {x.name}
                                </Option>
                              ))}
                          </Select>
                        }
                      />

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexDirection: "row",
                        }}
                      >
                        <CustomAntdFormField
                          label={<Translate textKey={"length"} />}
                          name="cargo_length"
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input suffix="m" className="inputHeight" />
                          }
                        />

                        <div className="formHorizontalDivider" />

                        <CustomAntdFormField
                          label={<Translate textKey={"width"} />}
                          name="cargo_width"
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input suffix="m" className="inputHeight" />
                          }
                        />

                        <div className="formHorizontalDivider" />

                        <CustomAntdFormField
                          name="cargo_weight"
                          label={<Translate textKey={"weight"} />}
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input suffix="t" className="inputHeight" />
                          }
                        />
                      </div>

                      <CustomAntdFormField
                        name="cargo_note"
                        label={<Translate textKey={"description"}  />}
                        children={<Input.TextArea rows={3} />}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-around",
                          flexDirection: "row",
                        }}
                      >
                        <CustomAntdFormField
                          label={<Translate textKey={"price"} />}
                          name="price"
                          rules={[INPUT_NUMBER_RULE]}
                          children={
                            <Input
                              className="inputHeight"
                              onChange={({ target: { value } }) => {
                                set_auctionVisible(!value);
                              }}
                              suffix={"€"}
                            />
                          }
                        />

                        <Checkbox
                          checked={exchange}
                          onChange={() => set_exchange(!exchange)}
                        >
                         <Translate textKey={"cargo_equip_exchange"}  />
                        </Checkbox>
                      </div>
                    </Form>
                  </Collapse>
                </Col>
              </Row>
              <Row>
                <Col span={device === "mobile" && 24} lg={12} xl={12}>
                  {/* Save filters */}
                  {auctionVisible && (
                    <CheckboxCollapse
                      checked={auction}
                      onChange={() => set_auction(!auction)}
                      header={  <Translate textKey={"auction"} />}
                    >
                      {auction && !update && (
                        <Form
                          form={auctionForm}
                          layout="vertical"
                          initialValues={{
                            start_price: update?.auctions[0]?.price || "",
                            min_down_bind_percentage:
                              update?.min_down_bind_percentage || "20",
                            to_date:
                              !renew &&
                              update &&
                              update.auction_end_datetime?.isValid()
                                ? moment(update.auction_end_datetime)
                                : null,
                            to_time:
                              !renew &&
                              update &&
                              update.auction_end_datetime?.isValid()
                                ? moment(update.auction_end_datetime)
                                : null,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              flexDirection: "row",
                            }}
                          >
                            <CustomAntdFormField
                              rules={[
                                {
                                  required: auction,
                                  message: VALIDATION_MESSAGE,
                                },
                              ]}
                              style={{
                                position: "relative",
                                width: "50%",
                                maxWidth: 270,
                              }}
                              label={<Translate textKey={"bid_starting_price"}  />}
                              name="start_price"
                              children={<Input suffix="€" />}
                            />
                            <CustomAntdFormField
                              rules={[
                                {
                                  required: auction,
                                  message: VALIDATION_MESSAGE,
                                },
                              ]}
                              style={{
                                position: "relative",
                                width: "50%",
                                maxWidth: 270,
                                marginLeft: 6,
                              }}
                              label={<Translate textKey={"bid_min_stake"} />}
                              name="min_down_bind_percentage"
                              children={<Input suffix="€" />}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              flexDirection: "row",
                            }}
                          >
                            <CustomAntdFormField
                              rules={[
                                {
                                  required: auction,
                                  message: VALIDATION_MESSAGE,
                                },
                              ]}
                              style={{
                                position: "relative",
                                width: "50%",
                                maxWidth: 270,
                              }}
                              label={<Translate textKey={"date_to"} />}
                              name="to_date"
                              children={
                                <DatePicker
                                  {...DATETIME_PICKER_OPTIONS(
                                    set_itemVisible,
                                    undefined,
                                    "auction_date_to"
                                  )}
                                  open={itemVisible === "auction_date_to"}
                                  style={{ width: "100%" }}
                                  disabledDate={(current) => {
                                    return moment().add(-1, "days") >= current;
                                  }}
                                />
                              }
                            />
                            <CustomAntdFormField
                              rules={[
                                {
                                  required: auction,
                                  message: VALIDATION_MESSAGE,
                                },
                              ]}
                              style={{
                                position: "relative",
                                width: "50%",
                                maxWidth: 270,
                                marginLeft: 6,
                              }}
                              label={<Translate textKey={"time_to"} />} 
                              name={"to_time"}
                              children={
                                <TimePicker
                                  {...DATETIME_PICKER_OPTIONS(
                                    set_itemVisible,
                                    timeFormat,
                                    "auction_to_time"
                                  )}
                                  onOk={(v) => {
                                    set_itemVisible("");
                                  }}
                                  open={itemVisible === "auction_to_time"}
                                  style={{ width: "100%" }}
                                />
                              }
                            />
                          </div>
                        </Form>
                      )}
                    </CheckboxCollapse>
                  )}
                </Col>
                <Col span={device === "mobile" && 24} lg={12} xl={12}>
                  {/* <CustomVerticalDevider height={37} /> */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      flexDirection: isMobile ? "column-reverse" : "row",
                      float: !isMobile && "right",
                    }}
                  >
                    {/* Clear filters */}
                    {!update && (
                      <BasicButton
                        containerStyle={{ width: isMobile && "100%" }}
                        onClick={resetForm}
                        text={<Translate textKey={"clean_butt"} />}
                        color="white"
                        noIcon
                        style={{ height: 46 }}
                      />
                    )}

                    <div
                      style={{
                        marginLeft: device === "desktop" && 10,
                        marginTop: device === "mobile" && 40,
                        marginBottom: isMobile && 20,
                        width: isMobile && "100%",
                      }}
                    >
                      <BasicButton
                        text={update && !renew ?   <Translate textKey={"edit"}  /> :  <Translate textKey={"save_butt"} />}
                        color="purple"
                        noIcon
                        style={{ height: 46 }}
                        onClick={() => {
                          const start = loadPlaceRef.current?.insertData();
                          const end = unloadPlaceRef.current?.insertData();

                          if (!start.isOk || !end.isOk) {
                            return;
                          }

                          if (!start.places.length || !end.places.length) {
                           scrollToError();
                            message.warning(
                              <Translate textKey={"min_one_departure_and_arrival_with_date"} />
                            );
                            return;
                          }


                          if (
                            loadPlaceRef.current?.validateFields(
                              start.places[0].from_date,
                              true
                            ) // true validation needs flag that is starting point
                          ) {
                            scrollToError();
                            return;
                          }

                          const _loadPlaces = start.places;
                          const _unloadPlaces = end.places;

                          auctionForm
                            .validateFields()
                            .then(() => {
                              cargoForm.validateFields().then(() => {
                                unstable_batchedUpdates(() => {
                                  set_loadPlaces(_loadPlaces);
                                  set_unloadPlaces(_unloadPlaces);
                                }, []);
                                // validacija ne moze se poslat na server ukoliko je duljina polazista liste 0
                                _saveCargo({
                                  ...auctionForm.getFieldsValue(),
                                  ...cargoForm.getFieldsValue(),
                                  ...vehicleForm.getFieldsValue(),
                                  auction_end_datetime: auction
                                    ? createLoadUnloadTime(
                                        auctionForm.getFieldValue("to_date"),
                                        auctionForm.getFieldValue("to_time")
                                      )
                                    : null,
                                  loadPlaces: _loadPlaces,
                                  unloadPlaces: _unloadPlaces,
                                });
                              });
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <CustomVerticalDevider height={70} />
            </Space>
          </Spin>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    prepare: state.User.prepare,
    currentUser: state.User.user.data.account,
    saveCargo: state.Transport.saveCargo,
    updateCargo: state.Transport.updateCargo,
    zip_codes: state.User.prepare.data.zip_codes,
    cities: state.User.prepare.data.cities,
    getCitiesOfCountry: state.Transport.getCitiesOfCountry,
    appLang: state.User.appLang
  };
};

export default connect(mapStateToProps, null)(AllForm);
