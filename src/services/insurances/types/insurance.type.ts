export type Insurance = {
  id: number
  name: string
  locator: string
  price: number
  customerId: number
}

export type CreateInsuranceBody = {
  name: string
  locator: string
  price: number
  customerId: number
}

export type CreateInsuranceFormModel = {
  name: string
  locator: string
  price: number
  customerId: number
}
