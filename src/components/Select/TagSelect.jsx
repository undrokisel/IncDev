import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {
  profiles,
  selectItems,
  selectTags,
  selectedItems,
  setPositionId,
} from "@redux/outstaffingSlice";

import { apiRequest } from "@api/request";

import { Loader } from "@components/Common/Loader/Loader";

import "./tagSelect.scss";
import { developers } from "@store/developers";

const TagSelect = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const dispatch = useDispatch();

  const itemsArr = useSelector(selectItems);

  const tagsArr = useSelector(selectTags);

  const handleSubmit = ({ dispatch, setSearchLoading }) => {
    setSearchLoading(true);

    dispatch(setPositionId(null));

    const filterItemsId = itemsArr.map((item) => item.id).join();

    const params = filterItemsId ? { skill: filterItemsId } : "";

    apiRequest("/profile", {
      params: { ...params, limit: 1000 },
    }).then((res) => {
      dispatch(profiles(res));
      setSearchLoading(false);
    });

    const searchResult = developers;
    dispatch(profiles(searchResult));
    setSearchLoading(false);
  };

  return (
    <>
      <section className="search">
        <div className="row">
          <div className="col-12">
            <h2 className="search__title">Найти специалиста по навыкам</h2>
            <div className="search__box">
              <Select
                value={itemsArr}
                onChange={(value) => dispatch(selectedItems(value))}
                isMulti
                name="tags"
                className="select"
                classNamePrefix="select"
                options={
                  tagsArr &&
                  tagsArr.flat().map((item) => {
                    return {
                      id: item.id,
                      value: item.value,
                      label: item.value,
                    };
                  })
                }
              />
              <button
                onClick={() => handleSubmit({ dispatch, setSearchLoading })}
                type="submit"
                className="search__submit"
              >
                {searchLoading ? <Loader width={30} height={30} /> : "Поиск"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TagSelect;
