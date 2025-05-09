import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { apiRequest } from "@api/request";

import {
  getCorrectDate,
  getCreatedDate,
  hourOfNum,
} from "@components/Calendar/calendarHelper";
import { Footer } from "@components/Common/Footer/Footer";
import { Loader } from "@components/Common/Loader/Loader";
import { Navigation } from "@components/Navigation/Navigation";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import { ProfileHeader } from "@components/ProfileHeader/ProfileHeader";

import arrowSwitchDate from "assets/icons/arrows/arrowViewReport.png";
import arrow from "assets/icons/arrows/left-arrow.png";

import "./viewReport.scss";

export const ViewReport = () => {
  if (localStorage.getItem("role_status") === "18") {
    return <Navigate to="/profile" replace />;
  }

  const dateReport = useParams();
  const [previousReportDay] = useState(new Date(dateReport.id));
  const [nextReportDay] = useState(new Date(dateReport.id));

  const [taskText, setTaskText] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [tomorrowTask, setTomorrowTask] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [currentDay] = useState(new Date());
  const [loader, setLoader] = useState(false);

  function getReportFromDate(day) {
    setLoader(true);
    setTaskText([]);
    setDifficulties([]);
    setTomorrowTask([]);
    apiRequest(
      `reports/find-by-date?user_card_id=${localStorage.getItem(
        "cardId",
      )}&date=${day}`,
    ).then((res) => {
      let spendTime = 0;
      for (const item of res) {
        if (item.difficulties) {
          setDifficulties((prevArray) => [...prevArray, item.difficulties]);
        }
        if (item.tomorrow) {
          setTomorrowTask((prevArray) => [...prevArray, item.tomorrow]);
        }
        item.task.map((task) => {
          const taskInfo = {
            hours: task.hours_spent,
            task: task.task,
            id: task.id,
          };
          if (task.hours_spent) {
            spendTime += Number(task.hours_spent);
          }
          setTaskText((prevArray) => [...prevArray, taskInfo]);
        });
      }
      setTotalHours(spendTime);
      setLoader(false);
    });
    previousReportDay.setDate(previousReportDay.getDate() - 1);
    nextReportDay.setDate(nextReportDay.getDate() + 1);
  }

  function nextDay() {
    getReportFromDate(getCreatedDate(nextReportDay));
    previousReportDay.setDate(previousReportDay.getDate() + 2);
  }

  function previousDay() {
    getReportFromDate(getCreatedDate(previousReportDay));
    nextReportDay.setDate(nextReportDay.getDate() - 2);
  }

  useEffect(() => {
    getReportFromDate(dateReport.id);
  }, []);

  return (
    <div className="viewReport">
      <ProfileHeader />
      <Navigation />
      <div className="container">
        <div className="viewReport__info">
          <ProfileBreadcrumbs
            links={[
              { name: "Главная", link: "/profile" },
              { name: "Ваша отчетность", link: "/profile/calendar" },
              { name: "Просмотр отчета за день", link: "/profile/view" },
            ]}
          />
          <h2 className="viewReport__title">
            Ваши отчеты - <span>просмотр отчета за день</span>
          </h2>
          <Link className="viewReport__back" to={`/profile/calendar`}>
            <img src={arrow} alt="#" />
            <p>Вернуться</p>
          </Link>
          <div className="viewReport__bar">
            <h3 className="viewReport__bar__date">
              {getCorrectDate(dateReport.id)}
            </h3>
            <p className="viewReport__bar__hours">
              Вами потрачено на работу :{" "}
              <span>
                {totalHours} {hourOfNum(totalHours)}
              </span>
            </p>
          </div>
        </div>
        <div className="viewReport__switchDate">
          <div
            onClick={() => {
              previousDay();
            }}
          >
            <Link to={`../view/${getCreatedDate(previousReportDay)}`}>
              <div className="viewReport__switchDate__prev switchDate">
                <img src={arrowSwitchDate} alt="arrow" />
              </div>
            </Link>
          </div>

          <p>{getCorrectDate(dateReport.id)}</p>

          <div
            onClick={() => nextDay()}
            className={`${
              getCreatedDate(currentDay) === dateReport.id ? "disable" : ""
            }`}
          >
            <Link to={`../view/${getCreatedDate(nextReportDay)}`}>
              <div className={`viewReport__switchDate__next switchDate`}>
                <img src={arrowSwitchDate} alt="arrow" />
              </div>
            </Link>
          </div>
        </div>
        {loader && <Loader width={75} height={75} />}
        {Boolean(taskText.length) && (
          <div className="viewReport__content">
            <div className="table__container">
              <table className="viewReport__done">
                <thead>
                  <tr>
                    <th>
                      <p>Какие задачи были выполнены?</p>
                    </th>
                    <th>
                      <p>Время</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {taskText.length &&
                    taskText.map((task, index) => {
                      return (
                        <tr key={task.id}>
                          <td>
                            <p>
                              {index + 1}. {task.task}
                            </p>
                          </td>
                          <td>
                            <div className="viewReport__done__hours__item">
                              <span>{task.hours}</span>
                              <p className="hours">
                                {hourOfNum(task.hours)} на задачу
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td></td>
                    <td>
                      <span>
                        Всего: {totalHours} {hourOfNum(totalHours)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {Boolean(difficulties.length) && (
              <div className="viewReport__item">
                <h3>Какие сложности возникли?</h3>
                {difficulties.map((item, index) => {
                  return <p key={index}>{item}</p>;
                })}
              </div>
            )}
            {Boolean(tomorrowTask.length) && (
              <div className="viewReport__item">
                <h3>Что планируется сделать завтра?</h3>
                {tomorrowTask.map((item, index) => {
                  return <p key={index}>{item}</p>;
                })}
              </div>
            )}
          </div>
        )}
        {!Boolean(taskText.length) && !loader && (
          <div className="viewReport__noTask">
            <p>
              В этот день вы <span>не заполняли</span> отчет
            </p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};
