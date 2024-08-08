export type Ticket = {
  id: number
  customerId: number
  origin: string
  destination: string
  flightDate: Date
  flightDateReturn: Date
  price: number
  child: false
  international: false
  details_ticket: {
    type_flight_class: string
    hand_baggage: number
    baggage: number
    location: string
  }
}

export type CreateTicketBody = {
  customerId: number
  origin: string
  destination: string
  flightDate: Date
  flightDateReturn: Date
  price: number
  child: boolean
  international: boolean
  details_ticket: {
    type_flight_class: string
    location: string
    hand_baggage: number
    baggage: number
  }
  flightClass?: string
  handBaggage?: number
  baggage?: number
}

export type CreateTicketFormModel = {
  customerId: number
  origin: string
  destination: string
  flightDate: Date | null
  flightDateReturn: Date | null
  price: number
  child: false
  international: false
  flightClass: string
  handBaggage: number
  baggage: number
  location: string
}
