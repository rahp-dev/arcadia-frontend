export type Assingment = {
  id: number
  userId: number
  date: Date
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
  date: Date | null
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
  date: Date | null
  clientName: string
  clientNumber: string
  origin: string
  assignedTime: Date | null
  resolvedTime: Date | null
  status: string
  notes: string
}
