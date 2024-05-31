import React, { useEffect, useRef, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";

// Locale

// Helpers
import useDevice from "../../../../../../helpers/useDevice";

// UI
import { Row, Col, Space, Checkbox, Form, Select, message, Button } from "antd";
import styles from "../../../../routes.module.css";

// Components

import BasicButton from "../../../../../../components/Buttons/Basic";
import Collapse from "../../../../../../components/Collapse";

import InputWithSuffix from "../../../../../../components/Inputs/WithSuffix";

import Place from "../../../../../Add/components/Cargo/components/Form/PlaceMemo";
import { appLang, CARGO_PLACE_TYPE } from "../../../../../../helpers/consts";
import { connect, useDispatch } from "react-redux";
import {
  createQueryParamsFromFilter,
  createTabName,
  getDatesPeriod,
  getTranslation,
  selectOptions,
} from "../../../../../../helpers/functions";
import {
  CARGO,
  PANES,
  SET_ACTIVE_KEY,
  SET_PANES,
} from "../../../../../../redux/modules/Transport/actions";

import MorePlaces from "../../../../../../components/MorePlaces";
import { unstable_batchedUpdates } from "react-dom";
import PickerWithType from "../../../../../../components/DatePickerTypes";
import CustomVerticalDevider from "../../../../../../components/CustomVerticalDevider";
import CloseElement from "../../../../../../components/CloseElement";
import moment from "moment";
import CustomInputLabel from "../../../../../../components/Inputs/CustomInputLabel";
import CustomAntdFormField from "../../../../../../components/CustomAntdFormField";
import Destinations from "../../../../../../components/Cards/Destinations";
import PlaceAddForm from "./PlaceAddForm";
import Translate from "../../../../../../Translate";
import translations from "../../../../../../assets/translations";

const { Option } = Select;
const { Item } = Form;

const Filters = ({
  prepare,
  panes,
  listCollection,
  updateFilter,
  closeDrawer,
  activePaneKey,
  visible,
  appLang
}) => {
  // Refs
  const fromPlaceRef = useRef();
  const scrollRef = useRef(null);
  const toPlaceRef = useRef();
  const dispatch = useDispatch();

  // Variables
  
  const device = useDevice();
  

  const [loads, set_loads] = useState([]);
  const [unloads, set_unloads] = useState([]);

  const [vehicleForm] = Form.useForm();

  const [itemVisible, set_itemVisible] = useState("");

  const [showBlockedUsers, set_showBlockedUsers] = useState(false);
  const [withAuction, set_withAuction] = useState(false);

 
  useEffect(() => {
    if (updateFilter) {
      const filter = panes[listCollection].find(
        (x) => x.path === activePaneKey[listCollection]
      ).filters;

      unstable_batchedUpdates(() => {
        set_loads(filter.from);
        set_unloads(filter.to);
        set_withAuction(!!filter.auction);
        set_showBlockedUsers(!!filter.show_blocked_users);
        vehicleForm.setFieldsValue({
          type: filter.vehicle.type,
          equipment: filter.vehicle.equipment,
          upgrades: filter.vehicle.upgrades,
          min_length: filter.vehicle.min_length,
          max_length: filter.vehicle.max_length,
          min_weight: filter.vehicle.min_weight,
          max_weight: filter.vehicle.max_weight,
          periodValue: filter.period.value ? moment(filter.period.value) : null,
          periodType: filter.period.type || "week",
        });
      }, []);
    }
    if (!visible) {
      resetFilter();
    }
  }, [updateFilter, visible]);

  const resetFilter = () => {
    fromPlaceRef.current?.resetData();
    toPlaceRef.current?.resetData();
    set_loads([]);
    set_unloads([]);
    set_withAuction(false);
    set_showBlockedUsers(false);
    vehicleForm.resetFields();
  };

  // Methods

  function add(_filter) {
    const time = new Date().getTime();
    let activeKey = +time;
    let newPanes = { ...panes };
    let arr = [...newPanes[listCollection]];
    let newObject = _filter; // zato
    const activekey = { ...activePaneKey };

    if (updateFilter) {
      let index = arr.findIndex(
        (item) => item.path === activePaneKey[listCollection]
      );
      arr[index] = {
        ...arr[index],
        name: createTabName(newObject.from, newObject.to, translations[appLang]["all_ads"]),
        filters: newObject,
      };
    } else {
      arr.push({
        id: +time,
        name: createTabName(newObject.from, newObject.to, translations[appLang]["all_ads"]),
        path: `tab-${time}`,
        key: activeKey,
        filters: newObject,
        type: `added`,
      });

      activekey[listCollection] = `tab-${time}`;
    }

    newPanes[listCollection] = arr;

    dispatch({
      type: CARGO,
      startWithEmptyArr: true,
      queryParams: {
        ...createQueryParamsFromFilter(_filter),
      },
      errorCallback: () => {
        message.error(<Translate textKey={"fetch_data_error"} />, 6);
      },
      successCallback: () => {
        dispatch({
          type: PANES,
          data: { panes: newPanes },
          successCallback: () => {
            dispatch({ type: SET_PANES, data: newPanes });
            dispatch({ type: SET_ACTIVE_KEY, data: activekey });
          },
        });
      },
    });
    resetFilter();
  }

  const scrollToTop = () => scrollRef.current.scrollIntoView();

  // Styles
  const dropdownWidth = device === "desktop" ? "calc(100% - 12px)" : "100%";
  const smallDropdownWidth =
    device === "desktop" ? "calc(50% - 12px)" : "calc(50% - 6px)";
  const inputWidth = "calc(50% - 12px)";
 

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <div className="dadada" ref={scrollRef}>
        <Space
          direction="vertical"
          size="small"
          style={{
            width: "100%",
            padding: "0 2px",
          }}
        >
          {/* Od - do */}
          <Row gutter={device === "desktop" && [24, 0]}>
            <Col span={device === "mobile" && 24} lg={12} xl={6}>
              <Collapse header={<Translate  textKey={"from"} />}>
                <PlaceAddForm
                  ref={fromPlaceRef}
                  data={loads}
                  type={CARGO_PLACE_TYPE.LOAD}
                />
              </Collapse>
            </Col>
            <Col span={device === "mobile" && 24} lg={12} xl={6}>
              <Collapse header={<Translate  textKey={"to"} />}>
                <PlaceAddForm
                  ref={toPlaceRef}
                  data={unloads}
                  type={CARGO_PLACE_TYPE.UNLOAD}
                />
              </Collapse>
            </Col>

            {/* Izbor vozila */}
            <Col span={device === "mobile" && 24} lg={24} xl={12}>
              <Collapse header={<Translate textKey={"vehicle_choice"} />}>
                <Form
                  form={vehicleForm}
                  layout={"vertical"}
                  initialValues={{
                    type: [],
                    equipment: [],
                    upgrades: [],
                    min_length: "",
                    max_length: "",
                    min_weight: "",
                    max_weight: "",
                    periodValue: null,
                    periodType: "week",
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
                        name="type"
                        label={<Translate textKey={"vehicle_sort"} />}
                        children={
                          <Select
                            showSearch={device === "desktop"}
                            {...selectOptions(set_itemVisible, "type")}
                            open={itemVisible === "type"}
                            mode={"multiple"}
                            style={{ width: dropdownWidth }}
                          >
                            {prepare.vehicle_types.map((x) => (
                              <Option key={x.id} value={x.id}>
                                {getTranslation(x.name, appLang).name}{" "}
                              </Option>
                            ))}
                          </Select>
                        }
                      />

                      <CustomVerticalDevider />
                      <CustomAntdFormField
                        label={ <Translate textKey={"vehicle_equipment"} />}
                        name="equipment"
                        children={
                          <Select
                            showSearch={device === "desktop"}
                            {...selectOptions(set_itemVisible, "equipment")}
                            open={itemVisible === "equipment"}
                            mode={"multiple"}
                            style={{ width: dropdownWidth }}
                          >
                            {" "}
                            {prepare.vehicle_equipment.map((x) => (
                              <Option key={x.id} value={x.id}>
                                {getTranslation(x.name, appLang).name}{" "}
                              </Option>
                            ))}{" "}
                          </Select>
                        }
                      />

                      <CustomVerticalDevider />
                      <div
                        className={styles.flexRowFilters}
                        style={{
                          marginBottom: 12,
                          paddingRight: device === "desktop" && 10,
                        }}
                      >
                        <Item name="min_length" width={dropdownWidth}>
                          <InputWithSuffix
                            suffix="m"
                            label={<Translate textKey={"min_length"} />}
                            type="decimal"
                          />
                        </Item>

                        <div className="formHorizontalDivider" />

                        <Item name="max_length" width={dropdownWidth}>
                          <InputWithSuffix
                            suffix="m"
                            label={<Translate textKey={"max_length"} />}
                            type="decimal"
                          />
                        </Item>
                      </div>
                      <div
                        className={styles.flexRowFilters}
                        style={{
                          marginBottom: 24,
                          paddingRight: device === "desktop" && 10,
                        }}
                      >
                        <Item name="min_weight" width={dropdownWidth}>
                          <InputWithSuffix
                            suffix="t"
                            label={<Translate  textKey={"min_weight"} />}
                            type="decimal"
                          />
                        </Item>

                        <div className="formHorizontalDivider" />

                        <Item name="max_weight" width={dropdownWidth}>
                          <InputWithSuffix
                            suffix="t"
                            label={<Translate  textKey={"max_weight"} />}
                            type="decimal"
                          />
                        </Item>
                      </div>

                      <Checkbox
                        checked={showBlockedUsers}
                        onChange={() => set_showBlockedUsers(!showBlockedUsers)}
                        style={{ marginBottom: 20 }}
                      >
                        <Translate textKey={"incl_blocked_users"}  />
                      </Checkbox>
                    </Col>
                    <Col lg={24} xl={12}>
                      <CustomAntdFormField
                        children={
                          <Select
                            mode={"multiple"}
                            showSearch={device === "desktop"}
                            {...selectOptions(set_itemVisible, "upgrades")}
                            open={itemVisible === "upgrades"}
                            style={{ width: dropdownWidth }}
                          >
                            {" "}
                            {prepare.vehicle_upgrades.map((x) => (
                              <Option key={x.id} value={x.id}>
                                {getTranslation(x.name, appLang).name}{" "}
                              </Option>
                            ))}{" "}
                          </Select>
                        }
                        label={<Translate  textKey={"vehicle_upgrades"}/>}
                        name={"upgrades"}
                      />
                      <CustomVerticalDevider />

                      <div
                        className={styles.flexRowFilters}
                        style={{
                          paddingRight: device === "desktop" && 10,
                        }}
                      >
                        <CustomAntdFormField
                          style={{ width: dropdownWidth }}
                          label={<Translate textKey={"time_period"} />}
                          name="periodType"
                          children={
                            <Select
                              placeholder=""
                              {...selectOptions(set_itemVisible, "periodType")}
                              onSelect={() => set_itemVisible("")}
                              open={itemVisible === "periodType"}
                              containerStyle={{ width: smallDropdownWidth }}
                            >
                               <Option value="hour"><Translate textKey={"time"} /></Option>
                              <Option value="date"><Translate textKey={"date"} /></Option>
                              <Option value="week"><Translate textKey={"week"} /></Option>
                              <Option value="month"><Translate textKey={"month"} /></Option>
                              <Option value="quarter"><Translate textKey={"quarter"} /></Option>
                              <Option value="year"><Translate textKey={"year"} /></Option>
                            </Select>
                          }
                        />

                        <div className="formHorizontalDivider" />
                        
                        <PickerWithType
                          type={vehicleForm.getFieldValue("periodType")}
                          name={"periodValue"}
                        />
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Collapse>
            </Col>
          </Row>

          {/* Aukcije */}
          <Row gutter={device === "desktop" && [24]}>
            <Col span={device === "mobile" && 24} lg={24} xl={12}>
              <Collapse header={  <Translate textKey={"auction"} />}>
                <Checkbox
                  checked={withAuction}
                  onChange={() => set_withAuction(!withAuction)}
                  style={{ marginBottom: 20 }}
                >
                  <Translate textKey={"show_auction"} />
                </Checkbox>
              </Collapse>
            </Col>
            <Col span={device === "mobile" && 24} lg={24} xl={12}>
              {/* Clear filters */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexDirection:
                    device === "desktop" ? "row" : "column-reverse",
                  paddingRight: device === "desktop" && 24,
                }}
              >
                <div style={{ width: device === "mobile" && "100%" }}>
                  <BasicButton
                    onClick={resetFilter}
                    text={<Translate textKey={"clean_butt"} />}
                    color="white"
                    noIcon
                    style={{ height: 46 }}
                  />
                </div>

                <div style={{ width: device === "mobile" && "100%" }}>
                  <BasicButton
                    text={<Translate textKey={"apply_filters_butt"} />}
                    color="purple"
                    noIcon
                    style={{
                      height: 46,
                      marginLeft: device === "desktop" && 24,
                      marginBottom: device === "mobile" && 20,
                    }}
                    onClick={() => {
                      const start = fromPlaceRef.current?.insertData();
                      const end = toPlaceRef.current?.insertData();

                      if (!start.isOk || !end.isOk) {
                        return;
                      }

                      const formData = vehicleForm.getFieldsValue();

                      const filterData = {
                        name: "",
                        from: start.places,
                        to: end.places,
                        vehicle: {
                          type: formData.type,
                          equipment: formData.equipment,
                          upgrades: formData.upgrades,
                          min_length: +formData.min_length || null,
                          max_length: +formData.max_length || null,
                          min_weight: +formData.min_weight || null,
                          max_weight: +formData.max_weight || null,
                        },
                        show_blocked_users: showBlockedUsers ? 1 : 0,
                        ...getDatesPeriod(
                          formData.periodValue,
                          formData.periodType
                        ),
                        auction: withAuction ? 1 : 0,
                        period: {
                          value: formData.periodValue,
                          type: formData.periodType,
                        },
                      };
                      add(filterData);
                      closeDrawer();
                      scrollToTop();
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Space>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    prepare: state.User.prepare.data,
    panes: state.Transport.panes,
    activeFiltersCargo: state.Transport.activeFiltersCargo,
    activePaneKey: state.Transport.activePaneKey,
    appLang: state.User.appLang
  };
};

export default connect(mapStateToProps, null)(Filters);
