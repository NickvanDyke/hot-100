import { useMutation } from '@apollo/client'
import { Login } from '../gql/Login.gql'

export const useLogin = () => {
	const [login] = useMutation(Login)

	return (name, password, cb) => {
		login({
			variables: {
				name,
				password,
			},
			onCompleted: (data) => cb(data),
			onError: (err) => cb(null, err),
		})
	}
}
