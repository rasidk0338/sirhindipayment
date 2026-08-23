# Sirhindi Deployment

This project deploys as two services: the Express API on Render and the Vite SPA on Vercel.

## Render API

Create a Render Web Service connected to this repository with:

- Root directory: `server`
- Runtime: `Node`
- Build command: `npm install`
- Start command: `npm start`

Add these environment variables in Render. Replace every placeholder with a real value:

```text
PORT=10000
NODE_ENV=production
JWT_SECRET=<long-random-secret>
MONGODB_URI=<mongodb-atlas-connection-string>
CLIENT_URL=https://sirhindi.vercel.app
COOKIE_SAME_SITE=none
```

Render supplies its own `PORT`; keeping `PORT=10000` is also valid for a standard Web Service.

Verify the API at `https://sirhinditransaction-backend.onrender.com/api/health`.

## Vercel frontend

Import the same repository as a Vercel project with:

- Root directory: `client`
- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Add this Vercel environment variable:

```text
VITE_API_URL=https://sirhinditransaction-backend.onrender.com/api
```

The `client/vercel.json` rewrite keeps React Router routes working after a browser refresh.

## Deployment order

1. Deploy the Render API and confirm `/api/health` responds.
2. Set `CLIENT_URL` to the final Vercel URL and redeploy the API.
3. Set `VITE_API_URL` in Vercel and deploy the frontend.
4. Test registration, login, refresh, logout, and a protected API request.

Never commit `.env` files. Only `.env.example` files belong in source control.
