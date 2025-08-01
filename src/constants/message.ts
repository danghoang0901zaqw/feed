export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_LENGTH: 'Name must be between 1 and 100 characters',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_IS_STRONG:
    'Password must be contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  PASSWORD_LENGTH: 'Password must be between 8 and 50 characters',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_MATCH: 'Confirm password must match the password',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_IS8601_INVALID: 'Date of birth must be a valid ISO 8601 date',
  LOGIN_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login successfully',
  REGISTER_SUCCESS: 'Register successfully',
  UN_AUTHORIZATION: 'Unauthorized',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  LOGOUT_SUCCESS: 'Logout successfully',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_TOKEN_IS_INVALID: 'Email verify token is invalid',
  EMAIL_VERIFY_SUCCESS: 'Email verify successfully',
  EMAIL_VERIFY_FAILED: 'Email verify failed',
  EMAIL_WAS_VERIFIED: 'Email was verified',
  USER_NOT_FOUND: 'User not found',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successfully',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  BIO_IS_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio must be between 1 and 200 characters',
  LOCATION_IS_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location must be between 1 and 200 characters',
  WEBSITE_IS_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website must be between 1 and 200 characters',
  USERNAME_IS_STRING: 'Username must be a string',
  USERNAME_INVALID: 'Username must be 1 to 15 characters long and only contain letters, numbers, or underscores',
  USERNAME_EXISTS: 'Username already exists',
  AVATAR_IS_STRING: 'Avatar must be a string',
  IMAGE_URL_IS_STRING: 'Image URL must be a string',
  IMAGE_URL_LENGTH: 'Image URL must be between 1 and 400 characters',
  UPDATE_PROFILE_SUCCESS: 'Update profile successfully',
  FOLLOWER_USER_ID_IS_NOT_EMPTY: 'Follower user ID is not empty',
  FOLLOW_SUCCESS: 'Follow successfully',
  CANNOT_FOLLOW_YOURSELF: 'Cannot follow yourself',
  ALREADY_FOLLOWING: 'Already following',
  UN_FOLLOW_SUCCESS: 'Unfollow successfully',
  HAVE_NOT_FOLLOWING: 'have not following user',
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully',
  NEW_PASSWORD_IS_SAME_OLD_PASSWORD: 'New password must be different from the old password.',
  OLD_PASSWORD_IS_REQUIRED: 'Old password is required',
  OLD_PASSWORD_IS_WRONG: 'Old password is wrong',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully'
} as const

export const TWEET_MESSAGES = {
  USER_ID_IS_REQUIRED: 'User ID is required',
  TYPE_TWEET_IS_REQUIRED: 'Type tweet is required',
  TYPE_TWEET_INVALID: 'Type tweet must be Tweet, Retweet Comment or Quote',
  AUDIENCE_IS_REQUIRED: 'Audience is required',
  AUDIENCE_INVALID: 'Audience must be Public, Private',
  PARENT_ID_IS_REQUIRED: 'Parent ID is required',
  CREATE_TWEET_SUCCESS: 'Create tweet successfully',
  CONTENT_IS_REQUIRED: 'Content is required',
  HASHTAGS_MUST_BE_STRING: 'Hashtags must be string',
  MENTIONS_MUST_BE_STRING: 'Mentions must be string',
  MEDIA_TYPE_INVALID: 'Media type must be image or video',
  MEDIA_URL_MUST_BE_STRING: 'Media URL must be string'
}
export const BOOKMARK_MESSAGES = {
  CREATE_SUCCESS: 'Create bookmark successfully',
  DELETE_SUCCESS: 'Delete bookmark successfully',
  FORBIDDEN: 'You do not have permission to delete this bookmark or it does not exist'
}

export const LIKE_MESSAGES = {
  CREATE_SUCCESS: 'Like successfully',
  DELETE_SUCCESS: 'Unlike successfully',
  FORBIDDEN: 'You do not have permission to delete this unlike or it does not exist'
}
