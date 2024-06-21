import { Rol } from '@/services/roles/types/rol.type'

export type User = {
  id: string
  name: string
  lastName: string
  image: string | null

  createdAt: Date
  deletedAt: Date | null
  updateAt: Date

  session: {
    id: string
    timesLoggedIn: number
    lastAccess: Date
    email: string
    password: string
    type: { id: number; name: string }
    rol: Rol
    status: { id: number; name: string }
  }
}
