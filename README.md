# carol

Carol is a test Cartesi Rollups reader node in TypeScript.

## Running

1. Download the honeypot mainnet machine from [https://github.com/cartesi/honeypot/releases/download/v2.0.0/honeypot-snapshot-mainnet.tar.gz](https://github.com/cartesi/honeypot/releases/download/v2.0.0/honeypot-snapshot-mainnet.tar.gz) and extract at `snapshots/0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`

2. Create an Infura API key and store at `.env.local`

```
ALCHEMY_ID=<alchemy_id>
```

3. Run

```shell
pnpm i
pnpm run dev
```

4. Query using the JSON-RPC API

```shell
cast rpc --rpc-url http://127.0.0.1:42069/mainnet/rpc cartesi_listOutputs '{ "application": "0x4c1e74ef88a75c24e49eddd9f70d82a94d19251c" }' | jq
```
