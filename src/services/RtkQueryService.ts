import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'

import BaseService from './BaseService'
import { EndpointBuilderType } from './core-entities/paginated-result.entity'

import { getMeQuery } from './getMe/getMe.service'
import { getClientsQuery } from './clients/Client.service'
import { getUsersQuery } from './users/Users.service'
import { getTicketsQuery } from './tickets/Tickets.service'
import { getOrdersQuery } from './orders/Orders.service'
import { getAssingmentsQuery } from './assingment/Assingments.service'
import { getEmissionQuery } from './emissions/Emissions.service'
import { getSedesQuery } from './sedes/Sedes.service'
import { getLodgingQuery } from './lodging/Lodging.service'
import { getInsuranceQuery } from './insurances/Insurances.service'

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
  async (request) => {
    try {
      const response = BaseService(request)
      return response
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

const RtkQueryService = createApi({
  reducerPath: 'rtkApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Customers',
    'Users',
    'Tickets',
    'Orders',
    'Assingments',
    'Emission',
    'Sedes',
    'Lodging',
    'Insurance',
  ],
  endpoints: (builder: EndpointBuilderType) => ({
    ...getMeQuery(builder),
    ...getClientsQuery(builder),
    ...getUsersQuery(builder),
    ...getTicketsQuery(builder),
    ...getOrdersQuery(builder),
    ...getAssingmentsQuery(builder),
    ...getEmissionQuery(builder),
    ...getSedesQuery(builder),
    ...getLodgingQuery(builder),
    ...getInsuranceQuery(builder),
  }),
})

export default RtkQueryService
export const {
  useGetMyInfoQuery,
  useGetAllClientsQuery,
  useGetAllUsersQuery,
  useGetAllAssingmentsQuery,
  useGetAllTicketsQuery,
  useGetAllOrdersQuery,
  useGetAllTicketsToOrdersQuery,
  useGetAllEmissionQuery,
  useGetAllSedesQuery,
  useGetAllLodgingQuery,
  useGetAllInsurancesQuery,
  useGetUserRolesQuery,
  useGetOrderByIdQuery,
  useGetClientByIdQuery,
  useGetEmissionByIdQuery,
  useGetOneUserQuery,
  useGetOneUserForAssingmentQuery,
  useGetOneCustomerQuery,
  useGetEmissionProviderQuery,
  useGetAgenciesQuery,
  useCreateClientMutation,
  useCreateUserMutation,
  useCreateTicketMutation,
  useCreateOrderMutation,
  useCreateAssingmentMutation,
  useCreateLodgingMutation,
  useCreateInsuranceMutation,
  useUpdateOrderMutation,
  useUpdateEmissionMutation,
  useCalculateEmissionMutation,
} = RtkQueryService
