import React, { useState } from "react";
import { Link } from "react-router-dom";

import arrow from "assets/icons/sideBarArrow.svg";

import "./sidebar.scss";

export const SideBar = () => {
  const [active, setActive] = useState(false);

  const toggleBar = () => {
    if (active) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  return (
    <div className="auth-menu">
      <div className="auth-title">
        <div className="text">
          <div className="burger" onClick={() => toggleBar()}>
            <div
              className={active ? "burger__line  l1 change" : "burger__line"}
            ></div>
            <div
              className={active ? "burger__line  l2 change" : "burger__line"}
            ></div>
            <div
              className={active ? "burger__line  l3 change" : "burger__line"}
            ></div>
          </div>

          <h3>МЕНЮ</h3>
        </div>
        <p className="outstaffing">
          <p>2024 © IncDev</p>
          <p>ИП Вдовин М.В.</p>
        </p>
      </div>

      <div className={active ? "auth-body active" : "auth-body"}>
        <div className="auth-body__title">
          <h1 className="">Inc<span>Dev</span></h1>
        </div>
        <ul className="auth-body__navigation">
          <li>
            <Link to={"/auth"}>Вход для компаний</Link>
          </li>
          <li>
            <Link to={"/authdev"}>Кабинет разработчика</Link>
          </li>
          <li>
            <Link to={"/tracker-intro"}>Трекер</Link>
          </li>
          <li>
            <a href="#">Контакты</a>
          </li>
          <li>
            <Link to={"/blog"}>Блог</Link>
          </li>
          <li>
            <Link to={"/frequently-asked-questions"}>FAQ</Link>
          </li>
        </ul>
        <p className="auth-body__politic">Политика конфиденциальности</p>
        {/*<div className="auth-body__contacts">*/}
        {/*  <h4>+7 812 363 17 87</h4>*/}
        {/*  <p>Перезвонить Вам?</p>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default SideBar;
