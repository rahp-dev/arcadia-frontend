import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { Client, CreateClientBody } from './types/client.type'

export function getClientsQuery(builder: EndpointBuilderType) {
  return {
    getAllClients: builder.query<
      PaginateResult<Client>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: `customers`,
        method: 'get',
        params: { limit, page, search },
      }),
      providesTags: ['Customers'] as any,
    }),

    getClientById: builder.query<Client, string>({
      query: (id: string) => ({ url: `customers/${id}`, method: 'get' }),
      providesTags: ['Customers'] as any,
    }),

    createClient: builder.mutation<Client, CreateClientBody>({
      query: (body) => ({ url: 'customers', method: 'post', data: body }),
      invalidatesTags: ['Customers'] as any,
    }),
  }
}
