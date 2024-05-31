import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  message,
  Spin,
  Col,
  Row,
} from "antd";
import { PHONE_NUM_TYPE } from "../../../../../helpers/consts";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getTranslation,
  selectOptions,
} from "../../../../../helpers/functions";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Place from "../../../../Add/components/Cargo/components/Form/PlaceMemo";
import axios from "axios";
import { getApiEndpoint } from "../../../../../axios/endpoints";
import { GET_USER_SUCCESS } from "../../../../../redux/modules/User/actions";
import BasicButton from "../../../../../components/Buttons/Basic";
import AddDocument from "../../../../../assets/icons/services_active.png";
import AddMail from "../../../../../assets/icons/green_mail.png";
import { colors } from "../../../../../styles/colors";
import CustomAntdFormField from "../../../../../components/CustomAntdFormField";
import CustomInputLabel from "../../../../../components/Inputs/CustomInputLabel";
import useDevice from "../../../../../helpers/useDevice";
import CloseElement from "../../../../../components/CloseElement";
import Translate from "../../../../../Translate";

const { Option } = Select;
const { Item } = Form;

const validationmessage = <Translate textKey={"compulsory_field"} />;

const UpdateCompanyForm = ({
  prepare,
  company,
  close,
  user,
  globalPrepare,
  appLang
}) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const device = useDevice();

  const [companyUpdateLoading, set_companyUpdateLoading] = useState(false);
  const [itemVisible, set_itemVisible] = useState("");
  const [reRender, set_reRender] = useState(0);

  const placeRef = useRef();

  const onFinish = async (values) => {

    const place = placeRef.current?.getData();
    if (!place.country || !place.city || !place.zip_code) {
      message.warning("Potrebno navesti državu, grad, poštanski broj...");
      return;
    }

    set_companyUpdateLoading(true);

    const data = {
      company_name: values.company_name,
      company_address: values.company_address,
      company_emails: values.company_emails,
      company_OIB: values.company_OIB,
      company_year: values.company_year,
      company_web: values.company_web,
      company_numbers: values.company_numbers,
      company_services: {
        goods_forms: values.goods_forms,
        goods_types: values.goods_types,
        transport_types: values.transport_types,
        own_vehicles: !!own_vehicles,
        vehicles_num: values.vehicles_num,
        vehicle_types: values.vehicle_types,
        vehicle_upgrades: values.vehicle_upgrades,
        loading_systems: values.loading_systems,
        vehicle_equipment: values.vehicle_equipment,
      },
      company_cover_countries: values.cover_countries,
      company_city: place.city?.id,
      company_country: place.country?.id,
      company_zip_code: place.zip_code?.id,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    const token = await localStorage.getItem("token");

    axios
      .put(`${getApiEndpoint()}transport/companies/${company.id}/`, formData, {
        timeout: 6000,
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        set_companyUpdateLoading(false);
        const data = { ...user };

        const _account = { ...data.account };
        _account.company = res.data;
        data.account = _account;
        dispatch({ type: GET_USER_SUCCESS, data });

        close();
      })
      .catch((err) => {
        message.error("Dogodila se greška prilikom spremanaj podataka", 6);
        set_companyUpdateLoading(false);
      });
  };

  const [own_vehicles, set_own_vehicles] = useState(
    company.services.own_vehicles
  );

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}
      <div className="FormUpdateCompanyWraper">
        <Spin spinning={companyUpdateLoading}>
          <Form
            scrollToFirstError={true}
            labelAlign="left"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            name={"dynamic_form_nest_item"}
            form={form}
            initialValues={{
              company_name: company.name,
              company_address: company.address,
              company_emails: company.company_emails?.map((x) => x.email) || [],
              company_OIB: company["OIB"],
              company_year: company.year,
              company_web: company.web,
              company_numbers: company.company_numbers || [],
              goods_forms: company.services.goods_forms?.map((x) => x.id) || [],
              goods_types: company.services.goods_types?.map((x) => x.id) || [],
              transport_types:
                company.services.transport_types?.map((x) => x.id) || [],
              vehicles_num: company.services.vehicles_num,
              vehicle_types: company.services.vehicle_types?.map((x) => x.id),
              vehicle_upgrades:
                company.services.vehicle_upgrades?.map((x) => x.id) || [],
              loading_systems:
                company.services.loading_systems?.map((x) => x.id) || [],
              vehicle_equipment:
                company.services.vehicle_equipment?.map((x) => x.id) || [],
              cover_countries: company.cover_countries?.map((x) => x.id) || [],
            }}
          >
            <Row gutter={[24]}>
              <Col span={24} lg={12} xl={6}>
                {" "}
                <div className="innerFormWraper">
                  <CustomAntdFormField
                    style={{ position: "relative" }}
                    label={<Translate textKey={"company_name"}  />}
                    name={"company_name"}
                    rules={[{ required: true, message: validationmessage }]}
                    children={<Input className="inputHeight" />}
                  />
                  <Place
                    marginBottom={0}
                    value={{
                      country: company.country,
                      city: company.city,
                      zip_code: company.zip_code,
                    }}
                    showButtonAll={false}
                    ref={placeRef}
                    onSelect={set_reRender}
                  />
                  <div style={{ height: 24 }} />
                  <CustomAntdFormField
                    style={{ position: "relative" }}
                    label={<Translate textKey={"address"} />}
                    name={"company_address"}
                    children={<Input className="inputHeight" />}
                  />
                </div>
              </Col>
              <Col span={24} lg={12} xl={6}>
                {" "}
                <div className="innerFormWraper">
                  <CustomAntdFormField
                    {...selectOptions(set_itemVisible, "cover_countries")}
                    open={itemVisible === "cover_countries"}
                    label={<Translate textKey={"presence"} />}
                    name={"cover_countries"}
                    style={{ position: "relative" }}
                    children={
                      <Select className="inputHeight" mode={"multiple"}>
                        {globalPrepare.data.countries.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {x.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"id_number"} />}
                    name={"company_OIB"}
                    style={{ position: "relative" }}
                    rules={[{ required: true, message: validationmessage }]}
                    children={<Input className="inputHeight" />}
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"website"}  />}
                    name={"company_web"}
                    style={{ position: "relative" }}
                    rules={[{ required: false, message: validationmessage }]}
                    children={<Input className="inputHeight" />}
                  />
                  <CustomAntdFormField
                    label={<Translate textKey={"year_founded"}  />}
                    name={"company_year"}
                    style={{ position: "relative" }}
                    rules={[{ required: true, message: validationmessage }]}
                    children={<Input className="inputHeight" type="number" />}
                  />

                  <Form.List name="company_emails">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, i) => {
                          return (
                            <div key={i} className="listWraper">
                              <Form.Item required={false} key={field.key}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Form.Item
                                    {...field}
                                    rules={[
                                      {
                                        type: "email",
                                        required: true,
                                        message: "Email nije ispravan...",
                                      },
                                    ]}
                                    style={{
                                      position: "relative",
                                      height: 39,
                                      marginBottom: "0px !important",
                                    }}
                                  >
                                    <Input />
                                  </Form.Item>

                                  <MinusCircleOutlined
                                    style={{
                                      width: 30,
                                      marginTop: -24,
                                      marginLeft: 10,
                                    }}
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                  />
                                </div>
                                <CustomInputLabel text={i + 1 + ". email"} />
                              </Form.Item>
                            </div>
                          );
                        })}

                        <Item>
                          <Button
                            type="dashed"
                            block
                            style={{
                              height: "76px",
                              color: colors.purple,
                              padding: "14px 0",
                              marginBottom: 0,
                            }}
                            onClick={() => add()}
                          >
                            <img
                              src={AddMail}
                              style={{ height: 18, width: 18, marginBottom: 4 }}
                            />
                            <div><Translate textKey={<Translate textKey={"add_mail_butt"} />}  /></div>
                          </Button>
                        </Item>
                      </>
                    )}
                  </Form.List>

                  <Form.List name="company_numbers">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(
                          ({ key, name, fieldKey, ...restField }, i) => (
                            <div
                              style={{ position: "relative" }}
                              key={i}
                              className="listWraper"
                            >
                              <Item
                                {...restField}
                                style={{ position: "relative" }}
                                name={[name, "number"]}
                                fieldKey={[fieldKey, "number"]}
                                rules={[
                                  {
                                    required: true,
                                    message: validationmessage,
                                  },
                                ]}
                              >
                                <Input
                                  id="updateCompanyEmailInput"
                                  className="inputHeight"
                                  type={"tel"}
                                  addonAfter={
                                    <Item
                                      style={{
                                        position: "relative",
                                        height: 39,
                                      }}
                                      name={[name, "type"]}
                                      fieldKey={[fieldKey, "type"]}
                                      noStyle
                                      rules={[
                                        {
                                          required: false,
                                          message: validationmessage,
                                        },
                                      ]}
                                    >
                                      <Select
                                        style={{ width: 64 }}
                                        className="inputHeight"
                                      >
                                        <Option value={PHONE_NUM_TYPE.TEL}>
                                          Tel
                                        </Option>
                                        <Option value={PHONE_NUM_TYPE.FAX}>
                                          Fax
                                        </Option>
                                      </Select>
                                    </Item>
                                  }
                                  style={{
                                    width: "100%",
                                    height: "39px !important",
                                  }}
                                />
                              </Item>
                              <CustomInputLabel text={i + 1 + ". broj"} />

                              <MinusCircleOutlined
                                style={{
                                  width: 30,
                                  marginTop: -22,
                                  marginLeft: 10,
                                }}
                                onClick={() => remove(name)}
                              />
                            </div>
                          )
                        )}
                        <Item>
                          <Button
                            type="dashed"
                            block
                            style={{
                              height: "76px",
                              color: colors.purple,
                              padding: "14px 0",
                            }}
                            onClick={() => add()}
                          >
                            <img
                              src={AddDocument}
                              style={{ height: 18, width: 18, marginBottom: 4 }}
                            />
                            <div><Translate textKey={"add_number_butt"}  /></div>
                          </Button>
                        </Item>
                      </>
                    )}
                  </Form.List>
                </div>
              </Col>
              <Col span={24} lg={12} xl={6}>
                <div className="innerFormWraper">
                  <CustomAntdFormField
                    label={<Translate textKey={"vehicle_type"} />}
                    name={"vehicle_types"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "vehicle_types")}
                        open={itemVisible === "vehicle_types"}
                      >
                        {prepare.vehicle_types.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"vehicle_upgrades"} />}
                    name={"vehicle_upgrades"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "vehicle_upgrades")}
                        open={itemVisible === "vehicle_upgrades"}
                      >
                        {prepare.vehicle_upgrades.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />

                  <CustomAntdFormField
                    label={ <Translate textKey={"vehicle_equipment"} />}
                    name={"vehicle_equipment"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "vehicle_equipment")}
                        open={itemVisible === "vehicle_equipment"}
                      >
                        {prepare.vehicle_equipment.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />

                  <CustomAntdFormField
                    label={ <Translate textKey={"load_system"} />}
                    name={"loading_systems"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "loading_systems")}
                        open={itemVisible === "loading_systems"}
                      >
                        {prepare.loading_systems?.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />

                  <CustomAntdFormField
                    name={"vehicles_num"}
                    label={<Translate textKey={"vehicle_number"} />}
                    style={{ position: "relative", width: "100%" }}
                    children={
                      <InputNumber
                        className="inputHeight"
                        style={{ width: "100%" }}
                      />
                    }
                  />

                  <div style={{ marginTop: 0 }}>
                    <span><Translate textKey={"own_vehicles"}  /></span>
                    <Checkbox
                      checked={own_vehicles}
                      style={{ marginLeft: 20 }}
                      onChange={() => {
                        set_own_vehicles(!own_vehicles);
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col span={24} lg={12} xl={6}>
                <div className="innerFormWraper">
                  {" "}
                  <CustomAntdFormField
                    label={<Translate textKey={"cargo_type"}  />}
                    name={"goods_types"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "goods_types")}
                        open={itemVisible === "goods_types"}
                      >
                        {prepare.goods_types.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />
                  <CustomAntdFormField
                    label={<Translate textKey={"cargo_shape"}  />}
                    name={"goods_forms"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "goods_forms")}
                        open={itemVisible === "goods_forms"}
                      >
                        {prepare.goods_forms?.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />
                  <CustomAntdFormField
                    label={<Translate textKey={"transportation_type"} />}
                    name={"transport_types"}
                    style={{ position: "relative" }}
                    children={
                      <Select
                        mode={"multiple"}
                        {...selectOptions(set_itemVisible, "transport_types")}
                        open={itemVisible === "transport_types"}
                      >
                        {prepare.transport_types?.map((x) => (
                          <Option key={x.id} value={x.id}>
                            {getTranslation(x.name, appLang)?.name}
                          </Option>
                        ))}
                      </Select>
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: device === "desktop" ? "flex-end" : "center",
              }}
            >
              <div
                style={{
                  float: device === "desktop" && "right",
                  display: "flex",
                  flexDirection: device === "mobile" ? "column-reverse" : "row",
                  alignItems: "center",
                  justifyContent: device === "desktop" ? "flex-end" : "center",
                  width: device === "mobile" && "calc(100% - 48px)",
                }}
              >
                <Button
                  block={device === "mobile"}
                  type="dashed"
                  style={{
                    color: "#909090",
                    height: 46,
                    marginBottom: 22,
                    marginRight: device === "desktop" && 20,
                  }}
                  onClick={close}
                >
                  <Translate textKey={"quit"} />
                </Button>
                <Form.Item>
                  <Button
                    block={device === "mobile"}
                    type="primary"
                    style={{
                      float: "right",
                      marginRight: device === "desktop" && 24,
                      height: 46,
                    }}
                    htmlType="submit"
                  >
                <Translate textKey={"save_butt"} />
                  </Button>
                </Form.Item>
              </div>
            </Row>
          </Form>
        </Spin>
      </div>
    </>
  );
};
// rules={[{ required: true, message: validationmessage }]}

const mapStateToProps = (state) => ({
  company: state.User.user.data.account.company,
  currentUser: state.User.user.data.account,
  prepare: state.User.prepare.data,
  user: state.User.user.data,
  globalPrepare: state.User.prepare,
  appLang: state.User.appLang
});

export default connect(mapStateToProps, null)(UpdateCompanyForm);
