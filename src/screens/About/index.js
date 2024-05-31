import React from "react";

// UI
import styles from "./about.module.css";
import Loader from "../../components/Loaders/Page";
import CustomVerticalDevider from "../../components/CustomVerticalDevider";
import { iOS } from "../../helpers/functions";
import Translate from "../../Translate";

export default function About() {
  // Loading
  if (false) {
    return <Loader />;
  }

  return (
    <div className="profile" id={styles.about}>
      <h2 className={styles.header}><Translate textKey={"basic_info"} /></h2>
      {/* <div className={styles.flexRow}>
        <div className={styles.information}>
          <p className={styles.label}><Translate textKey={"phone_number"} /></p>
          <p className={styles.value}>+387 39 706 787</p>
          <p className={styles.value}>+387 39 706 787</p>
        </div>
        <div className={styles.information}>
          <p className={styles.label}><Translate textKey={"phone_number"} /></p>
          <p className={styles.value}>+387 39 706 787</p>
          <p className={styles.value}>+387 39 706 787</p>
        </div>
      </div> */}
      <div className={styles.flexRow}>
        <div className={styles.information}>
          <p className={styles.label}><Translate textKey={"email"} /></p>
          <p className={styles.value}>info@joker-transport.com</p>
        </div>
      </div>

      {/* <h2 className={styles.header}><Translate textKey={"use_conditions"}  /></h2>
      <p className={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. At nulla semper
        aliquam mattis viverra egestas. Nisl eget maecenas pulvinar vel nulla.
        Id eu dignissim praesent sed sed semper. Convallis nibh adipiscing
        ultrices dui, dolor, cursus neque. Tellus mattis eget consequat tortor.
        Ullamcorper sodales nam turpis viverra pulvinar. Diam massa.
      </p>

      <h2 className={styles.header}><Translate textKey={"use_instructions"}  /></h2>
      <p className={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. At nulla semper
        aliquam mattis viverra egestas. Nisl eget maecenas pulvinar vel nulla.
        Id eu dignissim praesent sed sed semper. Convallis nibh adipiscing
        ultrices dui, dolor, cursus neque. Tellus mattis eget consequat tortor.
        Ullamcorper sodales nam turpis viverra pulvinar. Diam massa.
      </p> */}

      {/* Padding  */}
      <div style={{ height: 40 }} />

      <CustomVerticalDevider height={60} bottomExtend={iOS() ? 145 : 0} />
    </div>
  );
}
