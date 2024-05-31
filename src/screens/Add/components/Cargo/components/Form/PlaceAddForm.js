import React, {
  forwardRef,
  memo,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { unstable_batchedUpdates } from "react-dom";
import NewField from "../../../../../../components/Buttons/NewField";
import ListPlaces from "../../../../../../components/ListPlaces";
import Place from "./PlaceMemo";
import Date from "./Date";
import { Button, message } from "antd";
import { CARGO_PLACE_TYPE } from "../../../../../../helpers/consts";
import Translate from "../../../../../../Translate";

const PlaceAddForm = forwardRef(({ data, type }, ref) => {
  // type destination or start
  const placeRef = useRef();
  const dateRef = useRef();
  const [addingActive, set_addingActive] = useState(false);
  const [editActive, set_editActive] = useState(false);

  const [places, set_places] = useState(data);
  const [reRender, set_reRender] = useState(0);

  const onEdit = (index) => {
    const tmpData = { ...places[index] };




    

    if(editActive === true){
      return;
    }

    placeRef.current?.setData({
      country: tmpData.country,
      city: tmpData.city,
      zip_code: tmpData.zip_code,
    });

    dateRef.current?.setData({
      dateFrom: tmpData.from_date?.isValid() ? tmpData.from_date : null,
      dateTo: tmpData.to_date?.isValid() ? tmpData.to_date : null,
      timeFrom: tmpData.from_time?.isValid() ? tmpData.from_time : null,
      timeTo: tmpData.to_time?.isValid() ? tmpData.to_time : null,
    });

    unstable_batchedUpdates(() => {
      set_editActive(index);
    }, []);
  };

  useEffect(() => {
    set_places(data);
  }, [data]);

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

    console.log(place);

    if (
      places.length === 0 &&
      dateRef.current?.validateFields(
        dateRef.current?.getData().dateFrom,
        type === CARGO_PLACE_TYPE.LOAD
      )
    ) {
      message.warning(<Translate textKey="departureHasToHaveDate" />);
      return { isOk: false, places: places };
    }



    const data = {
      ...place,
      from_date: date.dateFrom,
      to_date: date.dateTo,
      from_time: date.timeFrom,
      to_time: date.timeTo,
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
        validateFields(date, typeFlag) {
          if (dateRef.current?.validateFields(date, typeFlag)) {
            if (places.length === 0) {
              set_addingActive(true);
            } else {
              onEdit(0);
            }
            return true;
          }
          return false;
        },
        insertData() {
          if (editActive !== false) {
            return editItem();
          } else if (addingActive) {
            return insertData();
          }
          return { isOk: true, places };
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
        <Date ref={dateRef} />
        <div style={{ float: "right" }}>
          {editActive !== false ? (
            <Button
              type="primary"
              disabled={!placeRef.current?.getData().country}
              onClick={() => {
                if (
                  dateRef.current?.validateFields(
                    dateRef.current?.getData().dateFrom,
                    type === CARGO_PLACE_TYPE.LOAD
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
                  dateRef.current?.validateFields(
                    dateRef.current?.getData().dateFrom,
                    type === CARGO_PLACE_TYPE.LOAD
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
