import React, { useState } from "react";
import { Button, message, Spin, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { getApiEndpoint } from "../../../axios/endpoints";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_SUCCESS } from "../../../redux/modules/User/actions";
import { IMAGE_TYPES } from "../../../helpers/consts";
import { compressImage } from "../../../helpers/functions";
import Translate from "../../../Translate";

const Demo = ({ close }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, set_loading] = useState(false);
  const [srcPreview, set_srcPreview] = useState("");
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.User);

  const onChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 1) {
      newFileList.shift();
    }

    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    set_srcPreview(src);

    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileList((prev) => [...prev, { url: reader.result }]);
    };

    // then upload `file` from the argument manually
    return false;
  };
  return (
    <div className={"addUserImage"}>
      <Spin spinning={loading}>
        <ImgCrop
          onModalOk={(a, b, c, d) => {
          }}
          onUploadFail={(a, b, c, d) => {
          }}
          onModalCancel={(a, b, c, d) => {
          }}
          rotate
        >
          <img src="https://api.joker-transport.com/mediafiles/images/zaKuma_yGGVfsX.png" />
        </ImgCrop>
        <div style={{ textAlign: "center" }}>
          <Button
            disabled={!fileList.length}
            onClick={() => {
              set_loading(true);
              const formData = new FormData();

              formData.append(
                "data",
                JSON.stringify({ avatar: "profile_img" })
              );
              fileList.forEach(async (file) => {
                const tmp = file.thumbUrl.split(",");

                formData.append("files", tmp[1]);

                // const base64Response = await fetch(`${tmp[0]},${tmp[1]}`);
                // const blob = await base64Response.blob();
                // if (IMAGE_TYPES.includes(file.type)) {
                //   // _file = await compressImage(blob);
                //   console.log(_file, blob);
                // }
              });

              axios
                .post(`${getApiEndpoint()}accounts/avatar/`, formData, {
                  timeout: 15000,
                  headers: {
                    "content-type":
                      "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
                    Authorization: "Token " + user.data.token,
                  },
                })
                .then((res) => {
                  // update redux

                  const arr = [...user.data.account.company.contact_accounts];
                  const index = arr.findIndex(
                    (x) => x.id === user.data.account.id
                  );
                  arr[index] = { ...arr[index], avatar: res.data.avatar };

                  const data = {
                    ...user.data,
                    account: {
                      ...user.data.account,
                      avatar: res.data.avatar,
                      company: {
                        ...user.data.account.company,
                        contact_accounts: arr,
                      },
                    },
                  };

                  dispatch({ type: GET_USER_SUCCESS, data });
                  set_loading(false);
                  close();
                })
                .catch((err) => {
                  message.error("Dogodila se greška kod spremanja", 3);
                  console.log(err);
                });
            }}
          >
           <Translate textKey={"save_butt"} />
          </Button>
        </div>
      </Spin>
    </div>
  );
};

export default Demo;


