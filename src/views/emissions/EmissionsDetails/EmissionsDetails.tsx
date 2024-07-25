import { Button, Card, Skeleton, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import {
  useCalculateEmissionMutation,
  useGetEmissionByIdQuery,
  useUpdateEmissionMutation,
} from '@/services/RtkQueryService'
import { format } from 'date-fns'
import { FaEdit } from 'react-icons/fa'
import { HiOutlineArrowRight, HiOutlineCalculator } from 'react-icons/hi'
import { VscEdit } from 'react-icons/vsc'
import { useNavigate, useParams } from 'react-router-dom'
import EmissionsForm from './EmissionsForm'
import { useEffect, useState } from 'react'
import { CreateEmissionFormModel } from '@/services/emissions/types/emissions.type'
import openNotification from '@/utils/useNotification'
import TabContent from '@/components/ui/Tabs/TabContent'
import EmisionsCalculate from './EmissionsCalculate'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'

type FormModel = CreateEmissionFormModel

const EmissionsDetails = () => {
  const navigate = useNavigate()
  const { emissionId } = useParams()
  const [editActive, setEditActive] = useState(false)
  const [currentTab, setCurrentTab] = useState('tab1')
  const [emissionData, setEmissionData] = useState<FormModel>({
    advisorCommission: 0,
    officeCommission: 0,
    advisorLeadCommission: 0,
    agencyId: 0,
    airline: '',
    amountPaid: '',
    clientPayment: 0,
    costPrice: 0,
    date: null,
    generatedFee: 0,
    observation: '',
    orderId: 0,
    passengerCount: 0,
    paymentMethodId: 0,
    providerFee: 0,
    providerSystemId: 0,
    status: '',
    totalToPay: 0,
  })

  const [emissionPreview, setEmissionPreview] = useState({
    orderId: 0,
    date: null,
    airline: '',
    costPrice: 0,
    amountPaid: '',
    status: '',
    observation: '',
    providerSystemId: 0,
    agencyId: 0,
  })

  const { data, isFetching } = useGetEmissionByIdQuery(emissionId, {
    refetchOnMountOrArgChange: true,
  })

  const [updateEmission, { isError, isSuccess, isUninitialized }] =
    useUpdateEmissionMutation()

  const [
    calculateEmission,
    {
      isError: calculateError,
      isSuccess: calculateIsSuccess,
      isUninitialized: calculateIsUninitialized,
    },
  ] = useCalculateEmissionMutation()

  const handleToggleEditing = () => {
    setEditActive(true)
  }

  const cardFooter = (
    <Button
      block
      variant="solid"
      size="sm"
      onClick={() => handleToggleEditing()}
      icon={<FaEdit />}
    >
      Editar emisión
    </Button>
  )

  const formattedDate = (date: Date | null) => {
    if (!date) return

    return format(new Date(date), 'dd-MM-yyyy - h:mm:ss a')
  }

  useEffect(() => {
    if (data && !isFetching) {
      setEmissionData({
        orderId: data?.orderId,
        date: new Date(data?.date),
        agencyId: data?.agency?.id,
        airline: data?.airline,
        passengerCount: data?.passengerCount,
        providerSystemId: data?.providerSystem.id,
        costPrice: data?.costPrice,
        providerFee: data?.providerFee,
        totalToPay: data?.totalToPay,
        clientPayment: data?.clientPayment,
        generatedFee: data?.generatedFee,
        advisorCommission: data?.advisorCommission,
        advisorLeadCommission: data?.advisorLeadCommission,
        officeCommission: data?.officeCommission,
        amountPaid: data?.amountPaid,
        paymentMethodId: data?.paymentMethod.id,
        status: data?.status,
        observation: data?.observation,
      })
      setEmissionPreview({
        agencyId: data?.agency?.id,
        airline: data?.airline,
        amountPaid: data?.amountPaid,
        costPrice: data?.costPrice,
        date: new Date(data?.date),
        status: data?.status,
        observation: data?.observation,
        orderId: data?.orderId,
        providerSystemId: data?.providerSystem.id,
      })
    } else {
      setEmissionData({
        orderId: 0,
        date: null,
        agencyId: 0,
        airline: '',
        passengerCount: 0,
        providerSystemId: 0,
        costPrice: 0,
        providerFee: 0,
        totalToPay: 0,
        clientPayment: 0,
        generatedFee: 0,
        advisorCommission: 0,
        officeCommission: 0,
        advisorLeadCommission: 0,
        amountPaid: '',
        paymentMethodId: 0,
        status: '',
        observation: '',
      })
      setEmissionPreview({
        agencyId: 0,
        airline: '',
        amountPaid: '',
        costPrice: 0,
        date: null,
        status: '',
        observation: '',
        orderId: 0,
        providerSystemId: 0,
      })
    }
  }, [data, isFetching])

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Emisión Actualizada',
        'La emisión se ha actualizado correctamente.',
        3,
      )

      setEditActive(false)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al actualizar la emisión, por favor intenta más tarde.',
        3,
      )
    }
  }, [isSuccess, isError])

  useEffect(() => {
    if (calculateIsSuccess) {
      openNotification(
        'success',
        '¡Cálculos generados!',
        'Los cálculos de la emisión fueron generados correctamente.',
        4,
      )
      setCurrentTab('tab1')
      setEditActive(false)
    }

    if (!calculateIsUninitialized && calculateError) {
      openNotification(
        'warning',
        'Error :(',
        'Ocurrio un error al generar los cálculos de la emisión, por favor intenta más tarde.',
        4,
      )
    }
  }, [calculateIsSuccess, calculateError])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3>Detalles de la emisión</h3>
        <Button
          size="sm"
          variant="solid"
          onClick={() => navigate('/emisiones')}
          icon={<HiOutlineArrowRight />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-row gap-4">
          <Card footer={cardFooter} className="w-[400px]">
            <div className="grid gap-y-4">
              {isFetching ? (
                <>
                  <Skeleton className="mt-4 w-[60%]" />
                  <Skeleton className="mt-1 w-[40%]" />
                </>
              ) : (
                <h5 className="text-center text-slate-600">
                  Emisión N°{data?.id}
                </h5>
              )}

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Agencia de Viaje:</span>
                    <span>{data?.agency?.name || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Aerolínea:</span>
                    <span>{data?.airline || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Conteo de pasajeros:</span>
                    <span>{data?.passengerCount || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Precio costo:</span>
                    <span>{`${data?.costPrice}$` || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Sistema Proveedor:</span>
                    <span>{data?.providerSystem.name || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Tarifa del Proveedor:</span>
                    <span>{`${data?.providerFee}$` || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Total a Pagar:</span>
                    <span>{`${data?.totalToPay}$` || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Pago del Cliente:</span>
                    <span>{data?.clientPayment || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Tarifa Generada:</span>
                    <span>{data?.generatedFee || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Comisión del Asesor:</span>
                    <span>{data?.advisorCommission || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">
                      Comisión de la oficina:
                    </span>
                    <span>{data?.officeCommission || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">
                      Comisión del Lider de Ventas:
                    </span>
                    <span>{data?.advisorLeadCommission || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Cantidad Pagada:</span>
                    <span>
                      {capitalizeFirstLetter(data?.amountPaid) || 'N/A'}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Método de Pago:</span>
                    <span>
                      {capitalizeFirstLetter(data?.paymentMethod?.name) ||
                        'N/A'}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Estatus:</span>
                    <span>{data?.status || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Observación:</span>
                    <span>{data?.observation || 'N/A'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Fecha de la Emisión:</span>
                    <span>{formattedDate(data?.date) || 'N/A'}</span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="w-full h-1/2">
            <Tabs value={currentTab} onChange={(value) => setCurrentTab(value)}>
              <TabList>
                <TabNav value="tab1" icon={<VscEdit />}>
                  Editar emisión
                </TabNav>
                <TabNav value="tab2" icon={<HiOutlineCalculator />}>
                  Generar cálculos
                </TabNav>
              </TabList>
              <TabContent value="tab1" className="pt-4">
                <EmissionsForm
                  emissionData={emissionData}
                  emissionId={emissionId}
                  editActive={!editActive}
                  updateEmission={updateEmission}
                />
              </TabContent>
              <TabContent value="tab2">
                <EmisionsCalculate
                  emissionData={emissionPreview}
                  emissionId={emissionId}
                  editActive={!editActive}
                  calculateEmission={calculateEmission}
                />
              </TabContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  )
}

export default EmissionsDetails
