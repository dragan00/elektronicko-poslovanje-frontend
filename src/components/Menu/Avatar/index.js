import React, { useState, useMemo } from "react";
import useDevice from "../../../helpers/useDevice";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../../redux/modules/User/actions";

// UI
import { Collapse, Popover } from "antd";
import styles from "../menu.module.css";

// Icons
import visitProfile from "../../../assets/icons/visit_profile.png";
import logout from "../../../assets/icons/logout.png";

const { Panel } = Collapse;

export default function Avatar({ onClose, children }) {
  // Variables
  const device = useDevice();
  const history = useHistory();
  const dispatch = useDispatch();
  const [popoverVisible, setPopoverVisible] = useState(false);

  // Methods
  function handleVisibleChange(visible) {
    setPopoverVisible(visible);
  }

  const content = useMemo(() => {
    // Methods
    function handleVisitProfile(event) {
      event.stopPropagation();
      history.push("/profile/about");
      setPopoverVisible(false);
      if (device === "mobile") {
        onClose();
      }
    }

    function handleLogout(event) {
      event.stopPropagation();
      setPopoverVisible(false);
      if (device === "mobile") {
        onClose();
      }

      history.replace("/logout");
    }

    return (
      <div id={styles.avatar}>
        <div className={styles.menu}>
          <>
            {/* Edit user */}
            <div className={styles.menuItem} onClick={handleVisitProfile}>
              <img
                src={visitProfile}
                alt="Edit user"
                className={styles.menuItemIcon}
              />
              <p className={styles.menuItemText}>Pogledajte profil</p>
            </div>

            {/* Delete user */}
            <div className={styles.menuItem} onClick={handleLogout}>
              <img
                src={logout}
                alt="Delete user"
                className={styles.menuItemIcon}
              />
              <p className={styles.menuItemText}>Odjava</p>
            </div>
          </>
        </div>
      </div>
    );
  }, []);

  return (
    <Popover
      id="uwacPopover"
      content={content}
      trigger="click"
      visible={popoverVisible}
      onClick={(event) => event.stopPropagation()}
      onVisibleChange={handleVisibleChange}
      placement={device === "desktop" ? "topLeft" : "topRight"}
    >
      {children}
    </Popover>
  );
}
