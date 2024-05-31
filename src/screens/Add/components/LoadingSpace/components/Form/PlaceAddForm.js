import React, {
  forwardRef,
  memo,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { unstable_batchedUpdates } from "react-dom";
import ListPlaces from "../../../../../../components/ListPlaces";
import Place from "../../../Cargo/components/Form/PlaceMemo";
import Date from "./Date";
import { Button, message, Input } from "antd";
import CustomInputLabel from "../../../../../../components/Inputs/CustomInputLabel";
import { LOAD_SPACE_PLACE_TYPE } from "../../../../../../helpers/consts";
import Translate from "../../../../../../Translate";

const PlaceAddForm = forwardRef(({ data, type, withinKmFlag }, ref) => {
  // type destination or start
  const placeRef = useRef();
  const dateRef = useRef();
  const [addingActive, set_addingActive] = useState(false);
  const [editActive, set_editActive] = useState(false);

  const [places, set_places] = useState(data);
  const [reRender, set_reRender] = useState(0);
  const [withinKm, set_withinKm] = useState("");

  useEffect(() => {
    set_places(data);
  }, [data]);

  const onEdit = (index) => {
    const tmpData = { ...places[index] };


    placeRef.current?.setData({
      country: tmpData.country,
      city: tmpData.city,
      zip_code: tmpData.zip_code,
    });


    dateRef.current?.setData({
      dateFrom: tmpData.from_date ? tmpData.from_date : null,
      timeFrom: tmpData.from_date ? tmpData.from_date : null,
    });
    unstable_batchedUpdates(() => {
      set_editActive(index);
    }, []);
  };

  const onRemove = (index) => {
    const tmpPlaces = [...places];
    tmpPlaces.splice(index, 1);
    set_places(tmpPlaces);
  };

  const editItem = () => {
    const place = placeRef.current?.getData();
    const date = dateRef.current?.getData();


    if (editActive === false) {
      return;
    }

    const data = {
      ...place,
      from_date: date?.dateFrom,
      to_date: date?.dateTo,
      from_time: date?.timeFrom,
      to_time: date?.timeTo,
      type,
    };

    const _places = [...places];
    _places[editActive] = data;

    unstable_batchedUpdates(() => {
      set_places(_places);
      set_editActive(false);
      placeRef.current?.resetPlace();
      dateRef.current?.resetDate();
    }, []);

    return { isOk: true, places: _places };
  };

  const insertData = () => {
    const place = placeRef.current?.getData();
    const date = dateRef.current?.getData();

    

    if (
      places.length === 0 &&
      dateRef.current?.validateFields(
        dateRef.current?.getData().dateFrom,
        type === LOAD_SPACE_PLACE_TYPE.START
      )
    ) {
      message.warning(<Translate textKey="departureHasToHaveDate" />);
      return { isOk: false, places: places };
    }

    const data = {
      ...place,
      from_date: date?.dateFrom || null,
      to_date: date?.dateTo || null,
      from_time: date?.timeFrom || null,
      to_time: date?.timeTo || null,
      withinKm,
      type,
    };

    const _places = [...places];
    if (data.country) {
      _places.push(data);
    }
    unstable_batchedUpdates(() => {
      set_places(_places);
      set_addingActive(false);
      placeRef.current?.resetPlace();
      dateRef.current?.resetDate();
    }, []);
    return { isOk: true, places: _places };
  };

  const validateFields = (date, typeFlag) => {
    if (
      dateRef.current?.validateFields(
        dateRef.current?.getData().dateFrom,
        typeFlag
      )
    ) {
      if (places.length === 0) {
        set_addingActive(true);
      } else {
        onEdit(0);
      }
      message.warning(
        <Translate textKey={"min_one_departure_and_arrival_with_date"} />,
        2.7
      );
      return true;
    }
    return false;
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        getData() {
          return [...places];
        },
        resetData() {
          set_places([]);
          set_addingActive(false);
          set_editActive(false);
          placeRef.current?.resetPlace();
          dateRef.current?.resetDate();
        },

        insertData() {
          if (editActive !== false) {
            return editItem();
          } else if (addingActive) {
            return insertData();
          }
          return { isOk: true, places };
        },
        validateFields(date, typeFlag) {
          return validateFields(date, typeFlag);
        },
      };
    },
    [places, editActive, addingActive]
  );
  return (
    <div>
      <div
        style={{
          display: addingActive || editActive !== false ? "block" : "none",
        }}
      >
        <Place onSelect={set_reRender} showButtonAll={false} ref={placeRef} />
        <div style={{ marginBottom: 24 }}>
          {withinKmFlag ? (
            <div style={{ position: "relative" }}>
              <Input
                name="within_km"
                type="number"
                width={"100%"}
                className="inputHeight"
                value={withinKm}
                onChange={({ target: { value } }) => {
                  set_withinKm(value);
                }}
              />
              <CustomInputLabel text={"U krugu od km"} />
            </div>
          ) : (
            <Date
              addingActive={addingActive}
              editActive={editActive}
              ref={dateRef}
            />
          )}
        </div>
        <div style={{ float: "right" }}>
          {editActive !== false ? (
            <Button
              type="primary"
              disabled={!placeRef.current?.getData().country}
              onClick={() => {
                if (
                  validateFields(
                    dateRef.current?.getData().dateFrom,
                    type === LOAD_SPACE_PLACE_TYPE.START
                  )
                ) {
                  return;
                }
                editItem();
              }}
            >
               <Translate textKey={"edit"}  />
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                if (
                  validateFields(
                    dateRef.current?.getData().dateFrom,
                    type === LOAD_SPACE_PLACE_TYPE.START
                  )
                ) {
                  return;
                }
                insertData();
              }}
              disabled={!placeRef.current?.getData().country}
            >
               <Translate textKey={"add_butt"}  />
            </Button>
          )}
          <Button
            style={{ marginLeft: 8 }}
            type="dashed"
            onClick={() => {
              unstable_batchedUpdates(() => {
                set_editActive(false);
                set_addingActive(false);
                placeRef.current?.resetPlace();
                dateRef.current?.resetDate();
              }, []);
            }}
          >
             <Translate textKey={"reject"} />
          </Button>
        </div>
      </div>
      <div
        className={"listPlaces"}
        style={{
          display: addingActive || editActive !== false ? "none" : "block",
        }}
      >
        <ListPlaces
          onEdit={onEdit}
          onRemove={onRemove}
          data={places}
          onAdd={() => set_addingActive(true)}
        />
      </div>
    </div>
  );
});

export default memo(PlaceAddForm);
