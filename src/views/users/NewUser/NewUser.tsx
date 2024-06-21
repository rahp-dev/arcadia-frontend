import { Button, Card, Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import React, { useState } from 'react'
import { HiArrowLeft, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import UserProfileForm from './UserProfileForm'
import UserPasswordForm from './UserPasswordForm'

const NewUser = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('tab1')

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
      <div className="flex justify-center">
        <Card>
          <Tabs value={currentTab} onChange={(value) => setCurrentTab(value)}>
            <TabList>
              <TabNav value="tab1" icon={<HiOutlineUser />}>
                Perfil del usuario
              </TabNav>
              <TabNav value="tab2" disabled icon={<HiOutlineLockClosed />}>
                Contraseña
              </TabNav>
            </TabList>
            <div className="p-4">
              <TabContent value="tab1">
                <UserProfileForm />
              </TabContent>
              <TabContent value="tab2">
                <UserPasswordForm />
              </TabContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default NewUser
