import { Button, Card, Skeleton, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import {
  useGetEmissionByIdQuery,
  useUpdateEmissionMutation,
} from '@/services/RtkQueryService'
import { format } from 'date-fns'
import { FaEdit } from 'react-icons/fa'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { VscEdit } from 'react-icons/vsc'
import { useNavigate, useParams } from 'react-router-dom'
import EmissionsForm from './EmissionsForm'
import { useEffect, useState } from 'react'
import { CreateEmissionFormModel } from '@/services/emissions/types/emissions.type'
import openNotification from '@/utils/useNotification'

type FormModel = CreateEmissionFormModel

const EmissionsDetails = () => {
  const navigate = useNavigate()
  const { emissionId } = useParams()
  const [editActive, setEditActive] = useState(false)
  const [emissionData, setEmissionData] = useState<FormModel>({
    orderId: 0,
    date: null,
    agency: '',
    airline: '',
    passengerCount: 0,
    providerSystem: '',
    costPrice: 0,
    providerFee: 0,
    totalToPay: 0,
    clientPayment: 0,
    generatedFee: 0,
    advisorCommission: 0,
    amountPaid: '',
    paymentMethod: '',
    status: '',
    observation: '',
  })

  const { data, isFetching } = useGetEmissionByIdQuery(emissionId, {
    refetchOnMountOrArgChange: true,
  })

  const [updateEmission, { isError, isSuccess, isUninitialized }] =
    useUpdateEmissionMutation()

  const cardFooter = (
    <Button block variant="solid" size="sm" icon={<FaEdit />}>
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
        agency: data?.agency,
        airline: data?.airline,
        passengerCount: data?.passengerCount,
        providerSystem: data?.providerSystem,
        costPrice: data?.costPrice,
        providerFee: data?.providerFee,
        totalToPay: data?.totalToPay,
        clientPayment: data?.clientPayment,
        generatedFee: data?.generatedFee,
        advisorCommission: data?.advisorCommission,
        amountPaid: data?.amountPaid,
        paymentMethod: data?.paymentMethod,
        status: data?.status,
        observation: data?.observation,
      })
    } else {
      setEmissionData({
        orderId: 0,
        date: null,
        agency: '',
        airline: '',
        passengerCount: 0,
        providerSystem: '',
        costPrice: 0,
        providerFee: 0,
        totalToPay: 0,
        clientPayment: 0,
        generatedFee: 0,
        advisorCommission: 0,
        amountPaid: '',
        paymentMethod: '',
        status: '',
        observation: '',
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

      // setEditActive(false)
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
                    <span>{data?.agency || 'N/A'}</span>
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
                    <span>{data?.costPrice || 'N/A'}</span>
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
                    <span>{data?.providerSystem || 'N/A'}</span>
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
                    <span>{data?.providerFee || 'N/A'}</span>
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
                    <span>{data?.totalToPay || 'N/A'}</span>
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
                    <span className="font-semibold">Cantidad Pagada:</span>
                    <span>{data?.amountPaid || 'N/A'}</span>
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
                    <span>{data?.paymentMethod || 'N/A'}</span>
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
            <Tabs value="tab1">
              <TabList>
                <TabNav value="tab1" icon={<VscEdit />}>
                  Editar emisión
                </TabNav>
              </TabList>
              <div className="pt-4">
                <EmissionsForm
                  emissionData={emissionData}
                  emissionId={emissionId}
                  editActive={!editActive}
                  updateEmission={updateEmission}
                />
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  )
}

export default EmissionsDetails
