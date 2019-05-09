import React from "react";
import { Progress } from "semantic-ui-react";

const progressBar = ({ uploadState, percentUploaded }) => {
  if (uploadState === "uploading") {
    return (
      <Progress
        style={{ margin: "0.3em 0 0 0" }}
        percent={percentUploaded}
        progress
        indicating
        size="small"
        inverted
      />
    );
  } else {
    return null;
  }
};

export default progressBar;
