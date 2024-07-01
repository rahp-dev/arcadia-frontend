import { Select } from '@/@types/select'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { Assingment, CreateAssingmentBody } from './types/assingment.type'
import { PaginateSearch } from '@/@types/pagination'

export function getAssingmentsQuery(builder: EndpointBuilderType) {
  return {
    getOneUserForAssingment: builder.query<
      Array<{ id: number; name: string } | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'users', method: 'get' }),
      transformResponse: (
        response: {
          data: Array<{
            id: number
            name: string
            lastName: string
          }>
        },
        meta,
        arg: { transformToSelectOptions?: boolean },
      ) => {
        const baseQueryReturnValue = response.data
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: `${item.name} ${item.lastName}`,
          }))
        }
        return baseQueryReturnValue
      },
    }),
    getAllAssingments: builder.query<
      PaginateResult<Assingment>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: 'interaction',
        method: 'get',
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ['Assingments'] as any,
    }),
    createAssingment: builder.mutation<Assingment, CreateAssingmentBody>({
      query: (body) => ({ url: 'interaction', method: 'post', data: body }),
      invalidatesTags: ['Assingments'] as any,
    }),
  }
}
