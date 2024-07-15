import { Dispatch, SetStateAction } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { CreateOrderFormModel } from '@/services/orders/types/orders.type'
import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Select,
  Switcher,
} from '@/components/ui'

import { HiOutlineSave } from 'react-icons/hi'

type FormModel = CreateOrderFormModel

type Option = {
  value: string
  label: string
  totalPrice: number
}

const paymentMethods: { value: string; label: string }[] = [
  { value: 'USD', label: 'Efectivo ($)' },
  { value: 'Transferencia Bancaria', label: 'Transferencia Bancaria' },
  { value: 'Pago Móvil', label: 'Pago Móvil' },
  { value: 'Zelle', label: 'Zelle' },
]

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0, 'El monto final debe de ser mayor a 0')
    .required('Ingrese el monto final.'),
  paymentMethod: Yup.string(),
  paymentReference: Yup.string(),
  status: Yup.string(),
  numQuotes: Yup.string(),
  financed: Yup.boolean(),
  transactionDate: Yup.date(),
})

function UpdateOrderForm({
  orderData,
  editActive,
  orderId,
  updateOrder,
}: {
  orderData: CreateOrderFormModel
  editActive: boolean
  orderId: string
  updateOrder: any
}) {
  const onSubmit = (values: FormModel) => {
    updateOrder({ id: orderId, ...values })
  }

  return (
    <Formik
      initialValues={orderData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, touched, errors, setFieldValue, isSubmitting }) => {
        const handleTicketChange = (selectedOptions: Option[]) => {
          const totalPrice = selectedOptions.reduce(
            (sum, option) => sum + option.totalPrice,
            0,
          )
          setFieldValue(
            'ticketIds',
            selectedOptions.map((option) => option.value),
          )
          setFieldValue('amount', totalPrice)
        }

        return (
          <Form>
            <FormContainer>
              <div className="flex items-center">
                <FormItem
                  errorMessage={errors.financed}
                  invalid={errors.financed && touched.financed}
                >
                  <Field name="financed">
                    {({ form, field }: FieldProps<FormModel>) => (
                      <div className="flex items-center gap-4">
                        <label className="text-base font-semibold">
                          Al contado
                        </label>
                        <Switcher
                          disabled={editActive}
                          checked={field.checked}
                          onChange={(checked) => {
                            form.setFieldValue(field.name, checked)
                            if (!checked) {
                              form.setFieldValue('numQuotes', 0)
                            }
                          }}
                        />
                        <label className="text-base font-semibold">
                          Financiado
                        </label>
                      </div>
                    )}
                  </Field>
                </FormItem>
              </div>
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Monto total"
                  className="w-1/4"
                  errorMessage={errors.amount}
                  invalid={errors.amount && touched.amount}
                >
                  <Field
                    type="number"
                    name="amount"
                    placeholder="Ingrese el precio total"
                    component={Input}
                    disabled
                  />
                </FormItem>
                <FormItem
                  label="Método de Pago"
                  className="w-1/4"
                  invalid={errors.paymentMethod && touched.paymentMethod}
                  errorMessage={errors.paymentMethod}
                >
                  <Field name="paymentMethod">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={paymentMethods}
                        placeholder="Seleccione uno"
                        isDisabled={editActive}
                        value={paymentMethods.filter(
                          (option) => option.value === values.paymentMethod,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Referencia del pago"
                  className="w-1/4"
                  errorMessage={errors.paymentReference}
                  invalid={errors.paymentReference && touched.paymentReference}
                >
                  <Field
                    type="text"
                    name="paymentReference"
                    placeholder="Ingrese el n° de referencia"
                    component={Input}
                    disabled={editActive}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  label="Fecha del pago"
                  className="w-1/4"
                  invalid={
                    errors.transactionDate && (touched.transactionDate as any)
                  }
                  errorMessage={errors.transactionDate as any}
                >
                  <Field name="transactionDate">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <DatePicker
                        placeholder="Selecciona la fecha"
                        field={field}
                        form={form}
                        disabled={editActive}
                        onChange={(day) => {
                          form.setFieldValue(field.name, day)
                        }}
                        inputFormat="DD-MM-YYYY"
                      />
                    )}
                  </Field>
                </FormItem>
              </div>
              <div className="flex items-center gap-4">
                <FormItem
                  label="N° de cuotas"
                  className="w-1/4"
                  errorMessage={errors.numQuotes}
                  invalid={errors.numQuotes && touched.numQuotes}
                >
                  <Field name="numQuotes">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={[
                          { value: 0, label: 'Ninguna' },
                          { value: 1, label: '1 cuota' },
                          { value: 2, label: '2 cuotas' },
                          { value: 3, label: '3 cuotas' },
                        ]}
                        placeholder="Seleccione uno"
                        value={[
                          { value: 0, label: 'Ninguna' },
                          { value: 1, label: '1 cuota' },
                          { value: 2, label: '2 cuotas' },
                          { value: 3, label: '3 cuotas' },
                        ].filter((option) => option.value === values.numQuotes)}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option.value)
                        }
                        isDisabled={!values.financed || editActive}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Estatus"
                  className="w-1/4"
                  errorMessage={errors.status}
                  invalid={errors.status && touched.status}
                >
                  <Field
                    type="text"
                    name="status"
                    placeholder="Ingrese el estatus del pedido"
                    component={Input}
                    autoComplete="off"
                    disabled={editActive}
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

export default UpdateOrderForm
