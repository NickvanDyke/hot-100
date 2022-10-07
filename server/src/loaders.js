export default {
	User: {
		name: (queries, { repository }) => repository.getUserNames(queries.map(({ obj }) => obj.id)),
	}
}