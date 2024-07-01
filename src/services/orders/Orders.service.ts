import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { CreateOrderBody, Order } from './types/orders.type'

export function getOrdersQuery(builder: EndpointBuilderType) {
  return {
    createOrder: builder.mutation<Order, CreateOrderBody>({
      query: (body) => ({ url: 'order', method: 'post', data: body }),
      invalidatesTags: ['Orders'] as any,
    }),
  }
}
