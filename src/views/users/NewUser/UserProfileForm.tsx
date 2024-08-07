import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Dispatch, SetStateAction, useState } from 'react'
import * as Yup from 'yup'

import './UserForm.css'
import {
  useGetAllSedesQuery,
  useGetUserRolesQuery,
} from '@/services/RtkQueryService'
import { Select as SelectType } from '@/@types/select'
import useAuth from '@/utils/hooks/useAuth'
import { RolesEnum } from '@/enums/roles.enum'
import { HiOutlineArrowCircleRight } from 'react-icons/hi'

type FormModel = {
  name: string
  lastName: string
  email: string
  identityCard: string
  primaryPhone: string
  rolId: number
  sedeId: number
}

type Option = {
  value: string
  label: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido.'),
  lastName: Yup.string().required('Apellido requerido.'),
  email: Yup.string()
    .email('Email erroneo.')
    .required('El email es requerido.'),
  identityCard: Yup.string().required('Ingrese el documento de identidad.'),
  primaryPhone: Yup.string().required('Ingrese el número.'),
  rolId: Yup.number().required('Rol requerido'),
  sedeId: Yup.number().required('Rol requerido'),
})

const UserProfileForm = ({
  newUserData,
  setNewUserData,
  navigationTabs,
}: {
  navigationTabs: Dispatch<SetStateAction<string>>
  setNewUserData: any
  newUserData: {
    name: string
    lastName: string
    email: string
    primaryPhone: string
    password: string
    confirmPassword: string
    identityCard: string
    rolId: number | null
    sedeId: number | null
  }
}) => {
  const { isSuperAdmin } = useAuth()
  const [cedulaPreffix, setCedulaPreffix] = useState('')
  const [identityCardValue, setIdentityCardValue] = useState('')

  const { data: rolOptions } = useGetUserRolesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )
  const { data: sedeOptions } = useGetAllSedesQuery(
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

  return (
    <Formik
      enableReinitialize
      initialValues={newUserData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setNewUserData(values)
        navigationTabs('tab2')
      }}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  asterisk
                  label="Nombre"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
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
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
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
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
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
                  className="z-[10] customer-personal-info-suffix xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
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
                <FormItem
                  asterisk
                  label="Teléfono"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
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
              </div>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  asterisk
                  label="Rol"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  invalid={errors.rolId && touched.rolId}
                  errorMessage={errors.rolId}
                >
                  <Field name="rolId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={setRolOptions()}
                        placeholder="Selecciona el rol..."
                        onChange={(option: SelectType) => {
                          form.setFieldValue(field.name, option.value)
                        }}
                        value={rolOptions?.filter(
                          (option: SelectType) => option.value === values.rolId,
                        )}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  label="Sede"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  invalid={errors.sedeId && touched.sedeId}
                  errorMessage={errors.sedeId}
                >
                  <Field name="sedeId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={sedeOptions}
                        placeholder="Selecciona la sede..."
                        onChange={(option: SelectType) => {
                          form.setFieldValue(field.name, option.value)
                        }}
                        value={sedeOptions?.filter(
                          (option: SelectType) =>
                            option.value === values.sedeId,
                        )}
                      />
                    )}
                  </Field>
                </FormItem>
              </div>

              <div className="flex items-center justify-end border-t pt-4">
                <Button
                  variant="solid"
                  size="sm"
                  type="submit"
                  className="font-semibold transition-colors shadow duration-300"
                  icon={<HiOutlineArrowCircleRight />}
                >
                  Siguiente
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default UserProfileForm
