import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from "./types";
import { USER_SERVER } from "../components/Config";

export function loginUser(dataTosubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataTosubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function regiterUser(dataTosubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataTosubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth(dataTosubmit) {
  const request = axios
    .post(`${USER_SERVER}/auth`, dataTosubmit)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
