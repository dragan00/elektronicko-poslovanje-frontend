import React, { useEffect } from "react";

import { motion } from "framer-motion";
import styles from "../card.module.css";
import { ADD_STATUSES, LOAD_SPACE_PLACE_TYPE } from "../../../helpers/consts";
import { Link } from "react-router-dom";
import FromCardPlace from "../FormCardPlace";
import moment from "moment";
import useDevice from "../../../helpers/useDevice";
import { Button } from "antd";
import { PhoneFilled } from "@ant-design/icons";
import { colors } from "../../../styles/colors";
import UnderCardTitleBorder from "../UnderCardTitleBorder";
import Translate from "../../../Translate";

const UnderCard = ({ item, owner, scroll }) => {
  const start =
    item.starting_point_destination &&
    item.starting_point_destination.filter(
      (x) => x.type === LOAD_SPACE_PLACE_TYPE.START
    );

  const end =
    item.starting_point_destination &&
    item.starting_point_destination.filter(
      (x) => x.type === LOAD_SPACE_PLACE_TYPE.DESTINATION
    );

  const device = useDevice();

  useEffect(() => {
    scroll();
  }, []);

  return (
    <motion.div
      layout
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      exit={{ scaleY: 0 }}
      transition={{ type: "just" }}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "flex-start",
        flexDirection: "row",
        transformOrigin: "top",
        borderBottom: "1px solid #ededed",
        borderLeft: "1px solid #ededed",
        borderRight: "1px solid #ededed",
      }}
    >
      <div className={"underCard"}>
        {device === "mobile" && (item.status !== ADD_STATUSES.CLOSED || owner) && (
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
                <PhoneFilled style={{ color: colors.purple, marginRight: 8 }} />
              }
            >
              <a
                style={{ opacity: 0.65 }}
                href={`tel:${item.contact_accounts[0]?.phone_number || "-"}`}
              >
                Poziv
              </a>
            </Button>
            <Button block={device === "mobile" && true} type="primary">
              <Link to={`/loadingspace/${item.id}`}> <Translate textKey={"details"} /></Link>
            </Button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {start.map((x, i) => (
            <div
              key={i}
              style={{
                border: "0 solid black",
                borderRadius: "3px",
                margin: 6,
                padding: 3,
                marginRight: 12,
              }}
              className={styles.information}
            >
              <p className={styles.label}>
                <UnderCardTitleBorder title={<><Translate textKey="departure" /> <span>{" "}</span> <span>{(i + 1)}</span> </>} />
              </p>

              <FromCardPlace
                hideDeleteButton={true}
                item={{
                  ...x,
                  departure_datetime: x.departure_datetime
                    ? moment(x.departure_datetime)
                    : null,
                }}
                dateKeyStart={"departure_datetime"}
              />
            </div>
          ))}
          {end.map((x, i) => (
            <div
              key={i}
              style={{
                border: "0 solid black",
                borderRadius: "3px",
                margin: 6,
                padding: 3,
                marginRight: 12,
              }}
              className={styles.information}
            >
              <p className={styles.label}>
                <UnderCardTitleBorder title={<><Translate textKey="arrival" /> <span>{" "}</span> <span>{(i + 1)}</span> </>} />
              </p>
              <FromCardPlace
                hideDeleteButton={true}
                item={{
                  ...x,
                  departure_datetime: x.departure_datetime
                    ? moment(x.departure_datetime)
                    : null,
                }}
                dateKeyEnd={"departure_datetime"}
              />
            </div>
          ))}

          <div
            style={{
              border: "0 solid black",
              borderRadius: "3px",
              margin: 6,
              padding: 3,
              marginRight: 12,
            }}
            className={styles.information}
          >
            <p className={styles.label}>
              <UnderCardTitleBorder title={<Translate textKey={"contact_person"} />} />
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
                  href={`tel:${item.contact_accounts[0]?.phone_number || "-"}`}
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
        </div>
      </div>
      {device === "desktop" && (item.status !== ADD_STATUSES.CLOSED || owner) && (
        <div style={{ padding: "4px 12px" }}>
          <Button>
            <Link style={{ float: "right" }} to={`/loadingspace/${item.id}`}>
            <Translate textKey={"details"} />
            </Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default UnderCard;
