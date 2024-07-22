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
  Switcher,
} from '@/components/ui'
import {
  useCreateOrderMutation,
  useGetAllTicketsToOrdersQuery,
} from '@/services/RtkQueryService'
import openNotification from '@/utils/useNotification'
import { useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { HiOutlineSave } from 'react-icons/hi'
import { paymentMethods } from '@/constants/paymentsMethods.constant'

type FormModel = CreateOrderFormModel

type Option = {
  value: number
  label: string
  totalPrice: number
}

type OptionStatus = {
  value: string
  label: string
}

const statusOptions: OptionStatus[] = [
  { value: 'Completed', label: 'Completado ✅' },
  { value: 'Canceled', label: 'Cancelado ❌' },
  { value: 'Pending', label: 'Pendiente 📝' },
]

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0, 'El monto final debe de ser mayor a 0')
    .required('Ingrese el monto final.'),
  paymentMethodId: Yup.string(),
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

  const onSubmit = async (values: FormModel, { setSubmitting }: any) => {
    setOrderData(values)
    const { ticketIds, ...orderBody } = values

    const body: CreateOrderBody = {
      ...orderBody,
      ticketIds,
    }

    await createOrder(body)
    setSubmitting(false)
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
        navigate('/ordenes')
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
              <div className="border-b border-slate-300 mb-6">
                <FormItem
                  asterisk
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
                            totalPrice: ticket.totalPrice,
                          })) ?? []
                        }
                        value={
                          values.ticketIds.map((id) => {
                            const selectedTicket = TicketsOptions?.find(
                              (ticket) => ticket.value === id,
                            )
                            return {
                              value: id,
                              label: selectedTicket?.label || '',
                              totalPrice: selectedTicket?.totalPrice || 0,
                            }
                          }) || []
                        }
                        onChange={handleTicketChange}
                      />
                    )}
                  </Field>
                </FormItem>
              </div>
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
                  className="w-1/5"
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
                  className="w-1/5"
                  invalid={errors.paymentMethodId && touched.paymentMethodId}
                  errorMessage={errors.paymentMethodId}
                >
                  <Field name="paymentMethodId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={paymentMethods}
                        placeholder="Seleccione uno"
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
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
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
                        isDisabled={!values.financed}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem label="Estatus" className="w-1/5">
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
                        placeholder="Selecciona uno"
                      />
                    )}
                  </Field>
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

export default OrderForm
