import { Button, message, Upload } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApiEndpoint } from "../../../../../axios/endpoints";
import { IMAGE_TYPES } from "../../../../../helpers/consts";
import { GET_USER_SUCCESS } from "../../../../../redux/modules/User/actions";
import Translate from "../../../../../Translate";

const AddDocuments = ({ close }) => {
  const [files, set_files] = useState([]);
  const [loading, set_loading] = useState(false);

  const user = useSelector((state) => state.User.user.data);
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Upload
        showUploadList={true}
        multiple={true}
        beforeUpload={(file, files) => {
          set_files(files);
          return false;
        }}
      >
        <Button> <Translate textKey={"upload_butt"}  /> </Button>
      </Upload>
      <Button
        type="primary"
        loading={loading}
        onClick={async () => {
          set_loading(true);
          const token = localStorage.getItem("token");
          const url = ``;
          const formData = new FormData();

          files.forEach( async (file) => {
            let _file = file
            formData.append("files", _file);
          });

          axios
            .post(
              `${getApiEndpoint()}transport/companies/${
                user.account.company.id
              }/documents/`,
              formData,
              {
                headers: { Authorization: "Token " + token },
              }
            )
            .then((res) => {
              set_loading(false);
              dispatch({
                type: GET_USER_SUCCESS,
                data: {
                  ...user,
                  account: {
                    ...user.account,
                    company: {
                      ...user.account.company,
                      company_documents: res.data.company_documents,
                    },
                  },
                },
              });
              close();
            })
            .catch((err) => {
              set_loading(false);
              message.error(<Translate textKey={"save_error"} />, 3);
            });
        }}
        disabled={!files.length}
      >
        <Translate textKey={"save_butt"} />
      </Button>
    </div>
  );
};

export default AddDocuments;
