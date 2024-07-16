import { Button, Card, Skeleton, Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from '@/services/RtkQueryService'
import { format } from 'date-fns'
import { FaEdit } from 'react-icons/fa'
import {
  HiOutlineArrowRight,
  HiOutlineClipboardCheck,
  HiOutlineTicket,
} from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  CreateOrderBody,
  CreateOrderFormModel,
} from '@/services/orders/types/orders.type'
import UpdateOrderForm from './UpdateOrderForm'
import openNotification from '@/utils/useNotification'

type FormModel = CreateOrderFormModel

const OrderDetails = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [editActive, setEditActive] = useState(false)
  const [orderData, setOrderData] = useState<FormModel>({
    amount: 0,
    financed: false,
    numQuotes: 0,
    paymentMethod: '',
    paymentReference: '',
    status: '',
    transactionDate: null,
    ticketIds: [],
  })

  const { data, isFetching } = useGetOrderByIdQuery(orderId, {
    refetchOnMountOrArgChange: true,
  })

  const [updateOrder, { isError, isSuccess, isUninitialized }] =
    useUpdateOrderMutation()

  const formattedDate = (date: Date | null) => {
    if (!date) return

    return format(new Date(date), 'dd-MM-yyyy - h:mm:ss a')
  }

  const handleToggleEditing = () => {
    setEditActive(true)
  }

  useEffect(() => {
    if (data && !isFetching) {
      setOrderData({
        amount: data?.amount,
        financed: data?.financed,
        numQuotes: data?.numQuotes,
        paymentMethod: data?.paymentMethod,
        paymentReference: data?.paymentReference,
        status: data?.status,
        transactionDate: new Date(data?.transactionDate),
        ticketIds: data?.ticketIds || [],
      })
    } else {
      setOrderData({
        amount: 0,
        financed: false,
        numQuotes: 0,
        paymentMethod: '',
        paymentReference: '',
        status: '',
        transactionDate: null,
        ticketIds: [],
      })
    }
  }, [data, isFetching])

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Orden Actualizada',
        'La orden se ha actualizado correctamente.',
        3,
      )

      setEditActive(false)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al actualizar la orden, por favor intenta más tarde.',
        3,
      )
    }
  }, [isSuccess, isError])

  const cardFooter = (
    <Button
      block
      variant="solid"
      size="sm"
      icon={<FaEdit />}
      onClick={() => handleToggleEditing()}
    >
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

      <div className="container">
        <div className="flex justify-between flex-row gap-4">
          <Card className="w-[400px]" footer={cardFooter}>
            <div className="grid gap-y-4 gap-x-4">
              {isFetching ? (
                <>
                  <Skeleton className="mt-4 w-[60%]" />
                  <Skeleton className="mt-1 w-[40%]" />
                </>
              ) : (
                <h5 className="text-center text-slate-600">
                  Orden N°{data?.id}
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
                    <span className="font-semibold">Monto total:</span>
                    <span>{data?.amount}</span>
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
                    <span className="font-semibold">¿Fue financiado?:</span>
                    <span>{data?.financed ? 'Sí' : 'No'}</span>
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
                    <span className="font-semibold">¿Cuántas cuotas?:</span>
                    <span>
                      {data?.numQuotes > 0 ? `${data?.numQuotes}` : 'Ninguna'}
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
                    <span>{data?.paymentMethod}</span>
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
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Estatus de la Orden:</span>
                    <span>{data?.status}</span>
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
                  <>
                    <Skeleton className="mt-4 w-[60%]" />
                    <Skeleton className="mt-1 w-[40%]" />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Fecha de creación:</span>
                    <span>{formattedDate(data?.createdAt)}</span>
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
                      Fecha de la Transacción:
                    </span>
                    <span>{formattedDate(data?.transactionDate)}</span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <div id="customer-form-edit" className="h-[70px]"></div>

          <Card className="w-full h-1/3">
            <Tabs value="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineClipboardCheck />}>
                  Detalle de la Orden
                </TabNav>
              </TabList>
              <div className="pt-4">
                <TabContent value="tab1">
                  <UpdateOrderForm
                    updateOrder={updateOrder}
                    orderData={orderData}
                    orderId={orderId}
                    editActive={!editActive}
                  />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetails
