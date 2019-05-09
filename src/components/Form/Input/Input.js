import React from "react";
import { Form } from "semantic-ui-react";

import styles from "./Input.module.css";

const input = props => (
  <Form.Input
    fluid
    className={[styles.Input, styles.Icon].join(" ")}
    name={props.name}
    icon={props.icon}
    iconPosition={props.iconPosition}
    placeholder={props.placeholder}
    onChange={props.clicked}
    type={props.type}
  />
);

export default input;
