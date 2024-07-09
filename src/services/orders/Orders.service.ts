import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateOrderBody, Order } from './types/orders.type'

export function getOrdersQuery(builder: EndpointBuilderType) {
  return {
    getAllOrders: builder.query<
      PaginateResult<Order>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: 'order',
        method: 'get',
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ['Orders'] as any,
    }),
    getOrderById: builder.query<Order, string>({
      query: (id: string) => ({ url: `order/${id}`, method: 'get' }),
      providesTags: ['Orders'] as any,
    }),
    createOrder: builder.mutation<Order, CreateOrderBody>({
      query: (body) => ({ url: 'order', method: 'post', data: body }),
      invalidatesTags: ['Orders'] as any,
    }),
  }
}
