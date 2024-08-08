import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

import { HiArrowLeft } from 'react-icons/hi'

import FlightTab from './FlightTab'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'

const NewOrder = () => {
  const navigate = useNavigate()
  const [ticketData, setTicketData] = useState<CreateTicketFormModel[]>([
    {
      customerId: 0,
      origin: '',
      destination: '',
      flightDate: null,
      flightDateReturn: null,
      price: 0,
      child: false,
      international: false,
      flightClass: '',
      location: '',
      handBaggage: 0,
      baggage: 0,
    },
  ])

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3>Crear ticket</h3>
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

      <div className="xl:container mt-6">
        <Card>
          <FlightTab ticketData={ticketData} setTicketData={setTicketData} />
        </Card>
      </div>
    </>
  )
}

export default NewOrder
