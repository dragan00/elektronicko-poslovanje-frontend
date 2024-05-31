import React, { useState, useEffect, useMemo } from "react";

// UI
import styles from "../../profile.module.css";
import { message, Space, Form, Input, Select, Button, Image } from "antd";

// Icons
import { LoginOutlined, PlusOutlined } from "@ant-design/icons";
import { connect, useDispatch } from "react-redux";
import { UPDATE_USER } from "../../../../../redux/modules/User/actions";
import { colors } from "../../../../../styles/colors";
import { getFilesRoute } from "../../../../../axios/endpoints";
import CustomAntdFormField from "../../../../../components/CustomAntdFormField";
import Translate from "../../../../../Translate";
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function UpdateUser({ currentUser, prepare, close, updateUser }) {
  const [form] = Form.useForm();

  const [file, set_file] = useState({});
  const [image, set_image] = useState({});
  const [loading, set_loading] = useState(false);
  const dispatch = useDispatch();

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Dozvoljene ekstenzije JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Slika mora biti manja od 2MB!");
    }

    set_file(file);
    return false;
  }

  const onFinish = (values) => {
    dispatch({
      type: UPDATE_USER,
      data: values,
      id: currentUser.id,
      errorCallback: () => {
        message.error("Dogodila se greška", 3);
      },
      successCallback: () => {
        message.success(<Translate textKey={"success"}  />, 3);
        close();
      },
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoginOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}><Translate textKey={"upload_butt"}  /> </div>
    </div>
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
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
    <div onClick={(event) => event.stopPropagation()} className={styles.form}>
      <div className={styles.header}>
        <p className={styles.formAction}><Translate textKey={"user_edit"}  /></p>
        <div className={styles.user}>
          {/* <img
            src={sampleAvatar}
            className={styles.userImage}
            alt="User avatar"
          /> */}
          {cardIcon}
          <p className={styles.userName}>{currentUser.name}</p>
        </div>
      </div>

      <Space size="large" direction="vertical" style={{ width: "100%" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            account_full_name: currentUser.name,
            account_phone_number: currentUser.phone_number,
            account_languages: currentUser.languages
              ? currentUser.languages.map((x) => x.id)
              : [],
          }}
        >
          <CustomAntdFormField
            rules={[
              {
                required: true,
                message: "Ovo polje je obavezno!",
              },
            ]}
            label={<Translate textKey={"name"} />}
            name={"account_full_name"}
            children={<Input className="inputHeight" />}
          />

          <CustomAntdFormField
            name="account_phone_number"
            label={<Translate textKey={"phone_number"}  />}
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
            children={<Input className="inputHeight" type="number" style={{ width: "100%" }} />}
          />

          <CustomAntdFormField
            label={<Translate textKey={"my_languages"} />}
            name={"account_languages"}
            rules={[{ required: true, message: "Ovo polje je obavezno" }]}
            children={
              <Select className="inputHeight" mode={"multiple"}>
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
                loading={updateUser.status === "loading"}
                htmlType={"submit"}
                type="primary"
                style={{ height: 46 }}
              >
           <Translate textKey={"edit"}  />
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
  updateUser: state.User.updateUser,
});

export default connect(mapStateToProps, null)(UpdateUser);
