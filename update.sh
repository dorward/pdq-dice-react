git pull
pnpm install --frozen-lockfile
cd server
pnpm install --frozen-lockfile
pnpm run build
cd ..
cd client
pnpm install --frozen-lockfile
pnpm run build:production
