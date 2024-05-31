import React, { useEffect, useState } from "react";
import useDevice from "../../../helpers/useDevice";

// UI
import styles from "./company.module.css";
import { Row, Col, Image, Space, Button, message } from "antd";
import Collapse from "../../../components/Collapse";
import User from "../../../components/Cards/User";
import Loader from "../../../components/Loaders/Page";
import MultipleInformations from "../../../components/Cards/Multiple";
import BasicCard from "../../../components/Cards/Basic";
import NotFound from "../../../components/NotFound";

// Icons
import Default from "../../../assets/icons/default_image.png";
import IconButton from "../../../components/Buttons/Icon";
import Edit from "../../../assets/icons/edit.png";
import { TiLocation } from "react-icons/ti";
import { ImPhone } from "react-icons/im";
import { FaFax } from "react-icons/fa";
import { IoMail, IoGlobeOutline } from "react-icons/io5";
import { COMPANY_STATUSES, PHONE_NUM_TYPE } from "../../../helpers/consts";
import { connect, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { COMPANY } from "../../../redux/modules/Transport/actions";
import { getTranslation, iOS } from "../../../helpers/functions";
import {  getFilesRoute } from "../../../axios/endpoints";
import { LeftCircleOutlined } from "@ant-design/icons";
import CompanyInformations from "../../../components/CompanyInformations";
import CustomVerticalDevider from "../../../components/CustomVerticalDevider";
import Translate from "../../../Translate";

function Profile({ company, currentUser }) {
  // Variables
  const device = useDevice();
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (currentUser.company?.status !== COMPANY_STATUSES.ACTIVE.value) {
      history.replace("/profile/about/");
    } else {
      dispatch({
        type: COMPANY,
        id,
        errorCallback: () => {
          message.error(<Translate textKey={"fetch_data_error"} />, 6);
        },
      });
    }
  }, []);

  // Loading
  if (company.status === "loading") {
    return <Loader />;
  }

  if (company.status === "error") {
    return <NotFound />;
    // return <h3>Nije pronašlo kompaniju</h3>;
  }

  const phone_numbers = company.data.company_numbers
    .filter((x) => x.type === PHONE_NUM_TYPE.TEL)
    .map((x) => x.number);

  const fax_numbers = company.data.company_numbers
    .filter((x) => x.type === PHONE_NUM_TYPE.FAX)
    .map((x) => x.number);

  const desktopName = device === "desktop" && (
    <div className={styles.companyName}>
      <h1 className={styles.profileName}>{company.data.name}</h1>
      <h5 className={styles.oibNumber}><Translate textKey={"vat_number"} />: {company.data.OIB}</h5>
      <h5 className={styles.year}><Translate textKey={"founded"} />: {company.data.year}</h5>
    </div>
  );

  const mobileName = device === "mobile" && (
    <div className={styles.aboutInformations}>
      <h1 className={styles.profileName}>{company.data.name}</h1>
      <h5 className={styles.oibNumber}><Translate textKey={"vat_number"} />: {company.data.OIB}</h5>
      <h5 className={styles.year}><Translate textKey={"founded"} />: {company.data.year}</h5>
    </div>
  );

  return (
    <div className="profile">
      <Row gutter={[0, 24]} className={styles.mainRow}>
        {/* Image and tabs */}
        <Row gutter={device === "mobile" ? [0] : [24]}>
          {/* Image */}
          <Col xs={24} xl={24}>
            <div className={styles.imageWrapper}>
              <Image
                src={`${getFilesRoute() + company.data.avatar}`}
                className={styles.profileImage}
                width="100%"
                alt="Default profile"
              />
              {desktopName}
            </div>
          </Col>
        </Row>

        {mobileName}

        <Row gutter={[24, 24]}>
          {/* Skladište */}
          <Col xs={24} lg={12} xl={8}>
            <Collapse
              header={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      marginRight: 21,
                      fontSize: 18,
                      color: "re#71dc9fd",
                    }}
                    onClick={() => {
                      history.push("/companies");
                    }}
                  >
                    <LeftCircleOutlined />
                  </div>
                  <div><Translate textKey={"transport_service"}  /></div>
                </div>
              }
            >
              <Row>
                <Col span={12}>
                  {Information(
                    company.data.services.own_vehicles ?<Translate textKey={"yes_flag"} /> : <Translate textKey={"no_flag"} />,
                    <Translate textKey={"own_vehicles"}  />
                  )}
                  {Information(
                    company.data.services.vehicle_types,
                    <Translate textKey={"vehicle_type"} />,
                    true,
                    true
                  )}
                  {Information(
                    company.data.services.vehicles_num,
                    <Translate textKey={"vehicle_number"} />
                  )}
                  {Information(
                    company.data.services.vehicle_upgrades,
                    <Translate textKey={"vehicle_upgrades"} />,
                    true,
                    true
                  )}
                  {Information(
                    company.data.services.vehicle_equipment,
                    <Translate textKey={"vehicle_equipment"} />,
                    true,
                    true
                  )}
                  {Information(
                    company.data.services.loading_systems,
                    <Translate textKey={"load_system"} />,
                    true,
                    true
                  )}
                </Col>
                <Col span={12}>
                  {Information(
                    company.data.services.goods_forms,
                    <Translate textKey={"cargo_shape"}  />,
                    true,
                    true
                  )}
                  {Information(
                    company.data.services.goods_types,
                    <Translate textKey={"cargo_type"}  />,
                    true,
                    true
                  )}
                  {Information(
                    company.data.services.transport_types,
                    <Translate textKey={"transportation_type"}  />,
                    true,
                    true
                  )}
                  {Information(
                    company.data.cover_countries,
                    <Translate textKey={"presence"}  />,
                    true,
                    true
                  )}
                </Col>
              </Row>
            </Collapse>
          </Col>

          <Col md={24} lg={12} xl={8} style={{ width: "100%" }}>
            <Collapse header={<Translate textKey={"basic_info"} />}>
              <CompanyInformations company={company.data} />
            </Collapse>
          </Col>

          <Col md={24} lg={12} xl={8} style={{ width: "100%" }}>
            <Collapse header={<Translate textKey={"contact_people"} />}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {company.data.contact_accounts.map((x, i) => (
                  <User key={i} user={x} collapsed />
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
  company: state.Transport.company,
  currentUser: state.User.user.data.account,
});

export default connect(mapStateToProps, null)(Profile);
const Information = (value = "", label = "", wrap = false, popover) => (
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
