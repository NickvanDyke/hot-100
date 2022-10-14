import { useQuery } from '@apollo/client'
import { MyFavorites } from '../../../gql/MyFavorites.gql'

export const useMyFavorites = () => {
	const { data } = useQuery(MyFavorites)
	return data?.myFavorites
}