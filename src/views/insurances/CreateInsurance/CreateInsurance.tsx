import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import InsuranceForm from './InsuranceForm'

const CreateInsurance = () => {
  const navigate = useNavigate()
  const [insuranceData, setInsuranceData] = useState({
    name: '',
    locator: '',
    price: 0,
    customerId: 0,
  })

  return (
    <div className="xl:container">
      <div className="flex items-center justify-between mb-4">
        <h3>Crear seguro</h3>
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
          <InsuranceForm
            insuranceData={insuranceData}
            setInsuranceData={setInsuranceData}
          />
        </Card>
      </div>
    </div>
  )
}

export default CreateInsurance
