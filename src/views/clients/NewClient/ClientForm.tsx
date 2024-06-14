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
import { CreateClientFormModel } from '@/services/clients/types/client.type'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'

type Option = {
    value: number
    label: string
}

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
}: {
    clientData: Partial<CreateClientFormModel>
}) {
    return (
        <Formik
            enableReinitialize
            initialValues={clientData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2))
                    setSubmitting(false)
                }, 400)
            }}
        ></Formik>
    )
}

export default ClientForm
