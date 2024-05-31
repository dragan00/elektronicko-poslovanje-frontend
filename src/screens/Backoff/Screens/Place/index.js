import { Button, Col, Input, message, Modal, Row, Spin } from "antd";
import React, { useState, useMemo } from "react";

import { List } from "antd";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { getApiEndpoint } from "../../../../axios/endpoints";
import { unstable_batchedUpdates } from "react-dom";
import AddForm from "./AddForm";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Translate from "../../../../Translate";
import VirtualList from 'rc-virtual-list';
const Places = () => {
  const history = useHistory();

  const [cityId, set_cityId] = useState(0);
  const [zipCodes, set_zipCodes] = useState([]);
  const [cities, set_cities] = useState([]);
  const [loading, set_loading] = useState(0);
  const [activeCountry, set_activeCountry] = useState({ name: "", id: 0 });
  const [activeCity, set_activeCity] = useState({ name: "", id: 0 });
  const [modalVisible, set_modalVisible] = useState(false);
  const [update, set_update] = useState(null);
  const [loadingDelete, set_loadingDelete] = useState(false);
  const [countrySearch, set_countrySearch] = useState("");
  const [citySearch, set_citySearch] = useState("");
  const [zipcodeSearch, set_zipcodeSearch] = useState("");
const [ContainerHeight, set_ContainerHeight] = useState(400)

 


  const { countries } = useSelector((state) => state.User.prepare.data);

  const getZipCodeSCities = async (queryParams) => {
    const token = await localStorage.getItem("token");

    set_loading(queryParams.country);

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

  const _zipCodes = zipCodes.filter((x) => x.city_id === cityId);

  const countriesMemo = useMemo(
    () => (
      <List
        header={
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div><Input.Search onChange={({target: {value}}) => set_countrySearch(value.toLowerCase())} /></div>
          <div style={{ visibility: "hidden" }}>
            
            <Button> <Translate textKey={"add_butt"}  /></Button>{" "}
          </div>
          </div>
        }
        dataSource={countrySearch ?  countries.filter(x => x.name.toLowerCase().includes(countrySearch)) : countries}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                loading={loading === item.id}
                onClick={() => {
                  set_activeCountry(item);
                  getZipCodeSCities({ country: item.id });
                }}
                type={"primary"}
              >
                <Translate textKey={"cities"}  />
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.name} />
          </List.Item>
        )}
      />
    ),
    [countries, loading, countrySearch]
  );

  const onDelete = async (type, id) => {
    set_loadingDelete(true);
    const token = await localStorage.getItem("token");

    let request = {
      name: null,
      endpoint: "",
      requestMethod: "",
    };
    if (type === "zip_code") {
      request = {
        data: { is_active: false },
        endpoint: `${getApiEndpoint()}transport/zip_codes/${id}/`,
        requestMethod: "patch",
      };
    } else {
      request = {
        data: { is_active: false },
        endpoint: `${getApiEndpoint()}transport/cities/${id}/`,
        requestMethod: "patch",
      };
    }

    axios[request.requestMethod](request.endpoint, request.data, {
      headers: {
        Authorization: "Token " + token,
      },
    })
      .then((res) => {
        if (type === "zip_code") {
          let index = zipCodes.findIndex((x) => x.id === id);
          let arr = [...zipCodes];
          arr.splice(index, 1);
          set_zipCodes(arr);
        } else {
          let index = cities.findIndex((x) => x.id === id);
          let arr = [...cities];
          arr.splice(index, 1);
          set_cities(arr);
        }
        set_loadingDelete(false);
        false;
      })
      .catch((err) => {
        set_loadingDelete(false);
        false;
        if (err.response && err.response.status === 401) {
          message.warning("Potrebna prijava...", 3, () =>
            history.replace("/backoff/signin")
          );
        } else {
          message.error("Dogodila se greška kod spremanja podataka...");
        }
      });
  };

  

  const citiesMemo = useMemo(
    ()=>{
      let filtredCitites = citySearch ?   cities.filter(x => x.name.toLowerCase().includes(citySearch)) : cities
      return (
      <List  header={
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div><Input.Search onChange={({target: {value}}) => set_citySearch(value.toLowerCase())} /></div>
        <div style={{ textAlign: "center" }}>
          <Button
            disabled={activeCountry.id === 0}
            onClick={() => {
              set_modalVisible({ visible: true, adding: "city" });
            }}
          >
             <Translate textKey={"add_butt"}  />
          </Button>
        </div>
        </div>
      } >
      <VirtualList
      data={filtredCitites}
      height={600}
      itemHeight={47}
      itemKey="id"
      >
      { item => <List.Item
            actions={[
              <Button
                onClick={() => {
                  set_activeCity(item);
                  set_cityId(item.id);
                }}
              >
                Poštanski
              </Button>,
              <Button
                onClick={() => {
                  unstable_batchedUpdates(() => {
                    set_update(item);
                    set_modalVisible({ visible: true, adding: "city" });
                  }, []);
                }}
              >
                <EditOutlined />
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.name} />
          </List.Item> 
    }
        </VirtualList>
        </List>
    )},
    [cities, citySearch]
  );
  return (
    <div style={{ padding: 27 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <span>
            <Translate textKey={"country"} />
            <span style={{ fontWeight: "bold" }}>{activeCountry.name}</span>
          </span>
          <span style={{ display: "inline-block", width: 69 }}></span>
          <span>
            <Translate textKey={"city"} />: <span style={{ fontWeight: "bold" }}>{activeCity.name}</span>
          </span>
          {loadingDelete && <Spin />}
        </div>
      </div>
      <Row>
        <Col style={{ padding: "0 12px" }} span={8}>
          {countriesMemo}
        </Col>
        <Col style={{ padding: "0 12px" }} span={8}>
          {citiesMemo}
        </Col>
        <Col style={{ padding: "0 12px" }} span={8}>
          {" "}
          <List
            header={
              <div style={{display: "flex", justifyContent: "space-between", justifyItems: "center"}}>
                <div>
                  <Input.Search onChange={({target: {value}}) => set_zipcodeSearch(value.toLowerCase())}  />
                </div>
                <Button
                  disabled={activeCity.id === 0}
                  onClick={() => {
                    set_modalVisible({ visible: true, adding: "zip_code" });
                  }}
                >
                   <Translate textKey={"add_butt"}  />
                </Button>
              </div>
            }
            dataSource={zipcodeSearch ? _zipCodes.filter(x => x.name.toLowerCase().includes(zipcodeSearch)) : _zipCodes}
            renderItem={(item) => (
              <List.Item
                actions={[
                  // <Button
                  //   onClick={() => {
                  //     onDelete("zip_code", item.id);
                  //   }}
                  // >
                  //   <DeleteOutlined />
                  // </Button>,
                  <Button
                    onClick={() => {
                      unstable_batchedUpdates(() => {
                        set_update(item);
                        set_modalVisible({ visible: true, adding: "zip_code" });
                      }, []);
                    }}
                  >
                    <EditOutlined />
                  </Button>,
                ]}
              >
                <List.Item.Meta title={item.name} />
              </List.Item>
            )}
          />{" "}
        </Col>
      </Row>
      <Modal
        footer={null}
        closable={true}
        visible={modalVisible || update}
        destroyOnClose={true}
        onCancel={() => {
          set_modalVisible(false);
          set_update(null);
        }}
      >
        <AddForm
          set_cities={set_cities}
          set_zipCodes={set_zipCodes}
          activeCity={activeCity}
          type={modalVisible.adding}
          activeCountry={activeCountry}
          zipCodes={zipCodes}
          cities={cities}
          close={() => {
            set_modalVisible(false);
            set_update(null);
          }}
          update={update}
        />
      </Modal>
    </div>
  );
};

export default Places;
