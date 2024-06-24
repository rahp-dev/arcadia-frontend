import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import {
  CreateUserBody,
  CreateUserFormModel,
} from '@/services/users/types/user.type'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import './UserForm.css'
import {
  useCreateUserMutation,
  useGetUserRolesQuery,
} from '@/services/RtkQueryService'
import { Select as SelectType } from '@/@types/select'
import openNotification from '@/utils/useNotification'
import useAuth from '@/utils/hooks/useAuth'
import { RolesEnum } from '@/enums/roles.enum'

type FormModel = {
  name: string
  lastName: string
  email: string
  password: string
  identityCard: string
  primaryPhone: string
  rolId: number | null
  imgUrl?: string
}

type Option = {
  value: string
  label: string
}

// const MIN_UPLOAD = 0
// const MAX_UPLOAD = 1

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido.'),
  lastName: Yup.string().required('Apellido requerido.'),
  email: Yup.string()
    .email('Email erroneo.')
    .required('El email es requerido.'),
  identityCard: Yup.string().required('Ingrese el documento de identidad.'),
  primaryPhone: Yup.string().required('Ingrese el número.'),
  rolId: Yup.number().required('Rol requerido'),
  // imgUrl: Yup.array().min(MIN_UPLOAD, 'Debe añadir un solo archivo'),
})

const UserProfileForm = ({
  newUserData,
}: {
  newUserData: {
    name: string
    lastName: string
    email: string
    primaryPhone: string
    password: string
    identityCard: string
    rolId: number | null
  }
}) => {
  const navigate = useNavigate()

  const { isSuperAdmin } = useAuth()

  const [cedulaPreffix, setCedulaPreffix] = useState('')
  const [identityCardValue, setIdentityCardValue] = useState('')

  const [createUser, { data, isError, isSuccess, isUninitialized }] =
    useCreateUserMutation()

  const { data: rolOptions } = useGetUserRolesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const setRolOptions = () => {
    if (isSuperAdmin) {
      return rolOptions
    }
    return rolOptions?.filter(
      (option: SelectType) => option.value !== RolesEnum.SUPER_ADMIN,
    )
  }

  const onSubmit = (values: FormModel) => {
    const {
      name,
      lastName,
      identityCard,
      password,
      primaryPhone,
      rolId,
      email,
    } = values

    const body: CreateUserBody = {
      name,
      lastName,
      identityCard,
      email,
      password,
      primaryPhone,
      rolId,
    }

    createUser(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        '¡Creación completada!',
        'El usuario ha sido creado exitosamente.',
        3,
      )

      setTimeout(() => {
        navigate('/usuarios')
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Ha ocurrido un error',
        'Ocurrio un error al crear el usuario, por favor intenta más tarde.',
        3,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      enableReinitialize
      initialValues={newUserData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex justify-between items-center gap-3">
                <FormItem
                  asterisk
                  label="Nombre"
                  className="w-1/5"
                  invalid={errors.name && touched.name}
                  errorMessage={errors.name}
                >
                  <Field
                    type="text"
                    name="name"
                    placeholder="Nombre del usuario"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Apellido"
                  className="w-1/5"
                  invalid={errors.lastName && touched.lastName}
                  errorMessage={errors.lastName}
                >
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Apellido del usuario"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Correo electrónico"
                  className="w-1/5"
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="text"
                    name="email"
                    placeholder="Correo del usuario"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Contraseña"
                  className="w-1/5"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field
                    type="password"
                    name="password"
                    placeholder="********"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  className="z-[10] customer-personal-info-suffix w-1/5"
                  label="Cédula"
                  invalid={errors.identityCard && touched.identityCard}
                  errorMessage={errors.identityCard}
                >
                  <Field name="identityCard">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Field
                        prefix={
                          <Select
                            className="w-[70px]"
                            placeholder="..."
                            options={[
                              {
                                value: 'V',
                                label: 'V',
                              },
                              {
                                value: 'E',
                                label: 'E',
                              },
                            ]}
                            onChange={(option: Option) => {
                              setCedulaPreffix(option.value)
                              form.setFieldValue(
                                'identityCard',
                                `${option.value}${identityCardValue}`,
                              )
                            }}
                          ></Select>
                        }
                        name="identityCard"
                        placeholder="Cédula"
                        type="text"
                        value={identityCardValue}
                        onChange={(event) => {
                          const newValue = event.target.value
                          setIdentityCardValue(newValue)
                          form.setFieldValue(
                            'identityCard',
                            `${cedulaPreffix}${newValue}`,
                          )
                        }}
                        component={Input}
                      ></Field>
                    )}
                  </Field>
                </FormItem>
              </div>
              <div className="flex items-center mb-4 gap-3">
                <FormItem
                  asterisk
                  label="Teléfono"
                  className="w-1/5"
                  invalid={errors.primaryPhone && touched.primaryPhone}
                  errorMessage={errors.primaryPhone}
                >
                  <Field
                    type="text"
                    name="primaryPhone"
                    placeholder="Número del usuario"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Rol"
                  className="w-1/5"
                  invalid={errors.rolId && touched.rolId}
                  errorMessage={errors.rolId}
                >
                  <Field>
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={setRolOptions()}
                        placeholder="Selecciona el rol..."
                        onChange={(option: SelectType) => {
                          form.setFieldValue(field.name, option?.value)
                        }}
                      />
                    )}
                  </Field>
                </FormItem>
              </div>

              <FormItem>
                <Button
                  variant="solid"
                  type="submit"
                  className="font-semibold transition-colors shadow duration-300"
                >
                  Siguiente
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default UserProfileForm
