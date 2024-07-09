import { Button, Card, Skeleton, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useGetOrderByIdQuery } from '@/services/RtkQueryService'
import { format } from 'date-fns'
import { FaEdit } from 'react-icons/fa'
import {
  HiOutlineArrowRight,
  HiOutlineClipboardCheck,
  HiOutlineTicket,
} from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'

const OrderDetails = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()

  const { data, isFetching } = useGetOrderByIdQuery(orderId, {
    refetchOnMountOrArgChange: true,
  })

  const formattedDate = (date: Date | null) => {
    if (!date) return

    return format(new Date(date), 'dd-MM-yyyy - h:mm:ss a')
  }

  const cardFooter = (
    <Button variant="solid" size="sm" icon={<FaEdit />} block>
      Editar orden
    </Button>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3>Detalles de la orden</h3>
        <Button
          size="sm"
          variant="solid"
          onClick={() => navigate('/ordenes')}
          icon={<HiOutlineArrowRight />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto h-full">
        <div className="flex flex-row gap-4">
          <Card className="w-[380px]" footer={cardFooter}>
            <div className="grid gap-y-4 gap-x-4">
              {isFetching ? (
                <Skeleton />
              ) : (
                <h5 className="text-center text-slate-600">
                  Orden N°{data?.id}
                </h5>
              )}

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">Monto total:</span>
                    <span>{data?.amount}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">¿Fue financiado?:</span>
                    <span>{data?.financed ? 'Sí' : 'No'}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">¿Cuántas cuotas?:</span>
                    <span>
                      {data?.numQuotes > 0 ? `${data?.numQuotes}` : 'Ninguna'}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">Método de Pago:</span>
                    <span>{data?.paymentMethod}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">
                      N° de Referencia del Pago:
                    </span>
                    <span>
                      {data?.paymentReference
                        ? `${data?.paymentReference}`
                        : 'Sin referencia'}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">Estatus de la Orden:</span>
                    <span>{data?.status}</span>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">Cantidad de Tickets:</span>
                    <div className="flex gap-2">
                      {data?.tickets.map((ticket: any, index: number) => (
                        <HiOutlineTicket key={ticket.id} className="text-2xl" />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col">
                {isFetching ? (
                  <Skeleton />
                ) : (
                  <>
                    <span className="font-semibold">
                      Fecha de la Transacción:
                    </span>
                    <span>{formattedDate(data?.transactionDate)}</span>
                  </>
                )}
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <Tabs>
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineClipboardCheck />}>
                  Orden previa
                </TabNav>
              </TabList>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetails
