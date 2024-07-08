import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateTicketBody, Ticket } from './types/tickets.type'
import { Select } from '@/@types/select'

interface TicketWithCustomer {
  id: number
  totalPrice: number
  details_ticket: {
    location: string
  }
  customer: {
    id: number
    name: string
    last_name: string
  }
}

interface SelectOption {
  value: number
  label: string
  totalPrice: number
}

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

    getAllTicketsToOrders: builder.query<
      SelectOption[],
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'ticket', method: 'get' }),
      transformResponse: (
        response: { data: TicketWithCustomer[] },
        meta,
        arg: { transformToSelectOptions?: boolean },
      ) => {
        if (arg.transformToSelectOptions) {
          return response.data.map((ticket) => ({
            value: ticket.id,
            label: `${ticket.customer.name} ${ticket.customer.last_name} - Localizador: ${ticket.details_ticket.location}`,
            totalPrice: ticket.totalPrice,
          }))
        }
        return []
      },
    }),
  }
}
