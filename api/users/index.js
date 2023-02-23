import express from 'express'
import createHttpError from 'http-errors'
import { createAccessToken, JWTMiddleware } from '../../lib/tools.js'
import usersModel from './model.js'

const usersRouter = express.Router()

//Allow a user to register a new account, returning a JWT token

usersRouter.post('/register', async (request, response, next) => {
  try {
    const newUser = new usersModel(request.body)
    const { _id, role } = await newUser.save()

    const payload = { _id: _id }
    const accessToken = await createAccessToken(payload)

    response.status(200).send({ accessToken })
  } catch (error) {
    next(error)
  }
})

//ALlow a user to login, returning a JWT token
usersRouter.post('/login', async (request, response, next) => {
  try {
    const { username, password } = request.body
    const user = await usersModel.checkDetails(username, password)

    if (user) {
      const payload = { _id: user._id }
      const accessToken = await createAccessToken(payload)
      response.send({ accessToken })
    } else {
      next(createHttpError(401, `Your login details were not correct`))
    }
  } catch (error) {
    next(error)
  }
})

//Returns the data for a logged in user

usersRouter.get('/me', JWTMiddleware, async (request, response, next) => {
  try {
    const user = await usersModel
      .findById(request.user._id)
      .select({ password: 0 })

    if (user) {
      response.send(user)
    } else {
      next(createHttpError(404, `Unable to find user with that ID`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
