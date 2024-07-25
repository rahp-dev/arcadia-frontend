import { Dispatch, SetStateAction, useState } from 'react'
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
import {
  HiOutlineArrowCircleRight,
  HiOutlinePlus,
  HiOutlineTrash,
} from 'react-icons/hi'

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
  | 'flightDateReturn'
  | 'price'
  | 'child'
  | 'international'
  | 'flightClass'
  | 'location'
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

const validationSchema = Yup.object().shape({
  customerId: Yup.number().required('Requerido'),
  origin: Yup.string().required('Requerido'),
  destination: Yup.string().required('Requerido'),
  flightDate: Yup.date().required('Requerido'),
  price: Yup.number().required('Requerido'),
  child: Yup.boolean().required('Requerido'),
  international: Yup.boolean(),
  flightClass: Yup.string().required('Requerido'),
  handBaggage: Yup.number()
    .min(1, 'El minimo es 1')
    .max(8, 'El máximo es 8')
    .required('Requerido'),
  baggage: Yup.number()
    .min(1, 'El minimo es 1')
    .max(8, 'El máximo es 8')
    .required('Requerido'),
})

function FlightTab({
  setTicketData,
  setCurrentTab,
  submitButtonText,
}: {
  setTicketData: Dispatch<SetStateAction<CreateTicketFormModel[]>>
  setCurrentTab?: Dispatch<SetStateAction<'tab1' | 'tab2' | 'tab3' | 'tab4'>>
  submitButtonText?: string
}) {
  const { data: userOptions } = useGetOneUserQuery(
    { transformToSelectOptions: true },
    { refetchOnMountOrArgChange: true },
  )

  const setUserOptions = () => {
    return userOptions?.filter((option: SelectTypes) => option.value)
  }

  const [flightForms, setFlightForms] = useState<FormModel[]>([
    {
      customerId: 0,
      origin: '',
      destination: '',
      flightDate: null,
      flightDateReturn: null,
      price: 0,
      child: false,
      international: false,
      flightClass: '',
      location: '',
      handBaggage: 0,
      baggage: 0,
    },
  ])

  const addFlightForm = () => {
    setFlightForms([
      ...flightForms,
      {
        customerId: 0,
        origin: '',
        destination: '',
        flightDate: null,
        flightDateReturn: null,
        price: 0,
        child: false,
        international: false,
        flightClass: '',
        location: '',
        handBaggage: 0,
        baggage: 0,
      },
    ])
  }

  const handleDeleteFlight = (index: number) => {
    if (index > 0) {
      const updatedFlights = [...flightForms]
      updatedFlights.splice(index, 1)
      setFlightForms(updatedFlights)
    }
  }

  const handleSubmit = (values: FormModel[]) => {
    setTicketData(values)
    console.log('Tickets: ', values)
    setCurrentTab('tab2')
  }

  return (
    <Formik
      initialValues={{ flights: flightForms }}
      validationSchema={Yup.object().shape({
        flights: Yup.array().of(validationSchema),
      })}
      onSubmit={(values) => handleSubmit(values.flights)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <FormContainer>
            {values.flights.map((flight, index) => (
              <div
                key={index}
                className={`${
                  index < values.flights.length - 1
                    ? 'border-b border-slate-300'
                    : ''
                } mb-4`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-6">
                    <span className="text-base text-slate-700 antialiased font-semibold">
                      Vuelo {index + 1}
                    </span>
                    <FormItem>
                      <Field name={`flights[${index}].international`}>
                        {({ form, field }: FieldProps<FormModel>) => (
                          <div className="flex items-center gap-4">
                            <label className="text-base font-semibold">
                              Nacional
                            </label>
                            <Switcher
                              onChange={(checked) => {
                                form.setFieldValue(field.name, checked)
                              }}
                            />
                            <label className="text-base font-semibold">
                              Internacional
                            </label>
                          </div>
                        )}
                      </Field>
                    </FormItem>
                  </div>

                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <>
                        <Button
                          variant="solid"
                          size="sm"
                          color="red-600"
                          type="button"
                          onClick={() => {
                            handleDeleteFlight(index)
                            setFieldValue(
                              'flights',
                              values.flights.filter((_, i) => i !== index),
                            )
                          }}
                          icon={<HiOutlineTrash />}
                        />
                        <span className="font-semibold">Eliminar vuelo</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <FormItem asterisk label="Cliente" className="w-1/5">
                    <Field name={`flights[${index}].customerId`}>
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
                              option.value === flight.customerId,
                          )}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem asterisk label="Vuelo de Origen" className="w-1/5">
                    <Field
                      type="text"
                      name={`flights[${index}].origin`}
                      placeholder="Ingrese el origen"
                      component={Input}
                      autoComplete="off"
                    />
                  </FormItem>
                  <FormItem asterisk label="Destino" className="w-1/5">
                    <Field
                      type="text"
                      name={`flights[${index}].destination`}
                      placeholder="Ingrese el destino"
                      component={Input}
                      autoComplete="off"
                    />
                  </FormItem>
                  <FormItem asterisk label="Fecha del vuelo" className="w-1/5">
                    <Field name={`flights[${index}].flightDate`}>
                      {({ field, form }: FieldProps<FormModel>) => (
                        <DatePicker
                          placeholder="Seleccione la fecha"
                          field={field}
                          form={form}
                          value={flight.flightDate}
                          onChange={(day) => {
                            form.setFieldValue(field.name, day)
                          }}
                          inputFormat="DD-MM-YYYY"
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem label="Fecha de retorno" className="w-1/5">
                    <Field name={`flights[${index}].flightDateReturn`}>
                      {({ field, form }: FieldProps<FormModel>) => (
                        <DatePicker
                          placeholder="Seleccione la fecha"
                          field={field}
                          form={form}
                          value={flight.flightDateReturn}
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
                    asterisk
                    label="Rastreador de vuelo"
                    className="w-1/5"
                  >
                    <Field
                      type="text"
                      name={`flights[${index}].location`}
                      placeholder="Ingrese el rastreador"
                      component={Input}
                      autoComplete="off"
                    />
                  </FormItem>
                  <FormItem asterisk label="Tipo de Vuelo" className="w-1/5">
                    <Field name={`flights[${index}].flightClass`}>
                      {({ field, form }: FieldProps<FormModel>) => (
                        <Select
                          field={field}
                          form={form}
                          options={flights}
                          placeholder="Seleccione uno"
                          value={flights.filter(
                            (option) => option.value === flight.flightClass,
                          )}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem asterisk label="Precio" className="w-1/5">
                    <Field
                      type="number"
                      name={`flights[${index}].price`}
                      placeholder="Ingrese el precio del vuelo"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem asterisk label="Maletas de mano" className="w-1/5">
                    <Field
                      type="number"
                      name={`flights[${index}].handBaggage`}
                      placeholder="Ingrese las maletas de mano"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem asterisk label="Maletas de 23kg" className="w-1/5">
                    <Field
                      type="number"
                      name={`flights[${index}].baggage`}
                      placeholder="Ingrese las maletas"
                      component={Input}
                    />
                  </FormItem>
                </div>
                <div className="flex items-center">
                  <FormItem asterisk className="w-1/5" label="¿Mayor de edad?">
                    <Field name={`flights[${index}].child`}>
                      {({ form, field }: FieldProps<FormModel>) => (
                        <div className="flex gap-4">
                          <Switcher
                            onChange={(checked) => {
                              form.setFieldValue(field.name, checked)
                            }}
                          />
                          <label className="text-base font-semibold">
                            No/Sí
                          </label>
                        </div>
                      )}
                    </Field>
                  </FormItem>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-4">
              <Button
                variant="solid"
                size="sm"
                type="button"
                onClick={() => {
                  addFlightForm()
                  setFieldValue('flights', [
                    ...values.flights,
                    {
                      customerId: 0,
                      origin: '',
                      destination: '',
                      flightDate: null,
                      flightDateReturn: null,
                      price: 0,
                      child: false,
                      international: false,
                      flightClass: '',
                      location: '',
                      handBaggage: 0,
                      baggage: 0,
                    },
                  ])
                }}
                icon={<HiOutlinePlus />}
              >
                Añadir otro vuelo
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

export default FlightTab
