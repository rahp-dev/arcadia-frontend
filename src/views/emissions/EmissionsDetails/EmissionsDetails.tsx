import { Button, Card, Skeleton, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useGetEmissionByIdQuery } from '@/services/RtkQueryService'
import { format } from 'date-fns'
import { FaEdit } from 'react-icons/fa'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { VscEdit } from 'react-icons/vsc'
import { useNavigate, useParams } from 'react-router-dom'
import EmissionsForm from './EmissionsForm'

const EmissionsDetails = () => {
  const navigate = useNavigate()
  const { emissionId } = useParams()

  const { data, isFetching } = useGetEmissionByIdQuery(emissionId, {
    refetchOnMountOrArgChange: true,
  })

  const cardFooter = (
    <Button block variant="solid" size="sm" icon={<FaEdit />}>
      Editar emisión
    </Button>
  )

  const formattedDate = (date: Date | null) => {
    if (!date) return

    return format(new Date(date), 'dd-MM-yyyy - h:mm:ss a')
  }

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
                    <span className="font-semibold">Precio de Coste:</span>
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
                <EmissionsForm />
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  )
}

export default EmissionsDetails
