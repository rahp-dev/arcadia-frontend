import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'

import BaseService from './BaseService'
import { getMeQuery } from './getMe/getMe.service'
import { EndpointBuilderType } from './core-entities/paginated-result.entity'
import { getClientsQuery } from './clients/Client.service'

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
  tagTypes: ['Customers'],
  endpoints: (builder: EndpointBuilderType) => ({
    ...getMeQuery(builder),
    ...getClientsQuery(builder),
  }),
})

export default RtkQueryService
export const {
  useGetMyInfoQuery,
  useGetAllClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
} = RtkQueryService
