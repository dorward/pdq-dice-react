# PDQ Dice

This is a dice bot and character management app for the [PDQ system for TTRPGs](http://evilhat.wikidot.com/pdq).

## Setup

Use pnpm 12.6.0 (install with `npm install --global pnpm@12.6.0`).
Run `pnpm install --frozen-lockfile` in the repository root, `client`, and `server`.
Each directory has its own lockfile and is installed independently.

## Development modes

For frontend development, it is easier to run the client standalone.

    ./run_dev.sh
    cd client
    pnpm run start:dev
