import { ConsoleSqlOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getApiEndpoint } from "../../../../axios/endpoints";
import { IMAGE_TYPES } from "../../../../helpers/consts";
import { compressImage } from "../../../../helpers/functions";
import { ONE_STOCK_SUCCESS } from "../../../../redux/modules/Transport/actions";
import Compressor from 'compressorjs';
import Translate from "../../../../Translate";

const AddImage = ({ close }) => {
  const dispatch = useDispatch();

  const [loading, set_loading] = useState(false);
  const [files, set_files] = useState([]);

  const oneStock = useSelector((state) => state.Transport.oneStock);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Upload
        multiple={true}
        beforeUpload={(file, _files) => {
          set_files([...files, ..._files]);
          return false;
        }}
        showUploadList={true}
        fileList={files}
        onRemove={(file) => {
          const index = files.findIndex((x) => x === file);
          const arr = [...files];
          arr.splice(index, 1);
          set_files(arr);
        }}
      >
        <Button icon={<UploadOutlined />}><Translate textKey={"upload_butt"}  /> </Button>
      </Upload>
      <Button
        loading={loading}
        onClick={async () => {
          set_loading(true);
          const formData = new FormData();
          const token = await localStorage.getItem("token");

          // Image compression
          async function imageCompress (file, callback) {
            let image = file
            if(IMAGE_TYPES.includes(file.type)){
              image = await compressImage(file)
            }
            formData.append("files", image);

            // Resolving promise
            callback()
          }

          let requests = files.reduce((promiseChain, item) => {
            return promiseChain.then(() => new Promise((resolve) => {
              imageCompress(item, resolve);
            }));
          }, Promise.resolve());
        
          // Call axios after all requests
          requests.then(() =>
            axios
              .post(
                `${getApiEndpoint()}transport/stock/${oneStock.data.id}/images/`,
                formData,
                { headers: { Authorization: "Token " + token } }
              )
              .then((res) => {
                const data = { ...oneStock.data, images: res.data.images };

                dispatch({ type: ONE_STOCK_SUCCESS, data });
                set_loading(false);
                close();
              })
              .catch((err) => {
                console.log(err);
                message.error("Dogodila se greška kod spremanja slika", 3);
                set_loading(false);
              })
          )
        }}
      >
        <Translate textKey={"save_butt"} />
      </Button>
    </div>
  );
};

export default AddImage;
