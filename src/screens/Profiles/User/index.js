import React, { useEffect, useState } from "react";
import useDevice from "../../../helpers/useDevice";
import Compressor from "compressorjs";

// UI
import styles from "./profile.module.css";
import {
  Row,
  Col,
  Image,
  Space,
  Modal,
  message,
  Button,
  Upload,
  Spin,
  List,
  notification,
} from "antd";
import Collapse from "../../../components/Collapse";
import User from "../../../components/Cards/UserWithActions";
import Loader from "../../../components/Loaders/Page";

import Form from "./components/UserForm";

// Icons
import IconButton from "../../../components/Buttons/Icon";
import Edit from "../../../assets/icons/edit.png";
import AddUser from "../../../assets/icons/green_user.png";
import AddDocument from "../../../assets/icons/services_active.png";

import AddUserForm from "./components/UserForm/AddUserForm";
import { connect, useDispatch, useSelector } from "react-redux";
import UpdateCompanyForm from "./components/UserForm/UpdateCompanyForm";
import axios from "axios";
import { getApiEndpoint, getFilesRoute } from "../../../axios/endpoints";
import { GET_USER_SUCCESS } from "../../../redux/modules/User/actions";
import { compressImage, getTranslation, iOS } from "../../../helpers/functions";
import { COMPANY_STATUSES } from "../../../helpers/consts";
import AddDocuments from "./components/UserForm/AddDocuments";
import { MinusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import CompanyInformations from "../../../components/CompanyInformations";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import { unstable_batchedUpdates } from "react-dom";
import CustomDrawer from "../../../components/CustomDrawer";
import Translate from "../../../Translate";

function Profile({ company, currentUser, user, getUser, appLang }) {
  // Variables
  const [formVisible, setFormVisible] = useState("");
  const device = useDevice();
  const dispatch = useDispatch();
  const history = useHistory();

  const [addUserVisible, set_addUserVisible] = useState("");
  const [updateCompanyVisible, set_updateCompanyVisible] = useState("");

  const [backgroundImageUpdate, set_backgroundImageUpdate] = useState(null);
  const [backImageLoading, set_backImageLoading] = useState(false);

  const [addDocumentVisible, set_addDocumentVisible] = useState("");
  const [notify, setNotify] = useState(null);

  const [loading, set_loading] = useState("");

  useEffect(() => {
    if (company.status !== COMPANY_STATUSES.ACTIVE.value) {
      if (!notify) {
        setNotify(openNotification());
      }
    } else {
      setNotify(null);
    }
    return () => setNotify(null);
  }, [company]);

  // Methods

  function onRemove(id) {
    message.info("On Remove");
  }

  function handleOk() {
    setFormVisible(false);
  }

  function handleCancel() {
    setFormVisible(false);
  }

  function handleCancelAddUser() {
    set_addUserVisible(false);
  }

  const openNotification = () => {
    notification.info({
      message: `Obavijest`,
      description:
        "Čeka se potvrda kompanije od strane našeg tima, molimo za strpljenje :)",
      placement: "topRight",
      duration: false,
      maxCount: 1,
      key: "CONFIRM_WAITING",
    });
  };

  if (getUser.status === "loading") {
    return <Loader />;
  }

  const desktopName = device === "desktop" && (
    <div className={styles.companyName}>
      <div className={styles.companyNameRow}>
        <h1 style={{ minWidth: 150 }} className={styles.profileName}>
          {company?.name}
        </h1>
        <div onClick={() => handleOnClick(set_updateCompanyVisible)}>
          <IconButton icon={Edit} size="medium" />
        </div>
      </div>
      <h5 className={styles.oibNumber}><Translate textKey={"vat_number"} />: {company?.OIB}</h5>
      <h5 className={styles.year}><Translate textKey={"founded"} />: {company.year}</h5>
    </div>
  );

  const mobileName = device === "mobile" && (
    <div className={styles.mobileName}>
      <div className={styles.aboutInformations}>
        <h1 className={styles.profileName}>{company.name}</h1>
        <h5 className={styles.oibNumber}><Translate textKey={"vat_number"} />: {company.OIB}</h5>
        <h5 className={styles.year}><Translate textKey={"founded"} />: {company.year}</h5>
      </div>
      <div>
        <div
          onClick={() => set_updateCompanyVisible(true)}
          style={{ marginRight: 14 }}
        >
          <IconButton icon={Edit} size="medium" />
        </div>
      </div>
    </div>
  );

  // drawer back buttobn

  function historyListener(event) {
    unstable_batchedUpdates(() => {
      set_addDocumentVisible(false);
      set_addUserVisible(false);
      setFormVisible(false);
      set_updateCompanyVisible(false);
    }, []);
  }

  useEffect(() => {
    window.addEventListener("popstate", historyListener, false);

    return () => {
      window.removeEventListener("popstate", null, false);
    };
  }, []);

  function handleOnClick(callback) {
    history.push("#drawer");
    callback(true);
  }

  // drawer back buttobn

  return (
    <div className="profile">
      {company.status === COMPANY_STATUSES.ACTIVE.value && notify}
      <Row className={styles.mainRow} gutter={[0, 24]}>
        {/* Image and tabs */}
        <Row gutter={device === "mobile" ? [0] : [24]}>
          {/* Image */}
          <Col xs={24} xl={24}>
            <div className={styles.imageWrapper}>
              <Spin spinning={backImageLoading}>
                <Image
                  src={
                    backgroundImageUpdate
                      ? backgroundImageUpdate.thumbUrl
                      : `${getFilesRoute() + company.avatar}`
                  }
                  className={styles.profileImage}
                  width="100%"
                  alt="Default profile"
                />
              </Spin>
              {desktopName}
              {/* Edit image */}
              <div className={styles.editImage}>
                {backgroundImageUpdate ? (
                  <div>
                    <Button
                      onClick={async () => {
                        set_backImageLoading(true);
                        const token = await localStorage.getItem("token");

                        const formData = new FormData();
                        const image = await compressImage(
                          backgroundImageUpdate.file
                        );



                        formData.append("files", image);

                        axios
                          .post(
                            `${getApiEndpoint()}transport/company_avatar/`,
                            formData,
                            {
                              timeout: 6 * 1000,
                              headers: {
                                "content-type":
                                  "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
                                Authorization: "Token " + token,
                              },
                            }
                          )
                          .then((res) => {
                            // update redux
                            const data = { ...user };
                            const _company = { ...user.account.company };
                            _company.avatar = res.data.avatar;
                            data.account.company = _company;
                            dispatch({ type: GET_USER_SUCCESS, data });
                            set_backImageLoading(false);
                            set_backgroundImageUpdate(null);
                          })
                          .catch((err) => {
                            set_backImageLoading(false);

                            console.log(err);
                            message.error(
                              <Translate textKey={"fetch_data_error"} />,
                              6
                            );
                          });
                      }}
                    >
                     <Translate textKey={"save_butt"} />
                    </Button>{" "}
                    <Button onClick={() => set_backgroundImageUpdate(null)}>
                      Otkaži
                    </Button>{" "}
                  </div>
                ) : (
                  <Upload
                    beforeUpload={(file, files) => {
                      if (files.length > 0) {
                        const aaa = URL.createObjectURL(files[0]);
                        set_backgroundImageUpdate({
                          file: files[0],
                          thumbUrl: aaa,
                        });
                      }
                    }}
                    showUploadList={false}
                  >
                    {" "}
                    <IconButton icon={Edit} size="medium" />
                  </Upload>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {mobileName}

        <Row gutter={device === "desktop" && [24, 24]}>
          {/* Skladište */}
          <Col xs={24} lg={12} xl={8} xxl={6} style={{ paddingRight: 0 }}>
            <Collapse header={<Translate textKey={"services"}  />}>
              <Row>
                <Col span={12}>
                  {Information(appLang, 
                    company.services.own_vehicles ?<Translate textKey={"yes_flag"} /> : <Translate textKey={"no_flag"} />,
                    <Translate textKey={"own_vehicles"}  />
                  )}
                  {Information(appLang, 
                    company.services.vehicle_types,
                    <Translate textKey={"vehicle_type"} />,
                    true,
                    true
                  )}
                  {Information(appLang, company.services.vehicles_num, <Translate textKey={"vehicle_number"} />)}
                  {Information(appLang, 
                    company.services.vehicle_upgrades,
                    <Translate textKey={"vehicle_upgrades"} />,
                    true,
                    true
                  )}
                  {Information(appLang, 
                    company.services.vehicle_equipment,
                    <Translate textKey={"vehicle_equipment"} />,
                    true,
                    true
                  )}
                  {Information(appLang, 
                    company.services.loading_systems,
                    <Translate textKey={"load_system"} />,
                    true,
                    true
                  )}
                </Col>
                <Col span={12}>
                  {Information(appLang, 
                    company.services.goods_forms,
                    <Translate textKey={"cargo_shape"}  />,
                    true,
                    true
                  )}
                  {Information(appLang, 
                    company.services.goods_types,
                    <Translate textKey={"cargo_type"}  />,
                    true,
                    true
                  )}
                  {Information(appLang, 
                    company.services.transport_types,
                    <Translate textKey={"transportation_type"}  />,
                    true,
                    true
                  )}
                  {Information(appLang, 
                    company.cover_countries,
                    <Translate textKey={"presence"}  />,
                    true,
                    true
                  )}
                </Col>
              </Row>
            </Collapse>
          </Col>

          <Col xs={24} lg={12} xl={8} xxl={6}>
            <Collapse header={<Translate textKey={"basic_info"} />}>
              <CompanyInformations company={company} />
            </Collapse>
          </Col>

          <Col xs={24} lg={12} xl={8} xxl={6}>
            <Collapse header={<Translate textKey={"contact_people"} />}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {company.status === COMPANY_STATUSES.ACTIVE.value && (
                  <div style={{ position: "relative" }}>
                    <Button
                      type="dashed"
                      block
                      style={{
                        height: "76px",
                        color: "#909090",
                        padding: "14px 0",
                        marginBottom: 10,
                      }}
                      onClick={() => {
                        handleOnClick(set_addUserVisible);
                      }}
                    >
                      <img
                        src={AddUser}
                        style={{ height: 18, width: 18, marginBottom: 4 }}
                      />
                      <div><Translate textKey={"add_user_butt"}  /></div>
                    </Button>
                  </div>
                )}
                {company.contact_accounts.map((x, i) => (
                  <User
                    key={i}
                    currentUser={currentUser}
                    user={x}
                    onEdit={() => handleOnClick(setFormVisible)}
                    onRemove={onRemove}
                    collapsed
                  />
                ))}
              </Space>
            </Collapse>
          </Col>
          <Col xs={24} lg={12} xl={8} xxl={6}>
            <Collapse header={<Translate textKey={"documents"} />}>
              {company.id === currentUser.company.id && (
                <Button
                  type="dashed"
                  block
                  style={{
                    height: "76px",
                    color: "#909090",
                    padding: "14px 0",
                    marginBottom: 10,
                  }}
                  onClick={() => handleOnClick(set_addDocumentVisible)}
                >
                  <img
                    src={AddDocument}
                    style={{ height: 18, width: 18, marginBottom: 4 }}
                  />
                  <div><Translate textKey={"upload_doc_butt"}  /></div>
                </Button>
              )}{" "}
              <List
                dataSource={company.company_documents || []}
                renderItem={(item) => (
                  <List.Item
                    extra={
                      <Button
                        shape="circle"
                        loading={loading === item.id}
                        onClick={async () => {
                          set_loading(item.id);
                          const token = localStorage.getItem("token");
                          axios
                            .post(
                              `${getApiEndpoint()}transport/companies/${
                                currentUser.company.id
                              }/documents/${item.id}/remove/`,
                              null,
                              {
                                headers: { Authorization: "Token " + token },
                              }
                            )
                            .then((res) => {
                              set_loading("");
                              dispatch({
                                type: GET_USER_SUCCESS,
                                data: {
                                  ...user,
                                  account: {
                                    ...user.account,
                                    company: {
                                      ...user.account.company,
                                      company_documents:
                                        res.data.company_documents,
                                    },
                                  },
                                },
                              });
                            })
                            .catch((err) => {
                              set_loading("");
                              message.error(
                                "Dogodila se greška kod brisanja...",
                                3
                              );
                            });
                        }}
                        icon={
                          <MinusOutlined
                            style={{
                              fontSize: 12,
                              transform: "translateY(-1px)",
                              opacity: 0.65,
                            }}
                          />
                        }
                      />
                    }
                  >
                    <List.Item.Meta
                      description={
                        <a
                          target="_blank"
                          href={`${getFilesRoute()}${item.path}`}
                        >
                          {item.title || "IDI"}
                        </a>
                      }
                    />
                  </List.Item>
                )}
              />
            </Collapse>
          </Col>
        </Row>
      </Row>
      <Modal
        closable={false}
        footer={false}
        destroyOnClose={true}
        visible={addDocumentVisible}
        onCancel={() => {
          set_addDocumentVisible(false);
          history.goBack();
        }}
      >
        <AddDocuments
          close={() => {
            set_addDocumentVisible(false);
            history.goBack();
          }}
        />
      </Modal>
      {device === "desktop" ? (
        <Modal
          closable={false}
          footer={false}
          destroyOnClose={true}
          // width="400px"
          visible={addUserVisible}
          onCancel={() => {
            set_addUserVisible(false);
            history.goBack();
          }}
        >
          <AddUserForm
            close={() => {
              set_addUserVisible(false);
              history.goBack();
            }}
          />
        </Modal>
      ) : (
        <CustomDrawer
          onClose={() => {
            handleCancelAddUser();
          }}
          visible={addUserVisible}
        >
          <AddUserForm
            drawer
            close={() => {
              set_addUserVisible(false);
            }}
          />
        </CustomDrawer>
      )}
      <CustomDrawer
        visible={updateCompanyVisible}
        onClose={() => {
          set_updateCompanyVisible(false);
        }}
      >
        <UpdateCompanyForm
          visible={updateCompanyVisible}
          close={() => {
            set_updateCompanyVisible(false);
          }}
        />
      </CustomDrawer>

      <Modal
        closable={false}
        footer={false}
        // width="400px"
        visible={formVisible}
        onOk={handleOk}
        destroyOnClose={true}
        onCancel={handleCancel}
      >
        <Form
          close={() => {
            setFormVisible(false);
            history.goBack();
          }}
        />
      </Modal>
      {device === "desktop" ? (
        <Modal
          closable={false}
          footer={false}
          // width="400px"
          visible={formVisible}
          onOk={handleOk}
          destroyOnClose={true}
          onCancel={handleCancel}
        >
          <Form
            close={() => {
              setFormVisible(false);
              history.goBack();
            }}
          />
        </Modal>
      ) : (
        <CustomDrawer onClose={handleCancel} visible={formVisible}>
          <Form
            close={() => {
              setFormVisible(false);
            }}
          />
        </CustomDrawer>
      )}

      <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  company: state.User.user.data.account.company,
  currentUser: state.User.user.data.account,
  getUser: state.User.getUser,
  user: state.User.user.data,
  appLang: state.User.appLang
});

export default connect(mapStateToProps, null)(Profile);

const Information = (appLang, value = "", label = "", wrap = false, popover) => (
  <div
    className={styles.information}
    style={{ width: wrap ? "100%" : "max-content" }}
  >
    {popover && value ? (
      <div>
        <p className={styles.label}>{label || "-"}</p>
        <div style={{ display: "block" }}>
          {value == ""
            ? "-"
            : value.map((x) => (
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                >
                  {getTranslation(x.name, appLang)?.name}
                </div>
              ))}
        </div>
      </div>
    ) : (
      <>
        <p className={styles.label}>{label || "-"}</p>

        <p className={styles.value}> {value || "-"}</p>
      </>
    )}
  </div>
);
