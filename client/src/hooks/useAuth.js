import { useMutation } from '@apollo/client'
import { MyFavorites } from '../gql/MyFavorites.gql'
import { MyFavoriteIds } from '../gql/MyFavoriteIds.gql'
import { Signup } from '../gql/Signup.gql'
import { Login } from '../gql/Login.gql'
import { makeReference } from '@apollo/client'
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
				refetchQueries: [MyFavorites, MyFavoriteIds],
				onCompleted: (data) => {
					setCookie('name', data.signup, { path: '/', expires: false })
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
				refetchQueries: [MyFavorites, MyFavoriteIds],
				onCompleted: (data) => {
					setCookie('name', data.login, { path: '/', expires: false })
					cb(data)
				},
				onError: (err) => cb(null, err.graphQLErrors[0].message),
			})
		},
		logout: (cb) => {
			logout({
				onCompleted: () => {
					removeCookie('name')
					cb()
				},
				update: (cache) => {
					cache.modify({
						id: cache.identify(makeReference('ROOT_QUERY')),
						fields: {
							myFavorites: (existingFavorites = []) => {
								return []
							},
						},
					})
				},
			})
		},
	}
}
