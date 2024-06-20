import {
  Button,
  Checkbox,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Radio,
  Select,
  Switcher,
} from '@/components/ui'
import { useCreateClientMutation } from '@/services/RtkQueryService'
import {
  CreateClientBody,
  CreateClientFormModel,
} from '@/services/clients/types/client.type'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import * as Yup from 'yup'

import './ClientForm.css'
import openNotification from '@/utils/useNotification'
import { useNavigate } from 'react-router-dom'

type Option = {
  value: string
  label: string
}

const countrys: Option[] = [
  { value: 'USA', label: 'United States' },
  { value: 'CAN', label: 'Canada' },
  { value: 'MEX', label: 'Mexico' },
]

type FormModel = Pick<
  CreateClientFormModel,
  | 'name'
  | 'lastName'
  | 'identityCard'
  | 'birthDate'
  | 'country'
  | 'email'
  | 'instagram'
  | 'frequentTraveler'
  | 'passport'
  | 'phone'
  | 'state'
  | 'street'
>

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Muy corto')
    .max(20, 'Muy largo')
    .required('Por favor, ingrese el nombre'),
  lastName: Yup.string()
    .min(3, 'Muy corto')
    .max(20, 'Muy largo')
    .required('Por favor, ingrese el apellido'),
  identityCard: Yup.string().min(1).required('Por favor, ingrese la cedula'),
  passport: Yup.string(),
  frequentTraveler: Yup.boolean().required('Requerido'),
  email: Yup.string().email('Formato del correo incorrecto'),
  phone: Yup.string().required('Ingrese su numero de telefono'),
  instagram: Yup.string(),
  country: Yup.string().required('Seleccione uno'),
  state: Yup.string().required('Por favor, ingrese el estado'),
  street: Yup.string().required('Por favor, ingrese la calle'),
})

function ClientForm({ clientData }: { clientData: CreateClientFormModel }) {
  const navigate = useNavigate()
  const [createClient, { data, isError, isSuccess, isUninitialized }] =
    useCreateClientMutation()

  const [cedulaPreffix, setCedulaPreffix] = useState('')
  const [identityCardValue, setIdentityCardValue] = useState('')

  const onSubmit = (values: FormModel) => {
    const {
      name,
      lastName,
      birthDate,
      identityCard,
      passport,
      frequentTraveler,
      email,
      phone,
      instagram,
      country,
      state,
      street,
    } = values

    const body: CreateClientBody = {
      name,
      lastName,
      birthDate,
      identityCard,
      passport,
      frequentTraveler,
      email,
      phone,
      instagram,
      address: { country, state, street },
    }

    createClient(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        '¡Creación completada!',
        'El cliente ha sido creado exitosamente.',
        3,
      )

      setTimeout(() => {
        navigate('/clientes')
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Ha ocurrido un error',
        'Ocurrio un error al crear el cliente, por favor intenta más tarde.',
        3,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      enableReinitialize
      initialValues={clientData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        console.log(values)
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
                    placeholder="Nombre del cliente"
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
                    placeholder="Apellido del cliente"
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

                <FormItem
                  asterisk
                  label="Fecha de nacimiento"
                  className="w-1/5"
                  invalid={errors.birthDate && (touched.birthDate as any)}
                  errorMessage={errors.birthDate as any}
                >
                  <Field name="birthDate">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <DatePicker
                        placeholder="Selecciona la fecha"
                        field={field}
                        form={form}
                        onChange={(day) => {
                          form.setFieldValue(field.name, day)
                        }}
                        inputFormat="DD-MM-YYYY"
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Pasaporte"
                  className="w-1/5"
                  invalid={errors.passport && touched.passport}
                  errorMessage={errors.passport}
                >
                  <Field
                    type="text"
                    name="passport"
                    placeholder="Documento del cliente"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
              </div>
              <div className="flex justify-between items-center gap-5">
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
                    placeholder="Correo del cliente"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Teléfono"
                  className="w-1/5"
                  invalid={errors.phone && touched.phone}
                  errorMessage={errors.phone}
                >
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Número del cliente"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Instagram"
                  className="w-1/5"
                  invalid={errors.instagram && touched.instagram}
                  errorMessage={errors.instagram}
                >
                  <Field
                    type="text"
                    name="instagram"
                    placeholder="Instagram del cliente"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="País"
                  className="w-1/5"
                  invalid={errors.country && touched.country}
                  errorMessage={errors.country}
                >
                  <Field name="country">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        placeholder="Selecciona el país"
                        options={countrys}
                        value={countrys?.filter(
                          (option: Option) => option.value === values.country,
                        )}
                        onChange={(option: Option) => {
                          form.setFieldValue(field.name, option?.value)
                        }}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  className="w-1/5 text-center"
                  label="¿Viajero frecuente?"
                  invalid={errors.frequentTraveler && touched.frequentTraveler}
                  errorMessage={errors.frequentTraveler}
                >
                  <Field name="frequentTraveler">
                    {({ form, field }: FieldProps<FormModel>) => (
                      <div className="flex items-center justify-center gap-4">
                        <Switcher
                          onChange={(checked) => {
                            form.setFieldValue(field.name, checked)
                          }}
                        />
                        <label className="text-base font-semibold">Sí/No</label>
                      </div>
                    )}
                  </Field>
                </FormItem>
              </div>
              <div className="flex items-center gap-5">
                <FormItem
                  asterisk
                  label="Estado"
                  className="w-1/5"
                  invalid={errors.state && touched.state}
                  errorMessage={errors.state}
                >
                  <Field
                    type="text"
                    name="state"
                    placeholder="Estado"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Calle"
                  className="w-1/5"
                  invalid={errors.street && touched.street}
                  errorMessage={errors.street}
                >
                  <Field
                    type="text"
                    name="street"
                    placeholder="Calle"
                    autoComplete="off"
                    component={Input}
                  />
                </FormItem>
              </div>

              <FormItem>
                <Button type="submit" variant="solid">
                  Guardar
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default ClientForm
