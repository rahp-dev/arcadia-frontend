import { Button, Card, Tabs } from '@/components/ui'
import React, { useState } from 'react'
import { HiArrowLeft, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import UserProfileForm from './UserProfileForm'
import { CreateUserFormModel } from '@/services/users/types/user.type'

const NewUser = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<CreateUserFormModel>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    identityCard: '',
    primaryPhone: '',
    rolId: null,
  })

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3>Crear usuario</h3>
        <Button
          variant="solid"
          size="sm"
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
        >
          Regresar
        </Button>
      </div>
      <div className="container mt-6">
        <Card>
          <UserProfileForm newUserData={userData} />
        </Card>
      </div>
    </div>
  )
}

export default NewUser
