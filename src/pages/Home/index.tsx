import React from "react";

import PopularSection from "./PopularSection";

import styles from "./Home.module.scss";

function Home() {
  return (
    <div className={styles.Home}>
      <div className={styles.TrendingAndInterests}></div>
      <PopularSection />
    </div>
  );
}

export default Home;
