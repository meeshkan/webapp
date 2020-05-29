# Meeshkan Webapp

⚠️ _Meeshkan is currently in alpha and by invitation only. [Request alpha access](https://meeshkan.com/) if you're interested._

Repositories in, bug fixes out. [Meeshkan](https://meeshkan.com/) is an automated testing tool designed to find bugs in your projects. In its current state, it's built to handle APIs and third-party services. Once installed, Meeshkan runs weekly and submits issues to your repository when it finds bugs.

We're actively building this webapp to facilitate the core service. Through the Meeshkan webapp, you can see what tests were run and resolve any issues that come up while executing your tests.

![Example of the Meeshkan dashboard in dark mode.](https://user-images.githubusercontent.com/26869552/83249968-ab134a80-a1a7-11ea-9168-bf4864e6c680.png)

## What's in this document:

- [Documentation](#documentation)
- [Routing style](#routing-style)
- [Important dependencies](#important-dependencies)
- [Known issues](#known-issues)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

## Documentation

If you're an existing Meeshkan user, everything from configuration instructions to frequently asked questions is available in the [Meeshkan documentation](https://meeshkan.com/docs/).

## Important dependencies

This repository makes heavy use of certain libraries. Without being familiar with the basics of how these libraries work, it will be difficult to understand the code base.

These libraries are, in no particualr order:

- [`next.js`](https://github.com/zeit/next.js): Opinionated framework for writing server-rendered React apps.
- [`chakra-ui`](https://github.com/chakra-ui/chakra-ui): Accessible React component library.
- [`fp-ts`](https://github.com/gcanti/fp-ts): Typed functional programming for TypeScript.
- [`io-ts`](https://github.com/gcanti/io-ts): Run-time type system for IO decoding/encoding.
- [`monocle-ts`](https://github.com/gcanti/monocle-ts): Functional optics for TypeScript projects.

## Routing style

We optimize for user experience (clear URL structure) and only add an abstraction if absolutely necessary. The repercussion of this is we will have some reserved paths such as `settings`, `user`, and more. We percieve this to have minimal impact and aren't actively solving for these edge cases.

## Known issues

- We currently have no way to know if a user revokes an incoming webhook.
- GitHub often responds that a stored refresh token is invalid.

## Roadmap

We're still in the early stages and things are changing rapidly, but here are some larger goals we'd like to accomplish with this webapp. Please note that these are subject to change at any time.

- Allow you to control the frequency of your tests
- Give you access to explore the specification Meeshkan builds of your repository
- More team-related functionalities

Have a suggestion? [File an issue](https://github.com/meeshkan/webapp/issues/new).

## Contributing

⚠️ The purpose of this repository is to keep our work open and transparent. But, given the way our webapp is configured, **we're unable to take outside contributions directly**. [File an issue](https://github.com/meeshkan/webapp/issues/new) if you have a feature request or bug report. You can also [contact our team directly](https://meeshkan.com/contact/).

Please note that this project is governed by the [Meeshkan Community Code of Conduct](https://github.com/meeshkan/code-of-conduct). By participating, you agree to abide by its terms.

➡️ If you're a member of the Meeshkan organization, you can find all of the local development instructions in the [contributing guide](./CONTRIBUTING.md).