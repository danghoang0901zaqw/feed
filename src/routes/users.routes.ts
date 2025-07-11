import express from 'express'
import UsersControllers from '~/controllers/users.controllers'
import catchAsync from '~/middlewares/catchAsync.middlewares'
import {
  emailVerifyTokenValidator,
  refreshTokenValidator,
  signInValidator,
  accessTokenValidator,
  signUpValidator,
  forgotPasswordValidator,
  verifyForgotPasswordTokenValidator,
  verifyResetPasswordValidator
} from '~/middlewares/users.middlewares'
const router = express.Router()

router.route('/sign-in').post(signInValidator, catchAsync(UsersControllers.signIn))
router.route('/sign-up').post(signUpValidator, catchAsync(UsersControllers.signUp))
router.route('/sign-out').post(accessTokenValidator, refreshTokenValidator, catchAsync(UsersControllers.signOut))
router.route('/verify-email').post(emailVerifyTokenValidator, catchAsync(UsersControllers.verifyEmail))
router.route('/resend-verify-email').post(accessTokenValidator, catchAsync(UsersControllers.resendVerifyEmail))
router.route('/forgot-password').post(forgotPasswordValidator, catchAsync(UsersControllers.forgotPassword))
router
  .route('/verify-forgot-password')
  .post(verifyForgotPasswordTokenValidator, catchAsync(UsersControllers.verifyForgotPasswordToken))
  router
  .route('/reset-password')
  .post(verifyResetPasswordValidator, catchAsync(UsersControllers.resetPassword))

export default router
