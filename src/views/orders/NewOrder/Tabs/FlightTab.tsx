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

const validationSchema = Yup.object().shape({
  customerId: Yup.number().required('Requerido'),
  origin: Yup.string().required('Requerido'),
  destination: Yup.string().required('Requerido'),
  flightDate: Yup.date().required('Requerido'),
  price: Yup.number().required('Requerido'),
  child: Yup.boolean().required('Requerido'),
  flightClass: Yup.string().required('Requerido'),
  handBaggage: Yup.number().required('Requerido'),
  baggage: Yup.number().required('Requerido'),
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
      price: 0,
      child: false,
      flightClass: '',
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
        price: 0,
        child: false,
        flightClass: '',
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
    console.log(values)
    setCurrentTab('tab2')
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ flights: flightForms }}
      validationSchema={Yup.object().shape({
        flights: Yup.array().of(validationSchema),
      })}
      onSubmit={(values) => handleSubmit(values.flights)}
    >
      {({ values, touched, errors }) => (
        <Form>
          <FormContainer>
            {values.flights.map((flight, index) => (
              <div key={index}>
                <h4 className="mb-4 ">Vuelo {index + 1}</h4>
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
                  <FormItem asterisk label="Precio" className="w-1/5">
                    <Field
                      type="number"
                      name={`flights[${index}].price`}
                      placeholder="Ingrese el precio del vuelo"
                      component={Input}
                    />
                  </FormItem>
                </div>
                <div className="flex items-center gap-4">
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
                  <FormItem
                    asterisk
                    className="w-1/5  text-center"
                    label="Niños"
                  >
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
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <>
                        <Button
                          variant="solid"
                          size="sm"
                          color="red-700"
                          type="button"
                          onClick={() => handleDeleteFlight(index)}
                          icon={<HiOutlineTrash />}
                        />
                        <span className="font-semibold">Eliminar vuelo</span>
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
                  onClick={addFlightForm}
                  icon={<HiOutlinePlus />}
                >
                  Añadir otro vuelo
                </Button>
              </FormItem>
              <FormItem>
                <Button
                  variant="solid"
                  size="sm"
                  type="submit"
                  icon={<HiOutlineArrowCircleRight />}
                >
                  {submitButtonText ? submitButtonText : 'Siguiente'}
                </Button>
              </FormItem>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default FlightTab
