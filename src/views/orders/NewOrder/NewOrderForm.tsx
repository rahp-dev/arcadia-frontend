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
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'

type Option = {
    value: number
    label: string
}

type FormModel = {
    salida: string
    destino: string
    fechaIda: Date | null
    fechaRegreso: Date | null
    tipoIda: number
    personasAdultas: number
    maletas23: number
    maletas10: number
    claseVuelo: string
    formaDePago: number
    cuantasCuotas: number | null
    niños: number
    bebes: number
}

const tipoVuelo: Option[] = [
    { value: 1, label: 'Economy (Coach)' },
    { value: 2, label: 'Premium Economy' },
    { value: 3, label: 'Business' },
    { value: 4, label: 'Premium Business' },
    { value: 5, label: 'First' },
    { value: 6, label: 'First Premium' },
]

const cuotas: Option[] = [
    { value: 1, label: '2 cuotas' },
    { value: 2, label: '3 cuotas' },
    { value: 3, label: 'Ninguna' },
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
    fechaIda: Yup.date().required('La fecha es requerida').nullable(),
    fechaRegreso: Yup.date().required('La fecha es requerida').nullable(),
    // tipoIda: Yup.array().min(1, 'Debes escoger uno'),
    personasAdultas: Yup.number()
        .min(1, 'Debe ser minimo 1 adulto')
        .max(9, 'El maximo de adultos es 9.')
        .required('Ingresa un numero'),
    maletas23: Yup.number()
        .min(1, 'Minimo 1 maleta de 23kg')
        .max(18, 'Máximo 18 maletas de 23kg.')
        .required('Ingresa la cantidad de maletas.'),
    maletas10: Yup.number()
        .min(1, 'Mínimo 1 maleta de 10kg')
        .max(9, 'Máximo 9 maletas de 10kg')
        .required('Ingresa la cantidad de maletas.'),
    claseVuelo: Yup.string().required('Seleccione uno'),
    formaDePago: Yup.number().required('Requerido'),
    cuantasCuotas: Yup.number().nullable(),
    niños: Yup.number()
        .min(0)
        .max(9)
        .required('Ingrese la cantidad de niños que viajarán con usted.'),
    bebes: Yup.number()
        .min(0)
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
                    fechaIda: null,
                    fechaRegreso: null,
                    tipoIda: 1,
                    personasAdultas: 0,
                    maletas23: 0,
                    maletas10: 0,
                    claseVuelo: '',
                    formaDePago: 1,
                    cuantasCuotas: null,
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
                            <div className="flex items-center gap-6">
                                <FormItem
                                    asterisk
                                    className="w-1/5"
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
                                <FormItem
                                    asterisk
                                    className="w-1/5"
                                    label="Destino"
                                    invalid={errors.destino && touched.destino}
                                    errorMessage={errors.destino}
                                >
                                    <Field
                                        type="text"
                                        name="destino"
                                        placeholder="Destino"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/6"
                                    label="Fecha de Salida"
                                    invalid={
                                        errors.fechaIda && touched.fechaIda
                                    }
                                    errorMessage={errors.fechaIda}
                                >
                                    <Field name="fechaIda" placeholder="Fecha">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values.fechaIda}
                                                onChange={(date) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date,
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/6"
                                    label="Fecha de Regreso"
                                    invalid={
                                        errors.fechaRegreso &&
                                        touched.fechaRegreso
                                    }
                                    errorMessage={errors.fechaRegreso}
                                >
                                    <Field
                                        name="fechaRegreso"
                                        placeholder="Fecha"
                                    >
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values.fechaRegreso}
                                                onChange={(date) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date,
                                                    )
                                                }}
                                                disabled={values.tipoIda === 2}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Tipo de Viaje"
                                    invalid={Boolean(
                                        errors.tipoIda && touched.tipoIda,
                                    )}
                                    errorMessage={errors.tipoIda as string}
                                >
                                    <Field name="tipoIda">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <Radio.Group
                                                value={values.tipoIda}
                                                onChange={(val) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        val,
                                                    )
                                                    if (val === 2) {
                                                        form.setFieldValue(
                                                            'fechaRegreso',
                                                            null,
                                                        )
                                                    }
                                                }}
                                            >
                                                <Radio value={1}>
                                                    Ida y vuelta
                                                </Radio>
                                                <Radio value={2}>
                                                    Solo ida
                                                </Radio>
                                            </Radio.Group>
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                            <div className="flex items-center gap-6">
                                <FormItem
                                    asterisk
                                    className="w-[15%]"
                                    label="Cantidad de Adultos"
                                    invalid={
                                        errors.personasAdultas &&
                                        touched.personasAdultas
                                    }
                                    errorMessage={errors.personasAdultas}
                                >
                                    <Field
                                        type="number"
                                        name="personasAdultas"
                                        placeholder="Adultos"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/5"
                                    label="Maletas de 23kg"
                                    invalid={
                                        errors.maletas23 && touched.maletas23
                                    }
                                    errorMessage={errors.maletas23}
                                >
                                    <Field
                                        type="number"
                                        name="maletas23"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/5"
                                    label="Maletas de 10kg"
                                    invalid={
                                        errors.maletas10 && touched.maletas10
                                    }
                                    errorMessage={errors.maletas10}
                                >
                                    <Field
                                        type="number"
                                        name="maletas10"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/5"
                                    label="Clase"
                                    invalid={
                                        errors.claseVuelo && touched.claseVuelo
                                    }
                                    errorMessage={errors.claseVuelo}
                                >
                                    <Field name="claseVuelo">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <Select
                                                placeholder="Selecciona la clase del vuelo"
                                                field={field}
                                                form={form}
                                                options={tipoVuelo}
                                                value={tipoVuelo.filter(
                                                    (option) =>
                                                        option.value ===
                                                        parseInt(
                                                            values.claseVuelo,
                                                        ),
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
                                <FormItem
                                    asterisk
                                    label="Como cancela"
                                    invalid={Boolean(
                                        errors.formaDePago &&
                                            touched.formaDePago,
                                    )}
                                    errorMessage={errors.formaDePago as string}
                                >
                                    <Field name="formaDePago">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <Radio.Group
                                                value={values.formaDePago}
                                                onChange={(val: number) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        val,
                                                    )
                                                    if (val === 2) {
                                                        form.setFieldValue(
                                                            'cuantasCuotas',
                                                            null,
                                                        )
                                                    }
                                                }}
                                            >
                                                <Radio value={1}>
                                                    Por cuotas
                                                </Radio>
                                                <Radio value={2}>
                                                    Al contado
                                                </Radio>
                                            </Radio.Group>
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                            <div className="flex items-center gap-6 mb-4">
                                <FormItem
                                    asterisk
                                    className="w-[22%]"
                                    label="Cuantas cuotas?"
                                    invalid={
                                        errors.cuantasCuotas &&
                                        touched.cuantasCuotas
                                    }
                                    errorMessage={errors.cuantasCuotas}
                                >
                                    <Field name="cuantasCuotas">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <Select
                                                placeholder="Cuantas cuotas?"
                                                field={field}
                                                form={form}
                                                options={cuotas}
                                                value={cuotas.find(
                                                    (option) =>
                                                        option.value ===
                                                        values.cuantasCuotas,
                                                )}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value,
                                                    )
                                                }
                                                isDisabled={
                                                    values.formaDePago === 2
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/4"
                                    label="Cantidad de Niños"
                                    invalid={errors.niños && touched.niños}
                                    errorMessage={errors.niños}
                                >
                                    <Field
                                        type="number"
                                        name="niños"
                                        placeholder="Niños"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    className="w-1/4"
                                    label="Cantidad de Bebes"
                                    invalid={errors.bebes && touched.bebes}
                                    errorMessage={errors.bebes}
                                >
                                    <Field
                                        type="number"
                                        name="bebes"
                                        placeholder="Bebes"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <FormItem>
                                <Button variant="solid" type="submit">
                                    Guardar
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default OrderForm
