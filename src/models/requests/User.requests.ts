export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  date_of_birth: string
  name: string
}

export interface SingOutRequest {
  refresh_token:string
}

export interface EmailVerifyBody {
  email_verify_token:string
}
