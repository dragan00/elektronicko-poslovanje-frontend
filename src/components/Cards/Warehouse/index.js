import React from "react";
import useDevice from "../../../helpers/useDevice";

// UI
import styles from "../card.module.css";
import Tag from "../../Tags/Basic";

// Icons
import CompanyIcon from "../../../assets/icons/default_image.png";
import { Link } from "react-router-dom";
import MyAdd from "../MyAdd";

export default function Warehouse({ item, currentUser }) {
  // Variables
  const device = useDevice();

  return (
    <Link
      style={{ position: "relative" }}
      className={styles.company}
      to={`/warehouses/${item?.id}/`}
    >
      <div className={styles.left}>
        {!!currentUser && (
          <MyAdd
            currentUserCompanyId={currentUser.account.company.id}
            itemCompanyId={item.company.id}
          />
        )}
        <img src={CompanyIcon} alt="Company" className={styles.icon} />
        <div className={styles.info}>
          <p className={styles.name}>{item.company.name}</p>
          <p className={styles.description}>{item.stock_types || "-"}</p>
        </div>
      </div>

      <Tag
        text={
          item.country?.alpha2Code || "" + 
          " " +
          (item.zip_code?.name || item.city?.name || "-")
        }
        size="medium"
      />

      {device === "desktop" && (
        <div className={styles.info} style={{ marginLeft: 20 }}>
          <p
            className={styles.description}
          >{`${item.min_area || ""} - ${item.max_area || ""}㎡`}</p>
        </div>
      )}
    </Link>
  );
}
