import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { useCreateTicketMutation } from '@/services/RtkQueryService'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import openNotification from '@/utils/useNotification'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  HiOutlineEyeOff,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineUpload,
} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  lodgingName: Yup.string().optional(),
  lodgingPlace: Yup.string().optional(),
  lodgingPrice: Yup.number().optional(),
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

  const [isDisabled, setIsDisabled] = useState<boolean[]>(
    Array(ticketData.length).fill(false),
  )

  const handleSubmit = (values: FormModel[]) => {
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

    const updatedTicketData = values.map((value, index) => {
      return {
        ...ticketData[index],
        ...value,
      }
    })

    const formattedTicketData = updatedTicketData.map((ticket) => {
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

    formattedTicketData.forEach((formattedTicket) => {
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
      initialValues={{
        lodgings: ticketData.map((ticket) => ({
          lodgingName: ticket.lodgingName || '',
          lodgingPlace: ticket.lodgingPlace || '',
          lodgingPrice: ticket.lodgingPrice || 0,
        })),
      }}
      validationSchema={Yup.object().shape({
        lodgings: Yup.array().of(validationSchema),
      })}
      onSubmit={(values) => handleSubmit(values.lodgings)}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <FormContainer>
            {values.lodgings.map((lodging, index) => (
              <div
                key={index}
                className={`${
                  index < values.lodgings.length - 1
                    ? 'border-b border-slate-300'
                    : ''
                } mb-4`}
              >
                <h4 className="mb-4">Hospedaje {index + 1}</h4>
                <div className="flex items-center gap-4">
                  <FormItem label="Nombre del hospedaje" className="w-1/4">
                    <Field
                      type="text"
                      name={`lodgings[${index}].lodgingName`}
                      placeholder="Ingrese el nombre del hospedaje"
                      component={Input}
                      autoComplete="off"
                      disabled={isDisabled[index]}
                    />
                  </FormItem>
                  <FormItem label="Localizador del hospedaje" className="w-1/4">
                    <Field
                      type="text"
                      name={`lodgings[${index}].lodgingPlace`}
                      placeholder="Ingrese la ubicación del hospedaje"
                      component={Input}
                      autoComplete="off"
                      disabled={isDisabled[index]}
                    />
                  </FormItem>
                  <FormItem label="Precio del hospedaje" className="w-1/5">
                    <Field
                      type="number"
                      name={`lodgings[${index}].lodgingPrice`}
                      placeholder="Ingrese el precio"
                      component={Input}
                      disabled={isDisabled[index]}
                    />
                  </FormItem>
                  <div className="flex justify-between items-center w-1/3">
                    <Button
                      variant="solid"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const newIsDisabled = [...isDisabled]
                        newIsDisabled[index] = !newIsDisabled[index]
                        setIsDisabled(newIsDisabled)
                      }}
                      icon={<HiOutlineEyeOff />}
                    >
                      {isDisabled[index] ? 'Habilitar' : 'Deshabilitar'}
                    </Button>
                    {index > 0 && (
                      <>
                        <Button
                          variant="solid"
                          size="sm"
                          color="red-700"
                          type="button"
                          onClick={() => {
                            setFieldValue(
                              'lodgings',
                              values.lodgings.filter((_, i) => i !== index),
                            )
                            setIsDisabled(
                              isDisabled.filter((_, i) => i !== index),
                            )
                          }}
                          icon={<HiOutlineTrash />}
                        >
                          Eliminar hospedaje
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <FormItem>
                <Button
                  variant="solid"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setFieldValue('lodgings', [
                      ...values.lodgings,
                      {
                        lodgingName: '',
                        lodgingPlace: '',
                        lodgingPrice: 0,
                      },
                    ])
                  }}
                  icon={<HiOutlinePlus />}
                >
                  Añadir otro hospedaje
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  variant="solid"
                  size="sm"
                  type="submit"
                  icon={<HiOutlineUpload />}
                  disabled={isSubmitting}
                >
                  {submitButtonText ? submitButtonText : 'Enviar'}
                </Button>
              </FormItem>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default LodgingTab
