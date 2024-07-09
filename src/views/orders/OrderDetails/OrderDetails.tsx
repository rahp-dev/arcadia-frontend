import { Button, Card, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useGetOrderByIdQuery } from '@/services/RtkQueryService'
import { FaEdit } from 'react-icons/fa'
import { HiOutlineArrowRight, HiOutlineClipboardCheck } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'

const OrderDetails = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()

  const { data, isFetching } = useGetOrderByIdQuery(orderId, {
    refetchOnMountOrArgChange: true,
  })

  const cardFooter = (
    <Button variant="solid" size="sm" icon={<FaEdit />}>
      Editar orden
    </Button>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles de la Orden #</h3>
        <Button
          size="sm"
          variant="solid"
          onClick={() => navigate('/ordenes')}
          icon={<HiOutlineArrowRight />}
        >
          Regresar
        </Button>
      </div>

      <div className="container mx-auto h-full">
        <div className="flex flex-row gap-4">
          <Card className="xl:max-w-[360px]" footer={cardFooter}></Card>
          <Card className="w-full">
            <Tabs>
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineClipboardCheck />}>
                  Orden previa
                </TabNav>
              </TabList>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetails
