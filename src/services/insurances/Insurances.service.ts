import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateInsuranceBody, Insurance } from './types/insurance.type'

export function getInsuranceQuery(builder: EndpointBuilderType) {
  return {
    createInsurance: builder.mutation<Insurance, CreateInsuranceBody>({
      query: (body) => ({ url: 'insurance', method: 'post', data: body }),
      invalidatesTags: ['Insurance'] as any,
    }),
    getAllInsurances: builder.query<
      PaginateResult<Insurance>,
      PaginateSearch & { search?: string }
    >({
      query: ({ limit, page, search }) => ({
        url: 'insurance',
        method: 'get',
        params: {
          limit,
          page,
          search,
        },
      }),
      providesTags: ['Insurance'] as any,
    }),
  }
}
