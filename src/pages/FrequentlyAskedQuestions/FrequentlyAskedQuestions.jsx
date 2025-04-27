import React, { useLayoutEffect, useState } from "react";

import AuthHeader from "@components/Common/AuthHeader/AuthHeader";
import { Footer } from "@components/Common/Footer/Footer";
import { FrequentlyAskedQuestionsItem } from "@components/FrequentlyAskedQuestionsItem/FrequentlyAskedQuestionsItem";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import SideBar from "@components/SideBar/SideBar";

import arrow from "assets/images/faq/arrow.svg";

import "./FrequentlyAskedQuestions.scss";
import { apiRequest } from "@api/request";

export const FrequentlyAskedQuestions = () => {
  const [faqs, setFaqs] = useState([]);
  const [rubrics, setRubrics] = useState([]);

  useLayoutEffect(() => {
    Promise.all([apiRequest("/rubrics"), apiRequest("/faqs")])
      .then(([rubricsResponse, faqsResponse]) => {
        setRubrics(rubricsResponse);
        setFaqs(faqsResponse);
      })
      .catch((error) => console.log("Ошибка при выполнении запросов: ", error));
  }, []);

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
          {rubrics?.map((rubric, index) => (
            <FrequentlyAskedQuestionsItem
              rubric={rubric}
              faqs={faqs.filter((faq) => faq.rubricId === rubric.id)}
              key={index}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
