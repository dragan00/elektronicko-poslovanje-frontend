import React, { useState, useMemo } from "react";

// UI
import styles from "../../profile.module.css";
import { message, Space, Form, Input, Select, Button, Image } from "antd";

// Components
import MultipleInput from "../../../../../components/Inputs/Multiple";

// Icons
import sampleAvatar from "../../../../../assets/icons/sample_avatar.png";
import { LoginOutlined, PlusOutlined } from "@ant-design/icons";
import { connect, useDispatch } from "react-redux";
import {
  GET_USER_SUCCESS,
  LOGOUT,
} from "../../../../../redux/modules/User/actions";
import axios from "axios";
import { getApiEndpoint, getFilesRoute } from "../../../../../axios/endpoints";
import { useHistory } from "react-router";
import { colors } from "../../../../../styles/colors";
import CustomAntdFormField from "../../../../../components/CustomAntdFormField";
import Translate from "../../../../../Translate";
const { Option } = Select;

function UpdateUser({
  currentUser,
  prepare,
  close,
  register,
  user,
  drawer = false,
}) {
  const [form] = Form.useForm();

  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onFinish = async (values) => {
    set_loading(true);
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        ...values,
        company: currentUser.company.id,
        account_full_name: values.name + " " + values.surname,
      })
    );

    const token = localStorage.getItem("token");

    axios
      .post(`${getApiEndpoint()}accounts/register/`, formData, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        message.success(<Translate textKey={"success"}  />, 3);


        dispatch({
          type: GET_USER_SUCCESS,
          data: {
            ...user,
            account: {
              ...user.account,
              company: {
                ...user.account.company,
                contact_accounts: res.data.data.contact_accounts,
              },
            },
          },
        });
        close();
        set_loading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          history.replace("/logout");
        }
        message.error("Dogodila se greška", 3);
        set_loading(false);
      });
  };

  return (
    <div onClick={(event) => event.stopPropagation()} className={styles.form}>
      {!drawer && (
        <div className={styles.header}>
          <p className={styles.formAction}><Translate textKey={"add_user_butt"}  /></p>
        </div>
      )}

      <Space size="large" direction="vertical" style={{ width: "100%" }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <CustomAntdFormField
            rules={[
              {
                required: true,
                message: "Ovo polje je obavezno!",
              },
            ]}
            label={<Translate textKey={"name"} />}
            name={"name"}
            children={<Input className="inputHeight" />}
          />
          <CustomAntdFormField
            rules={[
              {
                required: true,
                message: "Ovo polje je obavezno!",
              },
            ]}
            label={<Translate textKey={"surname"} />}
            name={"surname"}
            children={<Input className="inputHeight" />}
          />
          <CustomAntdFormField
            rules={[
              {
                required: true,
                message: "Ovo polje je obavezno!",
              },
              {
                type: "email",
                message: "Neispravan unos!",
              },
            ]}
            label={"Email"}
            name={"account_email"}
            children={<Input className="inputHeight" />}
          />
          <CustomAntdFormField
            name="account_phone_number"
            label={<Translate textKey={"phone_number"}/>}
            rules={[{ required: true, message: "Ovo polje je obavezno" }]}
            children={<Input className="inputHeight" type="number" style={{ width: "100%" }} />}
          />

          <CustomAntdFormField
            label={<Translate textKey={"languages"} />}
            name={"account_languages"}
            rules={[{ required: true, message: "Ovo polje je obavezno" }]}
            children={
              <Select mode={"multiple"}>
                {prepare.data.languages.map((x) => (
                  <Option value={x.id}>{x.name}</Option>
                ))}
              </Select>
            }
          />
          <Form.Item>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
                block
                type="link"
                style={{ color: "#909090", height: 46 }}
                onClick={() => close()}
              >
                <Translate textKey={"quit"} />
              </Button>
              <Button
                block
                loading={loading}
                htmlType={"submit"}
                type="primary"
                style={{ height: 46 }}
              >
             <Translate textKey={"save_butt"} />
              </Button>
            </div>
          </Form.Item>
        </Form>
        {/* TODO */}
      </Space>
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.User.user.data.account,
  prepare: state.User.prepare,
  register: state.User.register,
  user: state.User.user.data,
});

export default connect(mapStateToProps, null)(UpdateUser);
