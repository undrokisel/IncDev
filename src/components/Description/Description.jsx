import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectProfiles } from "@redux/outstaffingSlice";

import { LEVELS, SKILLS } from "@utils/constants";
import { urlForLocal } from "@utils/helper";

import cursorImg from "assets/icons/cursorImg.svg";
import rectangle from "assets/images/rectangle_secondPage.png";

import ErrorBoundary from "../../hoc/ErrorBoundary";
import "./description.scss";

const Description = ({ onLoadMore }) => {
  const candidatesListArr = useSelector(selectProfiles);

  return (
    <section className="description">
      <div className="container">
        <div className="description__wrapper">
          <ErrorBoundary>
            {candidatesListArr &&
            Array.isArray(candidatesListArr) &&
            candidatesListArr.length > 0 ? (
              candidatesListArr.map((el) => (
                <div className="row" key={el.id}>
                  <div className="col-2">
                    {el.photo && (
                      <img
                        className="description__img"
                        src={urlForLocal(el.photo)}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="col-12 col-xl-6">
                    <h3 className="description__title">
                      <Link to={`/candidate/${el.id}`}>
                        {" "}
                        {el.specification} {SKILLS[el.position_id]},{" "}
                        {LEVELS[el.level]}{" "}
                      </Link>
                    </h3>

                    {el.vc_text_short ? (
                      <div className="description__text">
                        {el.vc_text_short}
                      </div>
                    ) : (
                      <p className="description__text-secondary">
                        Описание отсутствует...
                      </p>
                    )}
                  </div>
                  <div className="col-12 col-xl-4">
                    <Link to={`/candidate/${el.id}`}>
                      <button className="description__button">
                        Подробное резюме
                      </button>
                    </Link>
                  </div>
                  <div className="col-xl-2"></div>
                  <div className="col-12 col-xl-6">
                    <ul className="description__list">
                      {Array.isArray(el?.skillValues) &&
                        el.skillValues?.map((e) => (
                          <li key={e.id} className="description__list-item">
                            {e.skill.name}
                          </li>
                        ))}
                    </ul>
                    {/* <img
                      className="description__rectangle"
                      src={rectangle}
                      alt=""
                    /> */}
                  </div>
                  <div className="col-xl-4"></div>
                </div>
              ))
            ) : (
              <div className="description__empty">
                <img src={cursorImg}></img>

                <p>
                  В данный момент<span> нет свободных </span> специалистов в
                  данной категории
                </p>
              </div>
            )}
          </ErrorBoundary>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="description__footer">
              <div className="description__footer-btn">
                {candidatesListArr && (
                  <button onClick={() => onLoadMore(2)}>Загрузить еще</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Description;
