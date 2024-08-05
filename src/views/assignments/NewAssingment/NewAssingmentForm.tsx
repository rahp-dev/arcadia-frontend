import { Dispatch, SetStateAction, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Field, FieldProps, Form, Formik } from 'formik'

import openNotification from '@/utils/useNotification'
import {
  useCreateAssingmentMutation,
  useGetOneUserForAssingmentQuery,
} from '@/services/RtkQueryService'
import { Select as SelectTypes } from '@/@types/select'

import {
  CreateAssingmentBody,
  CreateAssingmentFormModel,
} from '@/services/assingment/types/assingment.type'
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import { HiOutlineSave } from 'react-icons/hi'

type FormModel = CreateAssingmentFormModel

const validationSchema = Yup.object().shape({
  userId: Yup.number().required('Debe de seleccionar un usuario'),
  clientName: Yup.string().required('Nombre del cliente requerido'),
  clientNumber: Yup.number().required('Numero del cliente requerido'),
  origin: Yup.string().required('Ingrese el origen del cliente'),
  resolvedTime: Yup.date().required('Fecha requerida'),
  status: Yup.string().required('Ingrese el status'),
  notes: Yup.string(),
})

type Option = {
  value: string
  label: string
}

const statusOptions: Option[] = [
  { value: 'REASIGNADO', label: 'Reasignado ✅' },
  { value: 'ATENDIDO', label: 'Atendido ✅' },
  { value: 'EN ESPERA', label: 'En espera 📝' },
]

const originOptions: Option[] = [
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Página Web', label: 'Página Web' },
  { value: 'Correo Electrónico', label: 'Correo Electrónico' },
  { value: 'Teléfono', label: 'Teléfono' },
  { value: 'Mensaje de Texto', label: 'Mensaje de Texto' },
  { value: 'Referido', label: 'Referido' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Oficina', label: 'Oficina' },
]

function NewAssingmentForm({
  assingmentData,
  setAssingmentData,
}: {
  assingmentData: CreateAssingmentFormModel
  setAssingmentData: Dispatch<SetStateAction<CreateAssingmentFormModel>>
}) {
  const navigate = useNavigate()

  const [createAssingment, { data, isError, isSuccess, isUninitialized }] =
    useCreateAssingmentMutation()

  const { data: userOptions } = useGetOneUserForAssingmentQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const setUserOptions = () => {
    return userOptions?.filter((option: SelectTypes) => option.value)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        '¡Asignación completada!',
        'La asignación ha sido creado exitosamente.',
        3,
      )

      setTimeout(() => {
        navigate('/asignaciones')
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Ha ocurrido un error',
        'Ocurrio un error al crear la asignación, por favor intenta más tarde.',
        3,
      )
    }
  }, [isSuccess, isError])

  const onSubmit = async (values: FormModel, { setSubmitting }: any) => {
    setAssingmentData(values)
    console.log(values)

    const { ...assingmentData } = values

    const body: CreateAssingmentBody = {
      ...assingmentData,
    }

    await createAssingment(body)
    setSubmitting(false)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={assingmentData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, isSubmitting }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  asterisk
                  label="Usuario"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  invalid={errors.userId && touched.userId}
                  errorMessage={errors.userId}
                >
                  <Field name="userId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={setUserOptions()}
                        placeholder="Selecciona uno..."
                        onChange={(option: SelectTypes) => {
                          form.setFieldValue(field.name, option.value)
                        }}
                        value={userOptions?.filter(
                          (option: SelectTypes) =>
                            option.value === values.userId,
                        )}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.clientName}
                  invalid={errors.clientName && touched.clientName}
                  label="Nombre del Cliente"
                >
                  <Field
                    name="clientName"
                    type="text"
                    component={Input}
                    placeholder="Ingrese el nombre"
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.clientNumber}
                  invalid={errors.clientNumber && touched.clientNumber}
                  label="Número del Cliente"
                >
                  <Field
                    name="clientNumber"
                    type="number"
                    component={Input}
                    placeholder="Ingrese el número"
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  label="Origen del Cliente"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.origin}
                  invalid={errors.origin && touched.origin}
                >
                  <Field name="origin">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={originOptions}
                        value={originOptions.filter(
                          (option) => option.value === values.origin,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                        placeholder="Selecciona uno"
                      />
                    )}
                  </Field>
                </FormItem>
              </div>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  asterisk
                  label="Fecha asignada"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  invalid={errors.resolvedTime && (touched.resolvedTime as any)}
                  errorMessage={errors.resolvedTime as any}
                >
                  <Field name="resolvedTime">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <DateTimepicker
                        placeholder="Selecciona la fecha"
                        field={field}
                        form={form}
                        onChange={(day) => {
                          form.setFieldValue(field.name, day)
                        }}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Estatus"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field name="status">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={statusOptions}
                        value={statusOptions.filter(
                          (option) => option.value === values.status,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                        placeholder="Selecciona uno"
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Observaciones"
                  className="xl:w-1/5 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.notes}
                  invalid={errors.notes && touched.notes}
                >
                  <Field
                    type="text"
                    name="notes"
                    placeholder="Ingrese la observación"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
              </div>

              <div className="flex items-center justify-end border-t pt-4">
                <Button
                  type="submit"
                  size="sm"
                  variant="solid"
                  disabled={isSubmitting}
                  icon={<HiOutlineSave />}
                >
                  Guardar
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default NewAssingmentForm
