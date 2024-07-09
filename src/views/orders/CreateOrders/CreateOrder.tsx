import { Button, Card } from '@/components/ui'
import React, { useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import NewOrder from '../NewOrder/NewOrder'
import OrderForm from './OrdersForm'
import { CreateOrderFormModel } from '@/services/orders/types/orders.type'

const CreateOrder = () => {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState<CreateOrderFormModel>({
    amount: 0,
    financed: false,
    numQuotes: 0,
    paymentMethod: '',
    paymentReference: '',
    status: '',
    ticketIds: [],
    transactionDate: null,
  })

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3>Crear orden</h3>
        </div>

        <div className="flex flex-row gap-4">
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiArrowLeft />}
              onClick={() => {
                navigate(-1)
              }}
            >
              Regresar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mt-6">
        <Card>
          <OrderForm orderData={orderData} setOrderData={setOrderData} />
        </Card>
      </div>
    </>
  )
}

export default CreateOrder
