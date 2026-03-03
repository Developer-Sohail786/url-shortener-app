# Secure URL Shortener

A production-ready URL shortener built using **Next.js (App Router)**, **NextAuth**, and **MongoDB**, deployed on **Vercel**.

This application allows users to securely generate, manage, and track shortened URLs with authentication and protected routes.

---

## Live Demo

 Live App: https://url-shortener-app-topaz.vercel.app  
 GitHub Repository: https://github.com/Developer-Sohail786/url-shortener-app 

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS  
- **Authentication:** NextAuth (Credentials + Google OAuth)  
- **Database:** MongoDB Atlas  
- **Deployment:** Vercel  
- **Session Management:** Server-side session validation  

---

## Authentication Features

- Secure user registration with password hashing  
- Credentials-based login  
- Google OAuth login  
- Server-side protected routes  
- Session-based access control  
- Automatic redirect handling  
- Logout functionality  

---

## Core Features

### URL Generation
- Create custom short URLs  
- Prevent duplicate short codes  
- User-specific URL ownership  

### Dashboard
- View all generated URLs  
- Delete URLs  
- Copy short URL to clipboard  
- Responsive design for multiple devices  

### Click Tracking
- Atomic click increment using MongoDB `$inc`  
- Tracks total clicks per URL  
- Stores creation date  
- Tracks last clicked timestamp  
- Auto-refresh dashboard when returning to tab  

---

## Route Protection

### Protected Routes
- `/shorten` → Accessible only to authenticated users  
- `/login` & `/register` → Blocked for authenticated users  

Implemented using:
- `getServerSession()`  
- Server-side `redirect()`  
- Dynamic rendering with `force-dynamic`  

---

## Database Schema (URL Collection)

```json
{
  "url": "https://example.com",
  "shorturl": "example123",
  "userId": "user_id",
  "clicks": 0,
  "createdAt": "Date",
  "lastClickedAt": "Date"
}
```
## Configure Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_HOST=http://localhost:3000
```

## Installation & Setup
```
git clone https://github.com/Developer-Sohail786/url-shortener-app
cd url-shortener-app
npm install
npm run dev
```


## Future Improvements
```
Rate limiting

Analytics charts

URL expiration

Role-based access control

Advanced usage statistics
```
## Author
```
-Sohail Khan
```

