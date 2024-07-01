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
    key: 'pedidos',
    path: '/pedidos',
    component: lazy(() => import('@/views/orders/Orders')),
    authority: [],
  },
  {
    key: 'crearPedido',
    path: '/pedidos/crear',
    component: lazy(() => import('@/views/orders/NewOrder/NewOrder')),
    authority: [],
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
