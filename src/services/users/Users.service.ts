import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { User } from './types/user.type'
import { Select } from '@/@types/select'

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

    getUserRoles: builder.query<
      Array<{ id: number; name: string } | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'users/roles', method: 'get' }),
      transformResponse: (
        response: { data: Array<{ id: number; name: string }> },
        meta,
        arg: { transformToSelectOptions?: boolean },
      ) => {
        const baseQueryReturnValue = response.data
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        }
        return baseQueryReturnValue
      },
    }),

    getOneUser: builder.query<
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

    createUser: builder.mutation<
      User,
      {
        name: string
        lastName: string
        email: string
        password: string
        identityCard: string
        primaryPhone: string
        rolId: number
      }
    >({
      query: (body) => ({
        url: 'users',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Users'] as any,
    }),
  }
}
