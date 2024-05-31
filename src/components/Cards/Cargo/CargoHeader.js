import React from "react";

// UI
import { Tooltip } from 'antd'
import styles from "../card.module.css";

// Icons
import Date from '../../../assets/icons/card_calendar.png'
import Start from '../../../assets/icons/card_start.png'
import Stop from '../../../assets/icons/card_stop.png'
import Length from '../../../assets/icons/card_length.png'
import Weight from '../../../assets/icons/card_weight.png'
import Width from '../../../assets/icons/card_width.png'
import Auction from '../../../assets/icons/card_auction.png'
import LoadUnload from '../../../assets/icons/card_load_unload.png'
import Translate from "../../../Translate";


export default function Cargo() {

  return (
    <div layout className={styles.cargo}>
      <div style={{ width: "100%" }}>
        <div id={styles.cargoHeader}>
          <div className={styles.mainInfo} style={{ height: 32 }}>
            {/* Datum */}
            <Tooltip title={<Translate textKey={"date"} />}>
              <div
                style={{ width: "10%" }}
                className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo}`}
              >
                <img src={Date} className={styles.cardIcon} />
              </div>
            </Tooltip>

            {/* Polazište */}
            <Tooltip title={<Translate textKey="departure" />} placement="topLeft">
              <div className={`${styles.placeItem}`}>
                <img src={Start} className={styles.cardIcon} style={{ marginLeft: 8 }} />
              </div>
            </Tooltip>

            {/* Odredište */}
            <Tooltip title={<Translate textKey={"arrival"} />} placement="topLeft">
              <div className={styles.placeItem}>
                <img src={Stop} className={styles.cardIcon} style={{ marginLeft: 8 }} />
              </div>
            </Tooltip>

            {/* Dužina */}
            <Tooltip title={<Translate textKey={"length"} />}>
              <div className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo}`}>
                <img src={Length} className={styles.cardIcon} />
              </div>
            </Tooltip>

            {/* Težina */}
            <Tooltip title={<Translate textKey={"weight"} />}>
              <div className={styles.cardTabInfo}>
                <img src={Weight} className={styles.cardIcon} />
              </div>
            </Tooltip>

            {/* Širina */}
            <Tooltip title={<Translate textKey={"width"} />}>
              <div className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo}`}>
                <img src={Width} className={styles.cardIcon} />
              </div>
            </Tooltip>

            {/* Aukcija */}
            <Tooltip title={<Translate textKey={"auction"} />}>
              <div className={styles.cardTabInfo}>
                <img src={Auction} className={styles.cardIcon} />
              </div>
            </Tooltip>

            {/* Utovar / istovar */}
            <Tooltip title={<Translate textKey={"load_unload_places"} />}>
              <div className={`${styles.backgroundCardTabInfo} ${styles.cardTabInfo}`}>
                <img src={LoadUnload} className={styles.cardIcon} />
              </div>
            </Tooltip>

          </div>
        </div>
      </div>
    </div>
  );
}
