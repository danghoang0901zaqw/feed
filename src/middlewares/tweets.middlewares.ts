import { checkSchema } from 'express-validator'
import { MediaType, TweetAudience, TweetType } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEET_MESSAGES } from '~/constants/message'
import AppError from '~/controllers/error.controler'
import { convertNumberEnumToArr } from '~/utils/common'
import { validate } from '~/utils/validate'

export const validatorCreateTweet = validate(
  checkSchema(
    {
      user_id: {
        notEmpty: true,
        errorMessage: {
          required: TWEET_MESSAGES.USER_ID_IS_REQUIRED
        }
      },
      type: {
        notEmpty: true,
        errorMessage: {
          required: TWEET_MESSAGES.TYPE_TWEET_IS_REQUIRED
        },
        isIn: {
          options: [convertNumberEnumToArr(TweetType)],
          errorMessage: {
            invalid: TWEET_MESSAGES.TYPE_TWEET_INVALID
          }
        }
      },
      audience: {
        notEmpty: true,
        errorMessage: {
          required: TWEET_MESSAGES.AUDIENCE_IS_REQUIRED
        },
        isIn: {
          options: [convertNumberEnumToArr(TweetAudience)],
          errorMessage: {
            invalid: TWEET_MESSAGES.AUDIENCE_INVALID
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: async (value, { req }) => {
            const { hashtags, mentions } = req.body
            if (req.body.type !== TweetType.Retweet && !value) {
              throw new AppError(TWEET_MESSAGES.CONTENT_IS_REQUIRED, HTTP_STATUS.BAD_REQUEST)
            }
            return true
          }
        }
      },
      parentId: {
        custom: {
          options: async (value, { req }) => {
            if ([TweetType.Retweet, TweetType.Quote, TweetType.Comment].includes(req.body.type)) {
              if (!value) {
                throw new AppError(TWEET_MESSAGES.PARENT_ID_IS_REQUIRED, HTTP_STATUS.BAD_REQUEST)
              }
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: async (value, { req }) => {
            if (value.length > 0 && value?.some((val: any) => typeof val !== 'string')) {
              throw new AppError(TWEET_MESSAGES.HASHTAGS_MUST_BE_STRING, HTTP_STATUS.BAD_REQUEST)
            }
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: async (value, { req }) => {
            if (value.length > 0 && value?.some((val: any) => typeof val !== 'string')) {
              throw new AppError(TWEET_MESSAGES.MENTIONS_MUST_BE_STRING, HTTP_STATUS.BAD_REQUEST)
            }
          }
        }
      },
      media: {
        isArray: true,
        custom: {
          options: async (value, { req }) => {
            if (
              value?.some((val: any) => {
                if (!convertNumberEnumToArr(MediaType).includes(val.type)) {
                  throw new AppError(TWEET_MESSAGES.MEDIA_TYPE_INVALID, HTTP_STATUS.BAD_REQUEST)
                }
                if (typeof val.url !== 'string') {
                  throw new AppError(TWEET_MESSAGES.MEDIA_URL_MUST_BE_STRING, HTTP_STATUS.BAD_REQUEST)
                }
              })
            )
              return true
          }
        }
      }
    },
    ['body']
  )
)
