import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { profiles, tags } from "@redux/outstaffingSlice";

import { apiRequest } from "@api/request";

import { Footer } from "@components/Common/Footer/Footer";
import Description from "@components/Description/Description";
import { Navigation } from "@components/Navigation/Navigation";
import Outstaffing from "@components/Outstaffing/Outstaffing";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import { ProfileHeader } from "@components/ProfileHeader/ProfileHeader";

const Home = () => {
  if (localStorage.getItem("role_status") !== "18") {
    return <Navigate to="/profile" replace />;
  }

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [index, setIndex] = useState(4);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoadingMore(true);

    apiRequest("/profile", {
      params: { limit: 1000 },
    }).then((profileArr) => {
      dispatch(profiles(profileArr));
      setIsLoadingMore(false);
    });

    apiRequest("/skills/skills-on-main-page", {}).then((skills) => {
      if (!skills) {
        return [];
      }
      const keys = Object.keys(skills);
      const values = Object.values(skills);

      const tempTags = values.map((value, index) =>
        value.map((val) => {
          return { id: val.id, value: val.tags, name: keys[index] };
        }),
      );
      dispatch(tags(tempTags));
    });

    // const skills = {
    //   skills_front: [{id: 1, tags: 'frontend'}],
    //   skills_back: [{id: 2, tags: 'backend'}],
    //   skills_design: [{id: 3, tags: 'design'}],
    // }
    // const keys = Object.keys(skills);
    // const values = Object.values(skills);

    // const tempTags = values.map((value, index) =>
    //   value.map((val) => {
    //     return { id: val.id, value: val.tags, name: keys[index] };
    //   })
    // );
    // dispatch(tags(tempTags));
  }, [index]);

  const loadMore = (count) => {
    setIndex((prev) => prev + count);
  };

  return (
    <>
      <ProfileHeader />
      <Navigation />
      <div className="catalog">
        <div className="container">
          <ProfileBreadcrumbs
            links={[
              { name: "Главная", link: "/profile" },
              { name: "Запросы и открытые позиции", link: "/profile/requests" },
              { name: "Каталог", link: "/profile/catalog" },
            ]}
          />
          <h2 className="catalog__title">Каталог специалистов</h2>
          <Outstaffing />
          <Description onLoadMore={loadMore} isLoadingMore={isLoadingMore} />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
