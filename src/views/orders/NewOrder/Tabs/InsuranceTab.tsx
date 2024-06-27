import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import { Form, Field, Formik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  insuranceName: Yup.string().required('Ingrese el nombre del seguro.'),
  insuranceLocation: Yup.string().required('Ingrese la ubicacion del seguro.'),
  insurancePrice: Yup.number().required('Precio requerido.'),
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
}: {
  ticketData: Partial<CreateTicketFormModel>
  submitButtonText?: string
  setTicketData: Dispatch<SetStateAction<Partial<CreateTicketFormModel>>>
  setCurrentTab?: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3' | 'tab4'>>
}) {
  const onSubmit = (values: FormModel) => {
    console.log(values)
    setTicketData({
      ...ticketData,
      ...values,
    })
    setCurrentTab('tab3')
  }

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
                  label="Nombre del Seguro"
                  className="w-1/5"
                  invalid={errors.insuranceName && touched.insuranceName}
                  errorMessage={errors.insuranceName}
                >
                  <Field
                    type="text"
                    name="insuranceName"
                    placeholder="Ingrese el nombre del seguro"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Localizador del Seguro"
                  className="w-1/5"
                  invalid={
                    errors.insuranceLocation && touched.insuranceLocation
                  }
                  errorMessage={errors.insuranceLocation}
                >
                  <Field
                    type="text"
                    name="insuranceLocation"
                    placeholder="Ingrese el localizador del seguro"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Precio del Seguro"
                  className="w-1/5"
                  errorMessage={errors.insurancePrice}
                  invalid={errors.insurancePrice && touched.insurancePrice}
                >
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
