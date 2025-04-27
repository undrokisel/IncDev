import axios from "axios";

import { getToken, urlHasParams } from "@utils/helper";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  validateStatus(status) {
    // пропускает все статусы как успешные, придется далее обрабатывать ошибки
    return status;
  },
});

export const apiRequest = (
  url,
  {
    method = "get",
    params,
    data,
    headers = {
      // доступ к серверу с любого домена
      // можно указать конкретный домен для доступа к ресурсам
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  } = {}
) => {
  const fullHeaders = { ...headers, ...getToken() };
  let urWithParams = urlHasParams(url);

  return instance
    .request({
      url: urWithParams,
      method,
      params,
      data,
      headers: { ...fullHeaders },
    })
    .then(
      (response) =>
            
        new Promise((resolve) => {
          if (response.data?.redirect || response.status === 401) {
            window.location.replace("/auth");
            localStorage.clear();
            // dispatch(auth(false));
          }
          return resolve(response);
        })
    )
    .then((response) => new Promise((resolve) => resolve(response.data)));
};

const RequestError = (code, msg, data) => {
  let messag = msg ? `- ${msg}` : "";

  this.name = "RequestError";
  this.message = `API returned: ${code}${messag}.`;
  this.code = code;
  this.description = msg;
  this.data = data;
};

RequestError.prototype = Object.create(Error.prototype);
RequestError.prototype.constructor = RequestError;
