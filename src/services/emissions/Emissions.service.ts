import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
  Agencies,
  CreateEmissionBody,
  CreatePreviewEmissionBody,
  Emission,
  EmissionPreview,
  SystemProvider,
} from './types/emissions.type'
import { Select } from '@/@types/select'
import { CalculateEmissionFormModel } from '@/services/emissions/types/emissions.type'

type SelectProvider = {
  value: number
  label: string
  price: number
}

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

    getEmissionProvider: builder.query<
      Array<SystemProvider | SelectProvider>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({
        url: 'emision-providers',
        method: 'get',
      }),

      transformResponse: (
        response: {
          data: Array<{
            id: number
            name: string
            price: number
          }>
        },
        meta,
        arg: { transformToSelectOptions?: boolean },
      ) => {
        const baseQueryReturnValue = response.data
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: `${item.name} - ${item.price}$`,
            price: item.price,
          }))
        }
      },
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

    calculateEmission: builder.mutation<
      Emission,
      Partial<CalculateEmissionFormModel> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `emision/calcs/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Emission'] as any,
    }),

    createPreview: builder.mutation<
      EmissionPreview,
      { body: CreatePreviewEmissionBody; emissionId: string }
    >({
      query: ({ body, emissionId }) => ({
        url: `emision/preview`,
        method: 'post',
        data: body,
        params: { id: emissionId },
      }),
      invalidatesTags: ['Emission'] as any,
    }),

    getAgencies: builder.query<
      Array<Agencies | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({
        url: 'agency',
        method: 'get',
      }),
      transformResponse: (
        response: {
          data: Array<{
            id: number
            name: string
          }>
        },
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
      },
    }),
  }
}
