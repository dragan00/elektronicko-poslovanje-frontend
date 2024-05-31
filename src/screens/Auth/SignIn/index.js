import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// Redux
import { connect, useDispatch, useSelector } from "react-redux";
import { LOGIN, PREPARE } from "../../../redux/modules/User/actions";

// UI
import styles from "../auth.module.css";
import { Space, Divider, message, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

// Components
import Button from "../../../components/Buttons/Basic";
import BasicInput from "../../../components/Inputs/Basic";
import Card from "../../../components/Cards/WithAction";

// Icons
import login from "../../../assets/icons/login.png";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import { iOS } from "../../../helpers/functions";
import LogoIcon from "../../../assets/icons/logo_white_filled.png";
import Translate from "../../../Translate";

const { Item } = Form;

// Constants
const validateMessages = {
  required: <Translate textKey={"compulsory_field"} />,
  types: {
    email: <Translate textKey={"invalid_mail"}  />,
  },
};

function SingIn({ user, prepare, firebaseToken }) {
  // Variables
  let history = useHistory();
  let dispatch = useDispatch();
  const [form] = Form.useForm();
  const [lastMail, setLastMail] = useState(
    localStorage.getItem("lastEmail") || ""
  );

  async function onFinish() {
    // Save last E-mail address
    await localStorage.setItem("lastEmail", form.getFieldValue("email"));

    dispatch({
      type: LOGIN,
      data: { ...form.getFieldsValue(), fcm_token: firebaseToken },
      successCallback: (msg) => {
        if (msg) {
          message.warning(msg);
          return;
        }
        if (prepare.status === "error") {
          // u slucaju da je pripare prazan a prijava se izvrsi ponovo ce pozvati prepare
          dispatch({
            type: PREPARE,
            successCallback: () => {
              history.replace("/");
            },
          });
        } else {
          history.replace("/");
        }
      },
      errorCallback: () => message.error(<Translate textKey={"on_click_error"} />),
    });
  }

  function handleNavigate() {
    history.push("/signup");
  }

  return (
    <div id={styles.signIn} className="signIn">
      <div className={styles.baseStyle}>
        <Space align="center" direction="vertical" size="large">
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={LogoIcon} className={styles.logo} />
            <h1 style={{ textAlign: "center" }}><Translate textKey={"sign_in"}  /></h1>
          </div>

          {/* E-mail adresa */}
          <Form
            style={{ width: "100%" }}
            form={form}
            layout="vertical"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
              email: lastMail, // Get last email from local storage
              password: "",
            }}
          >
            <Item
              style={{ position: "relative" }}
              label={<Translate textKey={"mail"} />}
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input
                autoCapitalize="off"
                style={{ height: 39 }}
              />
            </Item>

            {/* Lozinka */}
            <Item
              style={{ position: "relative" }}
              label={<Translate textKey={"pass"} />}
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="Lozinka" />
            </Item>

            {/* Button */}
            <div className="divider" />
            <Button
              // onClick={onFinish}
              htmlType="submit"
              icon={login}
              loading={user.status == "loading"}
              text={<Translate textKey={"sign_in_butt"} />}
            />
          </Form>

          {/* Go to sign up */}
          <Divider className={styles.Divider} plain>
            <Translate textKey={"no_account"} />
          </Divider>
          <Card
            text="Napravite"
            subtext="račun"
            color="blue"
            onClick={handleNavigate}
            icon={UserOutlined}
          />
        </Space>
      </div>
      <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.User.user,
    prepare: state.User.prepare,
  };
};

export default connect(mapStateToProps, null)(SingIn);
