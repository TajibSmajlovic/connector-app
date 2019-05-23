import React from "react";
import { Link } from "react-router-dom";

import navLogoConnector from "../../../assets/NavLogo/ConnectorNavLogo.png";
import style from "./NavLogo.module.css";

const navLogo = () => (
  <Link to="/">
    <img className={style.NavLogo} src={navLogoConnector} alt="Connector" />
  </Link>
);

export default navLogo;
