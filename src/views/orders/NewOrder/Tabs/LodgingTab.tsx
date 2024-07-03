import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { useCreateTicketMutation } from '@/services/RtkQueryService'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import openNotification from '@/utils/useNotification'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlineSave } from 'react-icons/hi'
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

  const [lodgingForms, setLodgingForms] = useState<FormModel[]>([
    {} as FormModel,
  ])

  const addLodging = () => {
    setLodgingForms([...lodgingForms, {} as FormModel])
  }

  const removeLodging = (index: number) => {
    setLodgingForms(lodgingForms.filter((_, i) => i !== index))
  }

  const onSubmit = (values: FormModel[]) => {
    setTicketData((prevData) => {
      const updatedData = [...prevData]
      values.forEach((value, index) => {
        updatedData[index] = {
          ...updatedData[index],
          ...value,
        }
      })
      return updatedData
    })

    const formattedTicketData = ticketData.map((ticket) => {
      const {
        flightClass,
        handBaggage,
        baggage,
        location,
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
        location,
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
      console.log('Respuesta final: ', formattedTicket)
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
      initialValues={{ lodgings: lodgingForms }}
      onSubmit={(values) => onSubmit(values.lodgings)}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              {values.lodgings.map((lodging, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${
                    index !== values.lodgings.length - 1 &&
                    'border-b border-slate-500 pb-4'
                  }`}
                >
                  <FormItem
                    label={`Nombre del hospedaje ${index + 1}`}
                    className="w-1/5"
                  >
                    <Field
                      type="text"
                      name={`lodgings[${index}].lodgingName`}
                      placeholder="Ingrese el nombre del hospedaje"
                      component={Input}
                      autoComplete="off"
                    />
                  </FormItem>
                  <FormItem
                    label={`Localizador del hospedaje ${index + 1}`}
                    className="w-1/5"
                  >
                    <Field
                      type="text"
                      name={`lodgings[${index}].lodgingPlace`}
                      placeholder="Ingrese la ubicación del hospedaje"
                      component={Input}
                      autoComplete="off"
                    />
                  </FormItem>
                  <FormItem
                    label={`Precio del hospedaje ${index + 1}`}
                    className="w-1/5"
                  >
                    <Field
                      type="number"
                      name={`lodgings[${index}].lodgingPrice`}
                      placeholder="Ingrese el precio del hospedaje"
                      component={Input}
                    />
                  </FormItem>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="solid"
                      onClick={() => removeLodging(index)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              ))}

              <FormItem>
                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="solid"
                    size="sm"
                    onClick={addLodging}
                    icon={<HiOutlinePlus />}
                  >
                    Agregar otro hospedaje
                  </Button>
                  <Button
                    variant="solid"
                    type="submit"
                    size="sm"
                    icon={<HiOutlineSave />}
                  >
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
