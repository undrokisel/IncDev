import React from "react";

import AuthHeader from "@components/Common/AuthHeader/AuthHeader";
import { Footer } from "@components/Common/Footer/Footer";
import { FrequentlyAskedQuestionsItem } from "@components/FrequentlyAskedQuestionsItem/FrequentlyAskedQuestionsItem";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import SideBar from "@components/SideBar/SideBar";

import arrow from "assets/images/faq/arrow.svg";

import "./FrequentlyAskedQuestions.scss";


const rubrics = [
  {
    title: "Общие вопросы ",
   
    questions: [
      {
        id: 1,
        title: "Это фриланс-платформа?",
      },
      {
        id: 2,
        title:
          "Чем вы отличаетесь от традиционного процесса выбора исполнителя?",
      },
      {
        id: 3,
        title: "Как начать работу?",
      },
    ],
  },
  
  {
    title: "Поиск специалиста",
    questions: [
      {
        id: 4,
        title: "Как найти специлиста в компанию?",
      },
    ],
  },
  {
    title: "Бронирование специалиста",
    questions: [
      {
        id: 6,
        title: "Как организован процесс привлечения специалиста на проект?",
      },
    ],
  },
  {
    title: "Работа с выбранным специалистом",
    questions: [
      {
        id: 7,
        title:
          "Я недоволен работой привлеченного специалиста, что делать?",
      },
    ],
  },
];

export const FrequentlyAskedQuestions = () => {
  

  return (
    <div className="frequently-asked-questions">
      <AuthHeader />
      <SideBar />

      <div className="frequently-asked-questions__container container">
        <ProfileBreadcrumbs
          links={[
            { name: "Главная", link: "/auth" },
            {
              name: "FAQ (часто задаваемые вопросы)",
              link: "/frequently-asked-questions",
            },
          ]}
        />
        <div className="frequently-asked-questions__about">
          <div className="frequently-asked-questions__title">FAQ</div>
          <div className="frequently-asked-questions__arrow">
            <img src={arrow} alt="arrow" />
          </div>
          <div className="frequently-asked-questions__description">
            Ответы на популярные вопросы.
          </div>
        </div>
        <div className="frequently-asked-questions__items">
          {rubrics.map((rubric, index) => (
            <FrequentlyAskedQuestionsItem rubric={rubric} key={index} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
