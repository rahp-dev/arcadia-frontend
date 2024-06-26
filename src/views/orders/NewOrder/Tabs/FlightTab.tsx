import { Dispatch, SetStateAction } from 'react'
import { Select as SelectTypes } from '@/@types/select'
import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Select,
  Switcher,
} from '@/components/ui'
import { useGetOneUserQuery } from '@/services/RtkQueryService'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import { Field, FieldProps, Form, Formik } from 'formik'

import * as Yup from 'yup'

type Option = {
  value: string
  label: string
}

type FormModel = Pick<
  CreateTicketFormModel,
  | 'customerId'
  | 'origin'
  | 'destination'
  | 'flightDate'
  | 'price'
  | 'child'
  | 'flightClass'
  | 'handBaggage'
  | 'baggage'
>

const flights: Option[] = [
  { value: 'Economy', label: 'Economy (Coach)' },
  { value: 'PremiumEconomy', label: 'Premium Economy' },
  { value: 'Business', label: 'Business' },
  { value: 'PremiumBusiness', label: 'Premium Business' },
  { value: 'First', label: 'First' },
  { value: 'PremiumFirst', label: 'First Premium' },
]

function FlightTab({
  ticketData,
  setTicketData,
  setCurrentTab,
  submitButtonText,
}: {
  ticketData: Partial<CreateTicketFormModel>
  setTicketData?: Dispatch<SetStateAction<Partial<CreateTicketFormModel>>>
  setCurrentTab?: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3' | 'tab4'>>
  submitButtonText?: string
}) {
  const validationSchema = Yup.object().shape({
    customerId: Yup.number().required('Debe de seleccionar al cliente.'),
    origin: Yup.string().required('Origen requerido.'),
    destination: Yup.string().required('Destino requerido.'),
    flightDate: Yup.date().required('Fecha de vuelo requerida.'),
    price: Yup.number()
      .min(1, 'El precio no puede ser menor a 0')
      .required('Precio requerido.'),
    flightClass: Yup.string().required('Seleccione uno.'),
    handBaggage: Yup.number()
      .min(1, 'Minimo 1')
      .max(8, 'Maximo 8.')
      .required('Este campo es requerido.'),
    baggage: Yup.number()
      .min(1, 'Minimo 1')
      .max(8, 'Maximo 8.')
      .required('Este campo es requerido.'),
    child: Yup.boolean().required('Requerido'),
  })

  const { data: userOptions } = useGetOneUserQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const setUserOptions = () => {
    return userOptions?.filter((option: SelectTypes) => option.value)
  }

  const onSubmit = (values: FormModel) => {
    setTicketData((prevData) => ({
      ...prevData,
      ...values,
    }))
    console.log(values)
    setCurrentTab('tab2')
  }

  return (
    <Formik
      enableReinitialize
      initialValues={ticketData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Cliente"
                  className="w-1/5"
                  invalid={errors.customerId && touched.customerId}
                  errorMessage={errors.customerId}
                >
                  <Field name="customerId">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={setUserOptions()}
                        placeholder="Selecciona el cliente..."
                        onChange={(option: SelectTypes) => {
                          form.setFieldValue(field.name, option.value)
                        }}
                        value={userOptions?.filter(
                          (option: SelectTypes) =>
                            option.value === values.customerId,
                        )}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  label="Vuelo de Origen"
                  className="w-1/5"
                  invalid={errors.origin && touched.origin}
                  errorMessage={errors.origin}
                >
                  <Field
                    type="text"
                    name="origin"
                    placeholder="Ingrese el origen"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Destino"
                  className="w-1/5"
                  invalid={errors.destination && touched.destination}
                  errorMessage={errors.destination}
                >
                  <Field
                    type="text"
                    name="destination"
                    placeholder="Ingrese el destino"
                    component={Input}
                    autoComplete="off"
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Fecha del vuelo"
                  className="w-1/5"
                  invalid={errors.flightDate && (touched.flightDate as any)}
                  errorMessage={errors.flightDate as any}
                >
                  <Field name="flightDate">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <DatePicker
                        placeholder="Seleccione la fecha"
                        field={field}
                        form={form}
                        value={values.flightDate}
                        onChange={(day) => {
                          form.setFieldValue(field.name, day)
                        }}
                        inputFormat="DD-MM-YYYY"
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  label="Precio"
                  className="w-1/5"
                  errorMessage={errors.price}
                  invalid={errors.price && touched.price}
                >
                  <Field
                    type="number"
                    name="price"
                    placeholder="Ingrese el precio del vuelo"
                    component={Input}
                  />
                </FormItem>
              </div>
              <div className="flex items-center gap-4">
                <FormItem
                  asterisk
                  label="Tipo de Vuelo"
                  className="w-1/5"
                  invalid={errors.flightClass && touched.flightClass}
                  errorMessage={errors.flightClass}
                >
                  <Field name="flightClass">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Select
                        field={field}
                        form={form}
                        options={flights}
                        placeholder="Seleccione uno"
                        value={flights.filter(
                          (option) => option.value === values.flightClass,
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option?.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  asterisk
                  label="Maletas de mano"
                  className="w-1/5"
                  errorMessage={errors.handBaggage}
                  invalid={errors.handBaggage && touched.handBaggage}
                >
                  <Field
                    type="number"
                    name="handBaggage"
                    placeholder="Ingrese las maletas de mano"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Maletas de 23kg"
                  className="w-1/5"
                  errorMessage={errors.baggage}
                  invalid={errors.baggage && touched.baggage}
                >
                  <Field
                    type="number"
                    name="baggage"
                    placeholder="Ingrese las maletas"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  className="w-1/5 text-center"
                  label="Niños"
                  invalid={errors.child && touched.child}
                  errorMessage={errors.child}
                >
                  <Field name="child">
                    {({ form, field }: FieldProps<FormModel>) => (
                      <div className="flex gap-4">
                        <Switcher
                          onChange={(checked) => {
                            form.setFieldValue(field.name, checked)
                          }}
                        />
                        <label className="text-base font-semibold">No/Sí</label>
                      </div>
                    )}
                  </Field>
                </FormItem>
              </div>
              <FormItem>
                <Button variant="solid" type="submit">
                  {submitButtonText ? submitButtonText : 'Siguiente'}
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default FlightTab
