import React from "react";

import CardArticle from "@components/CardArticle/CardArticle";
import AuthHeader from "@components/Common/AuthHeader/AuthHeader";
import { Footer } from "@components/Common/Footer/Footer";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import SideBar from "@components/SideBar/SideBar";

import blogArrow from "assets/icons/arrows/blogArrow.svg";

import "./blog.scss";
import { articles } from "@store/blog";

export const Blog = () => {
  return (
    <div className="blog">
      <AuthHeader />
      <SideBar />

      <div className="container">
        <div className="blog__breadCrumbs">
          <ProfileBreadcrumbs
            links={[
              { name: "Главная", link: "/auth" },
              { name: "Блог", link: "/blog" },
            ]}
          />
        </div>

        <div className="blog__title">
          <div>
            <h1>Блог</h1>
            <img src={blogArrow} className="blog__title-arrow" />
          </div>

          <h3>Рассказываем о компании, делимся полезными материалами</h3>
        </div>

        <div className="blog__body">
          {articles.map((item, index) => {
            return (
              <CardArticle
                images={item.image}
                title={item.title}
                data={item.data}
                key={index}
                id={item.id}
              />
            );
          })}
        </div>

        <div className="blog__load-more">
          <button>Загрузить еще</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
