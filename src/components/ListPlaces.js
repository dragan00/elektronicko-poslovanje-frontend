import React from "react";

import { List, Button } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import NewField from "./Buttons/NewField";

import NoDateIcon from "../assets/icons/no_date.png";
import { Tooltip } from "antd";
import useDevice from "../helpers/useDevice";
import moment from "moment";
import Tag from "./Tags/Basic";
 
import { createLoadUnloadTime } from "../helpers/functions";
import Translate from "../Translate";

const ListPlaces = ({ data, onEdit, onRemove, disabled, onAdd, hideDates }) => {
  if (!data || !data.length) {
    return (
      <div>
        <NewField
          disabled={disabled}
          onClick={onAdd}
          style={{ width: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
      <List
        dataSource={data}
        header={
          <div>
            <NewField
              disabled={disabled}
              onClick={onAdd}
              style={{ width: "100%" }}
            />
          </div>
        }
        renderItem={(item, index) => {
          if (!item.start_datetime) {
            item.start_datetime = createLoadUnloadTime(
              item.from_date,
              item.from_time
            );
          }
          if (!item.end_datetime) {
            item.end_datetime = createLoadUnloadTime(
              item.to_date,
              item.to_time
            );
          }
          return (
            <List.Item
              extra={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Button
                    style={{ borderRadius: 3 }}
                    onClick={() =>onEdit(index)}
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    type="dashed"
                    style={{ marginTop: 4, borderRadius: 3 }}
                    onClick={() => onRemove(index)}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              }
            >
              <List.Item.Meta
                description={
                  <OnePlace hideDates={hideDates} item={item} shrink={true} />
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ListPlaces;


 

// UI


const OnePlace = ({ item, shrink, hideDates }) => {
  const device = useDevice();

  const isMobile = device === "mobile";

  const noDateIcon = (
    <Tooltip title={<Translate textKey={"date_missing"}  />}>
      <img src={NoDateIcon} style={{ width: 20, height: 20 }} />
    </Tooltip>
  );

  return (
    <div className={"destinations"}>
      <div className={"place"} style={{ width: shrink && "100%" }}>
        <div className={device === "desktop" && "destinationColumn"}>
          <h3 className={"item"} style={{ minWidth: 36 }}>
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
          className={device === "desktop" && "destinationColumn"}
          style={{ minWidth: device === "mobile" && 148 }}
        >
          {isMobile ? (
            <Tooltip title={item.city?.name}>
              <h3 className={`item city`}>
                {item.city?.name || "---"}
              </h3>
            </Tooltip>
          ) : (
            <h3 style={{ maxWidth: shrink && "50%" }} className={"item"}>
              {item.city?.name || "---"}
            </h3>
          )}
        </div>
        <div className={"destinationColumnPostalCode"}>
          <h3 style={{ minWidth: 52 }}>
            {<Tag text={item.zip_code?.name || "---"} />}
          </h3>
        </div>
      </div>

      {!hideDates && (
        <div className={"date"} style={{ marginLeft: shrink && 0 }}>
          {item.start_datetime == null && item.end_datetime == null ? (
            noDateIcon
          ) : (
            <h3 className={"item"}>
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

 
