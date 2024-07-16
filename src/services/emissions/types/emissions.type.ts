export type Emission = {
  id: number
  orderId: number
  date: Date
  agency: string
  airline: string
  passengerCount: number
  providerSystem: string
  costPrice: number
  providerFee: number
  totalToPay: number
  clientPayment: number
  generatedFee: number
  advisorCommission: number
  amountPaid: string
  paymentMethod: string
  status: string
  observation: string
}

export type CreateEmissionFormModel = {
  orderId: number
  date: Date | null
  agency: string
  airline: string
  passengerCount: number
  providerSystem: string
  costPrice: number
  providerFee: number
  totalToPay: number
  clientPayment: number
  generatedFee: number
  advisorCommission: number
  amountPaid: string
  paymentMethod: string
  status: string
  observation: string
}

export type CreateEmissionBody = {
  orderId: number
  date: Date | null
  agency: string
  airline: string
  passengerCount: number
  providerSystem: string
  costPrice: number
  providerFee: number
  totalToPay: number
  clientPayment: number
  generatedFee: number
  advisorCommission: number
  amountPaid: string
  paymentMethod: string
  status: string
  observation: string
}
