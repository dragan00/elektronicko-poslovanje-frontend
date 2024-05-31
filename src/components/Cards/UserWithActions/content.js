import React, { useState, useMemo } from "react";
import { connect } from "react-redux";

// UI
import styles from "../card.module.css";
import { colors } from "../../../styles/colors";

// Icons
import editUser from "../../../assets/icons/edit_user.png";
import deleteUser from "../../../assets/icons/delete_user.png";
import changePassword from "../../../assets/icons/change_password.png";
import { Modal, Form, Input, Button, message, Space, Image } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { getApiEndpoint, getFilesRoute } from "../../../axios/endpoints";
import CustomAntdFormField from "../../CustomAntdFormField";
import Translate from "../../../Translate";

function Content({ onEdit, onRemove, setPopoverVisible, currentUser }) {
  const [form] = Form.useForm();

  const user = useSelector((state) => state.User.user.data);
  const [loading, set_loading] = useState(false);

  const [updatePasswordVisible, set_updatePasswordVisible] = useState(false);
  // Methods
  function handleMenuClick(type, event) {
    event.stopPropagation();
    setPopoverVisible(false);
    if (type === "edit") {
      onEdit();
    } else if (type === "delete") {
      onRemove();
    } else if (type === "change_password") {
      set_updatePasswordVisible(true);
    }
  }

  const onFinish = async (values) => {
    set_loading(true);
    const token = await localStorage.getItem("token");

    axios
      .put(
        `${getApiEndpoint()}accounts/change_password/${user.account.id}/`,
        {
          old_password: values.oldPassword,
          new_password: values.password,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then((res) => {
        // update redux
        set_updatePasswordVisible(false);
        set_loading(false);
      })
      .catch((err) => {
        message.error("Dogodila se greška prilikom spremanja na server", 3);
        set_loading(false);
      });
  };

  const cardIcon = useMemo(() => {
    // Getting initials
    let initials = currentUser?.name
      .split(" ")
      .map((name) => name[0])
      .join("");

    return (
      <div
        className={styles.userIcon}
        style={{ backgroundColor: colors.purple }}
      >
        {currentUser.avatar ? (
          <Image src={`${getFilesRoute() + currentUser.avatar}`} />
        ) : (
          <h1 className={styles.initials} style={{ color: colors.lightPurple }}>
            {initials}
          </h1>
        )}
      </div>
    );
  }, [currentUser]);

  return (
    <div onClick={(event) => event.stopPropagation()} id={styles.uwac}>
      <div className={styles.menu}>
        {/* Edit user */}
        <div
          className={styles.menuItem}
          onClick={(event) => handleMenuClick("edit", event)}
        >
          <img src={editUser} alt="Edit user" className={styles.menuItemIcon} />
          <p className={styles.menuItemText}><Translate textKey={"user_edit"} /></p>
        </div>

        {/* Delete user */}
        {/* <div
          className={styles.menuItem}
          onClick={(event) => handleMenuClick("delete", event)}
        >
          <img
            src={deleteUser}
            alt="Delete user"
            className={styles.menuItemIcon}
          />
          <p className={styles.menuItemText}><Translate textKey={"user_delete"}  /></p>
        </div> */}

        {/* Change password */}
        <div
          className={styles.menuItem}
          onClick={(event) => handleMenuClick("change_password", event)}
        >
          <img src={changePassword} className={styles.menuItemIcon} />
          <p className={styles.menuItemText}><Translate textKey={"change_pass"}  /></p>
        </div>
      </div>
      <Modal
        visible={updatePasswordVisible}
        onCancel={() => set_updatePasswordVisible(false)}
        footer={null}
        closable={false}
        className={styles.changePassword}
      >
        <div className={styles.header}>
          <p className={styles.formAction}>Promjena lozinke</p>
          <div className={styles.user}>
            {cardIcon}
            <p className={styles.userName}>{currentUser.name}</p>
          </div>
        </div>
        <Space size="large" direction="vertical" style={{ width: "100%" }}>
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item>
              <CustomAntdFormField
                name="oldPassword"
                label="Trenutna lozinka"
                rules={[
                  {
                    required: true,
                    message: <Translate  textKey={"compulsory_field"} />,
                  },
                ]}
                aditionalInputProps={{ hasFeedback: true }}
                children={<Input.Password className="inputHeight" />}
              />

              <CustomAntdFormField
                name="password"
                label="Nova lozinka"
                rules={[
                  {
                    required: true,
                    message: <Translate textKey={"compulsory_field"} />,
                  },
                ]}
                aditionalInputProps={{ hasFeedback: true }}
                children={<Input.Password className="inputHeight" />}
              />

              <CustomAntdFormField
                name="confirm"
                label="Potvrdi lozinku"
                aditionalInputProps={{
                  dependencies: ["password"],
                  hasFeedback: true,
                }}
                children={<Input.Password className="inputHeight" />}
                rules={[
                  {
                    required: true,
                    message: "Potvrdi svoju lozinku",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(<Translate textKey={"pass_no_match"}  />)
                      );
                    },
                  }),
                ]}
              />
            </Form.Item>
            <Form.Item>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button
                  block
                  type="link"
                  style={{ color: "#909090", height: 46 }}
                  onClick={() => set_updatePasswordVisible(false)}
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
                  <Translate textKey={"edit"}  />
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.User.user.data.account,
});

export default connect(mapStateToProps, null)(Content);
