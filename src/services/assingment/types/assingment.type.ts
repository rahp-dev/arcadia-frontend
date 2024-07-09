export type Assingment = {
  id: number
  userId: number
  clientName: string
  clientNumber: string
  origin: string
  assignedTime: Date
  resolvedTime: Date
  status: string
  notes: string
}

export type CreateAssingmentBody = {
  userId: number
  clientName: string
  clientNumber: string
  origin: string
  assignedTime: Date | null
  resolvedTime: Date | null
  status: string
  notes: string
}

export type CreateAssingmentFormModel = {
  userId: number
  clientName: string
  clientNumber: string
  origin: string
  assignedTime: Date | null
  resolvedTime: Date | null
  status: string
  notes: string
}
