import axios from "axios";
import { SEND_CHAT, RECEIVE_CHAT, MY_SOCKET_ID, CLEAR_CHAT } from "./types";
import { CHAT_SERVER } from "../components/Config";

export const sendChat = () => {
  return {
    type: SEND_CHAT,
  };
};

export const socketId = () => {
  return {
    type: MY_SOCKET_ID,
  };
};

export const clearChat = () => {
  return {
    type: CLEAR_CHAT,
  };
};

export const receiveChat = (data) => {
  return {
    type: RECEIVE_CHAT,
    data,
  };
};
