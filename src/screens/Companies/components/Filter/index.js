import React, { useRef, useState } from "react";

// Helpers
import useDevice from "../../../../helpers/useDevice";

// UI
import { Row, Col, Space, message, Select } from "antd";
import styles from "../../companies.module.css";

// Components
import Collapse from "../../../../components/Collapse";
import InputWithSuffix from "../../../../components/Inputs/WithSuffix";
import Place from "../../../Add/components/Cargo/components/Form/PlaceMemo";
import { connect, useDispatch } from "react-redux";
import { GET_COMPANIES } from "../../../../redux/modules/Transport/actions";
import BasicButton from "../../../../components/Buttons/Basic";
import CloseElement from "../../../../components/CloseElement";
import {
  getTranslation,
  selectOptions,
  validateJoin,
} from "../../../../helpers/functions";
import CustomAntdFormField from "../../../../components/CustomAntdFormField";
import Translate from "../../../../Translate";

const collOptions = {
  xxl: 12,
  xl: 12,
  lg: 12,
  sm: 24,
  xs: 24,
};

const Filters = ({ prepare, close,appLang }) => {
  // Refs
  const placeRef = useRef();
  const scrollRef = useRef(null);
  const [itemVisible, set_itemVisible] = useState("");
  // Variables
  const dispatch = useDispatch();
  const device = useDevice();

  const [filter, set_filter] = useState({
    countries: null,
    cities: null,
    zip_codes: null,
    vehicle_types: [],
    vehicle_upgrades: [],
    vehicle_equipment: [],
    vehicle_length_max: "",
    vehicle_length_min: "",
    vehicle_weight_min: "",
    vehicle_weight_max: "",
    ignore_blocked_users: true,
  });

  const resetForm = () => {
    placeRef.current?.resetPlace();
    set_filter({
      countries: null,
      cities: null,
      zip_codes: null,
      vehicle_types: [],
      vehicle_upgrades: [],
      vehicle_equipment: [],
      vehicle_length_max: "",
      vehicle_length_min: "",
      vehicle_weight_min: "",
      vehicle_weight_max: "",
      ignore_blocked_users: true,
    });
    dispatch({
      type: GET_COMPANIES,
      errorCallback: () => {
        message.error("Upss dogodila se greška kod dohvata podataka", 3);
      },
    });
  };

  const scrollToTop = () => scrollRef.current.scrollIntoView();

  // Styles
  const dropdownWidth = device === "desktop" ? "calc(100% - 12px)" : "100%";
  const inputWidth = "calc(50% - 12px)";

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <div className={"companiesFilters"} ref={scrollRef}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Row gutter={device === "desktop" && [24]}>
            <Col span={24} xl={10}>
              <Collapse header={<Translate textKey={"location"} />}>
                <div style={{ height: 24 }} />
                <Place showButtonAll={false} ref={placeRef} />
                <CustomAntdFormField
                  label={<Translate  textKey={"vehicle_equipment"} />}
                  children={
                    <Select
                      {...selectOptions(set_itemVisible, "vehicle_equipment")}
                      open={"vehicle_equipment" === itemVisible}
                      mode={"multiple"}
                      placeholder=""
                      style={{ width: "100%" }}
                      value={filter.vehicle_equipment}
                      onChange={(v) => {
                        set_filter({ ...filter, vehicle_equipment: v });
                      }}
                    >
                      {prepare.vehicle_equipment &&
                        prepare.vehicle_equipment.map((x) => (
                          <Select.Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Select.Option>
                        ))}
                    </Select>
                  }
                />
              </Collapse>
            </Col>
            <Col span={24} xl={14} style={{ paddingRight: 0 }}>
              <Collapse style={{ padding: 0 }} header={<Translate textKey={"vehicle_choice"} />}>
                <div style={{ height: 24 }} />
                <CustomAntdFormField
                  label={<Translate textKey={"vehicle_sort"} />}
                  children={
                    <Select
                      {...selectOptions(set_itemVisible, "vehicle_types")}
                      open={itemVisible === "vehicle_types"}
                      style={{ width: dropdownWidth }}
                      value={filter.vehicle_types}
                      mode={"multiple"}
                      onChange={(v) => {
                        set_filter({ ...filter, vehicle_types: v });
                      }}
                      placeholder=""
                    >
                      {prepare.vehicle_types &&
                        prepare.vehicle_types.map((x) => (
                          <Select.Option key={x.id} value={x.id}>
                            {" "}
                            {getTranslation(x.name, appLang)?.name}
                          </Select.Option>
                        ))}
                    </Select>
                  }
                />

                <div
                  className={styles.flexRowFilters}
                  style={{
                    marginBottom: 24,
                    marginTop: 24,
                    paddingRight: device === "desktop" && 10,
                  }}
                >
                  <InputWithSuffix
                    label={<Translate textKey={"min_length"} />}
                    suffix="m"
                    name="min-length"
                    type="number"
                    width={inputWidth}
                    onChange={({ target: { value } }) => {
                      set_filter({ ...filter, vehicle_length_min: value });
                    }}
                    value={filter.vehicle_length_min}
                  />
                  <InputWithSuffix
                    label={<Translate textKey={"max_length"} />}
                    suffix="m"
                    name="max-length"
                    type="number"
                    width={inputWidth}
                    onChange={({ target: { value } }) => {
                      set_filter({ ...filter, vehicle_length_max: value });
                    }}
                    value={filter.vehicle_length_max}
                  />
                </div>
                <div
                  className={styles.flexRowFilters}
                  style={{
                    marginBottom: 24,
                    paddingRight: device === "desktop" && 10,
                  }}
                >
                  <InputWithSuffix
                    label={<Translate  textKey={"min_weight"} />}
                    suffix="t"
                    name="min-weight"
                    type="number"
                    width={inputWidth}
                    onChange={({ target: { value } }) => {
                      set_filter({ ...filter, vehicle_weight_min: value });
                    }}
                    value={filter.vehicle_weight_min}
                  />
                  <InputWithSuffix
                    label={<Translate  textKey={"max_weight"} />}
                    suffix="t"
                    name="max-weight"
                    type="number"
                    width={inputWidth}
                    onChange={({ target: { value } }) => {
                      set_filter({ ...filter, vehicle_weight_max: value });
                    }}
                    value={filter.vehicle_weight_max}
                  />
                </div>
                <CustomAntdFormField
                  label={<Translate textKey={"vehicle_upgrades"} />}
                  children={
                    <Select
                      {...selectOptions(set_itemVisible, "vehicle_upgrades")}
                      open={"vehicle_upgrades" === itemVisible}
                      mode={"multiple"}
                      placeholder=""
                      marginLeft={device === "desktop" && 12}
                      style={{ width: dropdownWidth }}
                      value={filter.vehicle_upgrades}
                      onChange={(v) => {
                        set_filter({ ...filter, vehicle_upgrades: v });
                      }}
                    >
                      {prepare.vehicle_upgrades &&
                        prepare.vehicle_upgrades.map((x) => (
                          <Select.Option key={x.id} value={x.id}>
                            {" "}
                            {getTranslation(x.name, appLang)?.name}
                          </Select.Option>
                        ))}
                    </Select>
                  }
                />
              </Collapse>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div
                className={styles.CTARowDesktop}
                style={{
                  float: "right",
                  marginTop: 40,
                  justifyContent: "flex-end",
                  paddingRight: device === "desktop" && 64,
                  flexDirection: device === "mobile" ? "column-reverse" : "row",
                }}
              >
                {/* Clear filters */}
                <div style={{ width: device === "mobile" && "100%" }}>
                  <BasicButton
                    onClick={resetForm}
                    text={<Translate textKey={"clean_butt"} />}
                    color="white"
                    noIcon
                    fill
                    style={{ height: 46 }}
                  />
                </div>

                <div
                  style={{
                    marginLeft: device === "desktop" && 10,
                    width: device === "mobile" && "100%",
                    marginBottom: device === "mobile" && 20,
                  }}
                >
                  <BasicButton
                    text={<Translate textKey={"apply_filters_butt"} />}
                    color="purple"
                    noIcon
                    onClick={(v) => {
                      const place = placeRef.current?.getData();
                      if (!place.country) {
                        message.warning(<Translate textKey={"at_least_country"} />, 3);
                        return;
                      }
                      dispatch({
                        type: GET_COMPANIES,
                        queryParams: {
                          ...filter,
                          countries: place.country?.id,
                          cities: place.city?.id,
                          zip_codes: place.zip_code?.id,
                          vehicle_upgrades: validateJoin(
                            filter.vehicle_upgrades.join("|")
                          ),
                          vehicle_equipment: validateJoin(
                            filter.vehicle_equipment.join("|")
                          ),
                          vehicle_types: validateJoin(
                            filter.vehicle_types.join("|")
                          ),
                        },
                        errorCallback: () => {
                          message.error(
                          <Translate textKey={"fetch_data_error"} />,
                            6
                          );
                        },
                        successCallback: () => {
                          if (close) {
                            close();
                          }
                        },
                      });
                      scrollToTop();
                    }}
                    style={{
                      marginLeft: device === "desktop" && 24,
                      height: 46,
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
    appLang: state.User.appLang
  };
};

export default connect(mapStateToProps, null)(Filters);
