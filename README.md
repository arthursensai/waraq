# Waraq

**Your personal reading library.** Upload your PDFs, track your reading progress, and organize your documents by author — all from a single, focused library built for readers who mean it.

🔗 **Live demo:** [waraq1.vercel.app](https://waraq1.vercel.app)

---

## Features

- **📖 Never lose your place** — Waraq remembers your last page across every document, so you can pick up exactly where you left off.
- **🖥️ Read directly in your browser** — no downloads, no switching apps. Documents open right inside Waraq.
- **✍️ Multi-author support** — a book can have co-authors, editors, or translators. Waraq connects every document to as many authors as it deserves.
- **📝 Notes that live with your reading** — capture thoughts and quotes, always attached to the document they came from.
- **🔐 Secure & private** — full authentication and role-based access control powered by Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Row Level Security) |
| Forms & Data | TanStack Form, TanStack Query, Zod |
| File Uploads | UploadThing |
| PDF Rendering | [@embedpdf](https://www.embedpdf.com/), mupdf, pdfjs-dist |
| UI | Tailwind CSS, shadcn/ui, Radix UI |
| Animation | Framer Motion, Three.js / React Three Fiber |
| Deployment | Vercel |

---

## Project Structure

```
waraq/
├── app/                    # Next.js App Router — routing only
│   ├── (landing)/          # Public marketing site
│   ├── auth/                # Login, sign-up, password reset
│   ├── dashboard/           # Authenticated app (library, reader, authors, notes)
│   └── api/                 # API routes (uploads, cleanup jobs)
├── src/features/           # Business logic, organized by domain
│   ├── auth/
│   ├── author/
│   ├── document/
│   ├── profile/
│   └── reader/               # PDF viewer
├── components/
│   ├── sections/            # Layout sections (sidebar, footer, search)
│   └── ui/                  # shadcn/ui design system primitives
├── lib/
│   ├── supabase/            # Supabase client/server setup
│   └── uploadThing/
└── hooks/
```

Each feature under `src/features/` is self-contained: API layer, React Query hook, Zod schema, and components — cleanly separated from routing.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project
- An [UploadThing](https://uploadthing.com/) account

### 1. Clone and install

```bash
git clone https://github.com/arthursensai/waraq.git
cd waraq
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

UPLOADTHING_TOKEN=your_uploadthing_token
UPLOADTHING_ID=your_uploadthing_app_id

GMAIL_USER=your_gmail_address
GMAIL_PASSWORD=your_gmail_app_password

CLEANUP_API_SECRET=your_custom_secret
CLEANUP_NOTIFICATION_EMAIL=your_notification_email
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Author

**Mohammed Ait Sidi Bah**
Self-taught Full-Stack Developer | Next.js & TypeScript

- Portfolio: [mohammedaitsidibah.me](https://mohammedaitsidibah.me)
- GitHub: [@arthursensai](https://github.com/arthursensai)
- LinkedIn: [mohamed-ait-sidi-bah](https://www.linkedin.com/in/mohamed-ait-sidi-bah)

---

## License

This project is currently unlicensed. All rights reserved.
