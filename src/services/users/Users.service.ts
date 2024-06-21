import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { User } from './types/user.type'

export function getUsersQuery(builder: EndpointBuilderType) {
  return {
    getAllUsers: builder.query<
      PaginateResult<User>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: 'users',
        method: 'get',
        params: { limit, page, search },
      }),
      providesTags: ['Users'] as any,
    }),
  }
}
