import React, { useState } from "react";

const ProgressBar = (props) => {
  const [start, setStart] = useState(false);
  const { bgcolor, completed, image } = props;

  const containerStyles = {
    height: 15,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 30,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
  };

  const labelStyles = {
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles} id="filler-progress-bar">
        <span style={labelStyles}>
          <img
            src={image}
            referrerPolicy="no-referrer"
            style={{
              height: "23px",
              width: "23px",
              borderRadius: "60px",
              position: "relative",
              bottom: "4px",
            }}
            onLoad={() => {
              setStart(true);
            }}
            alt="A"
          ></img>
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
