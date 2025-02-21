Presentation:
https://docs.google.com/presentation/d/1A23dNowjPOHSoKg1mjL5vMOYxwnjY-R9ditiDAGGJlk/edit#slide=id.g2d981ffed49_1_165

Video Link:
https://vimeo.com/1059006093/56350fc08d?ts=0&share=copy

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/coinbase/onchainkit/main/site/docs/public/logo/v0-27.png">
    <img alt="OnchainKit logo vibes" src="https://raw.githubusercontent.com/coinbase/onchainkit/main/site/docs/public/logo/v0-27.png" width="auto">
  </picture>
</p>

# Onchain App Template

An Onchain App Template build with [OnchainKit](https://onchainkit.xyz), and ready to be deployed to Vercel.

Play with it live on https://onchain-app-template.vercel.app

Have fun! ⛵️

<br />

## Setup

To ensure all components work seamlessly, set the following environment variables in your `.env` file using `.env.local.example` as a reference.

You can find the API key on the [Coinbase Developer Portal's OnchainKit page](https://portal.cdp.coinbase.com/products/onchainkit). If you don't have an account, you will need to create one. 

You can find your Wallet Connector project ID at [Wallet Connect](https://cloud.walletconnect.com).

```sh
# See https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_CDP_API_KEY="GET_FROM_COINBASE_DEVELOPER_PLATFORM"

# See https://cloud.walletconnect.com
NEXT_PUBLIC_WC_PROJECT_ID="GET_FROM_WALLET_CONNECT"
```
<br />

## Locally run

```sh
# Install bun in case you don't have it
curl -fsSL https://bun.sh/install | bash

# Install packages
bun i

# Run Next app
bun run dev
```
<br />

make .env file paste the following into the .env file:

# ~~~
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# See https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_CDP_API_KEY="organizations/a99d03a4-c6df-4df9-aa2d-fb549cdeac3f/apiKeys/497519ea-84a3-44af-8428-05f6bc9e8a56"

# ~~~
NEXT_PUBLIC_ENVIRONMENT=localhost

# See https://cloud.walletconnect.com/
NEXT_PUBLIC_WC_PROJECT_ID="7876166dcd3e5ce4e2c532bb947e37a3"

NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyNGQ2MjE3YS1jNmJlLTRlYWUtYmRhOS04OGMwMTUxNThkMTEiLCJlbWFpbCI6ImFuZGVsZXJsaXV0dkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMGY3MTJmMzgyOTNmOTg5ZDg1NzAiLCJzY29wZWRLZXlTZWNyZXQiOiIyNDZlYTNmNWNiYTMyMTliNjU4ZjJmZWUyZGZiOTVlZTQzOThkNjkxYWM3MjYwY2E2YTUxZjQ3OWU2ZGM4NWQwIiwiZXhwIjoxNzcxNjgwMjY5fQ.i4haJylLNRy9vnOC3pSqAt7tPf_qUiS11rvrlLgWZaU

## Resources
