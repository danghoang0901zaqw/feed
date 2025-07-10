class AppError extends Error {
  statusCode: string
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status || 500
    this.statusCode = `${this.status}`.startsWith('4') ? 'fail' : 'error'
    Error.captureStackTrace(this, this.constructor)
  }
}
export default AppError
