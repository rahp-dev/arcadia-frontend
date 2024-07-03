import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import Tabs from './../../../components/ui/Tabs/index'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'

import {
  HiArrowLeft,
  HiOutlineClipboardCheck,
  HiOutlineHome,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi'
import { BsAirplaneEngines } from 'react-icons/bs'
import TabContent from '@/components/ui/Tabs/TabContent'
import FlightTab from './Tabs/FlightTab'
import { CreateTicketFormModel } from '@/services/tickets/types/tickets.type'
import InsuranceTab from './Tabs/InsuranceTab'
import LodgingTab from './Tabs/LodgingTab'

const NewOrder = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState<
    'tab1' | 'tab2' | 'tab3' | 'tab4'
  >('tab1')
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
      lodgingName: undefined,
      lodgingPlace: undefined,
      lodgingPrice: undefined,
      insuranceName: undefined,
      insuranceLocation: undefined,
      insurancePrice: undefined,
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

      <div className="container mt-6">
        <Card>
          <Tabs
            value={currentTab}
            onChange={(value) => setCurrentTab(value as any)}
          >
            <TabList>
              <TabNav value="tab1" icon={<BsAirplaneEngines />}>
                Agregar vuelo
              </TabNav>
              <TabNav
                value="tab2"
                disabled={
                  currentTab !== 'tab2' &&
                  currentTab !== 'tab3' &&
                  currentTab !== 'tab4'
                }
                icon={<HiOutlineOfficeBuilding />}
              >
                Agregar Seguro
              </TabNav>
              <TabNav
                value="tab3"
                disabled={currentTab !== 'tab3'}
                icon={<HiOutlineHome />}
              >
                Agregar hospedaje
              </TabNav>
            </TabList>
            <div className="py-4">
              <TabContent value="tab1">
                <FlightTab
                  setTicketData={setTicketData}
                  setCurrentTab={setCurrentTab}
                  submitButtonText="Siguiente"
                />
              </TabContent>
              <TabContent value="tab2">
                <InsuranceTab
                  ticketData={ticketData}
                  setTicketData={setTicketData}
                  setCurrentTab={setCurrentTab}
                  flightIndex={0}
                />
              </TabContent>
              <TabContent value="tab3">
                <LodgingTab
                  ticketData={ticketData}
                  setTicketData={setTicketData}
                />
              </TabContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </>
  )
}

export default NewOrder
