import React from "react";

// UI
import styles from "../card.module.css";
import NoDateIcon from "../../../assets/icons/no_date.png";
import { Divider, Tooltip } from "antd";
import useDevice from "../../../helpers/useDevice";
import moment from "moment";
import Tag from "../../Tags/Basic";
import Translate from "../../../Translate";

const OnePlace = ({ item, shrink, hideDates }) => {
  const device = useDevice();

  const isMobile = device === "mobile";

  const noDateIcon = (
    <Tooltip title={<Translate  textKey={"date_missing"} />}>
      <img src={NoDateIcon} style={{ width: 20, height: 20 }} />
    </Tooltip>
  );

  return (
    <div id={styles.destinations}>
      <div className={styles.place} style={{ width: shrink && "100%" }}>
        <div className={device === "desktop" && styles.destinationColumn}>
          <h3 className={styles.item} style={{ minWidth: 36 }}>
            {isMobile
              ? (
                  <Tooltip title={item.country.name}>
                    {" "}
                    {item.country.alpha2Code}{" "}
                  </Tooltip>
                ) || "---"
              : shrink
              ? item.country.alpha2Code || "---"
              : item.country.name || "---"}
          </h3>
        </div>
        <div
          className={device === "desktop" && styles.destinationColumn}
          style={{ minWidth: device === "mobile" && 148 }}
        >
          {isMobile ? (
            <Tooltip title={item.city?.name}>
              <h3 className={`${styles.item} ${styles.city}`}>
                {item.city?.name || "---"}
              </h3>
            </Tooltip>
          ) : (
            <h3 style={{ maxWidth: shrink && "50%" }} className={styles.item}>
              {item.city?.name || "---"}
            </h3>
          )}
        </div>
        <div className={styles.destinationColumnPostalCode}>
          <h3 style={{ minWidth: 52 }}>
            {<Tag text={item.zip_code?.name || "---"} />}
          </h3>
        </div>
      </div>

      {!hideDates && (
        <div className={styles.date} style={{ marginLeft: shrink && 0 }}>
          {item.start_datetime == null && item.end_datetime == null ? (
            noDateIcon
          ) : (
            <h3 className={styles.item}>
              {item.start_datetime
                ? moment(item.start_datetime).format("YYYY-MM-DD HH:mm")
                : noDateIcon}
              <div style={{ width: 12 }} />
              -
              <div style={{ width: 12 }} />
              {item.end_datetime
                ? moment(item.end_datetime).format("YYYY-MM-DD HH:mm")
                : noDateIcon}
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default OnePlace;
