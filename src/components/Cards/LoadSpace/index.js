import React, { useRef, useState } from "react";
import { ADD_STATUSES, DATE_FORMAT, LOAD_SPACE_PLACE_TYPE } from "../../../helpers/consts";
import styles from "../card.module.css";
import { AnimatePresence } from "framer-motion";
import CardPlace from "../Cargo/CardPlace";
import moment from "moment";
import UnderCard from "./UnderCard";
import useDevice from "../../../helpers/useDevice";
import MyAdd from "../MyAdd";
import { unstable_batchedUpdates } from "react-dom";

const Card = ({ item, currentUser }) => {
  // Variables
  const [isOpen, setIsOpen] = useState(false);

  const device = useDevice();
  const [
    scrollPositionBeforeDivOpen,
    set_scrollPositionBeforeDivOpen,
  ] = useState(0);

  const element = useRef(<div></div>);

  const scrollRefCard = useRef();

  // Methods
  const toggle = () => {
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
  };

  const scroll = () => {
    scrollRefCard.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!item) {
    return null;
  }

  const start =
    item.starting_point_destination &&
    item.starting_point_destination.filter(
      (x) => x.type === LOAD_SPACE_PLACE_TYPE.START
    );

  const end =
    item.starting_point_destination &&
    item.starting_point_destination.filter(
      (x) => x.type === LOAD_SPACE_PLACE_TYPE.DESTINATION
    );

  return (
    <AnimatePresence>
      <div layout onClick={toggle} className={`${styles.cargo}`}>
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
                <span
                  style={{ fontSize: device === "mobile" && "9px" }}
                  className={styles.label}
                >
                  {start[0]?.departure_datetime && device === "mobile"
                    ? moment(start[0]?.departure_datetime).format("DD-MM")
                    : moment(start[0]?.departure_datetime).format(DATE_FORMAT)}
                </span>
              </div>
              <div className={`${styles.placeItem} ${item.status}`}>
                <CardPlace places={start} />
              </div>
              <div className={`${styles.placeItem} ${item.status}`}>
                <CardPlace places={end} noBorder />
              </div>
              <div
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo} ${item.status}`}
              >
                {item.vehicle_length || "-"}
              </div>
              <div className={`${styles.cardTabInfo} ${item.status}`}>
                {" "}
                {item.vehicle_load_capacity || "-"}
              </div>
              <div
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo} ${item.status}`}
              >
                {item.connected_vehicle_length || "-"}
              </div>
              <div className={`${styles.cardTabInfo} ${item.status}`}>
                {item.connected_vehicle_load_capacity || "-"}
              </div>
              <div
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo} ${item.status}`}
              >
                {`${start.length}/${end.length}`}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <UnderCard
          scroll={scroll}
          item={item}
          owner={item.company.id === currentUser?.account.company.id}
        />
      )}
    </AnimatePresence>
  );
};

export default Card;
