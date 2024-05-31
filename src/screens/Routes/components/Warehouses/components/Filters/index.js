import React, { useRef, useState } from "react";

// Locale
import "moment/locale/hr";
import locale from "antd/es/date-picker/locale/hr_HR";

// Helpers
import useDevice from "../../../../../../helpers/useDevice";

// UI
import {
  Row,
  Col,
  Space,
  DatePicker,
  message,
  Checkbox,
  Button,
  Spin,
} from "antd";
import styles from "../../../../routes.module.css";

// Components

import Place from "../../../../../Add/components/Cargo/components/Form/PlaceMemo";
import Collapse from "../../../../../../components/Collapse";
import BasicButton from "../../../../../../components/Buttons/Basic";
import { connect, useDispatch } from "react-redux";
import { STOCK } from "../../../../../../redux/modules/Transport/actions";
import moment from "moment";
import CustomVerticalDevider from "../../../../../../components/CustomVerticalDevider";
import {
  DATETIME_PICKER_OPTIONS,
  selectOptions,
} from "../../../../../../helpers/functions";
import CloseElement from "../../../../../../components/CloseElement";
import { unstable_batchedUpdates } from "react-dom";
import CustomInputLabel from "../../../../../../components/Inputs/CustomInputLabel";
import Translate from "../../../../../../Translate";

const Filters = ({ close }) => {
  // Variables
  const placeRef = useRef(null);
  const scrollRef = useRef(null);
  const device = useDevice();
  const dispatch = useDispatch();
  const [itemVisible, set_itemVisible] = useState("");
  const [loading, set_loading] = useState(false);

  // Methods

  const [filter, set_filter] = useState({
    country: null,
    cities: null,
    date: null,
    min_surface: "",
    max_surface: "",
    stock_equipments: [],
    stock_types: [],
    show_blocked_users: false,
  });

  const resetFilter = () => {
    placeRef.current?.resetPlace();
    set_filter({
      country: null,
      cities: null,
      date: null,
      min_surface: "",
      max_surface: "",
      stock_equipments: [],
      stock_types: [],
      show_blocked_users: false,
    });
  };

  const scrollToTop = () => scrollRef.current.scrollIntoView();

  // Styles
  const isMobile = device === "mobile";
  const elementWidth = device === "desktop" ? "calc(100% - 24px)" : "100%";

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <Spin spinning={loading}>
        <div ref={scrollRef}>
          <Space
            direction="vertical"
            size="small"
            style={{
              width: "100%",
              height: device === "desktop" && "100%", // 140 => Translate
              padding: "0 2px",
            }}
          >
            {
              // Show header only on desktop
              device === "desktop" && (
                <Row>
                  <h1 className="header"> <Translate textKey={"warehouse_search"} /></h1>
                </Row>
              )
            }
            {/* Call to action buttons */}

            {/* Od - do */}
            <Collapse header={<Translate textKey={"warehouse"}  />}>
              <Place width={elementWidth} maxWidth={540} ref={placeRef} />
              <CustomVerticalDevider />
              <div
                style={{ width: "100%", maxWidth: 540, position: "relative" }}
              >
                <DatePicker
                  {...DATETIME_PICKER_OPTIONS(
                    set_itemVisible,
                    undefined,
                    "date"
                  )}
                  open={itemVisible === "date"}
                  disabledDate={(current) => {
                    return moment().add(-1, "days") >= current;
                  }}
                  value={filter.date}
                  style={{ width: "100%" }}
                  onChange={(v) => {
                    unstable_batchedUpdates(() => {
                      set_filter({ ...filter, date: v });
                      set_itemVisible("");
                    }, []);
                  }}
                  locale={locale}
                  inputReadOnly
                  placeholder=""
                />
                <CustomInputLabel text={<Translate textKey={"choose_date"} />}/>
              </div>
              <CustomVerticalDevider />
              <div style={{ maxWidth: 540 }}>
                <span>  <Translate textKey={"incl_blocked_users"}  /></span>
                <Checkbox
                  checked={filter.show_blocked_users}
                  onChange={() => {
                    set_filter({
                      ...filter,
                      show_blocked_users: !filter.show_blocked_users,
                    });
                  }}
                />
              </div>
              <CustomVerticalDevider />
              <div
                className={styles.CTARowDesktop}
                style={{
                  maxWidth: 540,
                  flexDirection: isMobile ? "column-reverse" : "row",
                }}
              >
                {/* Clear filters */}
                <BasicButton
                  style={{ height: 46 }}
                  onClick={() => {
                    resetFilter();
                    dispatch({
                      type: STOCK,
                      errorCallback: () => {
                        message.error(
                          "Upsss dogodila se greška kod dohvata podataka",
                          3
                        );
                      },
                    });
                  }}
                  text={<Translate textKey={"clean_butt"} />}
                  color="white"
                  noIcon
                  containerStyle={{ width: isMobile && "100%" }}
                />

                <div
                  style={{
                    marginLeft: device === "desktop" && 10,
                    marginBottom: device === "mobile" && 20,
                    marginTop: isMobile && 40,
                    width: isMobile && "100%",
                  }}
                >
                  <BasicButton
                    text={<Translate textKey={"search"} />}
                    color="purple"
                    noIcon
                    onClick={() => {
                      set_loading(true);
                      const place = placeRef.current?.getData();
                      dispatch({
                        type: STOCK,
                        queryParams: {
                          ...filter,
                          countries: place.country?.id,
                          cities: place.city?.id,
                          zip_codes: place.zip_code?.id,
                        },
                        errorCallback: () => {
                          set_loading(false);
                          message.error(
                            <Translate textKey={"fetch_data_error"} />,
                            6
                          );
                        },
                        successCallback: () => {
                          set_loading(false);
                          if (close) close();
                        },
                      });
                      scrollToTop();
                    }}
                    style={{ height: 46 }}
                  />
                </div>
              </div>
            </Collapse>
          </Space>
        </div>
      </Spin>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    prepare: state.User.prepare.data,
  };
};

export default connect(mapStateToProps, null)(Filters);
