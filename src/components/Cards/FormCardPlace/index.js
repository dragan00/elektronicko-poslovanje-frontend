import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from "moment";
import React from "react";
import CityDisplayMode from "../../CityDisplayMode";
import CountryDisplayName from "../../CountryDisplayName";
import styles from "../card.module.css";

const FormCardPlace = ({
  hideDeleteButton,
  item,
  index,
  dateKeyStart = "from_date",
  dateKeyEnd = "to_date",
  timeKeyStart = "from_time",
  timeKeyEnd = "to_time",
  placesKey,
  onRemove,
  isMobile,
}) => {

  const createDatesFormates = (date, time) => {
    return (
      <p
        style={{ position: "relative" }}
        className={styles.value}
        style={{ opacity: 0.65 }}
      >
        {!date ? "-" : date?.format("YY-MM-DD")}
        <span style={{ position: "absolute", fontSize: 9 }}>
          {!time ? "" : time?.format("h:mm")}
        </span>
      </p>
    );
  };

  return (
    <div
      key={index}
      style={{
        border: "0 solid black",
        borderRadius: "3px",
        margin: 6,
        marginRight: 20,
        marginLeft: 0,
        padding: 4,
        paddingLeft: 0,
        position: "relative",
      }}
      className={styles.information}
    >
      <div style={{ paddingLeft: "3px" }}>
        <p className={styles.value} style={{ fontSize: 16, fontWeight: 600 }}>
          <CountryDisplayName country={item.country} />
        </p>
        <p className={styles.value} style={{ opacity: 0.65 }}>
          <CityDisplayMode city={item.city} />
        </p>
        <p className={styles.value} style={{ opacity: 0.65 }}>
          {item.zip_code?.name || "-"}
        </p>
        {createDatesFormates(item[dateKeyStart], item[timeKeyStart])}
        {createDatesFormates(item[dateKeyEnd], item[timeKeyEnd])}
        {item.within_km ? (
          <p className={styles.value} style={{ opacity: 0.65 }}>
            {" "}
            {"U krugu od " + item.within_km + " km"}
          </p>
        ) : (
          ""
        )}
        {!hideDeleteButton && (
          <Button
            shape="circle"
            style={{ marginBottom: 10 }}
            onClick={() => {
              onRemove(index, placesKey);
            }}
          >
            <DeleteOutlined />
          </Button>
        )}
      </div>
      {isMobile && <hr style={{ width: "calc(100vw - 48px)" }} />}
    </div>
  );
};

export default FormCardPlace;
