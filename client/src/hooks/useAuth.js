import { useMutation } from '@apollo/client'
import { Top100 } from '../gql/Top100.gql'
import { Favorites } from '../gql/Favorites.gql'
import { Signup } from '../gql/Signup.gql'
import { Login } from '../gql/Login.gql'
import { useCookies } from 'react-cookie'
import { Logout } from '../gql/Logout.gql'

export const useAuth = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['name'])
	const [signup] = useMutation(Signup)
	const [login] = useMutation(Login)
	const [logout] = useMutation(Logout)

	return {
		name: cookies.name,
		signup: (name, password, cb) => {
			signup({
				variables: {
					name,
					password,
				},
				refetchQueries: [Top100, Favorites],
				onCompleted: (data) => {
					setCookie('name', data.signup.name, { path: '/', expires: false })
					cb(data)
				},
				onError: (err) => cb(null, err.graphQLErrors[0].message),
			})
		},
		login: (name, password, cb) => {
			login({
				variables: {
					name,
					password,
				},
				refetchQueries: [Top100, Favorites],
				onCompleted: (data) => {
					setCookie('name', data.login.name, { path: '/', expires: false })
					cb(data)
				},
				onError: (err) => cb(null, err.graphQLErrors[0].message),
			})
		},
		logout: () => {
			logout({
				// Ideally should manually update Song.isFavorite on the cache
				refetchQueries: [Top100, Favorites],
				onCompleted: () => {
					removeCookie('name')
				},
			})
		},
	}
}
