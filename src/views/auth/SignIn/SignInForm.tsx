import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean
  forgotPasswordUrl?: string
  signUpUrl?: string
}

type SignInFormSchema = {
  username: string
  password: string
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required(
    'Por favor, ingrese su correo correctamente.',
  ),
  password: Yup.string().required('Por favor, ingrese su contraseña.'),
})

const SignInForm = (props: SignInFormProps) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    signUpUrl = '/sign-up',
  } = props

  const [message, setMessage] = useTimeOutMessage()

  const { signIn } = useAuth()

  const onSignIn = async (
    values: SignInFormSchema,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    const { username, password } = values
    setSubmitting(true)

    const result = await signIn({ username, password })

    if (result?.status === 'failed') {
      setMessage(result.message)
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <>{message}</>
        </Alert>
      )}
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Correo electrónico"
                invalid={(errors.username && touched.username) as boolean}
                errorMessage={errors.username}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="username"
                  placeholder="Ingresa tu correo"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Contraseña"
                invalid={(errors.password && touched.password) as boolean}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="**********"
                  component={PasswordInput}
                />
              </FormItem>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
              </Button>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm
