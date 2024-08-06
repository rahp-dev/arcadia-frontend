import * as Yup from 'yup'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'

import {
  CreateLodgingBody,
  CreateLodgingFormModel,
} from '@/services/lodging/types/lodging.type'
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import {
  useCreateLodgingMutation,
  useGetOneCustomerQuery,
} from '@/services/RtkQueryService'
import { Select as SelectTypes } from '@/@types/select'
import { HiOutlinePlus } from 'react-icons/hi'
import openNotification from '@/utils/useNotification'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  locator: Yup.string().required('Localizador requerido'),
  price: Yup.number().required('Precio requerido').min(0),
  customerId: Yup.number().required('Cliente requerido'),
})

type FormModel = CreateLodgingFormModel

function LodgingForm({
  lodgingData,
  setLodgingData,
}: {
  lodgingData: CreateLodgingFormModel
  setLodgingData: Dispatch<SetStateAction<CreateLodgingFormModel>>
}) {
  const navigate = useNavigate()

  const { data: customerOptions } = useGetOneCustomerQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const setCustomerOptions = () => {
    return customerOptions?.filter((option: SelectTypes) => option.value)
  }

  const [createLodging, { data, isError, isSuccess, isUninitialized }] =
    useCreateLodgingMutation()

  const onSubmit = async (values: FormModel) => {
    setLodgingData(values)
    const { customerId, ...lodgingBody } = values

    const body: CreateLodgingBody = {
      ...lodgingBody,
      customerId,
    }
    await createLodging(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'El hospedaje ha sido creado exitosamente',
        'El hospedaje se ha creado sin problemas!',
        5,
      )

      setTimeout(() => {
        navigate('/ordenes')
      }, 1 * 2000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'danger',
        'Ha ocurrido un error al crear el hospedaje :(',
        'Verifique la información e intente nuevamente.',
        5,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      initialValues={lodgingData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  asterisk
                  label="Cliente"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.customerId as string}
                  invalid={errors.customerId && touched.customerId}
                >
                  <Field name="customerId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={setCustomerOptions()}
                        placeholder="Selecciona el cliente..."
                        onChange={(option: SelectTypes) => {
                          form.setFieldValue(field.name, option.value)
                        }}
                        value={customerOptions?.filter(
                          (option: SelectTypes) =>
                            option.value === values.customerId,
                        )}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  label="Nombre del hospedaje"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.name}
                  invalid={errors.name && touched.name}
                >
                  <Field
                    type="text"
                    name="name"
                    placeholder="Ingrese el hospedaje"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Localizador del hospedaje"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.locator}
                  invalid={errors.locator && touched.locator}
                >
                  <Field
                    type="text"
                    name="locator"
                    placeholder="Ingrese el hospedaje"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Precio del hospedaje"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.price}
                  invalid={errors.price && touched.price}
                >
                  <Field
                    type="number"
                    name="price"
                    placeholder="Ingrese el precio"
                    component={Input}
                  />
                </FormItem>
              </div>

              <div className="flex justify-end items-center border-t pt-4">
                <Button
                  variant="solid"
                  size="sm"
                  type="submit"
                  icon={<HiOutlinePlus />}
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

export default LodgingForm
