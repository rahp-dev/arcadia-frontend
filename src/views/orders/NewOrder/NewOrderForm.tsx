import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

type Option = {
    value: number
    label: string
}

type FormModel = {
    salida: string
    destino: string
    date: Date | null
    idaVuelta: boolean
    soloIda: boolean
    personasAdultas: number
    maletas23: number
    maletas10: number
    claseVuelo: string
    cuotas: number
    contado: number
    cuantasCuotas: string
    niños: number
    bebes: number
}

const tipoVuelo: Option[] = [
    { value: 1, label: 'Clase economica' },
    { value: 2, label: '1era clase' },
    { value: 3, label: '2da clase' },
]

const validationSchema = Yup.object().shape({
    salida: Yup.string()
        .min(3, 'Muy corto')
        .max(40, 'Muy largo')
        .required('Por favor, ingrese el destino de salida'),
    destino: Yup.string()
        .min(3, 'Muy corto')
        .max(40, 'Muy largo')
        .required('Por favor, ingrese el destino de llegada'),
    date: Yup.date().required('La fecha es requerida').nullable(),
    idaVuelta: Yup.boolean().oneOf([true], 'Debes escoger uno.'),
    soloIda: Yup.boolean().oneOf([true], 'Debes escoger uno.'),
    personasAdultas: Yup.number().min(1).max(9).required('Ingresa un numero'),
    maletas23: Yup.number()
        .min(1)
        .max(18)
        .required('Ingresa la cantidad de maletas.'),
    maletas10: Yup.number()
        .min(1)
        .max(9)
        .required('Ingresa la cantidad de maletas.'),
    claseVuelo: Yup.string().required('Seleccione uno'),
    cuotas: Yup.boolean().oneOf([true], 'Debes escoger uno.'),
    cuantasCuotas: Yup.string().required('Seleccione una cuota'),
    contado: Yup.boolean().oneOf([true], 'Debes escoger uno.'),
    niños: Yup.number()
        .min(1)
        .max(9)
        .required('Ingrese la cantidad de niños que viajarán con usted.'),
    bebes: Yup.number()
        .min(1)
        .max(9)
        .required('Ingrese la cantidad de bebes que viajarán con usted.'),
})

const OrderForm = () => {
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{
                    salida: '',
                    destino: '',
                    date: null,
                    idaVuelta: false,
                    soloIda: false,
                    personasAdultas: 0,
                    maletas23: 0,
                    maletas10: 0,
                    claseVuelo: '',
                    cuotas: false,
                    cuantasCuotas: '',
                    contado: false,
                    niños: 0,
                    bebes: 0,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log(values)
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2))
                        setSubmitting(false)
                    }, 400)
                }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                asterisk
                                label="Salida"
                                invalid={errors.salida && touched.salida}
                                errorMessage={errors.salida}
                            >
                                <Field
                                    type="text"
                                    name="salida"
                                    placeholder="Vuelo de Salida"
                                    component={Input}
                                />
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default OrderForm
