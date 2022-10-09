import { useQuery } from '@apollo/client'
import { GetTop100 } from '../gql/GetTop100.gql'

export const useTop100 = () => {
	const { data } = useQuery(GetTop100)
	return data?.top100
}