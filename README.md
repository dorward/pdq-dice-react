# PDQ Dice

This is a dice bot and character management app for the [PDQ system for TTRPGs](http://evilhat.wikidot.com/pdq).

## Setup

Use pnpm 12.6.0 (install with `npm install --global pnpm@12.6.0`).
Run `pnpm install --frozen-lockfile` in the repository root, `client`, and `server`.
Each directory has its own lockfile and is installed independently.

## Discord channel permissions

Users can choose the Discord channel that receives the bot's output. This is an
intended feature; the application does not restrict output to the channel used
to log in.

Restrict the bot's Discord access to channels where users should be permitted to
direct its output. Configure its role and channel permissions accordingly, and
avoid granting Administrator permissions, which would bypass those restrictions.
Any text channel the bot can access and send messages to should be treated as an
allowed destination for user-directed output.

## Development modes

For frontend development, it is easier to run the client standalone.

    ./run_dev.sh
    cd client
    pnpm run start:dev

## Save concurrency tests

Run client tests with `pnpm --dir client test`.
Run server unit and HTTP tests with `pnpm --dir server test`, or use
`pnpm --dir server run test:watch` during development.
Type-check server source and tests with `pnpm --dir server run test:typecheck`.
The server integration tests require a disposable PostgreSQL database (they create
and write a `user_data` table):

```sh
cd server
TEST_DATABASE_URL=postgres://postgres:password@localhost:5432/pdq_test pnpm run test:integration
```

User documents carry a save revision. Conflicting saves return HTTP 409; the client
stops its save queue and shows an error so unsaved characters can be exported.
Deploy the server update before the client update. Older clients do not send save
revisions and will need to reload the updated application.
