import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getProjects,
  getToggleTab,
  modalToggle,
  setAllProjects,
  setToggleTab,
} from "@redux/projectsTrackerSlice";

import { caseOfNum } from "@utils/helper";

import { apiRequest } from "@api/request";

import AllTaskTableTracker from "@components/AllTaskTableTracker/AllTaskTableTracker";
import ArchiveTableTracker from "@components/ArchiveTableTracker/ArchiveTableTracker";
import BaseButton from "@components/Common/BaseButton/BaseButton";
import { Footer } from "@components/Common/Footer/Footer";
import { Loader } from "@components/Common/Loader/Loader";
import TrackerModal from "@components/Modal/Tracker/TrackerModal/TrackerModal";
import { Navigation } from "@components/Navigation/Navigation";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import { ProfileHeader } from "@components/ProfileHeader/ProfileHeader";
import ProjectTiket from "@components/ProjectTiket/ProjectTiket";

import addProjectImg from "assets/icons/addProjectImg.svg";
import archiveTrackerProjects from "assets/icons/archiveTrackerProjects.svg";
import arrowViewReport from "assets/icons/arrows/arrowViewReport.svg";
import filterIcon from "assets/icons/filterIcon.svg";
import search from "assets/icons/serchIcon.png";
import project from "assets/icons/trackerProject.svg";
import tasks from "assets/icons/trackerTasks.svg";
import archive from "assets/images/archiveIcon.png";
import mockAvatar from "assets/images/avatarMok.png";
import downloadExel from "assets/images/downloadExel.svg";
import noProjects from "assets/images/noProjects.png";
import statusTimeTask from "assets/images/statusTimeTask.svg";

import "./tracker.scss";
// import { projects } from "@store/profile";

export const Tracker = () => {
  const dispatch = useDispatch();
  const projects = useSelector(getProjects);
  const tab = useSelector(getToggleTab);

  const [allTasks, setAllTasks] = useState([]);
  const [filteredAllTasks, setFilteredAllTasks] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterCompleteTasks, setFilterCompleteTasks] = useState([]);
  const [allCompletedTasks, setAllCompletedTasks] = useState([]);

  const [modalCreateProject, setModalCreateProject] = useState(false);
  const tabs = ["projectsTab", "tasksTab", "archiveTab"];

  useEffect(() => {
    setLoader(true);

    // запрос проектов
    apiRequest(
      `/projects/projects-list?user_id=${localStorage.getItem(
        "id",
      )}&expand=columns`,
    ).then((el) => {
      // все архивные (законченные) таски в локальный стейт
      // setAllCompletedTasks(
      //   el.projects
      //     .filter((project) => {
      //       if (project.status === 10 && project.columns.length) {
      //         return project;
      //       }
      //     })
      //     .map((project) => {
      //       return project.columns;
      //     })
      //     .reduce((acu, curr) => {
      //       curr.forEach((item) => {
      //         acu.push(...item.tasks);
      //       });
      //       return acu;
      //     }, [])
      // );

      // диспатчим здесь вообще все проекты
      dispatch(setAllProjects(el.projects));
      setLoader(false);
    });

    // запрос задач
    apiRequest(
      `/task/get-user-tasks?user_id=${localStorage.getItem("id")}&expand=timers`,
    ).then((el) => {
      // 0 архивный статус
      const allTasks = el ? el.filter((item) => item.status !== 0) : [];
      const completedTasks = el ? el.filter((item) => item.status === 0) : [];

      // в локальный стейт
      setAllTasks(allTasks);
      setFilteredAllTasks(allTasks);
      setAllCompletedTasks(completedTasks);
      setFilterCompleteTasks(completedTasks);
    });
  }, []);

  const toggleTabs = (index) => {
    dispatch(setToggleTab(index));
  };

  function filterAllTask(e) {
    setFilteredAllTasks(
      allTasks.filter((item) => {
        if (!e.target.value) {
          return item;
        }
        if (
          item.title.toLowerCase().startsWith(e.target.value.toLowerCase()) ||
          item.description
            .toLowerCase()
            .startsWith(e.target.value.toLowerCase())
        ) {
          return item;
        }
      }),
    );
  }

  function filterArchiveTasks(e) {
    setFilterCompleteTasks(
      allCompletedTasks.filter((item) => {
        if (!e.target.value) {
          return item;
        }
        if (
          item.title.toLowerCase().startsWith(e.target.value.toLowerCase()) ||
          item.description
            .toLowerCase()
            .startsWith(e.target.value.toLowerCase())
        ) {
          return item;
        }
      }),
    );
  }

  return (
    <div className="tracker">
      <ProfileHeader />
      <Navigation />
      <div className="container">
        <div className="tracker__content">
          <ProfileBreadcrumbs
            links={[
              { name: "Главная", link: "/profile" },
              { name: "Трекер", link: "/profile/tracker" },
            ]}
          />
          <h2 className="tracker__title">Управление проектами с трекером</h2>
        </div>
      </div>
      <div className="tracker__tabs">
        <div className="tracker__tabs__head">
          <div
            className={
              tab === 1 ? "tab active-tab projectsTab" : "tab projectsTab"
            }
            onClick={() => toggleTabs(1)}
          >
            <img src={project} alt="img" />
            <p>Проекты </p>
          </div>
          <div
            className={tab === 2 ? "tab active-tab tasksTab" : "tab tasksTab"}
            onClick={() => toggleTabs(2)}
          >
            <img src={tasks} alt="img" />
            <p>Все мои задачи (трекер)</p>
          </div>

          <div
            className={
              tab === 3 ? "tab active-tab archiveTab" : "tab archiveTab"
            }
            onClick={() => toggleTabs(3)}
          >
            <img src={archive} alt="img" />
            <p>Архив</p>
          </div>
        </div>
        <div className={`tracker__tabs__content ${tabs[tab - 1]}`}>
          <div
            className={
              tab === 1
                ? "tracker__tabs__content__projects active__content tracker__tabs__content__wrapper"
                : "tracker__tabs__content__projects tracker__tabs__content__wrapper"
            }
          >
            <TrackerModal
              active={modalCreateProject}
              setActive={setModalCreateProject}
              titleProject={"Укажите название проекта:"}
            ></TrackerModal>

            {loader && <Loader style="pink" />}

            {projects &&
              Boolean(projects.length) &&
              !loader &&
              projects?.map((project, index) => {
                return project.status !== 10 ? (
                  <ProjectTiket key={index} project={project} />
                ) : (
                  ""
                );
              })}

            {typeof projects === "object" &&
              (!projects.length ||
                !projects?.filter((project) => project.status !== 10).length) &&
              !loader && (
                <div className="no-projects">
                  <div className="no-projects__createNew">
                    <div>
                      <img src={noProjects} alt="noProjectImg" />
                      <p>Создайте свой первый проект</p>
                    </div>

                    <BaseButton
                      styles={"createProjectBtn"}
                      onClick={() => {
                        dispatch(modalToggle("createProject"));
                        setModalCreateProject(true);
                      }}
                    >
                      <img src={addProjectImg} alt="#"></img>
                      <p className="createProjectBtn__text">
                        Ставьте задачи, следите за прогрессом, ведите учёт
                        рабочего времени
                      </p>
                    </BaseButton>
                  </div>
                </div>
              )}
            {projects && Boolean(projects.length) && !loader && (
              <>
                <BaseButton
                  styles="createProjectBtn"
                  onClick={() => {
                    dispatch(modalToggle("createProject"));
                    setModalCreateProject(true);
                  }}
                >
                  {/* <img src={addProjectImg} alt="#"></img> */}
                  <p className="createProjectBtn__text">Создать проект</p>
                </BaseButton>
              </>
            )}
          </div>
          <div
            className={
              tab === 2
                ? "tracker__tabs__content__allTasks taskList tasks active__content"
                : "tracker__tabs__content__projects"
            }
          >
            <div className="taskList__head">
              <div className="taskList__tasks-period">
                <div className="month-period">
                  <p>
                    {15} - {25}
                  </p>
                  <h2>декабря,</h2>
                  <h3>2024</h3>
                </div>

                <div className="buttons-month">
                  <button>
                    <img src={arrowViewReport} alt="<"></img>
                  </button>
                  <button>
                    <img src={arrowViewReport} alt=">"></img>
                  </button>
                </div>
              </div>

              <div className="taskList__head__search">
                <img src={search} alt="search" />
                <input
                  type="text"
                  placeholder="Найти задачу"
                  onChange={(event) => filterAllTask(event)}
                />
              </div>

              <div className="taskList__filters">
                <BaseButton styles={"taskList__filters-filter"}>
                  <img src={filterIcon} alt="#" />
                  <p>Фильтр</p>
                </BaseButton>
                <BaseButton styles={"taskList__filters-clear"}>
                  <p> Очистить фильтр</p>
                </BaseButton>
              </div>
            </div>

            {loader && <Loader style="pink" />}

            {projects && projects.length && (
              <AllTaskTableTracker
                loader={loader}
                filteredAllTasks={filteredAllTasks}
                projects={projects}
              />
            )}

            <div className="taskList__time">
              <div className="taskList__time-compited">
                <h4>Учет моего рабочего времени за день</h4>
                <h3>
                  Задач выполнено: <p>{2}</p>
                </h3>
              </div>
              <div className="taskList__time-all">
                <h3>Общее время:</h3>
                <p>{"4 ч 14 мин"}</p>
              </div>
              <div className="taskList__time-status">
                <div>
                  <img src={statusTimeTask} alt="#" />
                  <p>Сверка пройдена</p>
                </div>
                <div>
                  <img src={downloadExel} alt="#" />
                  <p>Скачать Exel отчет</p>
                </div>
              </div>
            </div>

            <div className="taskList__end">
              <BaseButton styles={"close-day"}>
                Закрыть сегоднящний день
              </BaseButton>
              <p>
                Нажимая кнопку - “Закрыть сегодняшний день” - вы отправляете
                потрачеенное время на сверку
              </p>
            </div>
          </div>
          <div
            className={
              tab === 3
                ? "tracker__tabs__content__archive active__content"
                : "tracker__tabs__content__projects"
            }
          >
            <div className="archive__tasks">
              {/* Архив задач заголовок */}
              <div className="archive__title">
                <h3>Архив задач:</h3>
                <p>
                  {`${filterCompleteTasks && filterCompleteTasks.length} 
                    ${caseOfNum(
                      filterCompleteTasks && filterCompleteTasks.length,
                      "tasks",
                    )}`}
                </p>

                <div className="archive__tasks-period">
                  <div className="buttons-month">
                    <button>
                      <img src={arrowViewReport} alt="<"></img>
                    </button>
                    <button>
                      <img src={arrowViewReport} alt=">"></img>
                    </button>
                  </div>
                  <div className="month-period">
                    <h2>декабрь,</h2>
                    <h3>2024</h3>
                  </div>
                </div>
                <div className="archive__tasks__search">
                  <img src={search} alt="search" />

                  {/* Поиск фильтр архивных задач */}
                  <input
                    type="text"
                    placeholder="Найти задачу"
                    onChange={(event) => filterArchiveTasks(event)}
                  />
                </div>
              </div>

              {loader && <Loader style="pink" />}

              <ArchiveTableTracker
                loader={loader}
                filterCompleteTasks={filterCompleteTasks}
              />
            </div>

            {/* Архив проектов */}
            <div className="archive__projects">
              <div className="archive__projects-title">
                <h3>Архив проектов:</h3>
                <p>
                  {`${
                    projects?.filter((project) => project.status === 10).length
                  } 
                     ${caseOfNum(
                       projects?.filter((project) => project.status === 10)
                         .length,
                       "projects",
                     )}`}
                </p>
              </div>
              <div className="archive__tasksWrapper">
                {Boolean(
                  projects?.filter((project) => project.status === 10).length,
                ) ? (
                  projects?.map((project, index) => {
                    return project.status === 10 ? (
                      <div
                        className="archive__completeTask-project"
                        key={index}
                      >
                        <div className="archive__completeTask__description">
                          <p className="project-title-archive">
                            {project.title}
                          </p>
                          {/* old */}
                          {/* <p className="date">{project.date}</p> */}
                          <p className="date">
                            {project.created_at.slice(0, 10)}
                          </p>
                        </div>
                        <div className="archive__completeTask__creator">
                          <img src={mockAvatar} alt="#" />
                          <div className="creator-title">
                            <h4>Создатель проекта:</h4>
                            <p>
                              {project.owner ?? "Тестовый аккаунт заглушка"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    );
                  })
                ) : (
                  <div className="archive__noItem-project">
                    <img src={archiveTrackerProjects} alt="#" />
                    <p>В архиве проектов нет</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
