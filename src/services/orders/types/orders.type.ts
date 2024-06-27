export type Order = {
  id: number
  amount: number
  paymentMethod: string
  paymentReference: string
  status: string
  numQuotes: number
  financed: boolean
  transactionDate: Date
  ticketsIds: Array<number>
}

export type CreateOrderBody = {
  amount: number
  paymentMethod: string
  paymentReference: string
  status: string
  numQuotes: number
  financed: boolean
  transactionDate: Date | null
  ticketsIds: Array<number>
}

export type CreateOrderFormModel = {
  amount: number
  paymentMethod: string
  paymentReference: string
  status: string
  numQuotes: number
  financed: boolean
  transactionDate: Date | null
  ticketsIds: Array<number>
}
