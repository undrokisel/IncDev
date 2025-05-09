import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { selectAuth } from "@redux/outstaffingSlice";

import { scrollToForm } from "@utils/helper";

import { AuthBox } from "@components/AuthBox/AuthBox";
import AuthHeader from "@components/Common/AuthHeader/AuthHeader";
import { Footer } from "@components/Common/Footer/Footer";
import SideBar from "@components/SideBar/SideBar";
import SliderWorkers from "@components/SliderWorkers/SliderWorkers";

import arrowBtn from "assets/icons/arrows/arrowRight.svg";
import arrow from "assets/icons/arrows/arrow__login_page.png";
// import text from "assets/images/Body_Text.png";
// import vector from "assets/images/Vector_Smart_Object.png";
import vectorBlack from "assets/images/Vector_Smart_Object_black.png";
import authImg from "assets/images/auth_img.png";
import cross from "assets/images/cross.png";

import "./authForPartners.scss";

const AuthForPartners = () => {
  const isAuth = useSelector(selectAuth);
  let navigate = useNavigate();

  const getToken = localStorage.getItem("auth_token");

  useEffect(() => {
    if (isAuth || getToken) {
      navigate("/profile");
    }
  }, [getToken]);

  return (
    <section className="auth-partners">
      <AuthHeader />
      <SliderWorkers
        title={"Свободные разработчики"}
        titleInfo={"для Вашей команды"}
        subTitle={true}
      />
      <div className="auth-partners__background">
        <img className="auth-partners__vector-black" src={vectorBlack} alt="" />
        <div className="container">
          <div className="change-mode">
            <div className="change-mode__arrow" onClick={() => scrollToForm()}>
              <img src={arrowBtn}></img>
            </div>
            <div className="buttons">
              <Link to={"/authdev"}>
                <button className="change-mode__developersForPart">
                  Для разработчиков
                </button>
              </Link>
              <Link to={"/auth"}>
                <button className="change-mode__partnersForPart">
                  Для компаний
                </button>
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-xl-6">
              <div className="auth-partners__box">
                <AuthBox title="для компаний" />
              </div>
            </div>
            <div className="col-xl-2">
              <img className="auth-partners__arrow" src={arrow} alt="" />
            </div>

            <div className="col-12 col-xl-4">
              <div className="auth-partners__info">
                <div className="auth-partners__info-box">
                  <img src={authImg} alt="" />
                  <h3>
                    Управление
                    <br /> командой
                  </h3>
                </div>

                <div className="auth-partners__info-container">
                  <div className="auth-partners__info-img">
                    <div>
                      <img className="cross" src={cross} alt="" />
                    </div>
                    <div>
                      <p className="auth-partners__specialists">
                        30 Специалистов
                      </p>
                    </div>
                  </div>

                  <ul className="auth-partners__info-list">
                    <li className="auth-partners__info-item">
                      Рабочее
                      <br />
                      пространство
                    </li>
                    <li className="auth-info__list-item">
                      Управление задачами
                    </li>
                  </ul>
                </div>

                {/* <img className="auth-partners__img-text" src={text} alt="" /> */}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <SideBar />
    </section>
  );
};

export default AuthForPartners;
