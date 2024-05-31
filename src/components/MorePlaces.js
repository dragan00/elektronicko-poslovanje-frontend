import React, { useEffect, useState } from "react";
import { Popover, Button } from "antd";
import NewField from "./Buttons/NewField";
import FormCardPlace from "./Cards/FormCardPlace";
import { connect } from "react-redux";
import useDevice from "../helpers/useDevice";

const MorePlaces = ({
  disabled,
  name = "",
  onClick,
  data,
  clearItem,
  update,
  onRemove,
  placesKey,
  toUpdate,
}) => {
  // Variables
  const [places, set_places] = useState([]);
  const device = useDevice();
  const isMobile = device === "mobile";

  // Methods
  useEffect(() => {
    set_places(data);
  }, [data]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NewField
          disabled={disabled}
          onClick={onClick}
          style={{ width: data.length ? "70%" : "100%" }}
        />
        {data.length ? (
          <Popover
            overlayStyle={{ maxHeight: !isMobile && "66vh" }}
            content={
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  height: isMobile && "50vh",
                  overflowY: "auto",
                  minWidth: !isMobile && 240,
                }}
              >
                {data.map((x, i) => (
                  <FormCardPlace
                    onRemove={() => {
                      const arr = [...places];
                      arr.splice(i, 1);
                      set_places(arr);
                      onRemove(i, placesKey);
                    }}
                    toUpdate={() => toUpdate(i, x)}
                    item={x}
                    clearItem={clearItem}
                    index={i}
                    key={i}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            }
            title={<div style={{ padding: "10px" }}>{name}</div>}
            trigger="click"
          >
            <Button style={{ height: 72, marginLeft: 12 }}>
              {name}: {data.length}
            </Button>
          </Popover>
        ) : null}{" "}
      </div>
    </>
  );
};

export default MorePlaces;
