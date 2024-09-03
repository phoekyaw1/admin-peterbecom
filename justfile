# https://github.com/casey/just
# https://just.systems/

dev:
    npm run dev -- --port 4001

build:
    npm run build

start: build
    npm run preview -- --port 4001

pretty:
    npm run pretty

tsc:
    npm run tsc

lint: pretty
    npm run lint
    npm run tsc

lintfix: prettyfix
    npm run lint:fix

prettyfix:
    npm run pretty:fix

test:
    npm run test

format: prettyfix lintfix

install:
    npm install