import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { useCreateTicketMutation } from '@/services/RtkQueryService'
import {
  CreateTicketBody,
  CreateTicketFormModel,
} from '@/services/tickets/types/tickets.type'
import openNotification from '@/utils/useNotification'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  lodgingName: Yup.string().required('Ingrese el nombre del hospedaje.'),
  lodgingPlace: Yup.string().required('Ingrese la ubicacion del hospedaje.'),
  lodgingPrice: Yup.number().required('Precio requerido.'),
})

type FormModel = Pick<
  CreateTicketFormModel,
  'lodgingName' | 'lodgingPlace' | 'lodgingPrice'
>

function LodgingTab({
  ticketData,
  submitButtonText,
  setTicketData,
  setCurrentTab,
}: {
  ticketData: CreateTicketFormModel
  submitButtonText?: string
  setTicketData: Dispatch<SetStateAction<Partial<CreateTicketFormModel>>>
  setCurrentTab?: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3'>>
}) {
  const navigate = useNavigate()
  const [createTicket, { data, isError, isSuccess, isUninitialized }] =
    useCreateTicketMutation()

  const onSubmit = (values: FormModel) => {
    setTicketData({ ...ticketData, ...values })

    const {
      flightClass,
      handBaggage,
      baggage,
      insuranceName,
      insuranceLocation,
      insurancePrice,
      lodgingName: stateLodgingName,
      lodgingPlace: stateLodgingPlace,
      lodgingPrice: stateLodgingPrice,
      ...ticketBody
    } = ticketData

    const body: CreateTicketBody = {
      ...ticketBody,
      details_ticket: {
        type_flight_class: flightClass,
        hand_baggage: handBaggage,
        baggage,
      },
      accommodation: {
        name: values.lodgingName,
        location: values.lodgingPlace,
        price: values.lodgingPrice,
      },
      insurance: {
        name: insuranceName,
        location: insuranceLocation,
        price: insurancePrice,
      },
    }
    console.log(body)
    createTicket(body)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'El ticket de vuelo ha sido creado exitosamente!',
        'Ha creado el ticket con exito.',
        8,
      )

      setTimeout(() => {
        navigate('/pedidos')
      }, 1 * 2000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Ha ocurrido un error al crear el ticket :(',
        'Verifique la información e intentelo nuevamente.',
        8,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={ticketData}
      onSubmit={onSubmit}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Nombre del hospedaje"
                  className="w-1/5"
                  invalid={errors.lodgingName && touched.lodgingName}
                  errorMessage={errors.lodgingName}
                >
                  <Field
                    type="text"
                    name="lodgingName"
                    placeholder="Ingrese el nombre del hospedaje"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Localizador del hospedaje"
                  className="w-1/5"
                  invalid={errors.lodgingPlace && touched.lodgingPlace}
                  errorMessage={errors.lodgingPlace}
                >
                  <Field
                    type="text"
                    name="lodgingPlace"
                    placeholder="Ingrese la ubicación del hospedaje"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Precio del hospedaje"
                  className="w-1/5"
                  errorMessage={errors.lodgingPrice}
                  invalid={errors.lodgingPrice && touched.lodgingPrice}
                >
                  <Field
                    type="number"
                    name="lodgingPrice"
                    placeholder="Ingrese el precio del hospedaje"
                    component={Input}
                  />
                </FormItem>
              </div>
              <FormItem>
                <div className="flex">
                  <Button variant="solid" type="submit">
                    {submitButtonText ? submitButtonText : 'Siguiente'}
                  </Button>
                </div>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default LodgingTab
