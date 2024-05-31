import React, { useEffect, useRef, useState } from "react";

// Helpers
import useDevice from "../../../../../../helpers/useDevice";

// UI
import { Row, Col, Space, Spin, message, Select, Form, Input } from "antd";
import styles from "../../../../add.module.css";

// Components
import Collapse from "../../../../../../components/Collapse";
import BasicButton from "../../../../../../components/Buttons/Basic";
import {
 
  INPUT_MAX_MIN_NUM_RULE,
  INPUT_NUMBER_RULE,
 
  LOAD_SPACE_PLACE_TYPE,
} from "../../../../../../helpers/consts";
import { connect, useDispatch } from "react-redux";
import {
  createLoadUnloadTime,
  getTimeDatePlaces,
  selectOptions,
  setPrepareByLang,
} from "../../../../../../helpers/functions";
import {
  SAVE_LOAD_SPACE,
  UPDATE_LOAD_SPACE,
} from "../../../../../../redux/modules/Transport/actions";
import CloseElement from "../../../../../../components/CloseElement";
import CustomAntdFormField from "../../../../../../components/CustomAntdFormField";
import PlaceAddForm from "./PlaceAddForm";
import { useHistory } from "react-router-dom";
import Translate from "../../../../../../Translate";

const { Option } = Select;

function AllForm({
  prepare,
  appLang,
  saveLoadSpace,
  closeDrawer,
  currentUser,
  update,
  updateLoadSpace,
  visible,
  renew,
}) {
  // Variables
  const loadPlaceRef = useRef(null);
  const unloadPlaceRef = useRef(null);

  const scrollRef = useRef(null);
  const device = useDevice();
  const dispatch = useDispatch();

  const [translatedPrepare, set_translatedPrepare] = useState({});

  const [itemVisible, set_itemVisible] = useState("");
  const [vehicleForm] = Form.useForm();
  const [loads, set_loads] = useState([]);
  const [unloads, set_unloads] = useState([]);
  const scrollRefOnError = useRef();

  const history = useHistory();

  useEffect(() => {
    set_translatedPrepare(setPrepareByLang(prepare.data, appLang));
  }, [appLang]);

  useEffect(() => {
    set_translatedPrepare(setPrepareByLang(prepare.data, appLang));
    if (update) {
      setDataForUpdate();
    }

    if(!visible){
      resetForm()
    }
  }, [visible]);

  const setDataForUpdate = () => {
    set_unloads(
      update.starting_point_destination
        .filter((x) => x.type === LOAD_SPACE_PLACE_TYPE.DESTINATION)
        .map((x) => {
          return {
            country: x.country,
            zip_code: x.zip_code,
            city: x.city,
            type: LOAD_SPACE_PLACE_TYPE.DESTINATION,
            time_from: null,
            date_from: null,
            departure_datetime: null,
            within_km: x.within_km || null,
          };
        })
    );
    set_loads(
      update.starting_point_destination
        .filter((x) => x.type === LOAD_SPACE_PLACE_TYPE.START)
        .map((x) => {
          const tmp = getTimeDatePlaces(x.departure_datetime, null);
          return {
            country: x.country,
            zip_code: x.zip_code,
            city: x.city,
            type: LOAD_SPACE_PLACE_TYPE.START,
            time_from: renew ? null : tmp.from_time,
            date_from: renew ? null : tmp.from_date,
            departure_datetime: null,
            within_km: null,
          };
        })
    );
  };

  const resetForm = () => {
    unloadPlaceRef.current?.resetData();
    loadPlaceRef.current?.resetData();
    vehicleForm.resetFields();
  };

  const scrollToTop = () => scrollRef.current.scrollIntoView();

  // Styles
  const isMobile = device === "mobile";

  const scrollToError = () => {
    scrollRefOnError.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <div className="dadada" ref={scrollRef}>
        <Spin
          spinning={
            saveLoadSpace.status === "loading" ||
            updateLoadSpace.status === "loading"
          }
        >
          {device === "mobile" && <span ref={scrollRefOnError}></span>}
          <Space
            direction="vertical"
            size="small"
            style={{
              width: "100%",
              padding: "0 2px",
            }}
          >
            {/* Od - do */}
            <Row gutter={device === "desktop" && [24]}>
              <Col span={device === "mobile" && 24} lg={6} xl={6}>
                <Collapse disableCollapse={true} header={<Translate textKey="departure" />}>
                  <PlaceAddForm
                    ref={loadPlaceRef}
                    data={loads}
                    type={LOAD_SPACE_PLACE_TYPE.START}
                  />
                </Collapse>
              </Col>
              <Col span={device === "mobile" && 24} lg={6} xl={6}>
                <Collapse disableCollapse={true} header={<Translate textKey={"arrival"} />}>
                  <PlaceAddForm
                    withinKmFlag={true}
                    ref={unloadPlaceRef}
                    data={unloads}
                    hideDates={true}
                    type={LOAD_SPACE_PLACE_TYPE.DESTINATION}
                  />
                </Collapse>
              </Col>
              <Col span={device === "mobile" && 24} lg={12} xl={12}>
                <Collapse header={<Translate textKey={"vehicle"} />}>
                  <Form
                    form={vehicleForm}
                    layout="vertical"
                    initialValues={{
                      vehicle_type: update ? update.vehicle_type?.id : null,

                      vehicle_upgrades: update
                        ? update.vehicle_upgrades.map((x) => x.id)
                        : [],
                      vehicle_equipment: update
                        ? update.vehicle_equipment.map((x) => x.id)
                        : [],
                      contact_accounts: [currentUser.id],
                      vehicle_load_capacity: update
                        ? update.vehicle_load_capacity?.toString()
                        : "",
                      vehicle_length: update
                        ? update.vehicle_length?.toString()
                        : "",
                      connected_vehicle_length: update
                        ? update.connected_vehicle_length?.toString()
                        : "",
                      connected_vehicle_load_capacity: update
                        ? update.connected_vehicle_load_capacity?.toString()
                        : "",
                      vehicle_note: update
                        ? update.vehicle_note.find((x) => x.lang === appLang)
                            ?.vehicle_note
                        : "",
                    }}
                  >
                    <Row
                      style={{
                        width: "100%",
                        display: device === "desktop" ? "flex" : "block",
                      }}
                    >
                      <Col lg={24} xl={12}>
                        <CustomAntdFormField
                          label={<Translate textKey={"vehicle_sort"} />}
                          name={"vehicle_type"}
                          children={
                            <Select
                              showSearch={device === "desktop"}
                              {...selectOptions(
                                set_itemVisible,
                                "vehicle_type"
                              )}
                              open={
                                device === "mobile"
                                  ? itemVisible === "vehicle_type"
                                  : undefined
                              }
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
                          name={"vehicle_equipment"}
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
                          name={"vehicle_upgrades"}
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
                      </Col>
                      <Col
                        lg={24}
                        xl={12}
                        style={{
                          paddingLeft: device === "desktop" && 12,
                          marginBottom: 24,
                        }}
                      >
                        <CustomAntdFormField
                          label={<Translate textKey={"vehicle_length"}  />}
                          name="vehicle_length"
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input
                              suffix="m"
                              type="decimal"
                              className="inputHeight"
                            />
                          }
                        />

                        <CustomAntdFormField
                          name="vehicle_load_capacity"
                          label={<Translate textKey={"vehicle_load"}  />}
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input
                              suffix="t"
                              type="decimal"
                              className="inputHeight"
                            />
                          }
                        />
                        <CustomAntdFormField
                          label={<Translate  textKey={"trailer_length"} />}
                          name="connected_vehicle_length"
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input
                              suffix="m"
                              type="decimal"
                              className="inputHeight"
                            />
                          }
                        />

                        <CustomAntdFormField
                           label={<Translate  textKey={"trailer_weight"} />}
                          name="connected_vehicle_load_capacity"
                          rules={[INPUT_NUMBER_RULE, INPUT_MAX_MIN_NUM_RULE]}
                          children={
                            <Input
                              suffix="t"
                              type="decimal"
                              className="inputHeight"
                            />
                          }
                        />

                        <CustomAntdFormField
                          style={{ position: "relative" }}
                          name={"vehicle_note"}
                          label={<Translate textKey={"description"}  />}
                          children={<Input.TextArea rows={5} />}
                          
                        />
                      </Col>
                    </Row>
                  </Form>
                </Collapse>
              </Col>
            </Row>

            {/* Vozilo */}
            <Row
              style={{ marginTop: device === "mobile" && -8 }}
              gutter={device === "desktop" && [24]}
              justify={"end"}
            >
              <Col span={24}>
                <div
                  className={styles.CTARowDesktop}
                  style={{
                    justifyContent: "end",
                    flexDirection: !isMobile ? "row" : "column-reverse",
                  }}
                >
                  {/* Clear filters */}
                  {!update && (
                    <BasicButton
                      onClick={resetForm}
                      text={<Translate textKey={"clean_butt"} />}
                      color="white"
                      noIcon
                      style={{ height: 46 }}
                      containerStyle={{ width: isMobile && "100%" }}
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
                      text={update && !renew ?   <Translate textKey={"edit"}  />:  <Translate textKey={"save_butt"} />}
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




                        const vehicleData = vehicleForm.getFieldsValue();
                        const data = {
                          vehicle: {
                            ...vehicleForm.getFieldsValue(),
                            vehicle_type: vehicleData.vehicle_type || null,
                            vehicle_length: +vehicleData.vehicle_length || null,
                            vehicle_load_capacity:
                              +vehicleData.vehicle_load_capacity || null,
                            connected_vehicle_length:
                              +vehicleData.connected_vehicle_length || null,
                            connected_vehicle_load_capacity:
                              +vehicleData.connected_vehicle_load_capacity ||
                              null,
                            contact_accounts: [currentUser.id],
                            vehicle_note: [
                              {
                                lang: appLang,
                                vehicle_note: vehicleForm.getFieldValue(
                                  "vehicle_note"
                                ),
                              },
                            ],
                          },

                          starting_point_destination: [
                            ...start.places,
                            ...end.places,
                          ].map((x) => ({
                            ...x,
                            country: x.country?.id || null,
                            city: x.city?.id || null,
                            zip_code: x.zip_code?.id || null,
                            departure_datetime: createLoadUnloadTime(
                              x.from_date,
                              x.from_time
                            ),
                          })),
                        };

                        vehicleForm.validateFields().then(() => {
                          dispatch({
                            type:
                              update && !renew
                                ? UPDATE_LOAD_SPACE
                                : SAVE_LOAD_SPACE,
                            data,
                            renew,
                            id: update?.id,
                            errorCallback: () => {
                              message.error(
                                "Upss nije prošlo spremanje na server...",
                                3
                              );
                            },
                            successCallback: (loadspace_id) => {
                              message.success(<Translate textKey={"success"}  />, 1, () => {
                                if (renew) {
                                  history.push(`/loadingspace/${loadspace_id}`);
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
                        });
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Space>
        </Spin>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    prepare: state.User.prepare,
    appLang: state.User.appLang,
    saveLoadSpace: state.Transport.saveLoadSpace,
    updateLoadSpace: state.Transport.updateLoadSpace,
    currentUser: state.User.user.data.account,
  };
};

export default connect(mapStateToProps, null)(AllForm);
