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
} as const
