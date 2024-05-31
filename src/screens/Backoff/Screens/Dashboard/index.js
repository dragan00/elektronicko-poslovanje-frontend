import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { getApiEndpoint } from "../../../../axios/endpoints";
import { Button, message, Spin, Typography } from "antd";

import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./Dashboard.css";
import Loader from "../../../../components/Loaders/Page";
import CompanyList from "../CompanyList";

const PIE_COLORS = ["#68e256", "#5567e2", "#e28955"];

const Dashboard = () => {
  // variables
  const history = useHistory();
  const [basicBackOfficeInfo, set_basicBackOfficeInfo] = useState({
    status: "loading",
    data: {
      active_ads: {
        per_category: {
          active_stocks_num: 0,
          active_loading_spaces_num: 0,
          active_cargo_num: 0,
        },
        total: 0,
      },
      closed_ads: {
        per_category: {
          closed_stocks_num: 0,
          closed_loading_spaces_num: 0,
          closed_cargo_num: 0,
        },
        total: 0,
      },
      companies: {
        per_category: {
          active_companies_num: 0,
          waiting_companies_num: 0,
        },
        total: 0,
      },
      accounts_num: 0,
    },
  });

  const ads = async () => {
    const token = await localStorage.getItem("token");
    set_basicBackOfficeInfo({ ...basicBackOfficeInfo, status: "loading" });
    axios
      .get(`${getApiEndpoint()}transport/basic_backoffice_info/`, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then((res) => {
        set_basicBackOfficeInfo({ status: "", data: res.data });
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          message.warning("Potrebna prijava", 3, () =>
          {
            history.replace("/backoff/signin")}
          );
          return;
        }
        set_basicBackOfficeInfo({ status: "", data: basicBackOfficeInfo.data });
        message.error("Dogodila se greška kod dohvata pdoataka...");
      });
  };
  useEffect(() => {
    ads();
  }, []);
  if (basicBackOfficeInfo.status === "loading") {
    return <Loader />;
  }



  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1 className={"headerColor"}>Dashboard</h1>
        <Spin
          style={{ width: "100%" }}
          spinning={basicBackOfficeInfo.status === "loading"}
        >
          <div
            style={{
              width: window.innerWidth,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="graph">
              <div className="graph-active">
                <h2 className={"headerColor"}>Aktivni oglasi</h2>
                <Typography.Paragraph style={{ fontSize: 18 }}>
                  Ukupan broj: {basicBackOfficeInfo.data.active_ads.total}
                </Typography.Paragraph>
                <Pie
                  width={300}
                  height={300}
                  data={{
                    labels: ["Tereti", "Utovar", "Skladišta"],
                    datasets: [
                      {
                        data: [
                          basicBackOfficeInfo.data.active_ads.per_category
                            .active_cargo_num,
                          basicBackOfficeInfo.data.active_ads.per_category
                            .active_loading_spaces_num,
                          basicBackOfficeInfo.data.active_ads.per_category
                            .active_stocks_num,
                        ],
                        backgroundColor: PIE_COLORS,
                      },
                    ],
                  }}
                  options={{
                    onClick: (evt, element) => {
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "left",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                      datalabels: {
                        display: true,
                        color: "#fff",
                        align: "center",
                        font: {
                          size: 18,
                        },
                      },
                    },
                  }}
                  plugins={[ChartDataLabels]}
                />
              </div>
              <div className="graph-zavrsni">
                <h2 className={"headerColor"}>Završni oglasi</h2>
                <Typography.Paragraph style={{ fontSize: 18 }}>
                  Ukupan broj: {basicBackOfficeInfo.data.closed_ads?.total}
                </Typography.Paragraph>
                <Pie
                  width={300}
                  height={300}
                  data={{
                    labels: ["Tereti", "Utovar", "Skladišta"],
                    datasets: [
                      {
                        data: [
                          basicBackOfficeInfo.data.closed_ads.per_category
                            .closed_cargo_num,
                          basicBackOfficeInfo.data.closed_ads.per_category
                            .closed_loading_spaces_num,
                          basicBackOfficeInfo.data.closed_ads.per_category
                            .closed_stocks_num,
                        ],
                        backgroundColor: PIE_COLORS,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "left",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                      datalabels: {
                        display: true,
                        color: "white",
                        align: "center",
                        font: {
                          size: 18,
                        },
                      },
                    },
                  }}
                  plugins={[ChartDataLabels]}
                />
              </div>
              <div className="graph-kopmanija">
                <h2 className={"headerColor"}>Kompanija ukupan broj</h2>
                <Typography.Paragraph style={{ fontSize: 18 }}>
                  Ukupan broj: {basicBackOfficeInfo.data.companies?.total}
                </Typography.Paragraph>
                <Pie
                  width={300}
                  height={300}
                  data={{
                    labels: ["Aktivne", "Čekaju potvrdu"],
                    datasets: [
                      {
                        data: [
                          basicBackOfficeInfo.data.companies.per_category
                            .active_companies_num,
                          basicBackOfficeInfo.data.companies.per_category
                            .waiting_companies_num,
                        ],
                        backgroundColor: ["#31719e", "#ebb600"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "left",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                      datalabels: {
                        display: true,
                        color: "white",
                        align: "center",
                        font: {
                          size: 18,
                        },
                      },
                    },
                  }}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3 style={{ marginTop: 21 }} className={"headerColor"}>
          Ukupan broj aktivnih korisnika:{" "}
          {basicBackOfficeInfo.data.accounts_num}
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            marginTop: 21,
          }}
        >
          <CompanyList refrestPiceData={ads} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
