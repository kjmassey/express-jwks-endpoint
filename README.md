# 🚀 express-js-jwks

A tiny, focused Express.js app that serves a JSON Web Key Set (JWKS) endpoint for verifying JWTs. Perfect for demos, auth microservices, or as a small public key distribution service.

✨ Highlights
- Lightweight Express server that exposes `/.well-known/jwks.json`
- Uses `jose` to convert a PEM public key into a JWK
- Ready for deployment (Heroku, Render, Fly.io, Vercel, DigitalOcean)

Badges

![node-version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)



**Quick Start**

Prerequisites
- Node.js v16+ and npm

Install & run locally
```bash
git clone https://github.com/your-username/express-js-jwks.git
cd express-js-jwks
npm install
npm start
# or for development (if you have nodemon)
npm run dev
```

By default the server listens on `PORT` (env) or `3000`. The JWKS endpoint is:

```text
http://localhost:3000/.well-known/jwks.json
```

Try it with curl
```bash
curl -s http://localhost:3000/.well-known/jwks.json | jq .
```

--

What this app expects
- A PEM-encoded public key at `./public_key.pem` (the repo reads `public_key.pem`).
- The app converts that PEM to a JWK and serves it under the `keys` array.

If you'd rather not keep the PEM on disk, you can set an environment variable `PUBLIC_KEY` with the PEM contents and modify `app.js` to read from `process.env.PUBLIC_KEY` as a fallback.

--

Endpoints
- `GET /.well-known/jwks.json` — returns the JWKS object { keys: [ ... ] }

--

Deployment Guides

Below are concise steps for deploying this app to popular hosts. Choose one that fits your workflow.

1) Heroku ☁️
- Ensure you have the Heroku CLI: `brew tap heroku/brew && brew install heroku` (macOS)
- Commit your code (Procfile is present):

```bash
git add .
git commit -m "Prepare for deploy"
heroku login
heroku create my-express-jwks
git push heroku main
heroku ps:scale web=1
heroku logs --tail
```

Notes: Heroku provides the `PORT` env automatically. If you keep the PEM private, store it in a config var:
```bash
heroku config:set PUBLIC_KEY="$(cat public_key.pem)"
```

2) Render 🚀
- Create a new Web Service on Render and connect your GitHub repo.
- Build Command: `npm install`
- Start Command: `npm start` (or `node app.js`)
- Set any env vars (like `PUBLIC_KEY`) in the Render dashboard.

3) Fly.io 🛰️
- Install `flyctl` and log in: `brew install superfly/tap/flyctl && flyctl auth login`
- From repo root:
```bash
flyctl launch --name my-jwks-app
# follow prompts (select region, app name, etc.)
flyctl deploy
```

Fly will detect a Node app or create a Dockerfile. Make sure `PORT` is used by the app (it is).

4) Vercel (Serverless) ⚡
Vercel prefers serverless functions. To deploy this exact Express server you'd either:
- Use a small Docker-based deployment (Vercel Pro) or
- Convert the server to a serverless function (wrap Express with `serverless-http` and move to `/api`)

Basic idea to use serverless:
```bash
npm install serverless-http
# create /api/index.js that imports your app and exports the handler
```

For most straight Node/Express apps, Render, Heroku or Fly are simpler.

5) DigitalOcean App Platform ☁️
- Create an App from GitHub in the App Platform UI.
- Choose `Node.js` runtime. Build command: `npm install`. Run command: `npm start`.
- Add `PUBLIC_KEY` or other env vars if needed.

--

Environment & Security Notes
- Keep private keys out of source control. Use host-provided env vars/secrets.
- If using a disk file (`public_key.pem`), restrict repo visibility or load from a secure secret store.
- Use HTTPS when serving JWKS publicly.

--

Improvement ideas
- Rotate keys and expose multiple entries in the JWKS `keys` array.
- Add caching headers or ETag on the JWKS endpoint.
- Add automated CI to validate that `public_key.pem` converts successfully.

--

Dependencies
- express
- jose
- node-jose

License
This project uses the ISC license.

Contributing
PRs welcome — open issues for feature requests or bugs.

--

Happy deploying! 🎉 