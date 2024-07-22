import { Select } from '@/@types/select'
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { Sede } from './types/sedes.types'

export function getSedesQuery(builder: EndpointBuilderType) {
  return {
    getAllSedes: builder.query<
      Array<Sede | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({
        url: 'sedes',
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
        return baseQueryReturnValue
      },

      providesTags: ['Sedes'] as any,
    }),
  }
}
