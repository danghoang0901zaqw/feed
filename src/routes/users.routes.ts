import express from 'express'
import UsersControllers from '~/controllers/users.controllers'
import catchAsync from '~/middlewares/catchAsync.middlewares'
import { signInValidator, signUpValidator } from '~/middlewares/users.middlewares'
const router = express.Router()

router.route('/sign-in').post(signInValidator, catchAsync(UsersControllers.signIn))
router.route('/sign-up').post(signUpValidator, catchAsync(UsersControllers.signUp))
export default router
