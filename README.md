# Webapp readme

## Routing style

Optimize for user experience (clear URL structure) and only add an abstraction if absolutely necessary. The repercussion of this is we will have some reserved paths such as `settings`, `user`, and more. We percieve this to have minimal impact and aren't actively solving for these edge cases.

## Loading / Error / Result pattern using Either

A lot of the code uses the following type pattern for asynchronous communication with a server:

```typescript
type MyType = Either<Loading, Either<Error, Result>>
const myAsyncFunc = (): MyType => { /** some stuff */ };
const res = await myAsyncFunc();
isLeft(res) // it is loading
isRight(res) && isLeft(res.right) // it produced an error
isRight(res) && isRight(res.right) // it produced a successful outcome
```

This pattern enforces type safety in the following way. Let's say we want to use a result. We can only do that using the following pattern:

```typescript
isRight(res) && isRight(res.right) && doSomethingWithResult(res.right.right)
```

If we leave out the second `isRight`, it will not compile and will raise a type error:

```typescript
isRight(res) && doSomethingWithResult(res.right.right)
```

That is how the `Either` pattern guarantees type safety of results - `isLeft` and `isRight` act as [predicate](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates) that give typesafety to whatever follows. 

## Typesafe graphql using `io-ts`

Ideally, we will use a typesafe schema for all of our queries, but until then, we are using `io-ts` for typesafe graphql IO. `io-ts` allows you to construct types that act both as runtime guards and compile-time types. For example, look at the function `confirmOrCreateUser` in `src/utils/user.ts` and its usages to see how this is done.

## Known issues

### Team name and project name

There is currently only a naive mechanism to dynamically generate a `teamName` that is not a GitHub owner name or `projectName` that is not a github repo name. That means that, in very rare cases, if there is a conflict because the `teamName` or `projectName` is not unique, the app will `/404`. As this is a rare occurence, we do not have any code to cover that. Eventually, we can write code that more-resiliently generates a new `teamName` or `projectName` if the current name is taken already.

### Slack webhooks

We currently have no way to know if a user revokes an incoming webhook, nor do we have any way to select which webhook to use if a user registers multiple ones. Other potential models are to figure out how Slack behaves when a webhook is no longer valid (there's no documentation about this so we'd have to hack at it & assume it's stable), ask the user to create a Slack app (Netlify does this), to make a more sophisticated app with the `chat:write` scope which uses an `access_token` that will 401 if no longer valid (at which point we can delete the integration), or get rid of Slack integrations entirely and do what Github does where we just have a webhook that we spit events out to.