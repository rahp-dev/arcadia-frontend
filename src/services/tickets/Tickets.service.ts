import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateTicketBody, Ticket } from './types/tickets.type'

export function getTicketsQuery(builder: EndpointBuilderType) {
  return {
    getAllTickets: builder.query<
      PaginateResult<Ticket>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: 'ticket',
        method: 'get',
        params: { limit, page, search },
      }),
      providesTags: ['Tickets'] as any,
    }),
    createTicket: builder.mutation<Ticket, CreateTicketBody>({
      query: (body) => ({ url: 'ticket', method: 'post', data: body }),
      invalidatesTags: ['Tickets'] as any,
    }),
  }
}
