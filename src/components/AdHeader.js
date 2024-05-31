import React from "react";
import { Divider } from "antd";
import Translate from "../Translate";

const AdHeader = ({ title = "", company, extra }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Ad title */}
        <div style={{ textAlign: "left", fontSize: "20px" }}>{title}</div>

        {/* Company info */}
        {company && (
          <div
            style={{
              textAlign: "left",
              fontSize: "14px",
              marginBottom: 10,
            }}
          >
            <span style={{ opacity: 0.5 }}><Translate textKey={"add_create_by_company"}  />: </span>
            {company.name + " " + company?.number || ""}
          </div>
        )}

        {/* Divider */}
        {!extra && <Divider dashed type="horizontal" />}
      </div>

      {/* Additional content */}
      {extra && extra}
    </div>
  );
};

export default AdHeader;
