import { useMutation } from '@apollo/client'
import { makeReference } from '@apollo/client'
import { Unfavorite } from '../gql/Unfavorite.gql'

export const useUnfavorite = (songId) => {
	const [unfavorite] = useMutation(Unfavorite, {
		variables: {
			songId,
		},
	})

	return () =>
		unfavorite({
			optimisticResponse: {
				__typename: 'Mutation',
				unfavorite: {
					__typename: 'Song',
					id: songId,
				},
			},
			update: (cache, { data: { unfavorite } }) => {
				cache.modify({
					id: cache.identify(makeReference('ROOT_QUERY')),
					fields: {
						myFavorites: (existingFavorites = []) => {
							const songId = cache.identify(unfavorite)
							return existingFavorites.filter((songRef) => songRef.__ref !== songId)
						},
					},
				})
			},
		})
}
