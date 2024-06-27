import { Dispatch, SetStateAction } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import { CreateOrderFormModel } from '@/services/orders/types/orders.type'
import { FormContainer, FormItem } from '@/components/ui'

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

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0, 'El monto final debe de ser mayor a 0')
    .required('Ingrese el monto final.'),
  paymentMethod: Yup.string().required('Ingrese el método de pago'),
  paymentReference: Yup.string().required('Ingrese la referencia del pago'),
  status: Yup.string().required('Ingrese el estado de la orden'),
  numQuotes: Yup.string().required('Seleccione un plan de cuotas'),
  financed: Yup.boolean().required('Seleccione una opción'),
  transactionDate: Yup.date().required('Seleccione la fecha de la transacción'),
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
  const onSubmit = () => {
    console.log('hola')
  }

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
              <FormItem
                asterisk
                label="Forma de Pago"
                invalid={errors.paymentMethod && touched.paymentMethod}
                errorMessage={errors.paymentMethod}
              ></FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default FinishTab
