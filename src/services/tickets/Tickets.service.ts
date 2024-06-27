import { Select } from '@/@types/select'
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { CreateTicketBody, Ticket } from './types/tickets.type'

export function getTicketsQuery(builder: EndpointBuilderType) {
  return {
    createTicket: builder.mutation<Ticket, CreateTicketBody>({
      query: (body) => ({ url: 'ticket', method: 'post', data: body }),
      invalidatesTags: ['Tickets'] as any,
    }),
  }
}
