export type Lodging = {
  id: number
  name: string
  locator: string
  price: number
  customerId: number
}

export type CreateLodgingBody = {
  name: string
  locator: string
  price: number
  customerId: number
}

export type CreateLodgingFormModel = {
  name: string
  locator: string
  price: number
  customerId: number
}
