import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateEmissionBody, Emission } from './types/emissions.type'

export function getEmissionQuery(builder: EndpointBuilderType) {
  return {
    getAllEmission: builder.query<
      PaginateResult<Emission>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, search, page }) => ({
        url: 'emision',
        method: 'get',
        params: {
          limit,
          search,
          page,
        },
      }),
      providesTags: ['Emission'] as any,
    }),

    getEmissionById: builder.query<Emission, string>({
      query: (id: string) => ({ url: `emision/${id}`, method: 'get' }),
      providesTags: ['Emission'] as any,
    }),

    updateEmission: builder.mutation<
      Emission,
      Partial<CreateEmissionBody> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `emision/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Emission'] as any,
    }),
  }
}
