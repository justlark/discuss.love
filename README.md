# discuss.love

This web app is a tool for negotiating interpersonal relationships.

## Architecture

The site is a Vue.js app hosted on [Cloudflare
Pages](https://developers.cloudflare.com/pages). The client app is in this repo
under [`./client/`](./client).

The backend is a [Cloudflare Worker](https://developers.cloudflare.com/workers/)
which stores session state in [Cloudflare
KV](https://developers.cloudflare.com/kv/). The worker is in this repo under
[`./worker/`](./worker).

The list of questions is defined [in a JSON
document](./client/src/assets/questions/relationship.json) which is used to
dynamically build the input form

## Development

To run the app locally, you'll need to spin up a local instance of the worker.
It must be running on port `8787`.

```shell
cd ./worker/
npm install
npx wrangler dev
```

Then you can start the local dev server.

```shell
cd ./client/
npm install
npm run dev
```

## Deployment

The client app is automatically deployed to Cloudflare Pages on pushes to
`main`. To deploy the worker, run:

```shell
cd ./worker/
npm install
npx wrangler deploy
```

You can also build the client app locally like this:

```shell
cd ./client/
npm install
npm run build
```

## Copyright

Copyright © 2024 Lark Aster

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.
