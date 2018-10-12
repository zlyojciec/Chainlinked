# Chainlinked

Implementation of [how to make a Chainlinked contract](https://docs.chain.link/docs/getting-started).

## Requirements

- NPM
- Truffle
- Yarn (optional)
- GCC (for testing)

## Installation

```bash
$ npm install
```

Or

```bash
$ yarn install
```

## Test

```bash
$ npm test
```

## Deploy

If needed, edit the truffle.js config file to set the desired network to a different port. It assumes any network is running the RPC port on 8545.

### Local development

```bash
$ truffle migrate --network development
```

### Public chains

Requires unlocked & synced Ethereum node. Accepts `--network ropsten` and `--network rinkeby` currently.

```bash
$ truffle migrate --network ropsten --compile-all
```