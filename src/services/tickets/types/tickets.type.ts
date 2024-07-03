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
  accommodation?: {
    name?: string
    location?: string
    price?: number
  }
  insurance?: {
    name?: string
    location?: string
    price?: number
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
  accommodation?: {
    name?: string
    location?: string
    price?: number
  }
  insurance?: {
    name?: string
    location?: string
    price?: number
  }
  flightClass?: string
  handBaggage?: number
  baggage?: number
  insuranceName?: string
  insuranceLocation?: string
  insurancePrice?: number
  lodgingName?: string
  lodgingPlace?: string
  lodgingPrice?: number
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

  lodgingName?: string
  lodgingPlace?: string
  lodgingPrice?: number

  insuranceName?: string
  insuranceLocation?: string
  insurancePrice?: number
}
