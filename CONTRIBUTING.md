# Contributing to Meeshkan

⚠️ The purpose of this repository is to keep our work open and transparent. But, given the way our webapp is configured, **we're unable to take outside contributions directly**. [File an issue](https://github.com/meeshkan/webapp/issues/new) if you have a feature request or bug report. Please note that this project is governed by the [Meeshkan Community Code of Conduct](https://github.com/meeshkan/code-of-conduct).

_The following documentation is intended for members of the Meeshkan organization._

## What's in this document:

- [Development](#development)
    - [Installation](#installation)
    - [Retrieving the environment variables](#retrieving-the-environment-variables)
    - [Build](#build)
    - [Run](#run)
- [Branching](#branching)
- [Formatting](#formatting)
- [Tests](#tests)

## Development 

Here are instructions on how to install, build and run this webapp.

### Installation

First, clone and move into this repository:

```bash
git clone https://github.com/meeshkan/webapp 
cd webapp
```

Then use [Yarn](https://yarnpkg.com/getting-started/install) to install the required dependencies:

```bash
yarn
```

### Retrieving the environment variables

There are many environment variables used in this webapp. We store these in [Vercel](https://vercel.com/). You'll need to be a member of the Meeshkan organization on Vercel to access them.

Once you've confirmed that you're a member, you need to install the [Vercel CLI](https://vercel.com/download) globally. If it's your first time running the webapp locally, you also need to initialize the repository:

```bash
vercel
```

Then, you can obtain the development version of these variables by running:

```bash
vercel env pull
```

### Build

To build the webapp, run:

```bash
yarn build
```

### Run

To run the webapp, invoke:

```bash
yarn dev
```

By default, the webapp will run on `localhost:3000`.

## Branching

Please make all pull requests against the `master` branch. If there's a corresponding [Linear](https://linear.app/meeshkan/) ticket, name your branch with the issue ID (ie. `MEM-111`).

## Formatting

We use [Prettier](https://prettier.io/) for code formatting. The most enjoyable way to
use Prettier is to let it format code for you when you save. You can [integrate it into your editor](https://prettier.io/docs/en/editors.html).

You can also format the code from the command line:

```bash
yarn format
```

Either way, please make sure to format your code before opening a pull request. 

## Tests

All of the tests for the webapp live in the [`test` directory](./test/). Run them with the following command:

```bash
yarn test
```