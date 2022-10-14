import { useQuery } from '@apollo/client'
import { MyFavoriteIds } from '../../../gql/MyFavoriteIds.gql'

export const useMyFavoriteIds = () => {
	const { data } = useQuery(MyFavoriteIds)
	return data?.myFavorites?.map(({ id }) => id)
}