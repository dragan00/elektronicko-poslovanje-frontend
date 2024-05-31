import React from "react";

import { Form, Button, Input, message } from "antd";
import { connect, useDispatch } from "react-redux";
import {
  GET_USER_SUCCESS,
  LOGIN,
  LOGOUT,
} from "../../../redux/modules/User/actions";
import { useHistory } from "react-router";
import axios from "axios";
import { getApiEndpoint } from "../../../axios/endpoints";
import Translate from "../../../Translate";

const Auth = ({ userLogin }) => {
  const [form] = Form.useForm();

  const history = useHistory();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    axios
      .post(`${getApiEndpoint()}accounts/auth/`, values)
      .then(({ data }) => {
        if (data.account.is_admin) {
          dispatch({ type: GET_USER_SUCCESS, data: data });
          localStorage.setItem("token", data.token);
          history.push("/backoff/dashboard");
        } else {
          message.error(
            "Nemate valjanu permisiju za nastaviti dalje",
            3,
            () => {
              history.replace("/logout");
            }
          );
        }
      })
      .catch((err) => {
        message.error(<Translate  textKey={"fetch_user_error"} />, 3);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: "12%",
      }}
    >
      <Form style={{ minWidth: 400 }} form={form} onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            loading={userLogin.status === "loading_backoff"}
            type="primary"
            htmlType="submit"
          >
            Prijavi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({ userLogin: state.User.user });

export default connect(mapStateToProps, null)(Auth);
