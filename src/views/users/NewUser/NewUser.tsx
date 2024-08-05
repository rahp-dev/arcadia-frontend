import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Notification, Tabs, toast } from '@/components/ui'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import { HiArrowLeft, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi'
import UserProfileForm from './UserProfileForm'
import UserPasswordForm from './UserPasswordForm'
import { useCreateUserMutation } from '@/services/RtkQueryService'

const NewUser = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState('tab1')
  const [userData, setUserData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    identityCard: '',
    primaryPhone: '',
    rolId: null,
    sedeId: 0,
  })

  const [createUser, { isError, isLoading, isSuccess, data, isUninitialized }] =
    useCreateUserMutation()

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration: number = 5,
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' },
    )
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        '¡Usuario creado exitosamente!',
        'El usuario ha sido creado correctamente.',
        3,
      )

      setTimeout(() => {
        navigate('/usuarios')
      }, 1 * 1000)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Ha ocurrido un error al crear el usuario :(',
        'Ocurrió un error al crear el usuario, intente nuevamente.',
        3,
      )
    }
  }, [isError, isSuccess])

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
      <div className="container mx-auto mt-6">
        <Card>
          <Tabs value={currentTab} onChange={(value) => setCurrentTab(value)}>
            <TabList>
              <TabNav value="tab1" icon={<HiOutlineUser />}>
                Información
              </TabNav>
              <TabNav value="tab2" disabled icon={<HiOutlineLockClosed />}>
                Contraseña
              </TabNav>
            </TabList>
            <div className="pt-4">
              <TabContent value="tab1">
                <UserProfileForm
                  newUserData={userData}
                  setNewUserData={setUserData}
                  navigationTabs={setCurrentTab}
                />
              </TabContent>
              <TabContent value="tab2">
                <UserPasswordForm
                  newUserData={userData}
                  setNewUserData={setUserData}
                  createUser={createUser}
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                />
              </TabContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default NewUser
