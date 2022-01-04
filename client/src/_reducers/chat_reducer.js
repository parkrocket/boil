import {
  SEND_CHAT,
  RECEIVE_CHAT,
  CLEAR_CHAT,
  MY_SOCKET_ID,
} from "../_actions/types";

const chatStates = {
  chatList: [],
  socketId: null,
};

const chatReducer = (state = chatStates, action) => {
  switch (action.type) {
    case MY_SOCKET_ID:
      return { ...state, socketId: action.socketId };
    case RECEIVE_CHAT:
      let newChatList = state.chatList.slice();
      newChatList.push(action.data);
      return { ...state, chatList: newChatList };
    case CLEAR_CHAT:
      return { ...state, chatList: [] };
    default:
      return state;
  }
};

export default chatReducer;
