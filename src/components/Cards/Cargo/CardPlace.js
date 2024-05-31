import React from "react";
import useDevice from "../../../helpers/useDevice";

const CardPlace = ({ places, noBorder = false }) => {
  const device = useDevice();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: "3px 10px",
        // borderLeft: "1.5px solid rgb(228, 227, 227)",
        borderRight: !noBorder && "1.5px solid rgb(228, 227, 227)",
      }}
    >
      {device === "desktop" ? (
        <>
          <div style={{ width: "210px" }}  >
          {places[0]?.city?.name || "-"}
     
          </div>
          <div  style={{ width: "calc(50% - 105px)" }} >       {places[0]?.country?.alpha2Code || "-"}</div>
          <div style={{ width: "calc(50% - 105px)" }}>
            {places[0]?.zip_code?.name || "-"}
          </div>
        </>
      ) : (
        <div style={{ width: "calc(50% - 105px)" }}>
          {places[0]?.country?.alpha2Code || "-"}
        </div>
      )}
    </div>
  );
};

export default CardPlace;
