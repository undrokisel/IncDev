import React from "react";
import { Link } from "react-router-dom";

import questionIcon from "assets/images/faq/question.svg";

import "./FrequentlyAskedQuestionsItem.scss";

export const FrequentlyAskedQuestionsItem = ({ rubric, faqs }) => {
  return (
    <div className="frequently-asked-questions-item">
      <div className="frequently-asked-questions-item__head">
        <div className="frequently-asked-questions-item__icon-question">
          <img src={questionIcon} alt="" />
        </div>
        <div className="frequently-asked-questions-item__title">
          {rubric?.name}
        </div>
      </div>
      {faqs?.map((question) => (
        <Link
          key={question.id}
          to={`/frequently-asked-question/${question.id}`}
          className="frequently-asked-questions-item__body"
        >
          <p>{question.question}</p>
        </Link>
      ))}
    </div>
  );
};
