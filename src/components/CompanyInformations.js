import React from "react";

import { TiLocation } from "react-icons/ti";
import { ImPhone } from "react-icons/im";
import { FaFax } from "react-icons/fa";
import { IoMail, IoGlobeOutline } from "react-icons/io5";

import MultipleInformations from "./Cards/Multiple";
import BasicCard from "./Cards/Basic";
import { PHONE_NUM_TYPE } from "../helpers/consts";
import { Link } from "react-router-dom";
import Translate from "../Translate";

const CompanyInformations = ({ company }) => {
  let phone_numbers = [];
  let fax_numbers = [];

  let emails = [];
  if (company?.company_numbers) {
    phone_numbers = company?.company_numbers
      .filter((x) => x.type === PHONE_NUM_TYPE.TEL)
      .map((x) => x.number);
    fax_numbers = company?.company_numbers
      .filter((x) => x.type === PHONE_NUM_TYPE.FAX)
      .map((x) => x.number);
  }

  if (company?.numbers) {
    phone_numbers = company?.numbers
      .filter((x) => x.type === PHONE_NUM_TYPE.TEL)
      .map((x) => x.number);
    fax_numbers = company?.numbers
      .filter((x) => x.type === PHONE_NUM_TYPE.FAX)
      .map((x) => x.number);
  }

  if (company.company_emails) {
    emails = company.company_emails;
  } else if (company.emails) {
    emails = company.emails;
  }

  const formattedLink = 
    (company.web.startsWith('http://') || company.web.startsWith('https://')) ? 
      company.web : 
      `http://${company.web}`

  return (
    <>
      <BasicCard
        Icon={TiLocation}
        text={`${company.address || "-"} ${company.zip_code?.name || ""} ${
          company.city?.name || ""
        } ${company.country?.name || ""}`}
        color="blue"
      />
      <MultipleInformations
        Icon={ImPhone}
        text={<span>{phone_numbers.length} <Translate textKey="added_numbers" /></span> }
        data={phone_numbers}
        color="blue"
        collapsed
      />
      <div className="divider" />
      <MultipleInformations
        Icon={FaFax}
        text={<span>{fax_numbers.length} <Translate textKey="added_numbers" /></span>}
        data={fax_numbers}
        color="blue"
        collapsed
      />
      <div className="divider" />
      <MultipleInformations
        Icon={IoMail}
        text={`${emails.length} dodana email-a`}
        data={emails.map((x) => x.email)}
        color="blue"
        collapsed
      />
      <BasicCard
        Icon={IoGlobeOutline}
        text={
          company.web ? (
            <a href={formattedLink} target={"_blank"}>
              {company.web}
            </a>
          ) : (
            "-"
          )
        }
        color="blue"
      />{" "}
    </>
  );
};

export default CompanyInformations;
