import * as Yup from 'yup'
import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Select,
} from '@/components/ui'
import { Field, Formik, Form, FieldProps } from 'formik'

import { CreateEmissionFormModel } from '@/services/emissions/types/emissions.type'
import {
  useGetAgenciesQuery,
  useGetEmissionProviderQuery,
} from '@/services/RtkQueryService'

import { airlines } from '@/constants/airlines.constant'
import { paymentMethods } from '@/constants/paymentsMethods.constant'

import { HiOutlineSave } from 'react-icons/hi'

type FormModel = CreateEmissionFormModel

type Option = {
  value: string
  label: string
}

type OptionAgencies = {
  value: number
  label: string
}

type SelectProvider = {
  value: number
  label: string
  price: number
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
    updateEmission({ id: emissionId, ...values })
  }

  const { data: providerOptions } = useGetEmissionProviderQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const { data: agenciesOptions } = useGetAgenciesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  return (
    <Formik
      initialValues={emissionData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
                <FormItem label="Agencia" className="w-1/4">
                  <Field name="agencyId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={agenciesOptions}
                        value={agenciesOptions?.filter(
                          (option: OptionAgencies) =>
                            option.value === values.agencyId,
                        )}
                        onChange={(option: OptionAgencies) => {
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
                    disabled
                    component={Input}
                  />
                </FormItem>
              </div>

              <div className="flex items-center gap-4">
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
                          form.setFieldValue('providerFee', option.price)
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

                <FormItem label="Tarifa del Proveedor" className="w-1/4">
                  <Field
                    type="number"
                    name="providerFee"
                    component={Input}
                    disabled
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

                <FormItem label="Total a Pagar" className="w-1/4">
                  <Field
                    type="number"
                    name="totalToPay"
                    component={Input}
                    disabled
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

                <FormItem label="Monto Pagado" className="w-1/4">
                  <Field
                    type="text"
                    name="amountPaid"
                    disabled={editActive}
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-center text-slate-700 mb-2">
                  Comisiones Generadas
                </h4>
                <div className="flex justify-center items-center gap-4">
                  <FormItem label="Comisión del Asesor" className="w-1/4">
                    <Field
                      type="number"
                      name="advisorCommission"
                      disabled
                      component={Input}
                    />
                  </FormItem>
                  <FormItem label="Comisión de la oficina" className="w-1/4">
                    <Field
                      type="number"
                      name="officeCommission"
                      disabled
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Comisión del Líder de Ventas"
                    className="w-1/4"
                  >
                    <Field
                      type="number"
                      name="advisorLeadCommission"
                      disabled
                      component={Input}
                    />
                  </FormItem>
                </div>
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

              <div className="flex items-center justify-end gap-4 border-t pt-4">
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
