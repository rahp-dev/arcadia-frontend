import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Spinner,
} from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import { HiOutlineSave } from 'react-icons/hi'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Contraseña requerida.'),
  confirmPassword: Yup.string()
    .required('Confirme la contraseña.')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden.'),
})

const UserPasswordForm = ({
  setNewUserData,
  newUserData,
  createUser,
  isLoading,
  isSuccess,
}: {
  setNewUserData: Dispatch<
    SetStateAction<{
      name: string
      lastName: string
      email: string
      password: string
      confirmPassword: string
      rolId: number
    }>
  >
  newUserData: {
    name: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    rolId: number | null
  }
  createUser: any
  isLoading: boolean
  isSuccess: boolean
}) => {
  const initialValues = {
    password: newUserData.password,
    confirmPassword: newUserData.confirmPassword,
  }

  const onSubmit = (values: { password: string; confirmPassword: string }) => {
    const { confirmPassword, ...body } = newUserData

    createUser(body)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  asterisk
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  label="Contraseña"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field
                    autoComplete="off"
                    name="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    component={Input}
                    onChange={(e) => {
                      setNewUserData({
                        ...newUserData,
                        password: e.target.value,
                      })
                    }}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  label="Confirma la contraseña"
                  invalid={errors.confirmPassword && touched.confirmPassword}
                  errorMessage={errors.confirmPassword}
                >
                  <Field
                    autoComplete="off"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme su contraseña"
                    component={Input}
                    onChange={(e) => {
                      setNewUserData({
                        ...newUserData,
                        confirmPassword: e.target.value,
                      })
                    }}
                  />
                </FormItem>
              </div>
              <div className="flex items-center justify-end border-t pt-4">
                <Button
                  variant="solid"
                  type="submit"
                  size="sm"
                  icon={<HiOutlineSave />}
                  disabled={!isLoading && isSuccess}
                >
                  {isLoading ? (
                    <Spinner color="white" size={30} />
                  ) : (
                    <span>Guardar</span>
                  )}
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default UserPasswordForm
