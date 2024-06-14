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
                url: `customers?page=${page}$limit=${limit}${
                    search ? `$search=${search}` : ''
                }`,
                method: 'get',
            }),
            providesTags: ['Clients'] as any,
        }),

        getClientById: builder.query<Client, string>({
            query: (id: string) => ({ url: `customers/${id}`, method: 'get' }),
            providesTags: ['Clients'] as any,
        }),

        createClient: builder.mutation<Client, CreateClientBody>({
            query: (body) => ({ url: 'customers', method: 'post', data: body }),
            invalidatesTags: ['Clients'] as any,
        }),
    }
}
