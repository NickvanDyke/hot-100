import { useQuery } from '@apollo/client'
import { Favorites } from '../../../gql/Favorites.gql'

export const useFavorites = () => {
	// TODO optimally could locally query all Songs with isFavorite: true while waiting for server response
	const { data } = useQuery(Favorites)
	return data?.user?.favorites
}