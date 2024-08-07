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

const amountPaid: Option[] = [
  { value: 'SI', label: 'Sí' },
  { value: 'NO', label: 'No' },
  { value: 'PARCIAL', label: 'Parcial' },
]

const statusOptions: Option[] = [
  { value: 'OPEN', label: 'Abierto 📂' },
  { value: 'PAID', label: 'Pagado ✅' },
  { value: 'CANCELLED', label: 'Cancelado ❌' },
  { value: 'REJECTED', label: 'Rechazado ❌' },
  { value: 'Pending', label: 'Pendiente 📝' },
]

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

  const { data: providerOptions } = useGetEmissionProviderQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const { data: agenciesOptions } = useGetAgenciesQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  return (
    <Formik initialValues={emissionData} onSubmit={onSubmit} enableReinitialize>
      {({ values }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  label="Fecha"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field name="date">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <DatePicker
                        placeholder="Selecciona..."
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
                <FormItem
                  label="Agencia"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
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
                        placeholder="Selecciona..."
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Aerolínea"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
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
                        placeholder="Selecciona..."
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Conteo de pasajeros"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field
                    type="number"
                    name="passengerCount"
                    disabled={editActive}
                    component={Input}
                  />
                </FormItem>
              </div>

              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0">
                <FormItem
                  label="Sistema Proveedor"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field name="providerSystemId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={providerOptions}
                        placeholder="Selecciona..."
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

                <FormItem
                  label="Tarifa del Proveedor"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field
                    type="number"
                    name="providerFee"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem
                  label="Precio costo"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field
                    type="number"
                    name="costPrice"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem
                  label="Total a Pagar"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field
                    type="number"
                    name="totalToPay"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>
              </div>

              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col justify-center items-center gap-4 gap-y-0">
                <FormItem
                  label="Pago del Cliente"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field
                    type="number"
                    name="clientPayment"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem
                  label="Tarifa generada"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field
                    type="number"
                    name="generatedFee"
                    component={Input}
                    disabled={editActive}
                  />
                </FormItem>

                <FormItem
                  label="Monto pagado"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field name="amountPaid">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={amountPaid}
                        value={amountPaid.filter(
                          (option) => option.value === values.amountPaid,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                        isDisabled={editActive}
                        placeholder="Selecciona..."
                      />
                    )}
                  </Field>
                </FormItem>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-center text-slate-700 mb-2">
                  Comisiones Generadas
                </h4>
                <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col justify-center items-center gap-4 gap-y-0">
                  <FormItem
                    label="Comisión del Asesor"
                    className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  >
                    <Field
                      type="number"
                      name="advisorCommission"
                      disabled={editActive}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Comisión de la oficina"
                    className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  >
                    <Field
                      type="number"
                      name="officeCommission"
                      disabled={editActive}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Comisión del Líder de Ventas"
                    className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                  >
                    <Field
                      type="number"
                      name="advisorLeadCommission"
                      disabled={editActive}
                      component={Input}
                    />
                  </FormItem>
                </div>
              </div>

              <div className="flex xl:flex-row lg:flex-row mobile:flex-col xs:flex-col items-center gap-4 gap-y-0 justify-center border-t pt-4">
                <FormItem
                  label="Método de pago"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
                  <Field name="paymentMethodId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={paymentMethods}
                        placeholder="Seleccione uno"
                        isDisabled={editActive}
                        value={paymentMethods.filter(
                          (option) => option.value === values.paymentMethodId,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>

                <FormItem
                  label="Estatus"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
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
                        isDisabled={editActive}
                        placeholder="Selecciona uno"
                      />
                    )}
                  </Field>
                </FormItem>

                <FormItem
                  label="Observaciones"
                  className="xl:w-1/4 lg:w-1/4 md:lg:w-1/4 sm:lg:w-1/4 mobile:w-full xs:w-full"
                >
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
