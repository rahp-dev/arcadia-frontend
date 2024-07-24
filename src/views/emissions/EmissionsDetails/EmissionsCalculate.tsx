import * as Yup from 'yup'
import { Field, Formik, Form, FieldProps } from 'formik'
import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Select,
} from '@/components/ui'
import { CalculateEmissionFormModel } from '@/services/emissions/types/emissions.type'
import { useGetEmissionProviderQuery } from '@/services/RtkQueryService'
import { airlines } from '@/constants/airlines.constant'
import { HiOutlineCheckCircle } from 'react-icons/hi'

const validationSchema = Yup.object().shape({
  orderId: Yup.number(),
  date: Yup.date(),
  airline: Yup.string(),
  costPrice: Yup.number(),
  amountPaid: Yup.string(),
  status: Yup.string(),
  observation: Yup.string(),
  providerSystemId: Yup.number(),
  agencyId: Yup.number(),
})

type FormModel = CalculateEmissionFormModel

type SelectProvider = {
  value: number
  label: string
  price: number
}

type Option = {
  value: string
  label: string
}

const statusOptions: Option[] = [
  { value: 'OPEN', label: 'Abierto 📂' },
  { value: 'PAID', label: 'Pagado ✅' },
  { value: 'CANCELLED', label: 'Cancelado ❌' },
  { value: 'REJECTED', label: 'Rechazado ❌' },
  { value: 'Pending', label: 'Pendiente 📝' },
]

function EmisionsCalculate({
  emissionData,
  editActive,
  emissionId,
  calculateEmission,
}: {
  emissionData: CalculateEmissionFormModel
  editActive: boolean
  emissionId: string
  calculateEmission: any
}) {
  const { data: providerOptions } = useGetEmissionProviderQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const calculateForm = (values: FormModel) => {
    calculateEmission({ id: emissionId, ...values })
  }

  return (
    <Formik
      initialValues={emissionData}
      validationSchema={validationSchema}
      onSubmit={calculateForm}
      enableReinitialize
    >
      {({ values }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex items-center gap-4">
                <FormItem label="Fecha" className="w-1/4">
                  <Field name="date">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <DatePicker
                        placeholder="Selecciona la fecha"
                        field={field}
                        form={form}
                        value={values.date}
                        disabled={editActive}
                        onChange={(day) => {
                          form.setFieldValue(field.name, day)
                        }}
                        inputFormat="DD-MM-YYYY"
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem label="Aerolínea" className="w-1/4">
                  <Field name="airline">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={airlines}
                        value={airlines?.filter(
                          (option: Option) => option.value === values.airline,
                        )}
                        onChange={(option: Option) => {
                          form.setFieldValue(field.name, option?.value)
                        }}
                        isDisabled={editActive}
                        placeholder="Selecciona una aerolinea..."
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem label="Sistema Proveedor" className="w-1/4">
                  <Field name="providerSystemId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={providerOptions}
                        placeholder="Selecciona el proveedor..."
                        onChange={(option: SelectProvider) => {
                          form.setFieldValue(field.name, option.value)
                        }}
                        value={providerOptions?.filter(
                          (option: SelectProvider) =>
                            option.value === values.providerSystemId,
                        )}
                        isDisabled={editActive}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem label="Precio costo" className="w-1/4">
                  <Field
                    type="number"
                    name="costPrice"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>
              </div>

              <div className="flex items-center gap-4">
                <FormItem label="Monto pagado" className="w-1/4">
                  <Field
                    type="text"
                    name="amountPaid"
                    disabled={editActive}
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem label="Estatus" className="w-1/4">
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
                        isDisabled={editActive}
                        placeholder="Selecciona uno"
                      />
                    )}
                  </Field>
                </FormItem>

                <FormItem label="Observaciones" className="w-1/4">
                  <Field
                    type="text"
                    name="observation"
                    component={Input}
                    autoComplete="off"
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem label="ID de Orden" className="w-1/4">
                  <Field
                    type="number"
                    name="orderId"
                    component={Input}
                    disabled
                  />
                </FormItem>
              </div>

              <div className="flex items-center justify-end gap-4 border-t pt-4">
                <Button
                  type="submit"
                  size="sm"
                  color="green-600"
                  variant="solid"
                  disabled={editActive}
                  icon={<HiOutlineCheckCircle />}
                >
                  Procesar cálculos
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default EmisionsCalculate
