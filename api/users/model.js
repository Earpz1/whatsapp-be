import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
})

userSchema.pre('save', async function (next) {
  const currentUser = this

  if (currentUser.isModified('password')) {
    const plainPassword = currentUser.password
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    currentUser.password = hashedPassword
  }
  next()
})

userSchema.static('checkDetails', async function (username, password) {
  const user = await this.findOne({ username })

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (passwordMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model('usersModel', userSchema)
