import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'

type ErrorType = Record<
  string,
  {
    message: string,
    [key: string]: any
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor(message: string, status: number) {
    this.message = message
    this.status = status
  }
}
export class ErrorEntity extends ErrorWithStatus {
  errors: ErrorType
  constructor({ message = USER_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY)
    this.errors = errors
  }
}
