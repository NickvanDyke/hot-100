import { useQuery } from '@apollo/client'
import { Top100 } from '../../../gql/Top100.gql'

export const useTop100 = () => {
	const { data } = useQuery(Top100)
	return data?.top100
}