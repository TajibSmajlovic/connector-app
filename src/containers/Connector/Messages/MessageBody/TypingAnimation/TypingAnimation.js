import React from "react";

import style from "./TypingAnimation.module.css";

const TypingAnimation = () => (
  <div className={style.Typing}>
    <div className={style.TypingDot} />
    <div className={style.TypingDot} />
    <div className={style.TypingDot} />
  </div>
);

export default TypingAnimation;
