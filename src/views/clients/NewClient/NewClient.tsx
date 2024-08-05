import { Button, Card } from '@/components/ui'
import React, { useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import ClientForm from './ClientForm'
import { useNavigate } from 'react-router-dom'
import { CreateClientFormModel } from '@/services/clients/types/client.type'

const NewClient = () => {
  const navigate = useNavigate()
  const [clientData, setClientData] = useState<CreateClientFormModel>({
    name: '',
    lastName: '',
    birthDate: null,
    identityCard: '',
    passport: '',
    frequentTraveler: false,
    email: '',
    phone: '',
    instagram: '',
    country: '',
    state: '',
    street: '',
  })

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3>Crear cliente</h3>
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

      <div className="container mx-auto mt-6">
        <Card>
          <ClientForm clientData={clientData} />
        </Card>
      </div>
    </>
  )
}

export default NewClient
