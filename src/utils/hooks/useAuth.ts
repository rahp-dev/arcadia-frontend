import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
  signInSuccess,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import { RolesEnum } from '@/enums/roles.enum'

type Status = 'success' | 'failed'

function useAuth() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const query = useQuery()

  const { token, signedIn, refreshTimeouts, rol } = useAppSelector(
    (state) => state.auth.session,
  )

  const signIn = async (
    values: SignInCredential,
  ): Promise<
    | {
        status: Status
        message: string
      }
    | undefined
  > => {
    try {
      const resp = await apiSignIn(values)
      if (!resp.data) {
        return
      }

      const { access_token, expirationInSeconds, refresh_token, type, rol } =
        resp.data
      dispatch(
        signInSuccess({
          access_token,
          refresh_token,
          expirationInSeconds,
          type,
          rol,
        }),
      )

      const redirectUrl = query.get(REDIRECT_URL_KEY)
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
      return {
        status: 'success',
        message: '',
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values)
      if (resp.data) {
        const { access_token, refresh_token, expirationInSeconds, type, rol } =
          resp.data
        dispatch(
          signInSuccess({
            access_token,
            refresh_token,
            expirationInSeconds,
            type,
            rol,
          }),
        )

        const redirectUrl = query.get(REDIRECT_URL_KEY)
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
        return {
          status: 'success',
          message: '',
        }
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const handleSignOut = () => {
    dispatch(signOutSuccess())

    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signOut = async () => {
    await apiSignOut()
    handleSignOut()
  }

  return {
    authenticated: token && signedIn,
    isSuperAdmin: rol === RolesEnum.SUPER_ADMIN,
    signIn,
    signUp,
    signOut,
  }
}

export default useAuth
