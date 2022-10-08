# Technical design

## The stack
Backend:
- NodeJS
	- JavaScript for the PoC at least; easy to be fast and loose when prototyping, but on a long-term project with multiple developers, TypeScript pays dividends quickly
	- JavaScript/TypeScript on both the front and back end makes it easy for developers to work on both sides of the application, requiring familiarity with only one language
- Fastify
	- Performant
	- Ergonomic plugin API, especially compared to Express's middleware
- Mercurius GraphQL server 
	- Performant
	- Flexible, easily allowing us to combine our multiple data sources into a single API for the client to consume
- PostgresQL

Frontend:
- React
- Apollo Client
	- Amazing docs
	- When your data is well-structured, it can often serve as the data store for your entire app. i.e. no need to also introduce something like Redux

Many of these are also chosen due to their popularity, meaning:
- Easier to find developers with experience
- Stack-specific learning is more likely to be transferrable to other projects
- More resources available online
- Repeatedly battle-tested in the real world
	
## Database model
See the [schema](./server/sql/migrations/1_create-initial-schema.sql).

## Method for accessing data
The server exposes a GraphQL API for the client to consume - see the [schema](./server/gql/schema.gql). Realistically for such a small and simple project, REST might be more appropriate. But in a real-world scenario, where before you know it you're being asking to push the prototype to production and add features too quickly to allow time for shoring up the foundation, the extensibility of GraphQL can quickly make it worth the slightly extra initial effort. 

Where it gets interesting though, is actually obtaining the Billboard Top 100 songs. They don't expose an official API. Fortunately an up-to-date [library](https://github.com/darthbatman/billboard-top-100) exists that scrapes the HTML. Our server abstracts this grossness away from the client and handles updating and storing the latest top 100 when appropriate, and exposing it to the client in an ergonomic API. This allows us to keep a lean, simple client, and easily swap out the top 100 data source if a more elegant or alternative source appears in the future. Additionally, since the top 100 only updates once a week, storing and serving it ourselves saves us from excessively hitting Billboard's "API". Lastly, we need to store all the songs that have ever been displayed to our users anyway, so that they can still view their favorites that have since fallen out of the top 100 and would no longer be in the API response. If we extended the project to allow viewing and storing of past weeks, we could also do some fun visualization with such data, like charting a song's popularity over time.

## Front-end architecture

## Testing strategy

### Integration
Here, the system is tested primarily on behavior. That is, tests interact with the system as a consumer would, and assert that the 'black box' behaves as expected. For example, when the client uses the API to favorite a song and then requests the user's favorites, it'd expect that song to be there. These tests are still split at the front/backend boundary, to keep complexity and flakiness down.

These tests make heavy use of the Robot pattern, which abstracts the details of how a user interacts with our system, making tests maintainable and easy to write and read. For example, our backend robot may have functions for `login`, `favoriteSong`, and `getFavorites`, which it would call in that order, as an actual frontend would, to finally assert on the returned favorites and verify that favoriting is working. Even more conducive to frontend testing, our robot would simulate user actions and checks, like `clickFavoriteButton`, and `checkSongIsFavorited`.

Tests are also named according to 'Given When Then', to obviously separate arrangement, action, and assertion.

Advantages:
- Resilient to implementation changes; you can modify the implementation without having to update a multitude of tests
- Tests serve as documentation of how the system should behave and how the user interacts with it
- Forces you to think about and cover edge cases
- Easy to map user stories to test cases and write them first, since test code usually doesn't depend on code that doesn't exist yet
- Minimizes time spent mocking, stubbing, spying etc and most closely mimicks the real world
- Bang for your buck - you can get good coverage with a relatively small number of tests

Disadvantages:
- Sometimes we *do* want to verify internal behavior, such as checking that the server returns cached data when available instead of hitting the API every time. Since the client has no knowledge of this, it can't check for that in these tests.
- Increased test overlap and reduced granularity; you may have to do more hunting when a test fails to figure out exactly where/why. If your test requires authentication and that implementation has errors, the test could fail even though it mainly asserts retrieving a user's favorites.

### Unit
Fortunately, unit testing fills in the gaps left above. We can test the internal behavior of the repository and it's caching, as well as simple things like our logic that determines whether we need to re-fetch the top 100.

Some test cases are stubs for the sake of brevity.

## Assumptions
- The user wants to access their favorites across devices, i.e. a login is needed. As opposed to simply using e.g. cookies or LocalStorage.

# Proof of concept
In this repository, you'll find the source for a proof of concept. I often find that actually building out an idea requires you to think more critically, and helps catch intricacies that you may miss when purely drawing it up. I particularly find it facilitates an ergonomic API, as it forces you to stumble on and confront pain points in your model and how it's consumed.

## What's missing
Important points that are missing from the PoC, but would be relatively vital before production:
- Salting + hashing passwords
- Email signup + verification, password reset
- Elegant error responses from API
- Stringent password requirements

## Neat nice to haves
Cool or fun features often pop up while prototyping. But of course, we only have so much time and must prioritize. Here are some for posterity:
- Store favorites locally if user is not logged in, so they can favorite without an account; then sync with server when they log in/sign up
- View number of favorites each song has
- View past weeks; db model would have to change to accommodate tracking rank per-song per-week, instead of a single rank per song that's updated every week
- With enough historical data stored, show a graph of song(s) performance over time
- Social login
- [SSR](https://github.com/fastify/fastify-vite) for faster initial load and better SEO