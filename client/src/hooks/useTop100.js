import { useQuery } from '@apollo/client'
import { GetTop100 } from '../gql/GetTop100.gql'

export const useTop100 = () => {
	const { data, loading } = useQuery(GetTop100)
	return { songs: data.top100, loading }
}