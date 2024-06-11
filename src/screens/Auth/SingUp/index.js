import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

// Redux
// import { useDispatch } from 'react-redux'

// UI
import styles from "../auth.module.css";
import {
  Space,
  Divider,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  message,
  Upload,
} from "antd";
import { UserOutlined, MinusCircleOutlined } from "@ant-design/icons";

// Components
import Collapse from "../../../components/Collapse";
import BasicButton from "../../../components/Buttons/Basic";
import Card from "../../../components/Cards/WithAction";
import Loader from "../../../components/Loaders/Page";

// Icons
import plus from "../../../assets/icons/plus.png";
import { connect, useDispatch } from "react-redux";
import { REGISTER } from "../../../redux/modules/User/actions";
import Place from "../../Add/components/Cargo/components/Form/PlaceMemo";
import useDevice from "../../../helpers/useDevice";
import {
  getTranslation,
  iOS,
  selectOptions,
} from "../../../helpers/functions";
import {   PHONE_NUM_TYPE } from "../../../helpers/consts";
import AddDocument from "../../../assets/icons/services_active.png";
import AddEmail from "../../../assets/icons/green_mail.png";
import AddNumber from "../../../assets/icons/green_phone.png";
import { colors } from "../../../styles/colors";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import CloseElement from "../../../components/CloseElement";
import CustomAntdFormField from "../../../components/CustomAntdFormField";
import CustomInputLabel from "../../../components/Inputs/CustomInputLabel";
import LogoIcon from "../../../assets/icons/new_logo_primary.png";
import Translate from "../../../Translate";

// Constants
const validateMessages = {
  required: <Translate textKey={"compulsory_field"} />,
  types: {
    email: "Nije unešen valjan mail...",
    number: "Nije unešen broj...",
    url: "Posjetite vašu stranicu i kopirajte vaš URL radi ispravnog unosa",
  },
};

const passwordMatchError = "Lozinke se ne podudaraju";

const COL_SPANS = {
  xxl: 8,
  xl: 8,
  lg: 8,
  sm: 24,
  xs: 24,
  style: {
    padding: "12px",
  },
};

const { Item } = Form;
const { Option } = Select;

function SingIn({ register, prepare, firebaseToken, appLang }) {
  // Variables
  const history = useHistory();
  const placeRef = useRef();
  const device = useDevice();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [itemVisible, set_itemVisible] = useState("");

  // Methods

  const onFinish = async (values) => {
    let formData = new FormData();

    const data = {
      account_full_name: `${values.firstName} ${values.lastName}`,
      account_password: values.password,
      account_email: values._email,
      account_phone_number: values.userPhoneNumber,
      account_languages: values.languages,
      company: null,
      company_name: values.name,
      company_emails: values.company_emails.map((x) => x.email),
      company_country: values.country?.id,
      company_city: values.city?.id,
      company_zip_code: values.zip_code?.id,
      company_OIB: values.oib,
      company_year: values.year,
      company_web: values.website,
      company_numbers: values.phone_numbers,
      fcm_token: firebaseToken,
    };

    formData.append("data", JSON.stringify(data));

    values.documents?.fileList?.forEach(async (file) => {
      let _file = file;
      formData.append("files", _file);
    });

    dispatch({
      type: REGISTER,
      data: formData,
      successCallback: (data) => {
        if (data.message) {
          message.warning(data.message);
        } else {
          history.replace("/");
        }
      },
      errorCallback: () => {
        message.error("Dogodila se greška tokom spremanja na server", 3);
      },
    });
  };

  function handleNavigate() {
    history.push("/signin");
  }

  if (prepare.status === "loading") {
    return <Loader />;
  }

  return (
    <>
      {itemVisible && device === "mobile" ? (
        <CloseElement onClick={() => set_itemVisible("")} />
      ) : null}
      <div id={styles.signUp} className="dadada" style={{ maxWidth: "1800px" }}>
        <div className={styles.baseStyle}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={LogoIcon} className={styles.logo} />
            <h1 style={{ textAlign: "center" }}><Translate textKey={"make_account"}  /></h1>
          </div>
          <Form
            style={{ width: "100%" }}
            form={form}
            layout="vertical"
            onFinish={() => {
              const place = placeRef.current?.getData();
              if (!place.country || !place.city || !place.zip_code) {
                message.error("Država, grad, poštanski broj su obavezni...", 3);
                return;
              }

              onFinish({ ...form.getFieldsValue(), ...place });
            }}
            validateMessages={validateMessages}
            initialValues={{
              name: "",
              firstName: "",
              lastName: "",
              _email: "",
              password: "",
              confirmPassword: "",
              userPhoneNumber: "",
              country: null,
              city: null,
              zip_code: null,
              company_emails: [],
              oib: "",
              year: "",
              website: "",
              phone_numbers: [],
              fax_numbers: [],
              documents: [],
              account_languages: [],
            }}
          >
            <Row justify="space-around">
              <Col {...COL_SPANS}>
                <Collapse header={<Translate textKey={"user"} />}>
                  <CustomAntdFormField
                    label={<Translate textKey={"register_name"}  />}
                    name="firstName"
                    rules={[{ required: true }]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        placeholder=""
                      />
                    }
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"register_surname"} />}
                    name="lastName"
                    rules={[{ required: true }]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        placeholder=""
                      />
                    }
                  />

                  <CustomAntdFormField
                    label="E-mail"
                    name="_email"
                    rules={[{ required: true, type: "email" }]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        placeholder=""
                      />
                    }
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"pass"}  />}
                    name="password"
                    rules={[{ required: true }]}
                    children={
                      <Input.Password autoComplete="off" placeholder="" />
                    }
                    aditionalInputProps={{ hasFeedback: true }}
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"confirm_pass"} />}
                    name="confirmPassword"
                    aditionalInputProps={{ hasFeedback: true }}
                    children={
                      <Input.Password autoComplete="off" placeholder="" />
                    }
                    rules={[
                      {
                        required: true,
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(passwordMatchError));
                        },
                      }),
                    ]}
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"phone_number"}  />}
                    name="userPhoneNumber"
                    rules={[{ required: true }]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        type="number"
                        placeholder=""
                      />
                    }
                  />

                  <div style={{ height: 8 }} />
                  <CustomAntdFormField
                    label={<Translate textKey={"my_languages"} />}
                    name="languages"
                    rules={[
                      { required: true, message: "Ovo polje je obavezno" },
                    ]}
                    children={
                      <Select
                        className="inputHeight dropdown"
                        {...selectOptions(set_itemVisible, "languages")}
                        showSearch={false}
                        open={itemVisible === "languages"}
                        placeholder=""
                        mode={"multiple"}
                        
                      >
                        {prepare?.data?.languages?.map((item, index) => (
                          <Option key={index} value={item.id}>
                            {typeof item === "object"
                              ? Array.isArray(item.name)
                                ? getTranslation(item.name, appLang)?.name
                                : item.name
                              : item}
                          </Option>
                        ))}
                      </Select>
                    }
                  />
                </Collapse>
              </Col>

              <Col {...COL_SPANS}>
                <Collapse header={<Translate textKey={"company"} />}>
                  <CustomAntdFormField
                    label={<Translate textKey={"company_name"} />}
                    name="name"
                    rules={[
                      { required: true, message: "Ovo polje je obavezno" },
                    ]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        placeholder=""
                      />
                    }
                  />

                  {/* Adresa */}
                  {/* E-mail adresa */}
                  <Item name="place">
                    <Place
                      marginBottom={0}
                      showButtonAll={false}
                      ref={placeRef}
                    />
                  </Item>

                  {/* OIB broj */}
                  <CustomAntdFormField
                    label={<Translate textKey={"vat_number"} />}
                    name="oib"
                    rules={[{ required: true }]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        type="tel"
                        placeholder=""
                      />
                    }
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"year_founded"}  />}
                    name="year"
                    rules={[{ required: true }]}
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        type="tel"
                        placeholder=""
                      />
                    }
                  />

                  <CustomAntdFormField
                    label={<Translate textKey={"website"} />}
                    name="website"
                    children={
                      <Input
                        autoComplete="off"
                        className="inputHeight"
                        placeholder=""
                      />
                    }
                  />

                  {/* company emails */}
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <Form.List name="company_emails">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }, i) => {
                              return (
                                <div key={i} className={styles.formListWrapper}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "email"]}
                                    fieldKey={[fieldKey, "email"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Ovo polje je obavezno",
                                      },
                                    ]}
                                    initialValue={
                                      form.company_emails &&
                                      form.company_emails[key]
                                    }
                                  >
                                    <Input
                                      autoComplete="off"
                                      className="inputHeight"
                                      placeholder=""
                                    />
                                  </Form.Item>
                                  <CustomInputLabel text={i + 1 + ". email"} />

                                  <MinusCircleOutlined
                                    style={{
                                      width: 30,
                                      marginTop: -20,
                                      marginLeft: 10,
                                    }}
                                    onClick={() => remove(name)}
                                  />
                                </div>
                              );
                            }
                          )}

                          <Form.Item>
                            <Button
                              onClick={() => add()}
                              type="dashed"
                              block
                              style={{
                                height: "76px",
                                padding: "14px 0",
                                marginBottom: -24,
                                color: colors.purple,
                              }}
                            >
                              <img
                                src={AddEmail}
                                style={{
                                  height: 18,
                                  width: 18,
                                  marginBottom: 4,
                                }}
                              />
                              <div><Translate textKey={"add_mail_butt"}  /></div>
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    {/* Broj telefona */}
                    <Form.List name="phone_numbers">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }, i) => (
                              <div key={i} className={styles.formListWrapper}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "number"]}
                                  fieldKey={[fieldKey, "number"]}
                                  initialValue={
                                    form.company_numbers &&
                                    form.company_numbers[i]?.number
                                  }
                                  rules={[
                                    {
                                      required: true,
                                      message: <Translate textKey={"compulsory_field"} />,
                                    },
                                  ]}
                                >
                                  <Input
                                    autoComplete="off"
                                    id="signUpEmailInput"
                                    type={"tel"}
                                    addonAfter={
                                      <Form.Item
                                        name={[name, "type"]}
                                        fieldKey={[fieldKey, "type"]}
                                        initialValue={
                                          (form.company_numbers &&
                                            form.company_numbers[i]?.type) ||
                                          PHONE_NUM_TYPE.TEL
                                        }
                                        noStyle
                                        rules={[
                                          {
                                            required: true,
                                            message: <Translate textKey={"compulsory_field"} />,
                                          },
                                        ]}
                                      >
                                        <Select style={{ width: 80 }}>
                                          <Option value={PHONE_NUM_TYPE.TEL}>
                                            Tel
                                          </Option>
                                          <Option value={PHONE_NUM_TYPE.FAX}>
                                            Fax
                                          </Option>
                                        </Select>
                                      </Form.Item>
                                    }
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                </Form.Item>
                                <CustomInputLabel text={i + 1 + ". broj"} />

                                <MinusCircleOutlined
                                  style={{
                                    width: 30,
                                    marginTop: -20,
                                    marginLeft: 10,
                                  }}
                                  onClick={() => remove(name)}
                                />
                              </div>
                            )
                          )}
                          <Form.Item>
                            <Button
                              onClick={() => add()}
                              type="dashed"
                              block
                              style={{
                                height: "76px",
                                padding: "14px 0",
                                marginBottom: -24,
                                color: colors.purple,
                              }}
                            >
                              <img
                                src={AddNumber}
                                style={{
                                  height: 18,
                                  width: 18,
                                  marginBottom: 4,
                                }}
                              />
                              <div><Translate textKey={"add_number_butt"}  /></div>
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    {/* Dokumenti */}
                    {/* <Item name={<Translate textKey={"documents"} />}>
                      <Button
                        type="dashed"
                        block
                        style={{
                          height: "76px",
                          marginBottom: 10,
                          cursor: "default",
                        }}
                      >
                        <Upload
                          showUploadList={true}
                          multiple={true}
                          beforeUpload={(file, files) => {
                            form.setFieldsValue(files);
                            return false;
                          }}
                        >
                          <Button
                            type="link"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              height: 46,
                              padding: "0 80px",
                            }}
                          >
                            <img
                              src={AddDocument}
                              style={{ height: 18, width: 18, marginBottom: 4 }}
                            />
                            <Translate textKey={"upload_doc_butt"}  />
                          </Button>
                        </Upload>
                      </Button> 
                    </Item>*/}
                  </Space>
                </Collapse>
              </Col>
              <Col {...COL_SPANS}>
                <div style={{ marginTop: device === "desktop" && 66 }} />
                <BasicButton
                  loading={register.status === "loading"}
                  htmlType="submit"
                  icon={plus}
                  text={<Translate textKey={"make_account"}  />}
                />

                <Divider className={styles.Divider} plain>
                  <Translate textKey={"have_account"}  />
                </Divider>
                <Card
                  text={<Translate textKey={"sign_in_butt"} />}
           
                  color="blue"
                  onClick={handleNavigate}
                  icon={UserOutlined}
                  style={{ maxWidth: "100%" }}
                />
              </Col>
            </Row>
          </Form>

          {/* BasicButton */}
        </div>
        <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    register: state.User.register,
    prepare: state.User.prepare,
    appLang: state.User.appLang
  };
};

export default connect(mapStateToProps, null)(SingIn);
