import React from "react";

import logoConnector from "../../../assets/Logo/ConnectorLogo.png";
import style from "./Logo.module.css";

const logo = () => (
  <img className={style.Logo} src={logoConnector} alt="Connector" />
);

export default logo;
