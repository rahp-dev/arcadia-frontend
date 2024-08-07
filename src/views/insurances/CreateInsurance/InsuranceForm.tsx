import * as Yup from 'yup'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'

import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import {
  useCreateInsuranceMutation,
  useCreateLodgingMutation,
  useGetOneCustomerQuery,
} from '@/services/RtkQueryService'
import { Select as SelectTypes } from '@/@types/select'
import { HiOutlinePlus } from 'react-icons/hi'
import openNotification from '@/utils/useNotification'
import {
  CreateInsuranceFormModel,
  CreateInsuranceBody,
} from '@/services/insurances/types/insurance.type'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  locator: Yup.string().required('Localizador requerido'),
  price: Yup.number().required('Precio requerido').min(0),
  customerId: Yup.number().required('Cliente requerido'),
})

type FormModel = CreateInsuranceFormModel

function InsuranceForm({
  insuranceData,
  setInsuranceData,
}: {
  insuranceData: CreateInsuranceFormModel
  setInsuranceData: Dispatch<SetStateAction<CreateInsuranceFormModel>>
}) {
  const navigate = useNavigate()

  const { data: customerOptions } = useGetOneCustomerQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const setCustomerOptions = () => {
    return customerOptions?.filter((option: SelectTypes) => option.value)
  }

  const [createInsurance, { data, isError, isSuccess, isUninitialized }] =
    useCreateInsuranceMutation()

  const onSubmit = async (values: FormModel) => {
    setInsuranceData(values)
    const { customerId, ...lodgingBody } = values

    const body: CreateInsuranceBody = {
      ...lodgingBody,
      customerId,
    }
    await createInsurance(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'El seguro de vida ha sido creado exitosamente',
        'El seguro de vida se ha creado sin problemas!',
        5,
      )

      setTimeout(() => {
        navigate('/seguros')
      }, 1 * 2000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'danger',
        'Ha ocurrido un error al crear el seguro de vida :(',
        'Verifique la información e intente nuevamente.',
        5,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      initialValues={insuranceData}
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
                  label="Nombre del seguro"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.name}
                  invalid={errors.name && touched.name}
                >
                  <Field
                    type="text"
                    name="name"
                    placeholder="Ingrese el seguro"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Localizador del seguro"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  errorMessage={errors.locator}
                  invalid={errors.locator && touched.locator}
                >
                  <Field
                    type="text"
                    name="locator"
                    placeholder="Ingrese el localizador"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Precio del seguro"
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

export default InsuranceForm
