import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import AuthHeader from "@components/Common/AuthHeader/AuthHeader";
import { Footer } from "@components/Common/Footer/Footer";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import SideBar from "@components/SideBar/SideBar";

import arrowBtn from "assets/icons/arrows/arrowRight.svg";

import "./FrequentlyAskedQuestion.scss";
import { apiRequest } from "@api/request";

export const FrequentlyAskedQuestion = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);

  useLayoutEffect(() => {
    apiRequest(`/faq/${+params.id}`).then((res) => {
      setQuestion(res);
    });
  }, []);

  return (
    <div className="frequently-asked-question">
      <AuthHeader />
      <SideBar />
      <div className="frequently-asked-question__container container">
        <ProfileBreadcrumbs
          links={[
            { name: "Главная", link: "/auth" },
            {
              name: "FAQ (часто задаваемые вопросы)",
              link: "/frequently-asked-questions",
            },
            {
              name: question
                ? question.question
                : "ошибка поиска страницы с вопросом",
              link: `/frequently-asked-question/${params.id}`,
            },
          ]}
        />
        <div className="frequently-asked-question__title">
          {question ? question.question : "ошибка поиска страницы с вопросом"}
        </div>
        <div
          className="frequently-asked-question__back"
          onClick={() => navigate(-1)}
        >
          <div className="frequently-asked-question__arrow">
            <img src={arrowBtn}></img>
          </div>
          <p>вернуться к списку вопросов</p>
        </div>
        <div className="frequently-asked-question__answer">
          {question?.answer?.map((item, index) => (
            <div key={index}>
              <p>{item}</p>
              <br />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
