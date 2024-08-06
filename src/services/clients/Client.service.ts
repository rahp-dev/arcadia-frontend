import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { Client, CreateClientBody } from './types/client.type'
import { Select } from '@/@types/select'

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

    getOneCustomer: builder.query<
      Array<{ id: number; name: string } | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'customers', method: 'get' }),
      transformResponse: (
        response: {
          data: Array<{
            id: number
            name: string
            lastName: string
            identityCard: string
          }>
        },
        meta,
        arg: { transformToSelectOptions?: boolean },
      ) => {
        const baseQueryReturnValue = response.data
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: `${item.name} ${item.lastName} - ${item.identityCard}`,
          }))
        }
        return baseQueryReturnValue
      },
    }),

    createClient: builder.mutation<Client, CreateClientBody>({
      query: (body) => ({ url: 'customers', method: 'post', data: body }),
      invalidatesTags: ['Customers'] as any,
    }),
  }
}
