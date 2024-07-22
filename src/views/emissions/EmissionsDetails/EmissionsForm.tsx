import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Select,
} from '@/components/ui'
import { agencies } from '@/constants/agencies.constant'
import { airlines } from '@/constants/airlines.constant'
import { paymentMethods } from '@/constants/paymentsMethods.constant'
import { CreateEmissionFormModel } from '@/services/emissions/types/emissions.type'
import { Field, Formik, Form, FieldProps } from 'formik'
import { HiOutlineSave } from 'react-icons/hi'
import * as Yup from 'yup'

type FormModel = CreateEmissionFormModel
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

const validationSchema = Yup.object().shape({
  orderId: Yup.number(),
  date: Yup.date(),
  agency: Yup.string(),
  airline: Yup.string(),
  passengerCount: Yup.number(),
  providerSystem: Yup.string(),
  costPrice: Yup.number(),
  providerFee: Yup.number(),
  totalToPay: Yup.number(),
  clientPayment: Yup.number(),
  generatedFee: Yup.number(),
  advisorCommission: Yup.number(),
  amountPaid: Yup.string(),
  paymentMethod: Yup.string(),
  status: Yup.string(),
  observation: Yup.string(),
})

function EmissionsForm({
  emissionData,
  editActive,
  emissionId,
  updateEmission,
}: {
  emissionData: CreateEmissionFormModel
  editActive: boolean
  emissionId: string
  updateEmission: any
}) {
  const onSubmit = (values: FormModel) => {
    console.log(values)
    updateEmission({ id: emissionId, ...values })
  }

  return (
    <Formik
      initialValues={emissionData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, isSubmitting }) => {
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
                <FormItem label="Agencia" className="w-1/4">
                  <Field name="agency">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={agencies}
                        value={agencies?.filter(
                          (option: Option) => option.value === values.agency,
                        )}
                        onChange={(option: Option) => {
                          form.setFieldValue(field.name, option?.value)
                        }}
                        isDisabled={editActive}
                        placeholder="Selecciona una agencia..."
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
                <FormItem label="Conteo de pasajeros" className="w-1/4">
                  <Field
                    type="number"
                    name="passengerCount"
                    disabled={editActive}
                    component={Input}
                  />
                </FormItem>
              </div>

              <div className="flex items-center gap-4">
                <FormItem label="Sistema Proveedor" className="w-1/4">
                  <Field
                    type="text"
                    name="providerSystem"
                    component={Input}
                    disabled={editActive}
                    autoComplete="off"
                  />
                </FormItem>

                <FormItem label="Precio costo" className="w-1/4">
                  <Field
                    type="number"
                    name="costPrice"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem label="Tarifa del Proveedor" className="w-1/4">
                  <Field
                    type="number"
                    name="providerFee"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem label="Total a Pagar" className="w-1/4">
                  <Field
                    type="number"
                    name="totalToPay"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>
              </div>

              <div className="flex items-center gap-4">
                <FormItem label="Pago del Cliente" className="w-1/4">
                  <Field
                    type="number"
                    name="clientPayment"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem label="Tarifa generada" className="w-1/4">
                  <Field
                    type="number"
                    name="generatedFee"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem label="Comisión del Asesor" className="w-1/4">
                  <Field
                    type="number"
                    name="advisorCommission"
                    disabled={editActive}
                    component={Input}
                  />
                </FormItem>

                <FormItem label="Cantidad Pagada" className="w-1/4">
                  <Field
                    type="text"
                    name="amountPaid"
                    disabled={editActive}
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
              </div>

              <div className="flex justify-center items-center gap-4 border-t pt-4">
                <FormItem label="Método de pago" className="w-1/4">
                  <Field name="paymentMethod.id">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={paymentMethods}
                        placeholder="Seleccione uno"
                        isDisabled={editActive}
                        value={paymentMethods.filter(
                          (option) => option.value === values.paymentMethod.id,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                      />
                    )}
                  </Field>
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
              </div>

              <div className="flex items-center justify-end border-t pt-4">
                <Button
                  type="submit"
                  size="sm"
                  variant="solid"
                  disabled={editActive}
                  icon={<HiOutlineSave />}
                >
                  Guardar cambios
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default EmissionsForm
