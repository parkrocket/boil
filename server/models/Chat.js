const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema(
  {
    type: {
      type: String,
    },
    room: {
      type: String,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    view: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const chatRoomSchema = mongoose.Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = { Chat, ChatRoom };
