import { Button, Checkbox } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDevice from "../helpers/useDevice";
import { SET_CITIES_FILTER } from "../redux/modules/Transport/actions";
import Translate from "../Translate";

const CitiesFilter = ({close}) => {
  const device = useDevice();
  const { citiesFilter } = useSelector((state) => state.Transport);
  const dispatch = useDispatch();

  const onChange = (id) => {

    let index = citiesFilter.cities.findIndex((x) => x.id === id);
    let newVal = { id: 0, name: "" };
    if (citiesFilter.cities[index].selected) {
      newVal = { ...citiesFilter.cities[index], selected: false };
    }else{
        newVal = { ...citiesFilter.cities[index], selected: true };
    }

    citiesFilter.cities[index] = newVal;

    let citiesIds = citiesFilter.cities.filter((x) => x.selected).map((x) => x.id);

    dispatch({type: SET_CITIES_FILTER, data:{cities:  [...citiesFilter.cities], citiesIds}})
  };


  const clearAll = () => {
      const arr = [];


      citiesFilter.cities.forEach(e => {
          arr.push({...e, selected: false})
      });   

      dispatch({type: SET_CITIES_FILTER, data: {cities:  [...arr], citiesIds: []}})
  }


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button update={true} onClick={() => {
            clearAll();
            close();
        }}>
          <Translate textKey={"clean_butt"}   />
        </Button>
      </div>
        <div style={{height: 33}}  />
      <div style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap", flexDirection: "row"}} >
        {citiesFilter?.cities?.filter(x => !!x.name)?.map((x, i) => (
            <div key={i} style={{margin: device === "mobile" ? 6 : 18}} >
          <Checkbox checked={x.selected} onChange={() => onChange(x.id)}>
            {x.name}
          </Checkbox>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitiesFilter;
