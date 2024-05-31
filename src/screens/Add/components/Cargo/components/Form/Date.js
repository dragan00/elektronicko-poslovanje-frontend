import { DatePicker, TimePicker } from "antd";
import React, {
  forwardRef,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
} from "react";

import styles from "../../../../add.module.css";
import useDevice from "../../../../../../helpers/useDevice";
import CloseElement from "../../../../../../components/CloseElement";
import { DATETIME_PICKER_OPTIONS } from "../../../../../../helpers/functions";
import CustomInputLabel from "../../../../../../components/Inputs/CustomInputLabel";
import { unstable_batchedUpdates } from "react-dom";
import Translate from "../../../../../../Translate";

const timeFormat = "HH:mm";

const Date = forwardRef(({ value, index }, ref) => {
  const [itemVisible, set_itemVisible] = useState("");
  const device = useDevice();
  const [error, set_error] = useState(false);
  const scrollRefOnError = useRef();

  const [date, set_date] = useState({
    dateFrom: null,
    timeFrom: null,
    dateTo: null,
    timeTo: null,
  });

  const resetDate = () => {
    set_date({
      dateFrom: null,
      timeFrom: null,
      dateTo: null,
      timeTo: null,
    });
  };

  useEffect(() => {
    if (value) {
    }
  }, []);
  const getData = () => ({ ...date });

  const validateFields = (date, startPlace) => {
    if (!date && startPlace) {
      set_error(true);
      scrollRefOnError.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      return true;
    }
    return false;
  };

  useImperativeHandle(
    ref,
    () => ({
      resetDate() {
        resetDate();
      },
      getData() {
        return getData();
      },
      setData(value) {
        set_date(value);
      },
      validateFields(date, startPlace) {
        return validateFields(date, startPlace);
      },
    }),
    [date]
  );

  return (
    <>
      {itemVisible && device === "mobile" && (
        <CloseElement onClick={() => set_itemVisible("")} />
      )}

      {/* Pick date */}

      <div className={styles.flexRowFilters} style={{ marginBottom: 24 }}>
        <div
          ref={scrollRefOnError}
          className={error ? "error" : ""}
          style={{ position: "relative", width: "100%", marginRight: "14px" }}
        >
          <DatePicker
            value={date.dateFrom}
            {...DATETIME_PICKER_OPTIONS(
              set_itemVisible,
              undefined,
              "from_date"
            )}
            placeholder=""
            onChange={(v) => {
              unstable_batchedUpdates(() => {
                set_date({ ...date, dateFrom: v });
                set_itemVisible("");
                set_error(false);
              }, []);
            }}
            open={itemVisible === "from_date"}
          />
          <CustomInputLabel text={<Translate textKey={"date_from"}/>} />
        </div>
        <div
          style={{ position: "relative", width: "100%", marginLeft: "14px" }}
        >
          <TimePicker
            {...DATETIME_PICKER_OPTIONS(
              set_itemVisible,
              timeFormat,
              "from_time"
            )}
            inputReadOnly={false}
            placeholder=""
            onOk={(v) => {
              set_date({ ...date, timeFrom: v });
              set_itemVisible("");
            }}
            open={itemVisible === "from_time"}
            value={date.timeFrom}
          />
          <CustomInputLabel text={<Translate textKey={"time_from"} />} />
        </div>
      </div>
      {/* Pick time */}
      <div className={styles.flexRowFilters} style={{ marginBottom: 24 }}>
        <div
          style={{ position: "relative", width: "100%", marginRight: "14px" }}
        >
          <DatePicker
            {...DATETIME_PICKER_OPTIONS(set_itemVisible, undefined, "date_to")}
            open={itemVisible === "date_to"}
            onClick={() => {
              set_itemVisible("date_to");
            }}
            placeholder=""
            value={date.dateTo}
            onChange={(v) => {
              set_date({ ...date, dateTo: v });
              set_itemVisible("");
            }}
          />
          <CustomInputLabel text={<Translate textKey={"date_to"} />} />
        </div>
        <div
          style={{ position: "relative", width: "100%", marginLeft: "14px" }}
        >
          <TimePicker
            placeholder=""
            onOk={(v) => {
              set_date({ ...date, timeTo: v });
              set_itemVisible("");
            }}
            open={itemVisible === "to_time"}
            onClick={() => {
              set_itemVisible("to_time");
            }}
            {...DATETIME_PICKER_OPTIONS(set_itemVisible, timeFormat, "to_time")}
            value={date.timeTo}
          />
          <CustomInputLabel text={<Translate textKey={"time_to"} />} />
        </div>
      </div>
    </>
  );
});

export default memo(Date);
