import React, {
  forwardRef,
  memo,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { unstable_batchedUpdates } from "react-dom";
import Place from "../../../../../Add/components/Cargo/components/Form/PlaceMemo";
import { Button, Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import ListPlaces from "../../../../../../components/ListPlaces";
import Translate from "../../../../../../Translate";

const PlaceAddForm = forwardRef(({ data, type, withinKmFlag }, ref) => {
  // type destination or start
  const placeRef = useRef();
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

    const data = {
      ...place,
    };

    const _places = [...places];

    if (data.country) {
      _places[editActive] = data;
    }

    unstable_batchedUpdates(() => {
      set_places(_places);
      set_editActive(false);
      placeRef.current?.resetPlace();
    }, []);

    return { isOk: true, places: _places };
  };

  const insertData = () => {
    const place = placeRef.current?.getData();

    const data = {
      ...place,
    };

    const _places = [...places];

    if (data.country) {
      _places.push(data);
    }
    unstable_batchedUpdates(() => {
      set_places(_places);
      set_addingActive(false);
      placeRef.current?.resetPlace();
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
        },

        insertData() {
          if (editActive !== false) {
            // u edit active se srpema index itema koji treba izmjenit
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
        <Place
          onSelect={set_reRender}
          showButtonAll={false}
          ref={placeRef}
        />
        <div style={{ float: "right" }}>
          {editActive !== false ? (
            <Button
              type="primary"
              disabled={!placeRef.current?.getData().country}
              onClick={editItem}
            >
                <Translate textKey={"edit"}  />
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={insertData}
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
              }, []);
            }}
          >
            <CloseCircleOutlined />
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
          hideDates={true}
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
