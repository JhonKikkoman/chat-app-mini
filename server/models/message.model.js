/** @format */

import { Schema, model } from 'mongoose';

const messageSchem = new Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    messageType: {
      type: String,
      required: true,
    },
    textOrPathToFile: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    createAt: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Message', messageSchem);
