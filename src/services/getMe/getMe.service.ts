import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { User } from '../users/types/user.type'

export function getMeQuery(builder: EndpointBuilderType) {
    return {
        getMyInfo: builder.query<User, {}>({
            query: ({}) => ({ url: '/auth/me', method: 'get' }),
        }),
    }
}
