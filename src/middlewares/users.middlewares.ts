import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import { REGEX_USERNAME } from '~/constants/regex'
import AppError from '~/controllers/error.controler'
import { ErrorWithStatus } from '~/models/Error'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { comparePassword } from '~/utils/bcrypt'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validate'

export const signInValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      trim: true,
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
      }
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
      isStrongPassword: {
        options: {
          minLength: 8,
          minNumbers: 1,
          minLowercase: 1,
          minUppercase: 1
        },
        errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
      }
    }
  })
)

export const signUpValidator = validate(
  checkSchema({
    name: {
      isString: true,
      notEmpty: {
        errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
      },
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: USER_MESSAGES.NAME_LENGTH
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      trim: true,
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          const isExist = await usersServices.checkEmailExists(value)
          if (!!isExist) {
            throw new ErrorWithStatus(USER_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.UNPROCESSABLE_ENTITY)
          }
          return true
        }
      }
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
      isStrongPassword: {
        options: {
          minLength: 8,
          minNumbers: 1,
          minLowercase: 1,
          minUppercase: 1
        },
        errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
      }
    },
    confirm_password: {
      trim: true,
      notEmpty: {
        errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
      isStrongPassword: {
        options: {
          minLength: 8,
          minNumbers: 1,
          minLowercase: 1,
          minUppercase: 1
        },
        errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH)
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strictSeparator: true,
          strict: true
        },
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS8601_INVALID
      },
      notEmpty: {
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED
      }
    }
  })
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new AppError(USER_MESSAGES.UN_AUTHORIZATION, HTTP_STATUS.UNAUTHORIZED)
            }
            const accessToken = value.slice('Bearer '.length)
            if (!accessToken) {
              throw new AppError(USER_MESSAGES.UN_AUTHORIZATION, HTTP_STATUS.UNAUTHORIZED)
            }
            const decode = await verifyToken(accessToken)
            req.decodeAccessToken = decode
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const decode = await verifyToken(value)
            const isExistRefreshToken = await databaseServices.refreshTokens.findOne({
              token: value
            })
            if (!isExistRefreshToken) {
              throw new AppError(USER_MESSAGES.UN_AUTHORIZATION, HTTP_STATUS.UNAUTHORIZED)
            }
            req.decodeRefreshToken = decode
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema({
    email_verify_token: {
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new AppError(USER_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED, HTTP_STATUS.BAD_REQUEST)
          }
          const decode = await verifyToken(value)
          req.decodeEmailVerifyToken = decode
          return true
        }
      }
    }
  })
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseServices.users.findOne({ email: value })
            if (!user) {
              throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        notEmpty: {
          errorMessage: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const decode = await verifyToken(value)
            const user = await databaseServices.users.findOne({
              _id: new ObjectId(decode.userId)
            })
            if (user?.forgot_password_token !== value) {
              throw new AppError(USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyResetPasswordValidator = validate(
  checkSchema(
    {
      password: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        }
      },
      confirm_password: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH)
            }
            return true
          }
        }
      },
      forgot_password_token: {
        notEmpty: {
          errorMessage: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const decode = await verifyToken(value)
            const user = await databaseServices.users.findOne({
              _id: new ObjectId(decode.userId)
            })
            if (user?.forgot_password_token !== value) {
              throw new AppError(USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateProfileValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USER_MESSAGES.NAME_LENGTH
        },
        isString: true,
        trim: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          options: {
            strictSeparator: true,
            strict: true
          },
          errorMessage: USER_MESSAGES.DATE_OF_BIRTH_IS8601_INVALID
        }
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.BIO_IS_STRING
        },
        isLength: { options: { min: 1, max: 200 }, errorMessage: USER_MESSAGES.BIO_LENGTH }
      },
      location: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.LOCATION_IS_STRING
        },
        isLength: { options: { min: 1, max: 200 }, errorMessage: USER_MESSAGES.LOCATION_LENGTH }
      },
      website: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.WEBSITE_IS_STRING
        },
        isLength: { options: { min: 1, max: 200 }, errorMessage: USER_MESSAGES.WEBSITE_LENGTH }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.USERNAME_IS_STRING
        },
        custom: {
          options: async (val) => {
            if (!REGEX_USERNAME.test(val)) {
              throw new AppError(USER_MESSAGES.USERNAME_INVALID, HTTP_STATUS.BAD_REQUEST)
            }
            const user = await databaseServices.users.findOne({ username: val })
            if (user) {
              throw new AppError(USER_MESSAGES.USERNAME_EXISTS, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        },
        trim: true
      },

      avatar: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.IMAGE_URL_IS_STRING
        },
        isLength: { options: { min: 1, max: 400 }, errorMessage: USER_MESSAGES.IMAGE_URL_LENGTH }
      },
      cover: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGES.IMAGE_URL_IS_STRING
        },
        isLength: { options: { min: 1, max: 400 }, errorMessage: USER_MESSAGES.IMAGE_URL_LENGTH }
      }
    },
    ['body']
  )
)

export const followerValidator = validate(
  checkSchema({
    follower_user_id: {
      notEmpty: {
        errorMessage: USER_MESSAGES.FOLLOWER_USER_ID_IS_NOT_EMPTY
      },
      custom: {
        options: async (value, { req }) => {
          const { _id } = req.user
          if (_id.toString() === value) {
            throw new AppError(USER_MESSAGES.CANNOT_FOLLOW_YOURSELF, HTTP_STATUS.BAD_REQUEST)
          }
          const isExistUser = await databaseServices.users.findOne({ _id: new ObjectId(value) })
          if (!isExistUser) {
            throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
          }
          const isFollowing = await databaseServices.followers.findOne({
            user_id: new ObjectId(_id),
            follower_user_id: new ObjectId(value)
          })
          if (isFollowing) {
            throw new AppError(USER_MESSAGES.ALREADY_FOLLOWING, HTTP_STATUS.BAD_REQUEST)
          }
        }
      }
    }
  })
)

export const unFollowerValidator = validate(
  checkSchema({
    follower_user_id: {
      notEmpty: {
        errorMessage: USER_MESSAGES.FOLLOWER_USER_ID_IS_NOT_EMPTY
      },
      custom: {
        options: async (value, { req }) => {
          const { _id } = req.user
          const isExistUser = await databaseServices.users.findOne({ _id: new ObjectId(value) })
          if (!isExistUser) {
            throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
          }
          const isFollowing = await databaseServices.followers.findOne({
            user_id: new ObjectId(_id),
            follower_user_id: new ObjectId(value)
          })
          if (!isFollowing) {
            throw new AppError(USER_MESSAGES.HAVE_NOT_FOLLOWING, HTTP_STATUS.BAD_REQUEST)
          }
        }
      }
    }
  })
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.OLD_PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        },
        custom: {
          options: async (val, { req }) => {
            const { _id } = req.user
            const user = await databaseServices.users.findOne({
              _id: new ObjectId(_id)
            })
            if (!user) {
              throw new AppError(USER_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
            }
            if (!comparePassword(val, user.password)) {
              throw new AppError(USER_MESSAGES.OLD_PASSWORD_IS_WRONG, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        },
        trim: true
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value === req.body.old_password) {
              throw new AppError(USER_MESSAGES.NEW_PASSWORD_IS_SAME_OLD_PASSWORD, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        },
        trim: true
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isLength: { options: { min: 8, max: 50 }, errorMessage: USER_MESSAGES.PASSWORD_LENGTH },
        isStrongPassword: {
          options: {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_IS_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new AppError(USER_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH, HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        },
        trim: true
      }
    },
    ['body']
  )
)
