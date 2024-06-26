export type Order = {
  id: number
  amount: number
  paymentMethod: string
  paymentReference: string
  status: string
  numQuotes: number
  financed: boolean
  transactionDate: Date
  ticketIds: Array<number>
}

export type CreateOrderBody = {
  amount: number
  paymentMethod: string
  paymentReference: string
  status: string
  numQuotes: number | null
  financed: boolean
  transactionDate: Date | null
  ticketIds: Array<number>
}

export type CreateOrderFormModel = {
  amount: number
  paymentMethod: string
  paymentReference: string
  status: string
  numQuotes: number | null
  financed: boolean
  transactionDate: Date | null
  ticketIds: Array<number>
}
