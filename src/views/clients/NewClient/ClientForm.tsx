import {
    Button,
    Checkbox,
    DatePicker,
    FormContainer,
    FormItem,
    Input,
    Radio,
    Select,
} from '@/components/ui'
import { useCreateClientMutation } from '@/services/RtkQueryService'
import {
    CreateClientBody,
    CreateClientFormModel,
} from '@/services/clients/types/client.type'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import * as Yup from 'yup'

type Option = {
    value: string
    label: string
}

const options: Option[] = [
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Argentina', label: 'Argentina' },
]

type FormModel = Pick<
    CreateClientFormModel,
    | 'name'
    | 'lastName'
    | 'identityCard'
    | 'birth_date'
    | 'country'
    | 'email'
    | 'instagram'
    | 'frequentTraveler'
    | 'passport'
    | 'phone'
    | 'state'
    | 'street'
>

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Muy corto')
        .max(20, 'Muy largo')
        .required('Por favor, ingrese el nombre del cliente'),
    lastName: Yup.string()
        .min(3, 'Muy corto')
        .max(20, 'Muy largo')
        .required('Por favor, ingrese el nombre del cliente'),
    identityCard: Yup.string().required('Por favor, ingrese la cedula'),
    passport: Yup.string(),
    frequentTraveler: Yup.number().required('Seleccione uno'),
    email: Yup.string().email('Formato del correo incorrecto'),
    phone: Yup.string().required('Ingrese su numero de telefono'),
    instagram: Yup.string(),
    country: Yup.string().required('Seleccione uno'),
    state: Yup.string().required('Por favor, ingrese el estado'),
    street: Yup.string().required('Por favor, ingrese la calle'),
})

function ClientForm({
    clientData,
    setClientData,
}: {
    clientData: Partial<CreateClientFormModel>
    setClientData: Dispatch<SetStateAction<CreateClientFormModel>>
}) {
    const [createClient, { data, isError, isSuccess, isUninitialized }] =
        useCreateClientMutation()

    const onSubmit = (values: FormModel) => {
        setClientData(values)

        const {
            name,
            lastName,
            birth_date,
            identityCard,
            passport,
            frequentTraveler,
            email,
            phone,
            instagram,
            country,
            state,
            street,
        } = clientData

        const body: CreateClientBody = {
            name: values.name,
            lastName: values.lastName,
            birth_date: values.birth_date,
            identityCard: values.identityCard,
            passport: values.passport,
            frequentTraveler: values.frequentTraveler,
            email: values.email,
            phone: values.phone,
            instagram: values.instagram,
            address: { country, state, street },
        }

        createClient(body)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={clientData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, touched, errors }) => (
                <Form>
                    <FormContainer>
                        <div className="flex items-center gap-5">
                            <FormItem
                                asterisk
                                label="Nombre"
                                className="w-1/5"
                                invalid={errors.name && touched.name}
                                errorMessage={errors.name}
                            >
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Nombre del cliente"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Apellido"
                                className="w-1/5"
                                invalid={errors.lastName && touched.lastName}
                                errorMessage={errors.lastName}
                            >
                                <Field
                                    type="text"
                                    name="lastName"
                                    placeholder="Apellido del cliente"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Documento de Identidad"
                                className="w-1/5"
                                invalid={
                                    errors.identityCard && touched.identityCard
                                }
                                errorMessage={errors.identityCard}
                            >
                                <Field
                                    type="text"
                                    name="identityCard"
                                    placeholder="Documento del cliente"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Pasaporte"
                                className="w-1/5"
                                invalid={errors.passport && touched.passport}
                                errorMessage={errors.passport}
                            >
                                <Field
                                    type="text"
                                    name="passport"
                                    placeholder="Documento del cliente"
                                    component={Input}
                                />
                            </FormItem>
                            {/* <FormItem
                                asterisk
                                label="¿Viajero frecuente?"
                                invalid={
                                    errors.frequentTraveler &&
                                    touched.frequentTraveler
                                }
                                errorMessage={errors.frequentTraveler}
                            >
                                <Field name="frequentTraveler">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<FormModel>) => (
                                        <Radio.Group
                                            value={values.frequentTraveler}
                                            onChange={(val) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    val,
                                                )
                                            }
                                        >
                                            <Radio value={1}>Paypal</Radio>
                                            <Radio value={2}>Stripe</Radio>
                                        </Radio.Group>
                                    )}
                                </Field>
                            </FormItem> */}
                        </div>
                        <div className="flex items-center gap-5">
                            <FormItem
                                asterisk
                                label="Correo electrónico"
                                className="w-1/5"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="text"
                                    name="email"
                                    placeholder="Correo del cliente"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Teléfono"
                                className="w-1/5"
                                invalid={errors.phone && touched.phone}
                                errorMessage={errors.phone}
                            >
                                <Field
                                    type="number"
                                    name="phone"
                                    placeholder="Número del cliente"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Instagram"
                                className="w-1/5"
                                invalid={errors.instagram && touched.instagram}
                                errorMessage={errors.instagram}
                            >
                                <Field
                                    type="text"
                                    name="instagram"
                                    placeholder="Instagram del cliente"
                                    component={Input}
                                />
                            </FormItem>
                        </div>
                        {/* <div className="flex items-center gap-5">
                            <FormItem
                                asterisk
                                label="Select"
                                invalid={errors.country && touched.country}
                                errorMessage={errors.country}
                            >
                                <Field name="country">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<FormModel>) => (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={options}
                                            value={options.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.country,
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    option?.value,
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        </div> */}
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default ClientForm
