import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
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
  submitButtonText,
  setTicketData,
  setCurrentTab,
  flightIndex,
}: {
  ticketData: Partial<CreateTicketFormModel>[]
  submitButtonText?: string
  setTicketData: Dispatch<SetStateAction<Partial<CreateTicketFormModel>[]>>
  setCurrentTab?: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3' | 'tab4'>>
  flightIndex: number
}) {
  const onSubmit = (values: FormModel) => {
    setTicketData((prevData) => {
      const updatedData = [...prevData]
      updatedData[flightIndex] = {
        ...updatedData[flightIndex],
        ...values,
      }
      return updatedData
    })
    console.log(values)
    setCurrentTab && setCurrentTab('tab3')
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={ticketData[flightIndex] || {}}
      onSubmit={onSubmit}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex items-center gap-4">
                <FormItem label="Nombre del Seguro" className="w-1/5">
                  <Field
                    type="text"
                    name="insuranceName"
                    placeholder="Ingrese el nombre del seguro"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem label="Localizador del Seguro" className="w-1/5">
                  <Field
                    type="text"
                    name="insuranceLocation"
                    placeholder="Ingrese el localizador del seguro"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem label="Precio del Seguro" className="w-1/5">
                  <Field
                    type="number"
                    name="insurancePrice"
                    placeholder="Ingrese el precio del seguro"
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

export default InsuranceTab
