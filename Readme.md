# 📄 AI Resume Builder

A full-stack web app for creating, editing, and previewing professional resumes — with AI-powered content enhancement for summaries, job descriptions, and project entries.

## Links

- Live Site: [resume-builder-delta-drab-68.vercel.app](https://resume-builder-delta-drab-68.vercel.app)
- Repo: [GitHub repo](https://github.com/ShubhangiMishra215/Resume-builder.git)

## Table of Contents

- [Links](#links)
- [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
- [My Process](#my-process)
  - [Project Structure](#project-structure)
  - [API Overview](#api-overview)
  - [Deployment](#deployment)
  - [What I Learned](#what-i-learned)
  - [Continued Development](#continued-development)
- [Author](#author)

## Overview

### Features

- 🔐 User authentication (JWT-based)
- 📝 Multi-section resume editor (personal info, summary, experience, education, projects, skills, etc.)
- 🤖 AI-powered enhancement for professional summaries and job descriptions.
- 🖼️ Image upload and management via ImageKit
- 👀 Live resume preview
- 🔗 Shareable public resume links
- 💾 Save, update, and manage multiple resumes

### Tech Stack

| Layer         | Tools                                              |
|---------------|-----------------------------------------------------|
| Frontend      | React (Vite), Redux Toolkit, React Router            |
| Backend       | Node.js, Express                                      |
| Database      | MongoDB, Mongoose                                      |
| AI            | OpenAI-compatible SDK → Gemini models                   |
| Media         | ImageKit                                                  |
| Auth          | JWT                                                          |
| Hosting       | Vercel (frontend), Render (backend)                            |

## My Process

### Project Structure

```
ai-resume-builder/
├── client/                 # React frontend (deployed on Vercel)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages (e.g. Preview, Dashboard)
│   │   ├── features/       # Redux slices
│   │   ├── routes/         # React Router setup
│   │   └── api/            # API call helpers
│   ├── vercel.json         # SPA rewrite rule for client-side routing
│   └── vite.config.js
├── server/                  # Node/Express backend (deployed on Render)
│   ├── controllers/         # Route logic (auth, resumes, AI enhancement)
│   ├── models/              # Mongoose schemas
│   ├── routes/               # Express routers (userRoutes, resumeRoutes, aiRoutes)
│   ├── middleware/          # Auth, error handling, etc.
│   └── configs/               # DB, ImageKit, multer, AI client config
└── README.md
```

### API Overview

**User routes** (`/api/users`)

| Method | Endpoint    | Auth | Description                          |
|--------|--------------|------|----------------------------------------|
| POST   | `/register`  | —    | Register a new user                    |
| POST   | `/login`      | —    | Log in and receive a JWT               |
| GET    | `/data`       | ✅   | Get the logged-in user's data          |
| GET    | `/resumes`    | ✅   | Get all resumes for the logged-in user |

**Resume routes** (`/api/resumes`)

| Method | Endpoint              | Auth | Description                              |
|--------|------------------------|------|--------------------------------------------|
| POST   | `/create`              | ✅   | Create a new resume                        |
| PUT    | `/update`              | ✅   | Update an existing resume (accepts image)  |
| DELETE | `/delete/:resumeId`    | ✅   | Delete a resume                              |
| GET    | `/get/:resumeId`       | ✅   | Get a single resume by ID                     |
| GET    | `/public/:resumeId`    | —    | Get a public (shareable) view of a resume      |

**AI routes** (`/api/ai`)

| Method | Endpoint             | Auth | Description                            |
|--------|------------------------|------|------------------------------------------|
| POST   | `/enhance-pro-sum`     | ✅   | AI-enhance a professional summary        |
| POST   | `/enhance-job-desc`    | ✅   | AI-enhance a job description             |
| POST   | `/upload-resume`       | ✅   | Upload/parse a resume file               |

### Deployment

**Backend — Render (Web Service)**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Env vars: all values from `server/.env`, added via the Render dashboard

**Frontend — Vercel**
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Env vars: `VITE_API_BASE_URL` set to the Render backend URL
- `vercel.json` includes a rewrite so client-side routes (e.g. `/resume/public/:id`) resolve correctly on direct load/refresh instead of 404ing:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

### What I Learned

Notable bugs and gotchas hit — and fixed — while building and deploying this:

- **CORS trailing slash mismatch** — `cors`'s `origin` array had the Vercel URL with a trailing slash (`.../vercel.app/`), but browsers send the `Origin` header without one. Since `cors` does an exact string match, this silently failed preflight requests with no `Access-Control-Allow-Origin` header, even though the origin was "technically" in the list.
- **SPA routing 404 on Vercel** — public resume links worked when navigated to from inside the app (client-side routing) but 404'd when opened directly or shared. Fixed with a `vercel.json` rewrite so all paths fall back to `index.html` and let React Router handle routing.
- **Immutable `_id` update failures** — Mongoose rejected updates on `PUT /api/resumes/update` because the request body included the immutable `_id` field. Fix: strip `_id` before passing the update payload to Mongoose.
- **ImageKit 403s** — traced to a stale/revoked private API key, not a code bug.
- **Variable shadowing** — a destructured `data` from an API response silently shadowed a component prop of the same name, causing hard-to-trace stale UI values.
- **Response key mismatches** — frontend expected `enhancedContent` while the backend returned `enhancedSummary` / `enhancedDescription` (and `data.resume` vs. `data.resumes` elsewhere).
- **Client instantiated under one name, called under another** — the OpenAI-compatible client was created as `ai` but referenced as `openai` throughout controllers.
- **ESM strictness** — Node's ESM module resolution required explicit `.js` extensions on relative imports.
- **`useSelector` referenced without being invoked** — in `Layout.jsx`, passing the hook itself instead of calling it produced confusing downstream errors.

```js
// Example: fixing the immutable _id bug
const { _id, ...updateFields } = req.body;
const resume = await Resume.findByIdAndUpdate(req.user.resumeId, updateFields, { new: true });
```

### Continued Development

- [ ] Track down duplicate rendering on the Preview page (React StrictMode vs. duplicate routes vs. parent double-render)
- [ ] Gracefully handle Gemini API 429s (free-tier quota limits) with retry/backoff and user-facing messaging
- [ ] Add an empty-input guard before firing AI enhancement requests
- [ ] Add resume export (PDF) functionality
- [ ] Write tests for controllers and Redux slices

## Author

- Name - Shubhangi Mishra
- GitHub - [@ShubhangiMishra215](https://github.com/ShubhangiMishra215)