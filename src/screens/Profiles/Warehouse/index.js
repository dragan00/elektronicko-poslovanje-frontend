import React, { useEffect, useRef, useState } from "react";
import useDevice from "../../../helpers/useDevice";

// UI
import { Button, Carousel, Col, Image, Modal, Row, Space, message } from "antd";
import User from "../../../components/Cards/User";
import Collapse from "../../../components/Collapse";
import Loader from "../../../components/Loaders/Page";
import styles from "./warehouse.module.css";

// Icons
import moment from "moment";
import { connect, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Default from "../../../assets/icons/default_image.png";
import { COMPANY_STATUSES, PHONE_NUM_TYPE } from "../../../helpers/consts";
import { ONE_STOCK, ONE_STOCK_SUCCESS } from "../../../redux/modules/Transport/actions";
import UpdateForm from "../../Add/components/Warehouses/components/Form";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { getApiEndpoint, getFilesRoute } from "../../../axios/endpoints";
import AddImage from "./components/AddImage";

import useWebSocket from "react-use-websocket";
import NOT_FOUND_IMG from "../../../assets/images/notFound.png";
import CompanyInformations from "../../../components/CompanyInformations";
import CustomDrawer from "../../../components/CustomDrawer";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import { iOS } from "../../../helpers/functions";
import { colors } from "../../../styles/colors";
import Translate from "../../../Translate";

function Profile({ oneStock, currentUser }) {
  // Refs
  const carouselRef = useRef(null);

  // Variables
  const device = useDevice();
  const [deleteLoading, set_deleteLoading] = useState(false);
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [updateFormVisible, set_updateFormVisible] = useState(false);
  const [addImagesVisible, set_addImagesVisible] = useState(false);
  const [imageSliderVisible, set_imageSliderVisible] = useState(false);
  const [removeImageLoading, set_removeImageLoading] = useState(false);

  useEffect(() => {
    if (currentUser.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.replace("/profile/about/");
    } else {
      dispatch({
        type: ONE_STOCK,
        id: params.id,
        errorCallback: () => {
          message.error(<Translate textKey={"fetch_data_error"} />, 6);
        },
      });
    }
  }, []);

  const socketInfo = useWebSocket(process.env.REACT_APP_WS_URL, {
    onOpen: () => console.log("DEV-LOG opened"),
    onMessage: (event) => {
      let data = JSON.parse(event.data);
      console.log("DEV-LOG ~ LoadingSpace ~ data:", data);
      if (data.type === "details" && data.part_of_app === "stock") {
        dispatch({
          type: ONE_STOCK,
          id: params.id,
          errorCallback: () => {
            message.error(<Translate textKey={"fetch_data_error"} />, 6);
          },
        });
      }
    },
    shouldReconnect: (closeEvent) => true,
  });

  const removeWarhouse = async () => {
    set_deleteLoading(true);
    const token = await localStorage.getItem("token");

    axios
      .post(`${getApiEndpoint()}transport/stock/${params.id}/close/`, null, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        set_deleteLoading(false);
        history.replace("/routes/warehouses");
      })
      .catch((err) => {
        set_deleteLoading(false);
        console.log(err);
        message.error("Dogodila se greška...", 3);
      });
  };

  const removeImage = async (id) => {
    set_removeImageLoading(id);
    const token = await localStorage.getItem("token");
    axios
      .post(`${getApiEndpoint()}transport/stock/${oneStock.data.id}/images/${id}/remove/`, null, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        const data = { ...oneStock.data, images: res.data.images };
        dispatch({ type: ONE_STOCK_SUCCESS, data });
        set_removeImageLoading(false);
        // update redux
      })
      .catch((err) => {
        set_removeImageLoading(false);
        console.log(err);
        message.error("Dogodila se greška kod brisanja slike...");
      });
  };

  // Loading
  if (oneStock.status === "loading") {
    return <Loader />;
  }

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const fax_numbers =
    oneStock.data.company.numbers?.filter((x) => x.type === PHONE_NUM_TYPE.FAX).map((x) => x.number) || [];
  const tel_numbers =
    oneStock.data.company.numbers?.filter((x) => x.type === PHONE_NUM_TYPE.TEL).map((x) => x.number) || [];

  const emails = oneStock.data.company.emails?.filter((x) => x.type === PHONE_NUM_TYPE.TEL).map((x) => x.number) || [];

  return (
    <div className="profile">
      <Row gutter={[0, 24]} className={styles.mainRow}>
        {/* Image and tabs */}
        <Row gutter={device === "mobile" ? [0] : [24]}>
          <Col xs={24} xl={24}>
            <div className={styles.imageWrapper}>
              {oneStock.data.images && oneStock.data.images.length ? (
                <>
                  <Carousel
                    className={"image_slider"}
                    autoplay={false}
                    dots={"fefefee"}
                    style={{ maxHeight: 360 }}
                    ref={carouselRef}
                  >
                    {oneStock.data.images && oneStock.data.images.length
                      ? oneStock.data.images.map((x) => (
                          <div style={{ maxHeight: 360 }}>
                            <Button
                              loading={removeImageLoading === 2}
                              size="large"
                              shape="circle"
                              style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                zIndex: 12,
                                backgroundColor: "rgba(0,0,0,.35)",
                                border: "none",
                              }}
                              icon={<DeleteOutlined style={{ color: "#fff" }} />}
                              onClick={() => removeImage(x.id)}
                            />
                            <Image
                              width={"100%"}
                              height={480}
                              fallback={NOT_FOUND_IMG}
                              src={`${getFilesRoute()}${x.path}`}
                            />{" "}
                          </div>
                        ))
                      : null}
                  </Carousel>

                  {/* Arrows */}
                  {oneStock.data.images && oneStock.data.images.length ? (
                    <>
                      <Button
                        size="large"
                        shape="circle"
                        style={{
                          position: "absolute",
                          bottom: "calc(50% - 20px)",
                          right: 10,
                          zIndex: 12,
                          backgroundColor: "rgba(0,0,0,.35)",
                          border: "none",
                        }}
                        icon={<ArrowRightOutlined style={{ color: colors.white }} />}
                        onClick={() => carouselRef.current.next()}
                      />

                      <Button
                        size="large"
                        shape="circle"
                        style={{
                          position: "absolute",
                          bottom: "calc(50% - 20px)",
                          left: 10,
                          zIndex: 12,
                          backgroundColor: "rgba(0,0,0,.35)",
                          border: "none",
                        }}
                        icon={<ArrowLeftOutlined style={{ color: colors.white }} />}
                        onClick={() => carouselRef.current.prev()}
                      />
                    </>
                  ) : null}
                </>
              ) : (
                <Image className={styles.profileImage} width="100%" src={Default} />
              )}

              {/* Add image */}
              {currentUser.company.id === oneStock.data.company.id && (
                <div className={styles.buttonContainer}>
                  <Button
                    size="large"
                    shape="circle"
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      zIndex: 12,
                      backgroundColor: "rgba(0,0,0,.35)",
                      border: "none",
                    }}
                    icon={<FileAddOutlined style={{ color: colors.green }} />}
                    onClick={() => {
                      set_addImagesVisible(true);
                    }}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Skladište */}
          <Col xs={24} lg={12} xl={8}>
            <Collapse header={<Translate textKey={"warehouse"} />}>
              <Row>
                <Col span={12}>{Information(oneStock.data.country?.name, <Translate textKey={"country"} />)}</Col>
                <Col span={12}> {Information(oneStock.data.company.name, <Translate textKey={"company_name"} />)}</Col>
              </Row>
              <Row>
                <Col span={12}>{Information(oneStock.data.city?.name, <Translate textKey={"city"} />)}</Col>
                <Col span={12}>
                  {Information(
                    moment(oneStock.data.start_datetime).format("YYYY-MM-DD"),
                    <Translate textKey={"free_from"} />
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>{Information(oneStock.data.zip_code?.name, <Translate textKey={"post_number"} />)}</Col>

                <Col span={12}>
                  {Information(
                    oneStock.data.end_datetime ? moment(oneStock.data.end_datetime).format("YYYY-MM-DD") : "-",
                    <Translate textKey={"free_to"} />
                  )}
                </Col>
                <Col span={12}>{Information(oneStock.data.stock_types, <Translate textKey={"warehouse_name"} />)}</Col>

                <Col span={12}>
                  {Information(oneStock.data.stock_equipment, <Translate textKey={"warehouse_equip"} />)}
                </Col>

                <Col span={12}>
                  {Information(
                    `${oneStock.data.min_area || "- "}-${oneStock.data.max_area || " -"} ㎡`,
                    <Translate textKey={"surface"} />
                  )}
                </Col>

                <Col span={12}>
                  {/* <div className={styles.information} style={{ marginBottom: 16 }}>
                    <p className={styles.label}>Fotografije</p>
                    <div style={{ marginTop: 8 }}>
                      <Button
                        size="large"
                        shape="circle"
                        style={{ marginRight: 8 }}
                        onClick={() => {
                          set_imageSliderVisible(true);
                        }}
                        icon={<PictureOutlined />}
                      />

                      {currentUser.company.id === oneStock.data.company.id && (
                        <Button
                          size="large"
                          shape="circle"
                          onClick={() => {
                            set_addImagesVisible(true);
                          }}
                          icon={<FileAddOutlined style={{ color: colors.purple }} />}
                        />
                      )}
                    </div>
                  </div> */}

                  {currentUser.company.id === oneStock.data.company.id && (
                    <Col>
                      <div className={styles.information} style={{ marginBottom: 16 }}>
                        <p className={styles.label}>
                          <Translate textKey={"warehouse"} />
                        </p>
                        <div style={{ marginTop: 8 }}>
                          <Col>
                            <Button
                              style={{
                                marginRight: 20,
                                width: device === "mobile" && "100%",
                                marginBottom: device === "mobile" && 10,
                              }}
                              type="dashed"
                              onClick={() => {
                                set_updateFormVisible(true);
                              }}
                              icon={<EditOutlined />}
                            />

                            <Button
                              style={{
                                width: device === "mobile" && "100%",
                              }}
                              type=""
                              loading={deleteLoading}
                              onClick={removeWarhouse}
                              icon={<DeleteOutlined style={{ color: colors.black }} />}
                            />
                          </Col>
                        </div>
                      </div>
                    </Col>
                  )}

                  <Modal
                    footer={null}
                    closable={false}
                    destroyOnClose={true}
                    onCancel={() => {
                      set_addImagesVisible(false);
                    }}
                    visible={addImagesVisible}
                  >
                    <AddImage close={() => set_addImagesVisible(false)} />
                  </Modal>

                  <Modal
                    wrapClassName={"imageSlider"}
                    footer={null}
                    visible={imageSliderVisible}
                    closable={false}
                    maskStyle={{ padding: 0 }}
                    onCancel={() => set_imageSliderVisible(false)}
                  >
                    {" "}
                    <Carousel className={"image_slider"} autoplay={false} dots={"fefefee"}>
                      {oneStock.data.images && oneStock.data.images.length ? (
                        oneStock.data.images.map((x) => (
                          <div>
                            {currentUser.company.id === oneStock.data.company.id && (
                              <Button
                                loading={removeImageLoading === 2}
                                shape="circle"
                                style={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  zIndex: 12,
                                  backgroundColor: "rgba(0,0,0,.35)",
                                  border: "none",
                                }}
                                icon={<DeleteOutlined style={{ color: "#fff" }} />}
                                onClick={() => removeImage(x.id)}
                              />
                            )}
                            <Image
                              width={"100%"}
                              height={480}
                              fallback={NOT_FOUND_IMG}
                              src={`${getFilesRoute()}${x.path}`}
                            />{" "}
                          </div>
                        ))
                      ) : (
                        <div style={{ minHeight: 600 }}>
                          <h3 style={{ textAlign: "center", margin: "66px" }}>Nema učitanih slika</h3>
                        </div>
                      )}
                    </Carousel>
                  </Modal>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <CustomDrawer onClose={() => set_updateFormVisible(false)} visible={updateFormVisible}>
                    {/* Rendering filters */}
                    <UpdateForm
                      close={() => set_updateFormVisible(false)}
                      update={oneStock.data}
                      visible={updateFormVisible}
                    />
                  </CustomDrawer>
                </Col>
              </Row>
            </Collapse>
          </Col>

          <Col md={24} lg={12} xl={8} style={{ width: "100%" }}>
            <Collapse header={<Translate textKey={"basic_info"} />} collapsed={device === "desktop"} specialCollapse>
              <CompanyInformations company={oneStock.data.company} />
            </Collapse>
          </Col>

          <Col md={24} lg={12} xl={8} style={{ width: "100%" }}>
            <Collapse header={<Translate textKey={"contact_person"} />}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {oneStock.data.contect_accounts.map((x) => (
                  <User user={x} collapsed />
                ))}
              </Space>
            </Collapse>
          </Col>
        </Row>
      </Row>
      <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
    </div>
  );
}

const mapStateToProps = (state) => ({
  oneStock: state.Transport.oneStock,
  currentUser: state.User.user.data.account,
});

export default connect(mapStateToProps, null)(Profile);

const Information = (value = "", label = "", wrap = true) => (
  <div className={styles.information} style={{ width: wrap ? "100%" : "max-content" }}>
    <p className={styles.label}>{label || "-"}</p>
    <p className={styles.value}> {value || "-"}</p>
  </div>
);
