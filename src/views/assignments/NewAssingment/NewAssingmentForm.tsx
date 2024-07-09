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
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Usuario"
                  className="w-1/5"
                  invalid={errors.userId && touched.userId}
                  errorMessage={errors.userId}
                >
                  <Field name="userId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={setUserOptions()}
                        placeholder="Selecciona el usuario..."
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
                  className="w-1/5"
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
                  className="w-1/5"
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
                  asterisk
                  className="w-1/5"
                  errorMessage={errors.origin}
                  invalid={errors.origin && touched.origin}
                  label="Origen del Cliente"
                >
                  <Field
                    name="origin"
                    type="text"
                    component={Input}
                    placeholder="Ingrese el origen del cliente"
                    autoComplete="off"
                  />
                </FormItem>
              </div>
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Fecha asignada"
                  className="w-1/5"
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
                  className="w-1/5"
                  errorMessage={errors.status}
                  invalid={errors.status && touched.status}
                >
                  <Field
                    type="text"
                    name="status"
                    placeholder="Ingrese el estatus"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  label="Observaciones"
                  className="w-1/5"
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

              <div className="flex items-center justify-end">
                <FormItem>
                  <Button
                    type="submit"
                    size="sm"
                    variant="solid"
                    disabled={isSubmitting}
                    icon={<HiOutlineSave />}
                  >
                    Guardar
                  </Button>
                </FormItem>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default NewAssingmentForm
