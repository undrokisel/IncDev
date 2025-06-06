import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { auth, getProfileInfo, setProfileInfo } from "@redux/outstaffingSlice";
import { getRole } from "@redux/roleSlice";

import { apiRequest } from "@api/request";

import { Loader } from "@components/Common/Loader/Loader";

import "./profileHeader.scss";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileInfo = useSelector(getProfileInfo);
  const userRole = useSelector(getRole);
  const [user] = useState(
    localStorage.getItem("role_status") === "18" ? "partner" : "developer",
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // если компания - ничего не делаем
    if (localStorage.getItem("role_status") === "18") {
      return;
    }
    // если данные уже есть в сторе, тоже ничего не делаем
    if (Object.keys(profileInfo).length) {
      return;
    }
    // если данных еще нет в сторе, идем на бек и запрашиваем
    apiRequest(`/user/me`).then((profileInfo) => {
      dispatch(
        setProfileInfo(
          profileInfo.userCard ? profileInfo.userCard[0] : profileInfo,
        ),
      );
    });
  }, [dispatch]);

  const handlerLogout = () => {
    setIsLoggingOut(true);
    localStorage.clear();
    dispatch(auth(false));
    setIsLoggingOut(false);
    navigate(userRole === "ROLE_DEV" ? "/authdev" : "/auth");
  };

  return (
    <header className="profileHeader">
      <div className="profileHeader__head">
        <div className="profileHeader__container">
          <NavLink to={"/profile"} className="profileHeader__title">
            IncDev.
            <span>
              {user === "developer" ? "для разработчиков" : "для компаний"}
            </span>
          </NavLink>
          <button onClick={handlerLogout} className="profileHeader__logout">
            {isLoggingOut ? <Loader /> : "Выйти"}
          </button>
        </div>
      </div>
    </header>
  );
};
