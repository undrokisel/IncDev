import React from "react";

import email from "assets/icons/emailLogo.svg";
import tg from "assets/icons/tgFooter.svg";
import vk from "assets/icons/vkLogo.svg";

import "./footer.scss";

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer">
          <div className="footer__top">
            {/* <img src={logo} alt="logo" className="logo" /> */}
            <div className="flex flex-col">
              <div className="logo">IncDev</div>
              <div className="logo">ИП Вдовин М.В.</div>
            </div>
            <p>
              Подбор и документальное оформление разработчиков с последующей передачей их в качестве исполнителей компании заказчика. 
            </p>
            <div className="footer__copyright">
              © {new Date().getFullYear()} - Made By Kisel AV, Onix
            </div>
          </div>
          <div className="footer__bottom">
            <div className="footer__social">
              <div className="footer__social__icons">
                <a>
                  <img src={vk} alt="vk" />
                </a>
                <a>
                  <img src={tg} alt="tg" />
                </a>
              </div>
              <p>Войти в команду</p>
            </div>
            <div className="footer__info">
              <div className="footer__mail">
                <a>
                  <img src={email} alt="email" />
                </a>
                <p>vdovinmv@gmail.com</p>
              </div>
              <a className="footer__policy">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
