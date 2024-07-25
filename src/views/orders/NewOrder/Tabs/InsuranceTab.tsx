import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  HiOutlineArrowCircleRight,
  HiOutlineEyeOff,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  insuranceName: Yup.string(),
  insuranceLocation: Yup.string(),
  insurancePrice: Yup.number(),
})

type FormModel = Pick<
  CreateTicketFormModel,
  'insuranceName' | 'insuranceLocation' | 'insurancePrice'
>

function InsuranceTab({
  ticketData,
  setTicketData,
  setCurrentTab,
  submitButtonText,
  flightIndex,
}: {
  ticketData: CreateTicketFormModel[]
  setTicketData: Dispatch<SetStateAction<CreateTicketFormModel[]>>
  setCurrentTab?: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3' | 'tab4'>>
  submitButtonText?: string
  flightIndex: number
}) {
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
    console.log('Seguros: ', values)

    setCurrentTab('tab3')
  }

  return (
    <Formik
      initialValues={{
        insurances: ticketData.map((ticket) => ({
          insuranceName: ticket.insuranceName || '',
          insuranceLocation: ticket.insuranceLocation || '',
          insurancePrice: ticket.insurancePrice || 0,
        })),
      }}
      validationSchema={Yup.object().shape({
        insurances: Yup.array().of(validationSchema),
      })}
      onSubmit={(values) => handleSubmit(values.insurances)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <FormContainer>
            {values.insurances.map((insurance, index) => (
              <div
                key={index}
                className={`${
                  index < values.insurances.length - 1
                    ? 'border-b border-slate-300'
                    : ''
                } mb-4`}
              >
                <h4 className="mb-4">Seguro {index + 1}</h4>
                <div className="flex items-center gap-4">
                  <FormItem label="Nombre del Seguro" className="w-1/4">
                    <Field
                      type="text"
                      name={`insurances[${index}].insuranceName`}
                      placeholder="Ingrese el nombre del seguro"
                      component={Input}
                      autoComplete="off"
                      disabled={isDisabled[index]}
                    />
                  </FormItem>
                  <FormItem label="Localizador del Seguro" className="w-1/4">
                    <Field
                      type="text"
                      name={`insurances[${index}].insuranceLocation`}
                      placeholder="Ingrese el localizador del seguro"
                      component={Input}
                      autoComplete="off"
                      disabled={isDisabled[index]}
                    />
                  </FormItem>
                  <FormItem label="Precio del Seguro" className="w-1/5">
                    <Field
                      type="number"
                      name={`insurances[${index}].insurancePrice`}
                      placeholder="Ingrese el precio del seguro"
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
                              'insurances',
                              values.insurances.filter((_, i) => i !== index),
                            )
                          }}
                          icon={<HiOutlineTrash />}
                        >
                          Eliminar seguro
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-4">
              <Button
                variant="solid"
                size="sm"
                type="button"
                onClick={() => {
                  setFieldValue('insurances', [
                    ...values.insurances,
                    {
                      insuranceName: '',
                      insuranceLocation: '',
                      insurancePrice: 0,
                    },
                  ])
                }}
                icon={<HiOutlinePlus />}
              >
                Añadir otro seguro
              </Button>

              <Button
                variant="solid"
                size="sm"
                type="submit"
                icon={<HiOutlineArrowCircleRight />}
              >
                {submitButtonText ? submitButtonText : 'Siguiente'}
              </Button>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default InsuranceTab
