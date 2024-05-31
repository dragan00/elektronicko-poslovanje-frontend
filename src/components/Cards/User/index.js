import React, { useMemo } from "react";

// UI
import { Collapse, Space, Image } from "antd";
import styles from "../card.module.css";
import { colors } from "../../../styles/colors";

// Components
import Information from "../Information";
import { getApiEndpoint, getFilesRoute } from "../../../axios/endpoints";
import Translate from "../../../Translate";

const { Panel } = Collapse;

export default function User({ color = "purple", collapsed = false, user }) {
  // Methods
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  const cardIcon = useMemo(() => {
    // Getting initials
    let initials = user?.name
      .split(" ")
      .map((name) => name[0])
      .join("");

    return (
      <div
        className={styles.userIcon}
        style={{ backgroundColor: colors[`light${capitalize(color)}`] }}
      >
        {user.avatar ? (
          <Image src={`${getFilesRoute() + user.avatar}`} />
        ) : (
          <h1 className={styles.initials} style={{ color: colors[color] }}>
            {initials}
          </h1>
        )}
      </div>
    );
  }, [color, user]);

  return (
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
        extra={cardIcon}
      >
        <div id={styles.user}>
          <Space direction="vertical">
            {/* Broj telefona */}
            <Information
              label={<Translate textKey={"phone_number"}  />}
              information={user.phone_number}
              tel={true}
            />

            {/* E-mail adresa */}
            <Information label={<Translate textKey={"mail"} />} information={user.email} />

            {/* Jezici */}
            <Information
              label="Jezici"
              information={user.languages?.map((x) => x.name).join(" ")}
            />
          </Space>
        </div>
      </Panel>
    </Collapse>
  );
}
