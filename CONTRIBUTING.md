# Contribute

👋 Thanks for thinking about contributing to our webapp! We, the members of the Meeshkan team, are glad you're here and will be excited to help you get started if you have any questions. For now, here are some basic instructions for how we manage this project.

Please note that this project is governed by the [Meeshkan Community Code of Conduct](https://github.com/meeshkan/code-of-conduct). By participating in this project, you agree to abide by its terms.

**Table of Contents**

<!-- toc -->

- [Contribute](#contribute)
  - [Branching](#branching)
  - [Formatting & linting](#formatting--linting)
  - [Commit Message conventions](#commit-message-conventions)
  - [Running tests](#running-tests)
  - [Generating the CONTRIBUTORS.md file](#generating-the-contributorsmd-file)

<!-- tocstop -->

## Branching

Please make all pull requests against the `master` branch. Someone from our team will review your pull request, make suggestions if appropriate, and merge or decline to merge. We apologize in advance if we cannot accommodate your pull request.

## Formatting & linting

This project formats its source code using Prettier. The most enjoyable way to
use Prettier is to let it format code for you when you save. You can [integrate
it into your editor][integrate prettier].

[integrate prettier]: https://prettier.io/docs/en/editors.html

If you don't want to integrate with your editor, you can run `yarn prettier`
instead.

Semantic issues are checked with ESLint via `yarn lint`.

## Commit Message conventions

So that your work gets in front of the right reviewer as fast as possible, three commit message conventions need to be followed:

- Commit bug fixes with `fix: ...` or `fix(scope): ...` prefix in commit subject
- Commit new features with `feat: ...` or `feat(scope): ...` prefix in commit subject
- Commit breaking changes by adding `BREAKING CHANGE:` in the commit body
  (not the subject line)

Other helpful conventions are

- Commit test files with `test: ...` or `test(scope): ...` prefix
- Commit changes to `package.json`, `.gitignore` and other meta files with
  `chore(filename-without-ext): ...`
- Commit changes to README files or comments with `docs: ...`
- Code style changes with `style: standard`

Don't stress this; if necessary the maintainers can fix commit message(s) of a pull request using the `squash & merge` button.

## Running tests

All of the tests work offline. None of them should hit the network.

```
$ yarn test
```

## Generating the CONTRIBUTORS.md file

We use [`name-your-contributors`](https://github.com/mntnr/name-your-contributors) to generate the CONTRIBUTORS file, which contains the names of everyone who have submitted code to the Meeshkan webapp codebase, or commented on an issue, or opened a pull request, or reviewed anyone else's code. After all, all contributions are welcome, and anyone who works with Meeshkan webapp is part of our community.

To generate this file, download `name-your-contributors` and set up a GitHub authorization token.

```sh
# Generate a JSON file of the members. This may take a while.
$ name-your-contributors -r webapp -u webapp > contributors.json
```

To parse that file, we suggest using [`jq`](https://stedolan.github.io/jq/), although other options are clearly possible:

```sh
cat contribs.json | jq '.[][]' | jq '"\(if (.name | length) > 0 then .name else null end) @\(.login) \(.url)"' | jq '. | tostring' | jq -s . | jq unique | jq .[] > CONTRIBUTORS.md
```

Note: This is a convoluted and time-intensive process, and could be updated in several ways. For one, `name-your-contributors` accepts a date flag, which could be used to only catch recent entries. Another way would be to use a bot to automate this at some regular interval. Any help on this would be appreciated.
