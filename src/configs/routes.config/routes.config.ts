import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/views/dashboard/Dashboard')),
    authority: [],
  },
  {
    key: 'tickets',
    path: '/tickets',
    component: lazy(() => import('@/views/orders/Tickets')),
    authority: [],
  },
  {
    key: 'crearTicket',
    path: '/tickets/crear',
    component: lazy(() => import('@/views/orders/NewOrder/NewOrder')),
    authority: [],
  },
  {
    key: 'orders',
    path: '/ordenes',
    component: lazy(() => import('@/views/orders/FinishOrder/Orders')),
  },
  {
    key: 'asignaciones',
    path: '/asignaciones',
    component: lazy(() => import('@/views/assignments/Assingments')),
    authority: [],
  },
  {
    key: 'crearAsignacion',
    path: '/asignaciones/crear',
    component: lazy(
      () => import('@/views/assignments/NewAssingment/NewAssingment'),
    ),
    authority: [],
  },
  {
    key: 'usuarios',
    path: '/usuarios',
    component: lazy(() => import('@/views/users/Users')),
    authority: [],
  },
  {
    key: 'clientes',
    path: '/clientes',
    component: lazy(() => import('@/views/clients/Clients')),
    authority: [],
  },
  {
    key: 'crearClientes',
    path: '/clientes/crear',
    component: lazy(() => import('@/views/clients/NewClient/NewClient')),
    authority: [],
  },
  {
    key: 'crearUsuarios',
    path: '/usuarios/crear',
    component: lazy(() => import('@/views/users/NewUser/NewUser')),
    authority: [],
  },
]
