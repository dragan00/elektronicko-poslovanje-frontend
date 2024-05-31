import { CloseSquareOutlined } from "@ant-design/icons";
import React, { memo, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useDevice from "../helpers/useDevice";

import Close from '../assets/icons/close_outlined.png'



const CustomDrawer = ({ onClose, visible, children, title }) => {
  const [_visible, set_visible] = useState(visible);

  const history = useHistory();
  const location = useLocation();
  const device = useDevice();

  const close = () => {
    onClose();
    set_visible(false);
  };

  const customDrawer = "customDrawer";
  const slideDrawer = device === "desktop" ? "slideDrawer" : "slideDrawer";

  let rendered = useRef(false);

  useEffect(() => {
    if (visible) {
      set_visible(true);
    } else {
      if (rendered.current) {
        if (location.hash === "#drawer") {
          history.goBack();
        }
        close();
      }
      rendered.current = true;
    }
  }, [visible]);

  return (
    <div
      className={`mobileDrawer ${customDrawer} ${_visible ? slideDrawer : ""}`}
    >
      <div className="customDrawerInner">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h3>{title}</h3>
          <div className="pointer" onClick={() => close(false)} style={{ padding: 12 }}>
          <img  style={{width: 27, height: 27}} src={Close} />

          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default memo(
  CustomDrawer,
  ({ visible }, newState) => visible === newState.visible
);
