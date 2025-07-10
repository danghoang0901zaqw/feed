import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'

interface CustomError extends Error {
  status?: number
  statusCode?: string | number
}

export const errorMiddlewares = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const customError = error as CustomError
  const status =
    customError?.status && String(customError.status).startsWith('4')
      ? HTTP_STATUS.BAD_REQUEST
      : HTTP_STATUS.INTERNAL_SERVER_ERROR
  const statusCode = customError.statusCode || 'error'
  const message = customError.message || 'Internal Server Error'
  res.status(status).json({
    status,
    statusCode: statusCode,
    message,
    stack: customError.stack
  })
}
