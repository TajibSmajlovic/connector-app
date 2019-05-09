import React from "react";
import { Link } from "react-router-dom";

import logoConnector from "../../../assets/Logo/ConnectorLogo.png";
import style from "./Logo.module.css";

const logo = () => (
  <Link to="/">
    <img className={style.Logo} src={logoConnector} alt="Connector" />
  </Link>
);

export default logo;
