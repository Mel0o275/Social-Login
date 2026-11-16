# Sara7a Frontend

A modern React + Vite SaaS dashboard frontend for the Sara7a Express.js backend.

## Setup

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment (copy and edit)
cp .env.example .env
# VITE_API_URL is already set to http://localhost:3000

# 4. Start the dev server
npm run dev
# Opens at http://localhost:5173
```

> **Important:** Make sure your Express backend is running first:
> ```bash
> # In the root project directory
> npm run start:dev
> ```

## Available Routes

| Route         | Description                               |
|--------------|-------------------------------------------|
| `/login`      | Email + password login, Google login stub |
| `/register`   | Account creation form                     |
| `/dashboard`  | Authenticated user dashboard (protected)  |
| `/products`   | Paginated product catalogue               |

## Google Login Setup

1. Go to https://console.cloud.google.com/ → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web Application type)
3. Add `http://localhost:5173` to **Authorized JavaScript origins**
4. Copy the Client ID into `frontend/.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
   ```
5. **⚠️ Backend integration required:** The backend needs to add `POST /auth/google` to verify the ID Token. See `src/components/GoogleLoginButton.jsx` for the stub.

## Backend Endpoints Used

| Method | Path              | Auth    | Used In         |
|--------|-------------------|---------|-----------------|
| POST   | /auth/signup      | No      | Register page   |
| POST   | /auth/login       | No      | Login page      |
| GET    | /user/profile     | Cookie  | App startup     |
| GET    | /product/all      | No      | Products page   |
| POST   | /product/create   | Cookie  | Create modal    |

## Build for Production

```bash
npm run build
# Output goes to frontend/dist/
```

Then serve `dist/` with Express static middleware or a CDN.
