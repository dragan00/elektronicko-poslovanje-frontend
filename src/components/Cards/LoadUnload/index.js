import React, { useMemo, useState } from "react";
import { useToggle } from "react-use";
import useDevice from "../../../helpers/useDevice";

// UI
import styles from "../card.module.css";
import { Modal, Tooltip } from "antd";
import Tag from "../../Tags/Basic";
import More from "../../Buttons/Icon";

// Icons
import Load from "../../../assets/icons/load.png";
import Unload from "../../../assets/icons/unload.png";
import MoreIcon from "../../../assets/icons/more_dots.png";
import Translate from "../../../Translate";

export default function Profile({ load, unload }) {

  // Variables
  const [tagsVisible, toggleTagsVisible] = useToggle(false);
  const [typeClicked, setTypeClicked] = useState("");
  const device = useDevice();
  const isMobile = device === 'mobile'
  const TAGS_LENGTH = device === "desktop" ? 4 : 1;
  const COUNTRIES_LENGTH = 3

  // Methods
  function showModal(type) {
    toggleTagsVisible();
    setTypeClicked(type);
  }

  // Styles
  const maskStyle = isMobile && {
    backgroundColor: "#ffffff40",
    backdropFilter: "blur(10px)",
  }

  const LOAD = useMemo(() => {
    let arr = [...load.map(item => item.city)];
    arr.length = TAGS_LENGTH;

    const noCities = load.every(item => item.city === null)

    return (
      <div className={styles.flexRowCenter}>
        {
          !noCities ?
            <>
              {
                arr.map((item, index) => {
                  return <Tag text={item || "-"} size={isMobile ? 'small' : 'medium'} marginRight={4} key={index} />;
                })
              }
              {
                load.length > arr.length && (
                  <More icon={MoreIcon} onClick={() => showModal("load")} />
                )
              }
            </>
            :
            <h5 style={{ opacity: .4 }}><Translate textKey={"cities_are_not_selected"} /></h5>
        }
        
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const LOAD_MORE_TAGS = useMemo(() => {
    return (
      <div className={styles.loadMoreTags}>
        {load.map((item, index) => (
          <div key={index} className={styles.moreTagsContainer}>
            {/* <NumberTag count={index + 1} /> */}
            <p className={styles.city}>{`${item.country.name}, ${item.city || "-"}`}</p>
            <p className={styles.country}>{ item.zip_code || "-" }</p>
          </div>
        ))}
      </div>
    );
  });

  const UNLOAD = useMemo(() => {
    let arr = [...unload.map(item => item.city)];
    arr.length = TAGS_LENGTH;

    const noCities = unload.every(item => item.city === null)

    return (
      <div className={styles.flexRowCenter}>
        {
          !noCities ? 
            <>
              {
                arr.map((item, index) => {
                  return <Tag text={item || "-"} size={isMobile ? 'small' : 'medium'} marginRight={4} key={index} />;
                })
              }
              {
                unload.length > arr.length && (
                  <More icon={MoreIcon} onClick={() => showModal("unload")} />
                )
              }
            </>
            :
            <h5 style={{ opacity: .4 }}><Translate textKey={"cities_are_not_selected"} /></h5>
        }
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const UNLOAD_MORE_TAGS = useMemo(() => {
    return (
      <div>
        {unload.map((item, index) => (
          <div key={index} className={styles.moreTagsContainer}>
            {/* <NumberTag count={index + 1} /> */}
            <p className={styles.city}>{`${item.country.name}, ${item.city || "-"}`}</p>
            <p className={styles.country}>{ item.zip_code || "-" }</p>
          </div>
        ))}
      </div>
    );
  }, [unload]);

  const LOAD_COUNTRIES = useMemo(() => {

    let arr = [...load.map(item => item.country.alpha2Code)];
    arr.length = COUNTRIES_LENGTH;

    return (
      <div className={styles.flexRow}>
        { !isMobile && <img className={styles.icon} src={Load} alt="Load" /> }
        <p className={styles.countries}>
          {
            isMobile ?
              load.length > 1 ? 
                load.length > arr.length ? 
                  `${arr.map(item => item).join(", ")}...` : 
                  load.map(item => item.country.alpha2Code).join(", ") : 
                load[0]?.country.alpha2Code :
              load?.map(item => item.country.name).join(", ")
          }
        </p>
      </div>
    );
  }, [load]);

  const UNLOAD_COUNTRIES = useMemo(() => {

    let arr = [...load.map(item => item.country.alpha2Code)];
    arr.length = COUNTRIES_LENGTH;

    return (
      <div className={styles.flexRow}>
        { !isMobile && <img className={styles.icon} src={Unload} alt="Load" /> }
        <p className={styles.countries}>
          {
            isMobile ?
              unload.length > 1 ? 
                unload.length > arr.length ? 
                  `${arr.map(item => item).join(", ")}...` : 
                  unload.map(item => item.country.alpha2Code).join(", ") : 
                unload[0]?.country.alpha2Code :
              unload?.map(item => item.country.name).join(", ")
          }
        </p>
      </div>
    );
  }, [unload]);

  return (
    <div id={styles.loadUnloadCard}>
      <div id={styles.loadUnload}>
        <div className={styles.load}>
          {/* Countries */}
          {LOAD_COUNTRIES}

          {/* Cities */}
          {LOAD}

          {/* Date */}
          <div className={styles.flexRowEnd}>
            <p className={styles.date}>{load[0]?.date === 'Invalid date' ? '-' : load[0]?.date}</p>
          </div>
        </div>
        <div className={styles.unload}>
          {/* Countries */}
          {UNLOAD_COUNTRIES}

          {/* Cities */}
          {UNLOAD}

          {/* Date */}
          <div className={styles.flexRowEnd}>
            <p className={styles.date}>{unload[0]?.date === 'Invalid date' ? '-' : unload[0]?.date}</p>
          </div>
        </div>
      </div>

      <Modal
        title={typeClicked === "load" ? <Translate  textKey={"departure_places"} />: <Translate  textKey={"arrival_places"} />}
        visible={tagsVisible}
        footer={null}
        onCancel={toggleTagsVisible}
        centered
        maskStyle={maskStyle}
      >
        <div id={styles.modalContainer}>
          {typeClicked === "load" ? LOAD_MORE_TAGS : UNLOAD_MORE_TAGS}
        </div>
      </Modal>
    </div>
  );
}
