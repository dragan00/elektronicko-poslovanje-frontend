import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import useDevice from "../../../helpers/useDevice";

// UI
import { Upload, message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../input.module.css";
import { colors } from "../../../styles/colors";

// Components
import Tag from "../../Tags/Basic";
import Plus from "../../Buttons/Plus";

// Icons
import arrow from "../../../assets/icons/arrow.png";
import { compressImage } from "../../../helpers/functions";
import Translate from "../../../Translate";

export default function UploadInput({
  label = "",
  icon,
  value = [],
  tag = "",
  name = "",
  inForm = false,
  width = "100%",
  type = "document",
  maxCount = 1,
  multiple,
  beforeUploadFile,
  onRemove,
  mode,
}) {
  // useEffect(() => {
  //   setFileList(value || []);
  // }, [value]);
  // Variables
  const device = useDevice();
  const [formVisible, toggleFormVisible] = useToggle(false);
  const [fileList, setFileList] = useState([]);

  // Methods
  async function beforeUpload(file, files) {
    if (!ALLOWED_FILE_TYPES[type].includes(file.type)) {
      message.error(`${file.name} nema odgovarajuću ekstenziju.`);
      return Upload.LIST_IGNORE;
    }
    setFileList((prevArray) => [...prevArray, file]);
    console.log("FILE LIST => ", files)
    beforeUploadFile(file, files)

    return false;
  }

  function removeFile(file) {
    let list = fileList.concat();
    const index = list.indexOf(file);
    list.splice(index, 1);
    setFileList(list);
    onRemove(file);
  }

  // Styles
  const activeStyles = {
    transform: value.length && `translateY(${-30}px)`,
    color: value.length ? colors.purple : inForm ? "#bfbfbf" : colors.grey,
  };

  const inputStyle = {
    borderColor: inForm
      ? formVisible
        ? "transparent"
        : colors.lightGrey
      : formVisible
      ? "transparent"
      : colors.grey,
    padding: formVisible ? "14px 0" : 10,
    height: formVisible ? "max-content" : 48,
    width,
  };

  return (
    <div className={"multipleWarhouseNesto"} id={styles.multiple}>
      {/* Input mockup */}
      <div className={styles.inputMockup} style={inputStyle}>
        {/* Form */}
        <AnimatePresence>
          {formVisible ? (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={wrapper}
              transition={{ delay: 0.15 }}
              className={styles.formWrapper}
            >
              <div className={styles.formDiv} style={{ marginBottom: -16 }}>
                <motion.div
                  initial={itemInitial}
                  animate={itemAnimate}
                  exit={itemInitial}
                  transition={{ duration: 0.25, delay: 0.15 }}
                >
                  <img
                    className={styles.formIcon}
                    src={icon}
                    alt="Folder icon"
                  />
                </motion.div>

                <motion.div
                  initial={itemInitial}
                  animate={itemAnimate}
                  exit={itemInitial}
                  transition={{ duration: 0.25, delay: 0.2 }}
                  style={{ flex: 1 }}
                >
                  <Tag text={`${value.length} ${tag}`} color="purple" />
                </motion.div>

                <motion.div
                  onClick={toggleFormVisible}
                  initial={itemInitial}
                  animate={itemAnimate}
                  exit={itemInitial}
                  transition={{ duration: 0.25, delay: 0.3 }}
                >
                  <img
                    className={styles.collapseArrow}
                    src={arrow}
                    alt="Folder icon"
                  />
                </motion.div>
              </div>

              <Upload
                beforeUpload={(file, files) => beforeUpload(file, files)}
                onRemove={removeFile}
                multiple={multiple}
                fileList={fileList}
                showUploadList={true}
                maxCount={maxCount}
                accept={".png,.jpg,.jpeg,.pdf"}
              >
                <motion.div
                  initial={itemInitial}
                  animate={itemAnimate}
                  exit={itemInitial}
                  transition={{ duration: 0.25, delay: 0.25 }}
                  className={styles.addDocument}
                  style={{
                    right: inForm ? (device === "mobile" ? 36 : 64) : 36,
                  }}
                >
                  <Plus size="small" />
                </motion.div>

                {!fileList.length && (
                  <p className={styles.addDocumentLabel}>
                    Pritisnite + ikonu da biste dodali {TEXT[type].extension}{" "}
                    <br />
                    Dopuštene ekstenzije su:
                    <span style={{ color: colors.purple }}>
                      &nbsp;{ALLOWED_EXTENSIONS[type].split(",").join(" ")}
                    </span>
                  </p>
                )}
              </Upload>
            </motion.div>
          ) : (
            <div className={styles.flexRow}>
              <p className={styles.multipleLabel} style={activeStyles}>
                {label}
              </p>
              {value.length ? (
                <p className={styles.multipleLabelCount}>
                  {TEXT[type].added} su
                  <span style={{ color: colors.purple }}> {value.length} </span>
                  {TEXT[type].extension}
                </p>
              ) : null}
              <Plus onClick={toggleFormVisible} size="small" />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Constants
const ALLOWED_EXTENSIONS = {
  document: ".pdf,.xlsx",
  photo: ".jpg,.png",
};
const ALLOWED_FILE_TYPES = {
  document: [
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // EXCEL
  ],
  photo: [
    "image/jpeg", // JPG
    "image/png", // PNG
  ],
};
const TEXT = {
  document: {
    extension: "dokument",
    added: "Dodana",
  },
  photo: {
    extension: <Translate textKey={"picture_low"}  />,
    added: "Dodane",
  },
};

const wrapper = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const itemAnimate = {
  opacity: 1,
  y: 0,
};

const itemInitial = {
  opacity: 0,
  y: 20,
};
