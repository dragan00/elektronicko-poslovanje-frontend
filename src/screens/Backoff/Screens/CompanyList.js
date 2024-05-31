import { Button, Input, message, Spin, Table, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getApiEndpoint } from "../../../axios/endpoints";
import Loader from "../../../components/Loaders/Page";
import { COMPANY_STATUSES } from "../../../helpers/consts";
import { COMPANIES_TO_CONFIRM } from "../../../redux/modules/Transport/actions";

const CompanyList = ({ companiesToConfirm, refrestPiceData }) => {
  const dispatch = useDispatch();

  const [search, set_search] = useState("");

  const history = useHistory();

  const [confirmLoading, set_confirmLoading] = useState(false);

  const [filteredInfo, set_filteredInfo] = useState({
    status: [],
  });

  const filters = Object.keys(COMPANY_STATUSES).map((x) => ({
    text: COMPANY_STATUSES[x].text,
    value: COMPANY_STATUSES[x].value,
  }));

  const confirmRejectCompany = async (id, value) => {
    const token = await localStorage.getItem("token");
    set_confirmLoading("loading" + id);
    axios
      .post(
        `${getApiEndpoint()}transport/confirm_company/`,
        {
          company_id: id,
          confirm: value,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then((res) => {
        getCompanies();
        refrestPiceData();
        set_confirmLoading(false);
      })
      .catch((err) => {
        message.error("Dogodila se greška");
        set_confirmLoading(false);
      });
  };

  const getCompanies = async () => {
    dispatch({
      type: COMPANIES_TO_CONFIRM,
      queryParams: {
        status: "active|need_confirm|rejected",
      },
      successCallback: () => {},
      errorCallback: (error) => {
        if (error.response && error.response.status === 403) {
          message.error("Nedostaje valjna permisija", 3, () => {
            history.replace("/logout");
          });
          return;
        }
        message.error("Dogodila se greška");
      },
    });
  };

  useEffect(() => {
    getCompanies();
  }, []);
  if (companiesToConfirm.status === "loading") {
    return <Loader />;
  }

  const COLUMNS = [
    {
      title: "Naziv",
      dataIndex: "name",
    },
    {
      title: "Kreiran",
      dataIndex: "created_at",
      render: (text) => {
        return moment(text).format("YYYY-MM-DD hh:mm");
      },
    },
    {
      title:"Godina",
      dataIndex: "year",
    },
    {
      title: "OIB",
      dataIndex: "OIB",
    },
    {
      title: "Broj",
      dataIndex: "number"
    },
    {
      title: "Lokacija",
      dataIndex: "",
      render: (text, value) => {
        return `${value.address || ""} ${value.country.name} ${
          value.city?.name || ""
        } ${value.zip_code?.name || ""}`;
      },
    },
    {
      title: "Web",
      dataIndex: "web",
      render: (text) => {
        return (
          <a href={text} target={"_blank"}>
            {text}
          </a>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, value) => {
        return (
          <span>{filters.find((x) => x.value === value.status).text}</span>
        );
      },
      filters: filters,
      filteredValue: filteredInfo.status || [],
      onFilter: (value, record) => {
        return record.status === value;
      },
    },
    {
      title: "",
      dataIndex: "",
      render: (text, values) => {
        return (
          <Spin spinning={confirmLoading === "loading" + values.id}>
            {values.status !== COMPANY_STATUSES.ACTIVE.value && (
              <Button
                style={{ margin: 3 }}
                type={"primary"}
                onClick={() => confirmRejectCompany(values.id, true)}
              >
                Odobri
              </Button>
            )}
            {values.status !== COMPANY_STATUSES.REJECTED.value && (
              <Button
                style={{ margin: 3 }}
                type={"ghost"}
                onClick={() => confirmRejectCompany(values.id, false)}
              >
                 Odbaci
              </Button>
            )}
          </Spin>
        );
      },
    },
  ];

  let filtredData = companiesToConfirm.data;
  if(search){
    filtredData = companiesToConfirm.data.filter(x => x.name.toLowerCase().includes(search) || x.number.toString().includes(search));
  }




  return (
    <div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div></div>
        <div>
          <Input.Search onChange={({target: {value}}) => set_search(value.toLowerCase())}  />
          <div style={{height: 27}} />
        </div>
      </div>
      <Table
      pagination={false}
        rowKey={(item) => item.id}
        onChange={(pagination, filters) => {
          set_filteredInfo({ ...filters });
        }}
        columns={COLUMNS}
        dataSource={filtredData}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  companiesToConfirm: state.Transport.companiesToConfirm,
});

export default connect(mapStateToProps, null)(CompanyList);
