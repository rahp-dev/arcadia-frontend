import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { useCreateTicketMutation } from '@/services/RtkQueryService'
import {
  CreateTicketBody,
  CreateTicketFormModel,
} from '@/services/tickets/types/tickets.type'
import openNotification from '@/utils/useNotification'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  lodgingName: Yup.string(),
  lodgingPlace: Yup.string(),
  lodgingPrice: Yup.number(),
})

type FormModel = Pick<
  CreateTicketFormModel,
  'lodgingName' | 'lodgingPlace' | 'lodgingPrice'
>

function LodgingTab({
  ticketData,
  submitButtonText,
  setTicketData,
}: {
  ticketData: CreateTicketFormModel[]
  submitButtonText?: string
  setTicketData: Dispatch<SetStateAction<CreateTicketFormModel[]>>
}) {
  const navigate = useNavigate()
  const [createTicket, { data, isError, isSuccess, isUninitialized }] =
    useCreateTicketMutation()

  const onSubmit = (values: FormModel) => {
    setTicketData((prevData) => {
      const updatedData = [...prevData]
      updatedData[updatedData.length - 1] = {
        ...updatedData[updatedData.length - 1],
        ...values,
      }
      return updatedData
    })

    const formattedTicketData = ticketData.map((ticket) => {
      const {
        flightClass,
        handBaggage,
        baggage,
        insuranceName,
        insuranceLocation,
        insurancePrice,
        lodgingName,
        lodgingPlace,
        lodgingPrice,
        ...ticketBody
      } = ticket

      const details_ticket = {
        type_flight_class: flightClass,
        hand_baggage: handBaggage,
        baggage,
      }

      const accommodation: any = {}
      if (lodgingName) accommodation.name = lodgingName
      if (lodgingPlace) accommodation.location = lodgingPlace
      if (lodgingPrice) accommodation.price = lodgingPrice

      const insurance: any = {}
      if (insuranceName) insurance.name = insuranceName
      if (insuranceLocation) insurance.location = insuranceLocation
      if (insurancePrice) insurance.price = insurancePrice

      const formattedTicket = {
        ...ticketBody,
        details_ticket,
        ...(Object.keys(accommodation).length > 0 && { accommodation }),
        ...(Object.keys(insurance).length > 0 && { insurance }),
      }

      return formattedTicket
    })

    formattedTicketData.map((formattedTicket) => {
      console.log(formattedTicket)
      createTicket(formattedTicket)
    })
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'El ticket de vuelo ha sido creado exitosamente!',
        'Ha creado el ticket con éxito.',
        8,
      )

      setTimeout(() => {
        navigate('/tickets')
      }, 1 * 2000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Ha ocurrido un error al crear el ticket :(',
        'Verifique la información e inténtelo nuevamente.',
        8,
      )
    }
  }, [isSuccess, isError])

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={ticketData[ticketData.length - 1] || {}}
      onSubmit={onSubmit}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex items-center gap-4">
                <FormItem label="Nombre del hospedaje" className="w-1/5">
                  <Field
                    type="text"
                    name="lodgingName"
                    placeholder="Ingrese el nombre del hospedaje"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem label="Localizador del hospedaje" className="w-1/5">
                  <Field
                    type="text"
                    name="lodgingPlace"
                    placeholder="Ingrese la ubicación del hospedaje"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem label="Precio del hospedaje" className="w-1/5">
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
                    {submitButtonText ? submitButtonText : 'Enviar'}
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
