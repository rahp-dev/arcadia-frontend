export type Emission = {
  id: number
  orderId: number
  date: Date
  airline: string
  passengerCount: number
  costPrice: number
  providerFee: number
  totalToPay: number
  clientPayment: number
  generatedFee: number
  advisorCommission: number
  officeCommission: number
  advisorLeadCommission: number
  amountPaid: string
  status: string
  observation: string
  agency: { id: number; name: string }
  paymentMethod: { id: number; name: string }
  providerSystem: { id: number; name: string }
}

export type Agencies = {
  id: number
  name: string
}

export type SystemProvider = {
  id: number
  name: string
  price: number
}

export type CreateEmissionFormModel = {
  orderId: number
  date: Date
  airline: string
  passengerCount: number
  costPrice: number
  providerFee: number
  totalToPay: number
  clientPayment: number
  generatedFee: number
  advisorCommission: number
  officeCommission: number
  advisorLeadCommission: number
  amountPaid: string
  status: string
  observation: string
  paymentMethodId: number
  agencyId: number
  providerSystemId: number
}

export type CreateEmissionBody = {
  orderId: number
  date: Date | null
  agency: string
  airline: string
  passengerCount: number
  providerSystemId: number
  costPrice: number
  providerFee: number
  totalToPay: number
  clientPayment: number
  generatedFee: number
  advisorCommission: number
  amountPaid: string
  paymentMethod: number
  status: string
  observation: string
}

export type CalculateEmissionFormModel = {
  orderId: number
  date: Date | null
  airline: string
  costPrice: number
  amountPaid: string
  status: string
  observation: string
  providerSystemId: number
  agencyId: number
}
