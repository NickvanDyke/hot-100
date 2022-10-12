# User stories
- As a user, I want to be able to view the weekly billboard top 100 songs, including artist, album, and genre
- As a user, I want to be able to favorite billboard top 100 songs and view a list of all my favorite songs

# Main questions
With these goals in mind, how should we:
- Retrieve the data
- Store the data
- Expose the data
- Display the data

In a way that optimally facilitates our objectives, including:
- User experience
- Developer experience
- Performance + Scalability
- Reliability

# Proof of concept
In this repository, you'll find the source for a proof of concept. While not entirely necessary, briefly building out an idea requires you to think more critically, and helps catch intricacies that you may miss when purely drawing it up. In particular, it facilitates an ergonomic API and positive DX, as it forces you to stumble on and confront pain points in your ideas and architecture before scaling up, after which re-architecting becomes more laborious and involved.

## Live
https://billboard.onrender.com (running on free tier, may have to spin up)

## Running locally
In `client` directory:

`npm install`

In `server` directory:

(Requires local Postgres instance)

`npm install && npm run pg:init && npm run pg:start && npm run pg:createdb`

`.env` file in root directory:
```
POSTGRES_URL=postgres://<your_local_postgres_user>@localhost/billboard
ADDRESS=localhost
PORT=3001
COOKIE_KEY=16f02b3c7f60ecbea73a95fdc00f56d761284d1b9cbf6f1ccefc9b7a61bba73e # obviously don't use this in prod
```

Then, `npm run build` in `client` and `npm start` in `server` to mimic production, available at `localhost:3001`, or `npm start` in both to access the Vite dev server at `localhost:3000`.

## What's missing
A non-exhaustive list of important things missing from the PoC that would be relatively vital before production:
- Salting + hashing passwords
- Email signup + verification, password reset
- More detailed error responses from API
- More error handling in the frontend
- Stringent password requirements
- More elegant login/signup flows

## Neat nice to haves
Cool or fun features often pop up while prototyping. But of course, we only have so much time and must prioritize. Here are some for posterity:
- Store favorites locally if user is not logged in, so they can favorite without an account; then sync with server when they log in/sign up
- View number of favorites each song has and other user's favorites
- View past weeks; db model would have to change to accommodate tracking rank per-song per-week, instead of a single rank per song that's updated every week
- With enough historical data stored, show a graph of song(s) performance over time
- Social login
- [SSR](https://github.com/fastify/fastify-vite) for faster initial load and better SEO. Since the top 100 is only updated weekly, this would also make CDN caching especially effective.

Thanks for taking the time to read and browse! I would love to hear any feedback you have.

# Technical design

## The stack
Backend:
- NodeJS
	- JavaScript for the PoC at least; easy to be fast and loose when prototyping, but on a long-term project with multiple developers, TypeScript pays dividends quickly
	- JavaScript/TypeScript on both the front and back end makes it easy for developers to work on both sides of the application, requiring familiarity with only one language
- Fastify
	- Performant
	- Intelligible plugin API, especially compared to Express's middleware
- [Mercurius](https://mercurius.dev/#/)
	- Performant with simple setup and configuration
	- Flexible, easily allowing us to combine our multiple data sources into a single API for the client to consume
- PostgresQL
	- Many features
	- Good SQL standard conformance
	- FOSS, but still has great official documentation and a big community

Frontend:
- React
	- Fast iteration for beautiful UIs
	- Sensible mental model with reactivity and composition
- [Vite](https://vitejs.dev/)
	- Ridiculously fast and easily configurable build tool, especially when compared to CRA and Webpack
	- Allows more flexibility than something very opinionated like NextJS
- Apollo Client
	- Amazing docs
	- When your data is well-structured, it can often serve as the data store for your app
- MUI
	- Easy to use and quickly create an aesthetically pleasing UI
	- Follows well-established Material Design patterns

Many of these are also chosen due to their popularity, meaning:
- Easier to find developers with experience
- Stack-specific learning is more likely to be transferrable to other projects
- More resources available online
- Repeatedly battle-tested in the real world
- Greater guarantee of long-term support
	
## Database model
See the [schema](/server/sql/migrations/1_create-initial-schema.sql). The app uses a relational model for data accuracy, a simple model, and future extensibility.
- Users
	- Unique on name, but uses a surrogate key to allow easy future changing of names, addition of emails, etc
- Songs
	- Uniquely identified by title + artist, with a surrogate key for simplicity
	- Nullable `rank`, since we'll store songs even after they've fallen out of the top 100, to be displayed in favorites
	- `rank` is a column instead of a separate table because we only track rank for the latest week. To store historic data, we'd separate it out to a table with the song's id and the rank it was on a particular week
	- `last_updated` so we know when our data has become stale relative to when the Billboard chart updates
	- Nullable `tag` because the billboard API doesn't provide genres/tags, so we have to later retrieve them from a different source, and can't guarantee availability for every song. Additionally, given the real-world APIs available to us, there's a good chance we'd get rate-limited or have to throttle our requests and we wouldn't want that to grind the entire app to a halt if we chained that API call before inserting the song at all.
- User's favorite songs
	- Many-to-many relationship
	- Cascades on delete to prevent stale data (not that our app allows deletion of songs or users yet)

Data integrity is enforced at the database level using constraints where possible.

## Method for accessing data
The server exposes a GraphQL API for the client to consume - see the [schema](/server/gql/schema.gql). It provides an ergonomic shape over the underlying data model, e.g. the frontend can query `isFavorite` on a song, instead of having to query the user's favorite song IDs and manually match those to songs returned by `top100`. Realistically for such a small and simple project, REST might be more appropriate. But in a real-world scenario, where prototypes can quickly become production, the extensibility of GraphQL makes it worth the slightly extra initial effort.  It's also conducive to combining multiple data sources into a single API, as needed here.

As far as obtaining the data underlying our API - Billboard does not expose a public API. Fortunately an up-to-date [library](https://github.com/darthbatman/billboard-top-100) exists that scrapes the HTML. Our server abstracts this grossness away from the client and handles retrieving and storing the latest top 100 when needed, and exposing it to the client in an intuitive API.
- Allows us to keep a lean, simple client
- We can easily swap out the top 100 data source if a more elegant or alternative source appears in the future
- Since the top 100 only updates once a week, storing and serving it ourselves saves us from excessively hitting Billboard's "API"
- More conducive to SSR and caching
- We need to store all the songs that have ever been displayed to our users anyway, so that they can still view their favorites that have since fallen out of the top 100 and would no longer be in the API response
- If we extended the project to allow viewing and storing of past weeks, we could also do some fun visualization with such data, like charting trends over time

However, we can't obtain genres from the above method, and instead must turn to [last.fm](https://www.last.fm/api/show/track.getTopTags). When a song's genre is requested in our GraphQL API, it'll check for and return the matching tag if it exists. If not, it'll make a request to last.fm, store the tag, and then return it. Not implemented in PoC due to time. We'd be hitting last.fm infrequently, but when we do, it'd be 100 requests at once (doesn't seem to allow requesting multiple song's tags in one request). So in practice we may get rate-limited and have to throttle ourselves to slowly collect tags after refreshing the top 100. At least, for the first top 100 refresh - after that, the number of unseen songs in the top 100 each week is probably low enough to not be an issue.

The [repository](/server/src/data/repository.js) coordinates the [database](/server/src/data/db.js) and [Billboard API](/server/src/data/billboard.js), implementing the above described business logic and leaving our GraphQL [resolvers](/server/src/api/resolvers.js) and [loaders](/server/src/api/loaders.js) simple.

## Front-end architecture
- Apollo Client is our model, updating and providing our data
- React components handle displaying this data
- [Custom hooks](/client/src/hooks/useAuth.js) bridge the view and model
- Files structured according to [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- Built with [Vite](https://vitejs.dev/)
- Compressed and served by the Fastify server

## Testing strategy
Tests follow Behavior Driven Development, where arrangements, actions, and assertions ('Given When Then') are made clear in the test names and given rise from user stories.
- Easy to map user stories to test cases, write them first, and then iterate
- Tests serve as readable documentation of how the system should behave
- Naturally leads you to consider additional use- and edge-cases

### Integration
Here, tests use the Robot pattern to interface with the system as a user would, and assert that the 'black box' behaves as expected. When the client uses the API to favorite a song and then requests the user's favorites, then it'd expect that song to be there. When they click the favorite button in the UI, then they'd expect it to change to displaying the opposite state.
- Resilient to implementation changes; you can modify the implementation without having to update a multitude of tests
- The [robot](/server/test/integration/robot.js) serves as documentation for how the user interacts with the system
- The robot abstracts away how we interact with the system, easily adapting to API surface changes and making tests easy to maintain, read, and write
- Minimizes time spent faking, mocking, stubbing, spying etc. and most closely mimicks the real world
- Bang for your buck - you can get good coverage and confidence with a relatively small number of tests

However, integration tests can fall short when we *do* want to verify internal behavior, or test narrow, specific scenarios.

### Unit
Here we test system components in isolation to explore specific or otherwise difficult to reproduce or verify scenarios. The [internal behavior of the repository](/server/test/unit/repository.test.js) or [determining whether we need to re-fetch the top 100](/server/test/unit/hasBillboardUpdatedSince.test.js). Additionally, architecting our code such that it's conducive to unit testing has benefits of its own, like modularity and separation of concerns. For example, the [repository](/server/src/data/repository.js) receives a DB and billboard API, and is agnostic to their implementation. In tests, this allows us to easily swap out either dependency for a mock or fake to test the repository in isolation and induce conditions that we normally don't have control over, like a 500 response from the Billboard website. In production, it minimizes the ripple effect of changes to underlying code like introducing an ORM or retrieving chart data from a difference source.

The tests in this repository are not meant to be all-encompassing due to the context, but to serve as an applied example of the above. Frontend-specific tests were foregone due to time, but normally would follow similar patterns using React Testing Library, with the possible addition of E2E tests using Cypress to ensure the final piece of the puzzle, the boundary between front- and back-end.

## Assumptions
- The user wants to access their favorites across devices, i.e. accounts are needed. As opposed to simply using e.g. cookies or LocalStorage.