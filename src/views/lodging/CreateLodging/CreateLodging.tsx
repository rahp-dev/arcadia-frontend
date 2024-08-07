import { Button, Card } from '@/components/ui'
import { useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import LodgingForm from './LodgingForm'

const CreateLodging = () => {
  const navigate = useNavigate()
  const [lodgingData, setLodgingData] = useState({
    name: '',
    locator: '',
    price: 0,
    customerId: 0,
  })

  return (
    <div className="xl:container">
      <div className="flex items-center justify-between mb-4">
        <h3>Crear hospedaje</h3>
        <Button
          variant="solid"
          size="sm"
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>
      <div className="xl:container mt-6">
        <Card>
          <LodgingForm
            lodgingData={lodgingData}
            setLodgingData={setLodgingData}
          />
        </Card>
      </div>
    </div>
  )
}

export default CreateLodging
