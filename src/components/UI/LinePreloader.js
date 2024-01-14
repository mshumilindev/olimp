import React from "react";

const LinePreloader = ({ prefix = "", height = "100%" }) => {
  return (
    <div className={prefix + "linePreloader"} style={{ height: height }} />
  );
};

export default LinePreloader;
