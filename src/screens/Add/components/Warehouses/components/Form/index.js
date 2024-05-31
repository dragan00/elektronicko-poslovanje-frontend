import React, { Children, useEffect, useRef, useState } from "react";

// Locale
import "moment/locale/hr";
import locale from "antd/es/date-picker/locale/hr_HR";

// Helpers
import useDevice from "../../../../../../helpers/useDevice";

// UI
import { Row, Col, Space, DatePicker, message, Spin, Form, Input } from "antd";
import styles from "../../../../add.module.css";

// Icons
import camera from "../../../../../../assets/icons/camera.png";

import Collapse from "../../../../../../components/Collapse";
import Upload from "../../../../../../components/Inputs/Upload";
import {  IMAGE_TYPES } from "../../../../../../helpers/consts";
import BasicButton from "../../../../../../components/Buttons/Basic";
import TextArea from "../../../../../../components/Inputs/TextArea";

import moment from "moment";
import { connect, useDispatch } from "react-redux";
import {
  ADD_STOCK,
  ONE_STOCK_SUCCESS,
} from "../../../../../../redux/modules/Transport/actions";
import Place from "../../../Cargo/components/Form/PlaceMemo";
import axios from "axios";
import { getApiEndpoint } from "../../../../../../axios/endpoints";
import { useParams } from "react-router";
import CustomVerticalDevider from "../../../../../../components/CustomVerticalDevider";
import {
  compressImage,
  DATETIME_PICKER_OPTIONS,
} from "../../../../../../helpers/functions";
import CloseElement from "../../../../../../components/CloseElement";
import CustomAntdFormField from "../../../../../../components/CustomAntdFormField";
import Translate from "../../../../../../Translate";

const { Item } = Form;

const AllForm = ({ addStock, currentUser, update, close, visible,appLang }) => {
  const placeRef = useRef();
  // Variables
  const device = useDevice();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, set_loading] = useState(false);
  const scrollRef = useRef(null);

  const [stockForm] = Form.useForm();
  const [itemVisible, set_itemVisible] = useState("");
  const [reRender, set_reRender] = useState(0);

  const removeFile = (file) => {
    let list = files.concat();
    const index = list.indexOf(file);
    list.splice(index, 1);
    set_files(list);
  };

  const beforeUploadFile = (file, fileList) => {
    set_files([...files, ...fileList]);
    return false;
  };

  useEffect(() => {
    if (update) {
      set_files(update.images || []);
    }
  }, [visible]);

  const [files, set_files] = useState([]);
  const resetForm = () => {
    placeRef.current?.resetPlace();
    stockForm.resetFields();
    set_files([]);
  };

  const saveData = async () => {
    const place = placeRef.current?.getData();

    if (!place.country?.id || !place.city?.id || !place.zip_code?.id) {
      message.warning(
        "Potrebno navesti državu, sa mjestom i poštanskim brojem...",
        3
      );
      return;
    }

    const stockData = stockForm.getFieldsValue();

    if (!stockData.start_datetime) {
      message.warning(<Translate textKey={"date"} />, 3);
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        stock: {
          ...stockData,
          contact_accounts: [currentUser.id],
          min_area: +stockData.min_area || null,
          max_area: +stockData.max_area || null,
          country: place.country?.id,
          city: place.city?.id,
          zip_code: place.zip_code?.id,
        },
      })
    );


    // console.log(files)
    // files.forEach(async (file, i) => {
    //   let _file = file;
    //   if (IMAGE_TYPES.includes(file.type)) {
    //     _file = await compressImage(file);
    //   }

    //   console.log(_file);
    //   formData.append("files", _file);
    // });


   

     

    if (update) {
      set_loading(true);
      let token = await localStorage.getItem("token");
      axios
        .put(
          `${getApiEndpoint()}transport/stock/${id}/`,
          {
            stock: {
              ...stockData,
              contact_accounts: [currentUser.id],
              min_area: +stockData.min_area || null,
              max_area: +stockData.max_area || null,
              country: place.country?.id,
              city: place.city?.id,
              zip_code: place.zip_code?.id,
            },
          },
          {
            timeout: 6 * 1000,

            headers: {
              Authorization: "Token " + token,
              
            },
          }
        )
        .then((res) => {
          dispatch({ type: ONE_STOCK_SUCCESS, data: res.data });
          //update redux
          set_loading(false);

          resetForm();
          close();
        })
        .catch((err) => {
          set_loading(false);
          message.error("Dogodila se greška kod spremanja podataka", 6);
        });

      return;
    }

    dispatch({
      type: ADD_STOCK,
      data: formData,
      errorCallback: () => {
        message.error("Upss dogodila se greška...", 3);
      },
      successCallback: () => {
        message.success(<Translate textKey={"success"}  />);
        resetForm();
        scrollToTop();
      },
    });
  };

  const scrollToTop = () => scrollRef.current.scrollIntoView();

  // Styles
  const isMobile = device === "mobile";
  const inputWidth = "calc(50% - 12px)";
  const elementWidth = device === "desktop" ? "calc(100% - 24px)" : "100%";

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <div className={"dadada"} ref={scrollRef}>
        <Form
          layout={"vertical"}
          form={stockForm}
          initialValues={{
            stock_types: update?.stock_types || "",
            stock_equipment: update?.stock_equipment || "",
            max_area: update?.max_area || "",
            min_area: update?.min_area || "",
            end_datetime: update?.end_datetime
              ? moment(update.end_datetime)
              : null,
            start_datetime: update?.start_datetime
              ? moment(update.start_datetime)
              : null,
          }}
        >
          <Spin spinning={addStock.status === "loading" || loading}>
            <Space
              direction="vertical"
              size="small"
              style={{
                width: "100%",
                height: device === "desktop" && "calc(100vh - 90px)", // 168 => Translate
                padding: "0 2px",
              }}
            >
              {
                // Show header only on desktop
                device === "desktop" && !update && (
                  <Row>
                    <h1 className="header"><Translate textKey={"add_warehouse"} /></h1>
                  </Row>
                )
              }

              {/* Od - do */}
              <Row gutter={device === "desktop" && [24]}>
                <Col span={24}>
                  <Collapse header={<Translate textKey={"warehouse"}  />}>
                    <Row
                      gutter={[0]}
                      style={{
                        width: "100%",
                        display: device === "desktop" ? "flex" : "block",
                      }}
                    >
                      <Col
                        style={{ paddingRight: device === "desktop" && 24 }}
                        span={device === "mobile" && 24}
                        lg={24}
                        xl={12}
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <Place
                            value={
                              update
                                ? {
                                    country: update.country,
                                    city: update.city,
                                    zip_code: update.zip_code,
                                  }
                                : null
                            }
                            width={elementWidth}
                            showButtonAll={false}
                            ref={placeRef}
                            onSelect={set_reRender}
                          />
                          {/* Pick date */}
                          <CustomAntdFormField
                            label={<Translate textKey={"date_from"}/>}
                            name="start_datetime"
                            children={
                              <DatePicker
                                {...DATETIME_PICKER_OPTIONS(
                                  set_itemVisible,
                                  undefined,
                                  "start_datetime"
                                )}
                                open={itemVisible === "start_datetime"}
                                disabledDate={(current) => {
                                  return moment().add(-1, "days") >= current;
                                }}
                                onChange={(v) => {
                                  set_itemVisible("");
                                }}
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                                locale={locale}
                                placeholder=""
                                inputReadOnly={true}
                              />
                            }
                          />
                          <CustomAntdFormField
                            label={<Translate textKey={"date_to"} />}
                            name="end_datetime"
                            children={
                              <DatePicker
                                {...DATETIME_PICKER_OPTIONS(
                                  set_itemVisible,
                                  undefined,
                                  "end_datetime"
                                )}
                                open={itemVisible === "end_datetime"}
                                onChange={(v) => {
                                  set_itemVisible("");
                                }}
                                disabledDate={(current) => {
                                  return moment().add(-1, "days") >= current;
                                }}
                                format="YYYY-MM-DD"
                                style={{ width: "100%", marginBottom: 20 }}
                                locale={locale}
                                placeholder=""
                                inputReadOnly
                              />
                            }
                          />
                          <div />
                        </Space>
                      </Col>
                      <Col
                        style={{ marginTop: device === "mobile" && -16 }}
                        span={device === "mobile" && 24}
                        lg={24}
                        xl={12}
                      >
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          {/* Surface */}
                          <div className={styles.flexRowFilters}>
                            <CustomAntdFormField
                              label={<Translate textKey={"min_wh_surface"} />}
                              name="min_area"
                              children={
                                <Input
                                  suffix="m²"
                                  type="text"
                                  width="100%"
                                  className="inputHeight"
                                />
                              }
                            />
                            <div style={{ width: 24 }} />
                            <CustomAntdFormField
                              label={<Translate textKey={"max_wh_surface"} />}
                              name="max_area"
                              children={
                                <Input
                                  suffix="m²"
                                  type="text"
                                  width="100%"
                                  className="inputHeight"
                                />
                              }
                            />
                          </div>
                          {/* Pick warehouse equipment */}

                          <CustomAntdFormField
                            label={<Translate textKey={"warehouse_equip"} />}
                            name="stock_equipment"
                            children={<TextArea type="text" width={"100%"} />}
                          />

                          {/* Pick type of warehouse */}
                          <CustomAntdFormField
                            name="stock_types"
                            label={<Translate textKey={"warehouse_name"} />}
                            children={<TextArea width={"100%"} />}
                          />
                          {/* Dokumenti */}

                          {false && (
                            <Upload
                              multiple={true}
                              label={<Translate textKey={"pictures"}  />}
                              tag=" slike"
                              name="photos"
                              type="photo"
                              icon={camera}
                              value={files}
                              beforeUploadFile={beforeUploadFile}
                              onRemove={removeFile}
                              inForm={true}
                            />
                          )}
                          {/* Divider */}
                          <div />
                        </Space>
                      </Col>
                    </Row>
                  </Collapse>
                </Col>
              </Row>

              <Row
                style={{
                  width: !isMobile && "calc(100% - 48px)",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      flexDirection: !isMobile ? "row" : "column-reverse",
                      float: !isMobile && "right",
                    }}
                  >
                    {/* Clear filters */}
                    <BasicButton
                      onClick={() => {
                        resetForm();
                      }}
                      text={<Translate textKey={"clean_butt"} />}
                      color="white"
                      noIcon
                      containerStyle={{ width: isMobile && "100%" }}
                      style={{ height: 46 }}
                    />

                    <div
                      style={{
                        marginLeft: device === "desktop" && 10,
                        marginTop: device === "mobile" && 40,
                        marginBottom: isMobile && 20,
                        width: isMobile && "100%",
                      }}
                    >
                      <BasicButton
                        disabled={false}
                        text={ <Translate textKey={"save_butt"} />}
                        color="purple"
                        noIcon
                        onClick={saveData}
                        containerStyle={{ width: "100%" }}
                        style={{
                          marginLeft: !isMobile && 10,
                          height: 46,
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Space>
          </Spin>
        </Form>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    prepare: state.User.prepare.data,
    appLang: state.User.appLang,
    addStock: state.Transport.addStock,
    currentUser: state.User.user.data.account,
  };
};

export default connect(mapStateToProps, null)(AllForm);
