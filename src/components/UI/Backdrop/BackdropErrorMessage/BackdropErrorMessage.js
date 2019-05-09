import React from "react";
import { Segment, Button } from "semantic-ui-react";

import styles from "./BackdropErrorMessage.module.css";

const backdropErrorMessage = props => (
  <Segment textAlign="center" className={styles.BackdropError}>
    <h1>Error</h1>
    {props.children}
    <Button onClick={props.click} basic color="grey">
      Try Again
    </Button>
  </Segment>
);

export default backdropErrorMessage;
