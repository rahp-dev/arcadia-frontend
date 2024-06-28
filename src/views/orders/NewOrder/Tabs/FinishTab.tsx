import { Dispatch, SetStateAction, useEffect } from 'react'
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
} from '@/components/ui'

type FormModel = Pick<
  CreateOrderFormModel,
  | 'amount'
  | 'paymentMethod'
  | 'paymentReference'
  | 'status'
  | 'numQuotes'
  | 'financed'
  | 'transactionDate'
  | 'ticketsIds'
>

type Option = {
  value: string
  label: string
}

type OptionQuotes = {
  value: number
  label: string
}

const paymentMethods: Option[] = [
  { value: 'USD', label: 'Efectivo ($)' },
  { value: 'Transferencia Bancaria', label: 'Transferencia Bancaria' },
  { value: 'Pago Móvil', label: 'Pago Móvil' },
  { value: 'Zelle', label: 'Zelle' },
]

const numQuote: OptionQuotes[] = [
  { value: 0, label: 'Ninguna' },
  { value: 1, label: '1 cuota' },
  { value: 2, label: '2 cuotas' },
  { value: 3, label: '3 cuotas' },
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

function FinishTab({
  ticketId,
  orderData,
  setOrderData,
}: {
  ticketId: number
  orderData: CreateOrderFormModel
  setOrderData: Dispatch<SetStateAction<CreateOrderFormModel>>
}) {
  const onSubmit = (values: FormModel) => {
    console.log(values)
  }

  useEffect(() => {
    setOrderData((prevOrderData) => {
      if (!prevOrderData.ticketsIds.includes(ticketId)) {
        return {
          ...prevOrderData,
          ticketsIds: [...prevOrderData.ticketsIds, ticketId],
        }
      }
      return prevOrderData
    })
  }, [ticketId, setOrderData])

  return (
    <Formik
      enableReinitialize
      initialValues={orderData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Monto total"
                  className="w-1/5"
                  errorMessage={errors.amount}
                  invalid={errors.amount && touched.amount}
                >
                  <Field
                    type="number"
                    name="amount"
                    placeholder="Ingrese el precio total"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Método de Pago"
                  className="w-1/5"
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
                        value={paymentMethods.filter(
                          (option) => option.value === values.paymentMethod,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option?.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label="Referencia del pago"
                  className="w-1/5"
                  errorMessage={errors.paymentReference}
                  invalid={errors.paymentReference && touched.paymentReference}
                >
                  <Field
                    type="number"
                    name="paymentReference"
                    placeholder="Ingrese el n° de referencia"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Fecha del pago"
                  className="w-1/5"
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
                  className="w-1/5"
                  errorMessage={errors.numQuotes}
                  invalid={errors.numQuotes && touched.numQuotes}
                >
                  <Field name="numQuotes">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={numQuote}
                        placeholder="Seleccione uno"
                        value={numQuote.filter(
                          (option) => option.value === values.numQuotes,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option?.value)
                        }
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
                    placeholder="Ingrese el estatus del pedido"
                    component={Input}
                  />
                </FormItem>
                <FormItem label="Tickets" className="w-1/5">
                  <Field
                    type="text"
                    name="ticketsIds"
                    component={Input}
                    disabled
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

export default FinishTab
