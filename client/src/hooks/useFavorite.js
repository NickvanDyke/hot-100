import { useMutation } from '@apollo/client'
import { makeReference } from '@apollo/client'
import { Favorite } from '../gql/Favorite.gql'

export const useFavorite = (songId) => {
	const [favorite] = useMutation(Favorite, {
		variables: {
			songId,
		},
	})

	return () =>
		favorite({
			optimisticResponse: {
				__typename: 'Mutation',
				favorite: {
					__typename: 'Song',
					id: songId,
				},
			},
			update: (cache, { data: { favorite } }) => {
				cache.modify({
					id: cache.identify(makeReference('ROOT_QUERY')),
					fields: {
						myFavorites: (existingFavorites = []) => {
							const songId = cache.identify(favorite)
							return [{ __ref: songId }, ...existingFavorites]
						},
					},
				})
			},
		})
}
