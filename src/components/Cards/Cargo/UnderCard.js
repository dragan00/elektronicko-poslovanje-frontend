import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import styles from "../card.module.css";
import { ADD_STATUSES, CARGO_PLACE_TYPE } from "../../../helpers/consts";
import moment from "moment";
import { Link } from "react-router-dom";
import FromCardPlace from "../FormCardPlace";
import useDevice from "../../../helpers/useDevice";
import { PhoneOutlined, PhoneFilled } from "@ant-design/icons";
import { Button } from "antd";
import { colors } from "../../../styles/colors";
import UnderCardTitleBorder from "../UnderCardTitleBorder";
import Translate from "../../../Translate";

const UnderCard = ({ item, owner, scroll }) => {
  const device = useDevice();

  const loads =
    item.load_unload &&
    item.load_unload.filter((x) => x.type === CARGO_PLACE_TYPE.LOAD);

  const unloads =
    item.load_unload &&
    item.load_unload.filter((x) => x.type === CARGO_PLACE_TYPE.UNLOAD);

  useEffect(() => {
    scroll();
  }, []);

  return (
    <div>
      <motion.div
        layout
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ type: "just" }}
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "flex-start",
          transformOrigin: "top",
          borderBottom: "1px solid #ededed",
          borderLeft: "1px solid #ededed",
          borderRight: "1px solid #ededed",
        }}
      >
        <div className={"underCard"}>
          {device === "mobile" &&
            (item.status !== ADD_STATUSES.CLOSED || owner) && (
              <div
                style={{
                  padding: "4px 12px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Button
                  block={device === "mobile"}
                  type="link"
                  icon={
                    <PhoneFilled
                      style={{ color: colors.purple, marginRight: 8 }}
                    />
                  }
                >
                  <a
                    style={{ opacity: 0.65 }}
                    href={`tel:${
                      item.contact_accounts[0]?.phone_number || "-"
                    }`}
                  >
                    Poziv
                  </a>
                </Button>

                
                {(item.status !== ADD_STATUSES.CLOSED || owner)  &&
                 <Button block={device === "mobile"} type="primary">
                  <Link
                    style={{ float: device === "desktop" && "right" }}
                    to={`/cargo/${item.id}`}
                  >
                    <Translate textKey={"details"} />
                  </Link>
                </Button>}
                
              </div>
            )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
            className={styles.underCard}
          >
            {loads.map((x, i) => (
              <div
                key={i}
                style={{
                  border: "0 solid black",
                  borderRadius: "3px",
                  margin: 6,
                  padding: 3,
                }}
                className={styles.information}
              >
                <p
                  className={styles.label}
                >
                  <UnderCardTitleBorder title={<><Translate textKey="departure" /> <span>{" "}</span><span>{(i + 1)}</span></> } />
                </p>
                <FromCardPlace
                  hideDeleteButton={true}
                  item={{
                    ...x,
                    start_datetime: x.start_datetime
                      ? moment(x.start_datetime)
                      : null,
                    end_datetime: x.end_datetime
                      ? moment(x.end_datetime)
                      : null,
                  }}
                  dateKeyStart={"start_datetime"}
                  dateKeyEnd={"end_datetime"}
                />
              </div>
            ))}
            {unloads.map((x, i) => (
              <div
                key={i}
                style={{
                  border: "0 solid black",
                  borderRadius: "3px",
                  margin: 6,
                  padding: 3,
                }}
                className={styles.information}
              >
                <p
                  className={styles.label}
                >
                  <UnderCardTitleBorder title={<><Translate textKey="arrival" /> <span>{" "}</span><span>{(i + 1)}</span></>} />
                </p>
                <FromCardPlace
                  hideDeleteButton={true}
                  item={{
                    ...x,
                    start_datetime: x.start_datetime
                      ? moment(x.start_datetime)
                      : null,
                    end_datetime: x.end_datetime
                      ? moment(x.end_datetime)
                      : null,
                  }}
                  dateKeyStart={"start_datetime"}
                  dateKeyEnd={"end_datetime"}
                />
              </div>
            ))}

            <div
              style={{
                border: "0 solid black",
                borderRadius: "3px",
                margin: 6,
                marginLeft: 6,
                padding: 4,
              }}
              className={styles.information}
            >
              <p
                className={styles.label}
              >
                <UnderCardTitleBorder title={<Translate textKey={"contact_person"} />}/>
              </p>
              <div
                style={{
                  margin: 6,
                  marginRight: 20,
                  marginLeft: 0,
                  padding: 4,
                  paddingLeft: 0,
                }}
              >
                <p
                  className={styles.value}
                  style={{ fontSize: 16, fontWeight: 600 }}
                >
                  {" "}
                  {item.contact_accounts[0]?.name || "-"}
                </p>
                <p className={styles.value} style={{ opacity: 0.65 }}>
                  {" "}
                  {item.contact_accounts[0]?.email || "-"}
                </p>
                {device === "mobile" ? (
                  <a
                    href={`tel:${
                      item.contact_accounts[0]?.phone_number || "-"
                    }`}
                  >
                    {item.contact_accounts[0]?.phone_number || "-"}
                    <PhoneFilled style={{ marginLeft: 15 }} />
                  </a>
                ) : (
                  <p className={styles.value} style={{ opacity: 0.65 }}>
                    {" "}
                    {item.contact_accounts[0]?.phone_number || "-"}
                  </p>
                )}
              </div>
            </div>

            {item.auction && (
              <div
                style={{
                  border: "0 solid black",
                  borderRadius: "3px",
                  margin: 6,
                  marginLeft: 6,
                  padding: 3,
                }}
                className={styles.information}
              >
                <p
                  className={styles.label}
                  style={{ borderBottom: "2px solid #7360f2" }}
                >
                  <Translate textKey={"auction"} />
                </p>
                <div
                  style={{
                    margin: 6,
                    marginRight: 20,
                    marginLeft: 0,
                    padding: 4,
                    paddingLeft: 0,
                  }}
                >
                  <p
                    className={styles.value}
                    style={{ fontSize: 16, fontWeight: 600 }}
                  >
                    {" "}
                    {moment(item.auction_end_datetime).format(
                      "DD-MM-YY hh:mm"
                    ) || "-"}
                  </p>
                  <p className={styles.value} style={{ opacity: 0.65 }}>
                    {" "}
                    {item.auctions[0]?.price || "-"}€
                  </p>
                  <p className={styles.value} style={{ opacity: 0.65 }}>
                    {" "}
                    {item.auctions[item.auctions.length - 1]?.price || "-"}€
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {device === "desktop" &&
          (item.status !== ADD_STATUSES.CLOSED || owner) && (
            <div style={{ padding: "4px 12px" }}>
              <Button>
                <Link style={{ float: "right" }} to={`/cargo/${item.id}`}>
                <Translate textKey={"details"} />
                </Link>
              </Button>
            </div>
          )}
      </motion.div>
    </div>
  );
};

export default UnderCard;

const Information = (value, label) => (
  <div className={styles.information}>
    <p className={styles.label}>{label}</p>
    <p className={styles.value}> {value}</p>
  </div>
);
