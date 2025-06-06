import React, { useState } from "react";

import { CardControl } from "@components/CardControl/CardControl";
import { Footer } from "@components/Common/Footer/Footer";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import { ProfileHeader } from "@components/ProfileHeader/ProfileHeader";
import { HeadBottom } from "@components/features/Candidate-lk/HeadBottom";

import settingIcon from "assets/icons/settingIcon.png";
import medium_male from "assets/images/medium_male.png";
import noteIcon from "assets/images/note.png";
import questionIcon from "assets/images/question.png";
import reportsIcon from "assets/images/reports.png";

import "./ProfileCandidate.scss";

export const ProfileCandidate = () => {
  const [candidatsCardsControl] = useState([
    {
      path: "quiz",
      img: reportsIcon,
      title: "Мои тесты",
      description: "<span>У вас 122 часа<br/></span>отработанных в этом месяце",
    },
    {
      path: "profile/settings",
      img: settingIcon,
      title: "Настройки аккаунта",
      description: "Перейдите чтобы начать редактирование",
    },
  ]);
  return (
    <div className="profile-candidate">
      <ProfileHeader />
      <div className="profile-candidate__head-bottom bottom-head">
        <HeadBottom />
      </div>
      <div className="profile-candidate__container">
        <ProfileBreadcrumbs
          links={[{ name: "Главная", link: "/profile-candidate" }]}
        />
        <div className="profile-candidate__title main-title">
          Добрый день, <span>Андрей</span>
        </div>
        <div className="profile-candidate__row">
          <div className="profile-candidate__tests">
            <div className="info-candidate">
              <div className="info-candidate__img">
                <img src={medium_male} alt="" />
              </div>
              <div className="info-candidate__info">
                <div className="info-candidate__title">
                  Открыто {3} теста из {12}
                </div>
                <div className="info-candidate__decor"></div>
              </div>
            </div>
            <div className="profile-candidate__cards">
              {candidatsCardsControl.map((item, index) => (
                <CardControl
                  description={item.description}
                  img={item.img}
                  path={item.path}
                  title={item.title}
                  key={index}
                />
              ))}
            </div>
          </div>
          <div className="profile-candidate__instructions instructions-candidate">
            <div className="instructions-candidate__container">
              <div className="instructions-candidate___row">
                <div className="instructions-candidate__title">Интсрукция:</div>
                <div className="instructions-candidate__note">
                  <img
                    className="instructions-candidate__icon"
                    src={noteIcon}
                    alt=""
                  />
                  <div className="instructions-candidate__text">
                    Для подтверждения своих знаний - пройдите тестирование во
                    вкладке
                    <span>“Мои тесты”</span>
                  </div>
                </div>
              </div>
              <div className="instructions-candidate___row">
                <div className="instructions-candidate__title">Зачем?</div>
                <div className="instructions-candidate__note">
                  <img
                    className="instructions-candidate__icon"
                    src={questionIcon}
                    alt=""
                  />
                  <div className="instructions-candidate__text">
                    Тесты IncDev предназначены для того, чтобы подтверждать
                    навыки, которые вы указали у себя.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
