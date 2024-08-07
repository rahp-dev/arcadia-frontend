import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateLodgingBody, Lodging } from './types/lodging.type'

export function getLodgingQuery(builder: EndpointBuilderType) {
  return {
    createLodging: builder.mutation<Lodging, CreateLodgingBody>({
      query: (body) => ({ url: 'accommodation', method: 'post', data: body }),
      invalidatesTags: ['Lodging'] as any,
    }),
    getAllLodging: builder.query<
      PaginateResult<Lodging>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: 'accommodation',
        method: 'get',
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ['Lodging'] as any,
    }),
  }
}
