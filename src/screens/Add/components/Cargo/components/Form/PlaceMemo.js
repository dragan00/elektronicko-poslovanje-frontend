import { message, Spin, Select, Button } from "antd";
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import Country from "../../../../../../components/Dropdowns/Country";
import { fitlerDataById } from "../../../../../../helpers/functions";
import axios from "axios";
import { getApiEndpoint } from "../../../../../../axios/endpoints";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { unstable_batchedUpdates } from "react-dom";
import CustomInputLabel from "../../../../../../components/Inputs/CustomInputLabel";
import Translate from "../../../../../../Translate";

const { Option } = Select;

const Place = forwardRef(
  ({ onSelect, showButtonAll, value, maxWidth, marginBottom = 24 }, ref) => {
    const [componentId, set_componentId] = useState(+new Date().getTime());
    const { countries } = useSelector((state) => state.User.prepare.data);

    const dummyRef = useRef(null);
    const [zipCodes, set_zipCodes] = useState([]);
    const [cities, set_cities] = useState([]);

    const [loading, set_loading] = useState(false);

    const [selectActive, set_selectActive] = useState("");

    const history = useHistory();

    const [place, set_place] = useState({
      country: null,
      city: null,
      zip_code: null,
    });

    const resetPlace = () => {
      set_place({
        country: null,
        city: null,
        zip_code: null,
      });
    };

    const toggleDropDownList = (bool) => {
      const dorpDownList = document.getElementsByClassName(
        "ant-select-dropdown"
      );

      for (let i = 0; i < dorpDownList.length; i++) {
        const element = dorpDownList[i];
        element.style.visibility = bool ? "visible" : "hidden";
      }
    };

    const getZipCodeSCities = async (queryParams) => {
      if (
        cities[0]?.country_id === place.country?.id ||
        componentId === loading
      ) {
        return;
      }

      toggleDropDownList(false);

      set_loading(componentId);

      const token = await localStorage.getItem("token");

      axios
        .get(`${getApiEndpoint()}transport/cities/`, {
          headers: { Authorization: "Token " + token },
          params: queryParams,
        })
        .then((res) => {
          set_loading(false);
          unstable_batchedUpdates(() => {
            set_zipCodes(res.data.zip_codes);
            set_cities(res.data.cities);
          });
          setTimeout(() => {
            toggleDropDownList(true);
          }, 390);
        })
        .catch((res) => {
          set_loading(false);
          if (res.response && res.response.status === 401) {
            message.warning("Potrebna prijava...", 3, () =>
              history.replace("/logout")
            );
            return;
          }
          message.error(
            "Dogodila se greška kod dohvata gradova, ponovo odabrati državu...",
            6
          );
        });
    };

    const resetCityZipCode = (place) => {
      set_place({
        country: place.country?.id,
        city: null,
        zip_code: null,
      });
    };

    useEffect(() => {
      if (value && value.country?.id) {
        getZipCodeSCities({ country: value.country.id || 0 });
        if (value.country?.id !== place.country?.id) set_place(value);
      }
    }, [value]);

    const getData = () => {
      return { ...place };
    };

    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(
      ref,
      () => {
        if (onSelect) onSelect(new Date().getTime()); // potrebno za update parent componente tako da validacija odradisvoje u parent komponenti, nema gubitka performansi sve su child komponente memo
        return {
          resetCityZipCode(place) {
            resetCityZipCode(place);
          },
          resetPlace() {
            resetPlace();
          },
          getData() {
            return getData();
          },
          setData(value) {
            if(value.zip_code){
              set_zipCodes([value.zip_code]);
            }
            
            if(value.city){
              set_cities([value.city]);
            }
            
            set_place(value);
          },
        };
      },
      [place]
    );



    return (
      <div
        style={{
          maxWidth: maxWidth && maxWidth,
          position: "relative",
          marginBottom: marginBottom,
        }}
      >
        <Country
          style={{ marginBottom: "24px" }}
          showButtonAll={showButtonAll}
          value={place.country?.id}
          onChange={(v) => {
            const country = countries.find((x) => x.id === v);
            set_place({ ...place, country, city: null, zip_code: null });
          }}
        />
        <div style={{ position: "relative" }}>
          <Select
            notFoundContent={
              <Spin spinning={componentId === loading}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 0",
                    fontSize: 15,
                  }}
                >
                  {" "}
                  Nema podataka...
                </div>
              </Spin>
            }
            onBlur={() => {
              set_selectActive("");
            }}
            onClick={(v) => {
              if (!place.country) {
                return;
              }
              getZipCodeSCities({ country: place.country.id });
              if (selectActive !== "cities") set_selectActive("cities");
            }}
            allowClear
            showSearch={true}
            style={{ marginBottom: "24px", width: "100%" }}
            onFocus={() => {
              if (!place.country) {
                return;
              }
              getZipCodeSCities({ country: place.country.id });
              set_selectActive("cities");
            }}
            onSelect={() => {
              set_selectActive("");
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            open={selectActive === "cities"}
            disabled={!place.country}
            value={place.city?.id}
            onChange={(v) => {
              const city = cities.find((x) => x.id === v);
              let zipCode = null;
              let zipCodesOfCity = zipCodes.filter(
                (x) => x.city_id === city?.id
              );
              if (zipCodesOfCity?.length === 1) {
                // ukoliko rad ima jedan zipcode odmah renderaj
                zipCode = zipCodesOfCity[0];
              }
              set_place({ ...place, city, zip_code: zipCode });
            }}
            placeholder=""
          >
            {cities
              ? cities.map((x) => (
                  <Option value={x.id} key={x.id}>
                    {x.name}
                  </Option>
                ))
              : []}
          </Select>
          <CustomInputLabel text={<Translate textKey={"city"} />} style={{ width: "100%" }} />
        </div>
        <div style={{ position: "relative" }}>
          <Select
            notFoundContent={
              <Spin spinning={componentId === loading}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 0",
                    fontSize: 15,
                  }}
                >
                  {" "}
                  Nema podataka...
                </div>
              </Spin>
            }
            showSearch={true}
            open={selectActive === "zipCode"}
            allowClear
            onSelect={() => {
              set_selectActive("");

              // Lose focus from zip code select
              dummyRef.current.focus();
            }}
            onFocus={() => {
              if (!place.country) {
                return;
              }
              set_selectActive("zipCode");
              getZipCodeSCities({ country: place.country?.id });
            }}
            onBlur={() => {
              set_selectActive("");
            }}
            onClick={() => {
              if (!place.country) {
                return;
              }
              getZipCodeSCities({ country: place.country?.id });
              if (selectActive !== "zipCode") set_selectActive("zipCode");
            }}
            style={{ width: "100%" }}
            disabled={!place.country}
            value={place.zip_code?.id}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(v) => {
              const zip_code = zipCodes.find((x) => x.id === v);
              let city = null;
              if (zip_code) {
                city = cities.find((x) => x.id === zip_code.city_id);
              }

              set_place({ ...place, zip_code, city: city });
            }}
            placeholder=""
          >
            {fitlerDataById(zipCodes, place.city?.id, "city_id").map((x) => (
              <Option value={x.id} key={x.id}>
                {x.name}
              </Option>
            ))}
          </Select>

          {/* Label */}
          <CustomInputLabel text={"Zip code"} style={{ width: "100%" }} />

          {/* Dummy button to lose focus from zip code select */}
          <Button style={{ opacity: 0, height: 0, padding: 0 }} ref={dummyRef}>
            -
          </Button>
        </div>
      </div>
    );
  }
);

export default memo(Place);
