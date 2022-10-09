import { useMutation } from '@apollo/client'
import { Favorite } from '../gql/Favorite.gql'

export const useFavorite = (songId) => {
	const [favorite] = useMutation(Favorite, {
		variables: {
			songId,
		},
	})

	return (isFavorite) =>
		favorite({
			variables: {
				isFavorite,
			},
			optimisticResponse: {
				__typename: 'Mutation',
				favorite: {
					__typewname: 'Song',
					id: songId,
					isFavorite,
				},
			},
		})
}
