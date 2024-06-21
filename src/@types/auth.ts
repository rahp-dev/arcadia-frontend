export type SignInCredential = {
  username: string
  password: string
}

export type SignInResponse = {
  access_token: string
  refresh_token: string
  expirationInSeconds: number
  type: number
  rol: number
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
  userName: string
  email: string
  password: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}
