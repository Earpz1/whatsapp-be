import mongoose from 'mongoose'

const { Schema, model } = mongoose

const membersSchema = new Schema({
  _id: String,
  username: String,
  email: String,
  avatar: String,
})

const messageSchema = new Schema({
  _id: String,
  timestamp: integer($int32),
  sender: String,
})

const chatSchema = new Schema({
  members: {
    type: [membersSchema],
    required: true,
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
})

export default model('chatModel', chatSchema)
