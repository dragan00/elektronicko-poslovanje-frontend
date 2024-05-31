import { PhoneFilled, PhoneOutlined } from "@ant-design/icons";
import React from "react";
import useDevice from "../../../helpers/useDevice";
import { colors } from "../../../styles/colors";

// UI
import styles from "../card.module.css";

export default function Information({ label = "", information = "", tel }) {
  const device = useDevice();

  return (
    <div id={styles.information}>
      {/* Label */}
      <h5 className={styles.label}>{label}</h5>

      {/* Information */}
      {device === "mobile" && tel ? (
        <a
          className={styles.information}
          style={{  color: "#434343" }}
          href={`tel:${information || "-"}`}
        >
          {information || "-"}
          <PhoneFilled style={{ color: colors.purple, marginLeft: 15 }} />
        </a>
      ) : (
        <h2 className={styles.information}>{information}</h2>
      )}
    </div>
  );
}
