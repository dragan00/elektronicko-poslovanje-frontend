import React, { useState } from "react";

import { Button, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { getApiEndpoint } from "../../../../axios/endpoints";

const AddForm = ({
  activeCity,
  activeCountry,
  type,
  set_cities,
  set_zipCodes,
  zipCodes,
  cities,
  close,
  update,
}) => {
  const [form] = Form.useForm();

  const [loading, set_loading] = useState(false);

  const onFinish = async (values) => {
    set_loading(true);
    const token = await localStorage.getItem("token");

    let request = {
      name: null,
      endpoint: "",
      requestMethod: "",
    };
    if (type === "zip_code") {
      request = {
        data: { ...values, city: activeCity.id },
        endpoint: update
          ? `${getApiEndpoint()}transport/zip_codes/${update.id}/`
          : `${getApiEndpoint()}transport/zip_codes/`,
        requestMethod: update ? "patch" : "post",
      };
    } else {
      request = {
        data: { ...values, country: activeCountry.id },
        endpoint: update
          ? `${getApiEndpoint()}transport/cities/${update.id}/`
          : `${getApiEndpoint()}transport/cities/`,
        requestMethod: update ? "patch" : "post",
      };
    }

    axios[request.requestMethod](request.endpoint, request.data, {
      headers: {
        Authorization: "Token " + token,
      },
    })
      .then((res) => {
        if (type === "zip_code") {
          if (update) {
            let index = zipCodes.findIndex((x) => x.id === res.data.id);
            zipCodes[index] = {...res.data, city_id:  res.data.city}
            set_zipCodes([...zipCodes]);
          } else {
            set_zipCodes([
              ...zipCodes,
              { ...res.data, city_id: res.data.city },
            ]);
          }
        } else {
          if (update) {
            let index = cities.findIndex((x) => x.id === res.data.id);
            cities[index] = res.data;
            set_cities([...cities]);
          } else {
            set_cities([...cities, res.data]);
          }
        }
        set_loading(false);
        close();
      })
      .catch((err) => {
        set_loading(false);
        if (err.response && err.response.status === 401) {
          message.warning("Potrebna prijava...", 3, () =>
            history.replace("/backoff/signin")
          );
        } else {
          message.error("Dogodila se greška kod spremanja podataka...");
        }
      });
  };


  return (
    <div>
      {type === "zip_code" ? (
        <>
          {/* POŠTANSKI */}
          <Typography.Title level={4}>{activeCity.name} </Typography.Title>
          <Form
            initialValues={{
              code: update ? update.code : "",
            }}
            onFinish={onFinish}
            layout="vertical"
            form={form}
          >
            <Form.Item name={"code"} style={{ maxWidth: 320 }} label={"Naziv"}>
              <Input type="text" />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} htmlType="submit">
              Spremi
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          {/* GRAD  */}
          <Typography.Title level={4}>{activeCountry.name}</Typography.Title>
          <Form
            initialValues={{
              name: update ? update.name : "",
            }}
            onFinish={onFinish}
            layout="vertical"
            form={form}
          >
            <Form.Item name={"name"} style={{ maxWidth: 320 }} label={"Naziv"}>
              <Input type="text" />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} htmlType="submit">
             Spremi
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default AddForm;
