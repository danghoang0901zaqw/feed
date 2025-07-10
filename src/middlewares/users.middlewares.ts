import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Error'
import usersServices from '~/services/users.services'
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
