init: && cf-typegen
    pnpm install

deploy:
    pnpm run deploy

dev:
    pnpm run dev

start:
    pnpm run start

cf-typegen:
    pnpm run cf-typegen

format:
    pnpm run format

compile: && format
    pnpm run config:compile
