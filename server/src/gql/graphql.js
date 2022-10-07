import { makeExecutableSchema } from '@graphql-tools/schema'
import fs from 'fs'
import mercurius from 'mercurius'
import loaders from '../loaders.js'
import resolvers from '../resolvers.js'

export default async (fastify, options) => {
	await fastify.register(mercurius, {
		schema: makeExecutableSchema({
			typeDefs: fs.readFileSync('./gql/schema.gql').toString(),
			resolvers,
		}),
		loaders: loaders,
		context: (request, reply) => ({
			repo: fastify.repo,
			user: request.user,
		}),
		errorFormatter: (error, ...args) => {
			console.error(error)
			return mercurius.defaultErrorFormatter(error, ...args)
		},
	})
}
