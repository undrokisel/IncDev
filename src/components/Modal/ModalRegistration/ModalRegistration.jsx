import React, { useState } from "react";

import { apiRequest } from "@api/request";

import { useNotification } from "@hooks/useNotification";

import BaseButton from "@components/Common/BaseButton/BaseButton";
import { Loader } from "@components/Common/Loader/Loader";
import ModalLayout from "@components/Common/ModalLayout/ModalLayout";

import anyMoment from "assets/icons/anyMoment.svg";
import doc from "assets/icons/doc.svg";
import telegramLogo from "assets/icons/tgLogo.svg";

import "./modalRegistration.scss";

export const ModalRegistration = ({ active, setActive }) => {
  const [inputsValue, setInputsValue] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [inputsError, setInputsError] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [loader, setLoader] = useState(false);

  const validateEmail = (email) => {
    // регулярное выражение для проверки email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // возвращаем true, если email проходит проверку, и false, если нет
    return re.test(email);
  };

  const { showNotification } = useNotification();

  const validateForm = () => {
    if (inputsValue.password.length < 6) {
      setInputsError((prevValue) => ({ ...prevValue, password: true }));
    }
    if (inputsValue.userName.length < 2) {
      setInputsError((prevValue) => ({ ...prevValue, name: true }));
    }
    if (!validateEmail(inputsValue.email)) {
      setInputsError((prevValue) => ({ ...prevValue, email: true }));
    }
    if (
      inputsValue.password.length < 6 ||
      inputsValue.userName.length < 6 ||
      !validateEmail(inputsValue.email)
    ) {
      return true;
    }
  };

  const submitHandler = () => {
    if (validateForm()) {
      return;
    }
    setLoader(true);
    apiRequest("/register/sign-up", {
      method: "POST",
      data: {
        username: inputsValue.userName,
        email: inputsValue.email,
        password: inputsValue.password,
      },
    }).then((data) => {
      setLoader(false);
      if (!data) {
        showNotification({
          show: true,
          text: "Аккаунт с таким логином или email уже существует",
          type: "error",
        });
      } else {
        closeModal();
        showNotification({
          show: true,
          text: "Аккаунт успешно создан",
          type: "success",
        });
      }
    });
    setTimeout(() => {
      closeModal();
      showNotification({
        show: true,
        text: "Аккаунт успешно создан",
        type: "success",
      });
    }, 1000);
  };

  const closeModal = () => {
    setInputsValue({
      userName: "",
      email: "",
      password: "",
    });
    setInputsError({
      name: false,
      email: false,
      password: false,
    });
    setActive(false);
  };
  return (
    <ModalLayout active={active} setActive={closeModal} styles={"registration"}>
      <div className="registration-body__left">
        <h2>
          Подключайтесь к <p>IncDev.</p>
        </h2>
        <p className="registration-body__left-desc">
          Зарегистрируйтесь и начните работу уже сегодня
        </p>

        <div className="input-body">
          <div className="input-body__box">
            <div className="inputContainer">
              <h5>Ваше имя</h5>
              <input
                className={inputsError.name ? "error" : ""}
                onChange={(e) => {
                  setInputsError({
                    name: false,
                    email: false,
                    password: false,
                  });
                  setInputsValue((prevValue) => ({
                    ...prevValue,
                    userName: e.target.value,
                  }));
                }}
                value={inputsValue.userName}
                placeholder="Имя"
              />
              {inputsError.name && <span>Минимум 2 символов</span>}
            </div>
            <div className="inputContainer">
              <h5>E-mail</h5>
              <input
                type="email"
                className={inputsError.email ? "error" : ""}
                onChange={(e) => {
                  setInputsError({
                    name: false,
                    email: false,
                    password: false,
                  });
                  setInputsValue((prevValue) => ({
                    ...prevValue,
                    email: e.target.value,
                  }));
                }}
                value={inputsValue.email}
                placeholder="Почта"
              />
              {inputsError.email && <span>Введите коректный email</span>}
            </div>
          </div>

          <div className="input-body__box">
            <div className="inputContainer">
              <h5>Пароль</h5>
              <input
                className={inputsError.password ? "error" : ""}
                type="password"
                onChange={(e) => {
                  setInputsError({
                    name: false,
                    email: false,
                    password: false,
                  });
                  setInputsValue((prevValue) => ({
                    ...prevValue,
                    password: e.target.value,
                  }));
                }}
                value={inputsValue.password}
                placeholder="Пароль"
              />
              {inputsError.password && <span>Минимум 6 символов</span>}
            </div>
          </div>
        </div>
        <div className="button-box">
          {loader ? (
            <Loader style={"green"} />
          ) : (
            <BaseButton
              onClick={(e) => {
                e.preventDefault();
                submitHandler();
              }}
              styles="button-box__submit"
            >
              Отправить
            </BaseButton>
          )}
        </div>
      </div>
      <div className="registration-body__right">
        <h4>Отказ от специалиста в любой момент</h4>
        <div className="registration-body__right-text">
          <img src={anyMoment}></img>
          <p>
            Поменяйте, откажитесь или возьмите еще специалиста в любой момент
            работы.
          </p>
        </div>
        <h4>100% постоплата</h4>
        <div className="registration-body__right-text">
          <img src={doc}></img>
          <p>
            Договор не подразумевает какую‑либо оплату до того, как вы
            арендовали специалиста
          </p>
        </div>
        <h4>Есть вопросы?</h4>
        <div className="registration-body__right-text">
          <img src={telegramLogo}></img>
          <p>Напишите нам в Телеграм. Мы с удовольствием ответим!</p>
        </div>
      </div>
      <span onClick={() => closeModal()} className="exit"></span>
    </ModalLayout>
  );
};

export default ModalRegistration;
