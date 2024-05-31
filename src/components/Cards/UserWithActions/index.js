import React, { useState, useMemo } from "react";
import useDevice from "../../../helpers/useDevice";
import ImgCrop from "./ImgCrop";

// UI
import { Collapse, Space, Popover, Image } from "antd";
import styles from "../card.module.css";
import { colors } from "../../../styles/colors";

// Icons
import MoreIcon from "../../../assets/icons/more_dots_green.png";

// Components
import More from "../../Buttons/Icon";
import Information from "../Information";
import Content from "./content";
import Modal from "antd/lib/modal/Modal";
import { getApiEndpoint, getFilesRoute } from "../../../axios/endpoints";
import Translate from "../../../Translate";

const { Panel } = Collapse;

export default function User({
  user,
  color="purple",
  collapsed = false,
  onEdit,
  onRemove,
  currentUser,
}) {
  // Variables
  const device = useDevice();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [addUserImage, set_addUserImage] = useState(false);

  // Methods
  function handleVisibleChange(visible) {
    setPopoverVisible(visible);
  }

  function handleOnMore(e) {
    e.stopPropagation();
    setPopoverVisible((previousState) => !previousState);
  }

  const cardIcon = useMemo(() => {

    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleOnClick(event) {
      event.stopPropagation()
      set_addUserImage(!addUserImage);
    }

    // Getting initials
    let initials = user.name
      .split(" ")
      .map((name) => name[0])
      .join("");

    return (
      <div>
        <div
          onClick={handleOnClick}
          className={styles.userIcon}
          style={{ backgroundColor: colors[`light${capitalize(color)}`] }}
        >
          {user.avatar ? (
            <Image preview={false} src={`${getFilesRoute() + user.avatar}`} />
          ) : (
            <h1 className={styles.initials} style={{ color: colors[color] }}>
              {initials}
            </h1>
          )}
        </div>
        <div className={styles.uwaEdit}>
          <More icon={MoreIcon} onClick={handleOnMore} />
        </div>
      </div>
    );
  }, [color, user]);

  const extra = currentUser.id === user.id && (
    <Popover
      id="uwacPopover"
      content={
        <Content
          onEdit={onEdit}
          onRemove={onRemove}
          setPopoverVisible={setPopoverVisible}
        />
      }
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={handleVisibleChange}
      placement={device === "desktop" ? "left" : "topRight"}
    >
      {cardIcon}
    </Popover>
  );

  return (
    <>
      <Collapse
        bordered={false}
        className="site-collapse-custom-collapse-multiple"
        expandIconPosition="right"
        defaultActiveKey={["opened"]}
      >
        <Panel
          header={user.name}
          key={collapsed ? "collapsed" : "opened"}
          className="site-collapse-custom-panel-multiple"
          extra={extra}
        >
          <div id={styles.user}>
            <Space direction="vertical">
              {/* Broj telefona */}
              <Information
                label={<Translate textKey={"phone_number"}  />}
                information={user.phone_number || "-"}
                tel={true}
              />

              {/* E-mail adresa */}
              <Information
                label={<Translate textKey={"mail"} /> }
                information={user.email || "-"}
              />

              {/* Jezici */}
              <Information
                label="Jezici"
                information={user.languages.map((x) => x.name).join(" ")}
              />
            </Space>
          </div>
        </Panel>
      </Collapse>
      <Modal
        closable={false}
        footer={null}
        onCancel={() => {
          set_addUserImage(false);
        }}
        visible={addUserImage}
        destroyOnClose={true}
      >
        <ImgCrop
          close={() => {
            set_addUserImage(false);
          }}
        />
      </Modal>
    </>
  );
}
