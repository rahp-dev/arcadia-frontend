import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
  CreateOrderBody,
  CreateOrderFormModel,
} from '@/services/orders/types/orders.type'
import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Select,
} from '@/components/ui'
import {
  useCreateOrderMutation,
  useGetAllTicketsToOrdersQuery,
} from '@/services/RtkQueryService'
import openNotification from '@/utils/useNotification'
import { useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'

type FormModel = CreateOrderFormModel

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
  ticketIds: Yup.array().min(1, 'Al menos debe de seleccionar uno.'),
})

function OrderForm({
  orderData,
  setOrderData,
}: {
  orderData: CreateOrderFormModel
  setOrderData: Dispatch<SetStateAction<CreateOrderFormModel>>
}) {
  const navigate = useNavigate()

  const [createOrder, { data, isError, isSuccess, isUninitialized }] =
    useCreateOrderMutation()

  const { data: TicketsOptions } = useGetAllTicketsToOrdersQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const onSubmit = (values: FormModel) => {
    setOrderData({ ...orderData, ...values })

    const { ticketIds, ...orderBody } = orderData

    const body: CreateOrderBody = {
      ...orderBody,
      ticketIds: orderData.ticketIds,
    }

    createOrder(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'La orden ha sido completada exitosamente',
        'La orden se ha creado sin problemas!',
        5,
      )

      setTimeout(() => {
        navigate('/pedidos')
      }, 1 * 2000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'danger',
        'Ha ocurrido un error al finalizar la orden :(',
        'Verifique la información e intente nuevamente.',
        5,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      initialValues={orderData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setFieldValue }) => {
        return (
          <Form>
            <FormContainer>
              <div className="border-b border-slate-300 mb-6">
                <FormItem
                  label="Tickets"
                  errorMessage={errors.ticketIds as string}
                  invalid={!!errors.ticketIds && touched.ticketIds}
                >
                  <Field name="ticketIds">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select<Option, true>
                        isMulti
                        placeholder="Selecciona los tickets a cancelar..."
                        field={field}
                        componentAs={CreatableSelect}
                        form={form}
                        options={
                          TicketsOptions?.map((ticket) => ({
                            value: ticket.value,
                            label: ticket.label,
                          })) ?? []
                        }
                        value={
                          values.ticketIds.map((id) => ({
                            value: id,
                            label: TicketsOptions?.find(
                              (ticket) => ticket.value === id,
                            )?.label,
                          })) || []
                        }
                        onChange={(selectedOptions) =>
                          setFieldValue(
                            field.name,
                            selectedOptions.map((option) =>
                              Number(option.value),
                            ),
                          )
                        }
                      />
                    )}
                  </Field>
                </FormItem>
              </div>
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
                          form.setFieldValue(field.name, option.value)
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
                    type="text"
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
                          form.setFieldValue(field.name, option.value)
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
                    autoComplete="off"
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

export default OrderForm
