# AI-Powered Secure URL Shortener

A production-ready full-stack URL shortener built with **Next.js**, **NextAuth**, **MongoDB**, and **Gemini AI**.

The application allows authenticated users to securely generate, manage, and track shortened URLs. It also includes an AI-powered suggestion feature that analyzes the destination webpage and generates a meaningful short URL slug and concise summary.

---

## Live Demo

**Live App:** https://url-shortener-app-topaz.vercel.app

**GitHub Repository:** https://github.com/Developer-Sohail786/url-shortener-app

---

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Frontend:** React 19.2.3, Tailwind CSS
- **Authentication:** NextAuth 4 (Credentials + Google OAuth)
- **Session Management:** JWT sessions with server-side validation
- **Database:** MongoDB / MongoDB Atlas
- **Database Driver:** MongoDB Native Driver
- **AI:** Google Generative AI
- **AI Models:** Gemini 2.5 Flash with Gemini 3 Flash Preview fallback
- **Forms:** React Hook Form
- **Notifications:** React Toastify
- **Icons:** React Icons
- **Password Security:** bcryptjs
- **Deployment:** Vercel

---

## Core Features

### 1. Secure URL Generation

- Create custom short URLs
- Prevent duplicate short URL codes
- Associate URLs with individual user accounts
- Store URL summaries
- Server-side authentication before URL creation
- Store click counts and timestamps

### 2. AI-Powered URL Suggestions

The application includes an **AI Suggest** feature powered by Google Gemini.

When a user enters a destination URL:

1. The frontend sends the URL to `/api/ai-generate`.
2. The server fetches the destination webpage.
3. The webpage HTML is inspected.
4. The application attempts to extract the `<title>` tag.
5. If the title is unavailable, it attempts to extract `og:title`.
6. The URL and extracted title are sent to Gemini.
7. Gemini generates:
   - A concise summary
   - A clean, lowercase, hyphen-separated URL slug
8. The generated slug and summary are returned to the frontend.

### AI Model Fallback

```text
Gemini 2.5 Flash
        ↓
If request fails
        ↓
Gemini 3 Flash Preview
        ↓
If both fail
        ↓
Deterministic fallback slug + generic summary
```

The final fallback generates a slug from the last segment of the URL and uses:

```text
Generated from URL
```

as the fallback summary.

---

## Authentication

Authentication is implemented using **NextAuth** with JWT sessions.

### Credentials Authentication

- User registration
- Email and password login
- Password hashing with bcryptjs
- Case-normalized email lookup
- Invalid credential handling
- JWT-based sessions

### Google OAuth

- Google login
- Automatic user creation when a Google account is used for the first time
- MongoDB user ID stored in the JWT
- Session access to the authenticated user ID

### Authentication Flow

```text
User
 ↓
Login / Register
 ↓
NextAuth
 ↓
Credentials or Google OAuth
 ↓
JWT Session
 ↓
Authenticated Application
```

---

## Route Protection

The application protects authenticated routes using server-side session validation.

### Protected Routes

- `/shorten` → Accessible only to authenticated users

### Authentication-only Routes

- `/login` → Authenticated users are redirected to `/shorten`
- `/register` → Authenticated users are redirected to `/shorten`

### Implementation

Route protection uses:

- `getServerSession()`
- `authOptions`
- `redirect()`
- `force-dynamic`
- Server-side session validation

> The current `app/middleware.js` does not perform route protection. Protection is implemented directly in the relevant server-rendered pages and API routes.

---

## URL Dashboard

The `/shorten` page provides a dashboard for managing generated URLs.

### Dashboard Features

- View all generated URLs
- View original destination URL
- View shortened URL
- View AI-generated summary
- View total clicks
- View creation date
- Copy shortened URL
- Delete URLs
- Responsive table layout

The dashboard fetches the user's URLs when the page loads and refreshes them when the browser window receives focus.

---

## Click Tracking

Shortened URLs support click tracking.

When a user opens a shortened URL:

```text
/shorturl
   ↓
Find URL in MongoDB
   ↓
Increment clicks using $inc
   ↓
Redirect to original URL
```

MongoDB's atomic `$inc` operation is used to increment the click count.

Tracked fields include:

- `clicks`
- `createdAt`
- `lastClickedAt`

> `lastClickedAt` is currently initialized when a URL is created, but the current redirect implementation does not update it when a click occurs.

---

## URL Redirect System

Short URLs are handled through:

```text
/[shorturl]
```

The redirect process:

1. Receives the short URL parameter.
2. Searches MongoDB for the matching `shorturl`.
3. Returns `notFound()` if the record does not exist.
4. Validates that the destination begins with `http`.
5. Atomically increments the click counter.
6. Redirects the user to the original destination.

---

## Authorization & User Ownership

Each URL is associated with the authenticated user's ID.

```json
{
  "url": "https://example.com",
  "shorturl": "example123",
  "summary": "Example webpage",
  "clicks": 0,
  "userId": "user_id",
  "createdAt": "Date",
  "lastClickedAt": null
}
```

The application ensures that:

- Users only retrieve their own URLs.
- Users can only delete their own URLs.
- URL deletion checks both the requested document ID and authenticated user's ID.
- Unauthenticated API requests are rejected.

---

## API Routes

### Authentication

#### `POST /api/auth/register`

Creates a new credentials-based user.

#### `/api/auth/[...nextauth]`

Handles NextAuth authentication requests.

---

### URL Management

#### `POST /api/generate`

Creates a shortened URL.

Requires:

```text
url
shorturl
summary
```

Authentication is required.

#### `GET /api/urls`

Returns URLs belonging to the authenticated user.

Authentication is required.

#### `POST /api/delete`

Deletes an owned shortened URL.

Authentication is required.

---

### AI

#### `POST /api/ai-generate`

Generates an AI-powered slug and webpage summary.

Input:

```json
{
  "url": "https://example.com"
}
```

Output:

```json
{
  "success": true,
  "summary": "Example webpage summary",
  "slug": "example-page"
}
```

If both Gemini models fail, the endpoint can return fallback data.

---

## Database

The project uses **MongoDB** with the database:

```text
URL_Shorten
```

### Collections

```text
users
url
```

### URL Collection

| Field | Description |
|---|---|
| `url` | Original destination URL |
| `shorturl` | Short URL identifier |
| `summary` | AI-generated or supplied summary |
| `clicks` | Total number of clicks |
| `userId` | ID of the URL owner |
| `createdAt` | URL creation timestamp |
| `lastClickedAt` | Last-click timestamp field |

### Users Collection

User records can contain:

- `name`
- `email`
- `password`
- `provider`
- `createdAt`

---

## Security

The application demonstrates several real-world security practices.

### Authentication Security

- NextAuth authentication
- JWT sessions
- Password hashing with bcryptjs
- Google OAuth

### Authorization Security

- Server-side session validation
- User-scoped database queries
- Ownership verification during deletion
- Protected application routes
- Protected API operations

### Data Security

- Passwords are hashed before storage
- URL records contain ownership information
- Database operations are performed server-side

---

## AI Architecture

```text
User enters URL
      ↓
AI Suggest button
      ↓
POST /api/ai-generate
      ↓
Fetch webpage HTML
      ↓
Extract <title>
      ↓
Fallback to og:title
      ↓
Build Gemini prompt
      ↓
Gemini 2.5 Flash
      ↓
Gemini 3 Flash Preview (fallback)
      ↓
Deterministic fallback (final fallback)
      ↓
Return summary + slug
      ↓
Populate URL form
```

The AI prompt asks Gemini to generate a maximum 10-word summary and a clean lowercase, hyphen-separated slug using the URL and webpage title.

---

## Application Architecture

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Next.js         │
                    │     App Router       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │  NextAuth   │  │ API Routes  │  │   Pages /   │
       │    + JWT    │  │             │  │ Components  │
       └─────────────┘  └──────┬──────┘  └─────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌─────────────┐      ┌─────────────┐
             │   MongoDB   │      │  Gemini AI  │
             │   Database  │      │             │
             └─────────────┘      └─────────────┘
```

---

## Important Project Files

```text
app/
├── (auth)/
│   ├── login/
│   │   ├── page.js
│   │   └── loginComponent.js
│   └── register/
│       ├── page.js
│       └── register-component.js
│
├── (main)/
│   ├── [shorturl]/
│   │   └── page.js
│   ├── shorten/
│   │   ├── page.js
│   │   └── shorten.js
│   ├── about/
│   │   └── page.js
│   ├── contact/
│   │   └── page.js
│   └── page.js
│
├── api/
│   ├── ai-generate/
│   │   └── route.js
│   ├── auth/
│   │   ├── [...nextauth]/
│   │   │   └── route.js
│   │   └── register/
│   │       └── route.js
│   ├── delete/
│   │   └── route.js
│   ├── generate/
│   │   └── route.js
│   └── urls/
│       └── route.js
│
└── middleware.js

lib/
├── auth.js
├── mongodb.js
└── normalizeUrl.js
```

---

## Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_secret

NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_HOST=http://localhost:3000

GEMINI_API_KEY=your_gemini_api_key
```

### Environment Variable Purpose

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | NextAuth session/security secret |
| `NEXTAUTH_URL` | Application URL used by NextAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_HOST` | Public host used to construct shortened URLs |
| `GEMINI_API_KEY` | Google Generative AI API key |

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Developer-Sohail786/url-shortener-app
```

### 2. Enter the project

```bash
cd url-shortener-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

and add the required variables.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## NPM Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Deployment

The project is deployed using **Vercel**.

### Production Services

```text
Frontend / Backend
        ↓
      Vercel

Database
        ↓
  MongoDB Atlas

AI
        ↓
Google Generative AI
```

For production deployment, configure:

- MongoDB Atlas connection string
- NextAuth secret
- Production NextAuth URL
- Google OAuth credentials
- Public application host
- Gemini API key

---

## Future Improvements

Planned improvements include:

- Rate limiting
- Analytics charts
- URL expiration
- Role-based access control
- Advanced usage statistics

---

## Project Highlights

- Full-stack Next.js application
- Next.js App Router
- React-based responsive interface
- Credentials + Google OAuth authentication
- JWT session management
- Secure password hashing with bcryptjs
- Server-side route protection
- User-scoped URL ownership
- MongoDB-backed URL management
- Atomic click tracking with MongoDB `$inc`
- AI-powered URL slug generation
- AI-generated webpage summaries
- Gemini model fallback strategy
- Deterministic fallback when AI is unavailable
- Server-side URL redirects
- Responsive URL management dashboard
- Vercel deployment

---

## Author

**Sohail Khan**

GitHub: https://github.com/Developer-Sohail786

