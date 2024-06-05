import {
    Checkbox,
    DatePicker,
    FormContainer,
    FormItem,
    Input,
    Radio,
    Select,
} from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import * as Yup from 'yup'

type Option = {
    value: number
    label: string
}

type FormModel = {
    salida: string
    destino: string
    date: Date | null
    tipoIda: Array<string | number>
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
    tipoIda: Yup.array().min(1, 'Debes escoger uno'),
    personasAdultas: Yup.number()
        .min(1, 'Debe ser minimo 1 adulto')
        .max(9, 'El maximo de adultos es 9.')
        .required('Ingresa un numero'),
    maletas23: Yup.number()
        .min(1)
        .max(18)
        .required('Ingresa la cantidad de maletas.'),
    maletas10: Yup.number()
        .min(1)
        .max(9)
        .required('Ingresa la cantidad de maletas.'),
    claseVuelo: Yup.string().required('Seleccione uno'),
    formaDePago: Yup.array().min(1, 'Debes escoger uno'),
    cuantasCuotas: Yup.string().required('Seleccione uno'),
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
    const [showCuotasSelect, setShowCuotasSelect] = useState(false)

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{
                    salida: '',
                    destino: '',
                    date: null,
                    tipoIda: [],
                    personasAdultas: 0,
                    maletas23: 0,
                    maletas10: 0,
                    claseVuelo: '',
                    formaDePago: [],
                    cuantasCuotas: '',
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
                                    className="w-[30%]"
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
                                    className="w-[30%]"
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
                                    label="Fecha"
                                    invalid={errors.date && touched.date}
                                    errorMessage={errors.date}
                                >
                                    <Field name="date" placeholder="Fecha">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values.date}
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
                                                onChange={(val) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        val,
                                                    )
                                                }
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
                                    className="w-1/4"
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
                                    className="w-[23%]"
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
                                    className="w-[23%]"
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
                                    className="w-[22%]"
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
                            </div>
                            <div className="flex items-center gap-6">
                                <FormItem
                                    asterisk
                                    label="Formas de Pago"
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
                                            <>
                                                <Checkbox.Group
                                                    value={values.formaDePago}
                                                    onChange={(options) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            options,
                                                        )
                                                    }}
                                                >
                                                    <Checkbox
                                                        name={field.name}
                                                        value="Cuotas"
                                                    >
                                                        Por cuotas
                                                    </Checkbox>
                                                    <Checkbox
                                                        name={field.name}
                                                        value="Contado"
                                                    >
                                                        Contado
                                                    </Checkbox>
                                                </Checkbox.Group>
                                            </>
                                        )}
                                    </Field>
                                </FormItem>
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
                                                value={cuotas.filter(
                                                    (option) =>
                                                        option.value ===
                                                        parseInt(
                                                            values.cuantasCuotas,
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
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default OrderForm
