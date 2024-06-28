export type Ticket = {
  id: number
  customerId: number
  origin: string
  destination: string
  flightDate: Date
  price: number
  child: false

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
  flightDate: Date
  price: number
  child: false

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
  flightDate: Date | null
  price: number
  child: false

  flightClass: string
  handBaggage: number
  baggage: number

  lodgingName: string
  lodgingPlace: string
  lodgingPrice: number

  insuranceName: string
  insuranceLocation: string
  insurancePrice: number
}
