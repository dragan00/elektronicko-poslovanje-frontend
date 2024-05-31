import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

// UI
import styles from "../card.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { ADD_STATUSES, CARGO_PLACE_TYPE, DATE_FORMAT } from "../../../helpers/consts";
import CardPlace from "./CardPlace";
import UnderCard from "./UnderCard";
import useDevice from "../../../helpers/useDevice";
import MyAdd from "../MyAdd";
import { colors } from "../../../styles/colors";
import { unstable_batchedUpdates } from "react-dom";
import Translate from "../../../Translate";

export default function Cargo({ item, currentUser }) {
  // Variables
  const device = useDevice();
  const [isOpen, setIsOpen] = useState(false);
  const [
    scrollPositionBeforeDivOpen,
    set_scrollPositionBeforeDivOpen,
  ] = useState(0);

  const element = useRef(<div></div>);

  const scrollRefCard = useRef();

  // Methods
  function toggle(e) {
    if (!isOpen) {
      // kod scrolanja oglasa da uvijek oglas ukoliko se dojnji otvori da se prikaže scrolat ce se preko cijelog ekrana kada se zatvori porebno je vartiti element na staru poziciju stoga ga odmah bindam u state profil div koji je citav scroll
      let elements = document.getElementsByClassName("profile");
      for (let index = 0; index < elements.length; index++) {
        element.current = elements[index];
      }
      unstable_batchedUpdates(() => {
        set_scrollPositionBeforeDivOpen(element.current.scrollTop);
        setIsOpen(!isOpen);
      }, []);
    } else {
      setIsOpen(!isOpen);
      element.current.scroll({
        top: scrollPositionBeforeDivOpen,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  const scroll = () => {
    scrollRefCard?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!item) {
    return null;
  }

  const loads =
    item.load_unload &&
    item.load_unload.filter((x) => x.type === CARGO_PLACE_TYPE.LOAD);

  const unloads =
    item.load_unload &&
    item.load_unload.filter((x) => x.type === CARGO_PLACE_TYPE.UNLOAD);

  return (
    <AnimatePresence>
      <div className={`${styles.cargo}`} layout onClick={toggle}>
        <div
          style={{
            width: "100%",
            opacity: item.status === ADD_STATUSES.CLOSED ? 0.6 : 1,
          }}
        >
          <div
            ref={scrollRefCard}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              justifyItems: "center",
              width: "100%",
            }}
          >
            <div className={styles.mainInfo}>
              {!!currentUser && (
                <MyAdd
                  itemCompanyId={item.company.id}
                  currentUserCompanyId={currentUser.account.company.id}
                />
              )}
              <div
                style={{ width: "10%" }}
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo} ${item.status}`}
              >
                {loads[0]?.start_datetime && (
                  <span
                    style={{ fontSize: device === "mobile" && "9px" }}
                    className={styles.label}
                  >
                    {device === "mobile"
                      ? moment(loads[0]?.start_datetime).format("DD-MM")
                      : moment(loads[0]?.start_datetime).format(DATE_FORMAT)}
                  </span>
                )}
              </div>
              <div className={`${styles.placeItem} ${item.status}`}>
                <CardPlace places={loads} />
              </div>
              <div className={`${styles.placeItem}  ${item.status}`}>
                <CardPlace places={unloads} noBorder />
              </div>
              <div
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo}  ${item.status}`}
              >
                {item.length}
              </div>
              <div className={`${styles.cardTabInfo} ${item.status}`}>
                {item.weight}
              </div>
              <div
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo} ${item.status}`}
              >
                {item.width}
              </div>
              <div
                className={`${styles.cardTabInfo}  ${item.status}`}
                style={{ color: item.auction && colors.purple }}
              >
                {item.auction ? <Translate textKey={"yes_flag"} /> : <Translate textKey={"no_flag"} />}
              </div>
              <div
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo} ${item.status}`}
              >
                {`${loads.length}/${unloads.length}`}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (  
        <UnderCard
          scroll={scroll}
          style={{ display: isOpen ? "" : none }}
          item={item}
          owner={item.company.id === currentUser?.account.company.id}
        />
      )}
    </AnimatePresence>
  );
}
