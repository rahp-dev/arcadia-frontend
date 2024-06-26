export type Ticket = {
  customerId: number
  origin: string
  destination: string
  exist: string
  flightDate: Date
  price: number
  details_ticket: {
    type_flight_class: string
    hand_baggage: number
    baggage: number
  }
  accommodation: {
    name: string
    location: string
    price: number
  }
  insurance: {
    name: string
    location: string
    price: number
  }
}

export type CreateTicketBody = {
  customerId: number
  origin: string
  destination: string
  exist: string
  flightDate: Date
  price: number
  details_ticket: {
    type_flight_class: string
    hand_baggage: number
    baggage: number
  }

  accommodation: {
    name: string
    location: string
    price: number
  }

  insurance: {
    name: string
    location: string
    price: number
  }
}

export type CreateTicketFormModel = {
  customerId: number
  origin: string
  destination: string
  exist: string
  flightDate: Date | null
  flightPrice: number

  typeFlight: string
  handBaggage: number
  baggage: number

  lodgingName: string
  lodgingPlace: string
  lodgingPrice: number

  insuranceName: string
  insuranceLocation: string
  insurancePrice: number
}
