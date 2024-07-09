import { Button, Input } from '@/components/ui'
import React, { useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import NewAssingmentForm from './NewAssingmentForm'
import { CreateAssingmentFormModel } from '@/services/assingment/types/assingment.type'

const NewAssingment = () => {
  const navigate = useNavigate()

  const [assingmentData, setAssingmentData] =
    useState<CreateAssingmentFormModel>({
      userId: 0,
      clientName: '',
      clientNumber: '',
      assignedTime: null,
      notes: '',
      origin: '',
      resolvedTime: null,
      status: '',
    })

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3>Crear Asignación</h3>
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
          <NewAssingmentForm assingmentData={assingmentData} />
        </Card>
      </div>
    </>
  )
}

export default NewAssingment
