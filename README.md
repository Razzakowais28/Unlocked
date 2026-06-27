# Unlocked

**A message meant for the future.**

Unlocked is a digital time capsule platform where users create capsules, add memories, lock them until a future date, share countdown links, and open them only when the unlock date arrives.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite**
- **React Hook Form** + **Zod**
- **Framer Motion**
- **Lucide React**
- **date-fns**

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed demo data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login

Use the demo account after seeding:

- **Name:** owais
- **Email:** owaisrak28@gmail.com

Go to `/login` and sign in with these credentials (no password required for MVP).

## App Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Demo authentication |
| `/dashboard` | User dashboard |
| `/capsules/new` | Multi-step capsule creation |
| `/capsules/[id]/edit` | Edit capsule |
| `/capsules/[id]/preview` | Preview and lock capsule |
| `/c/[slug]` | Public countdown page |
| `/c/[slug]/open` | Unlocked capsule experience |
| `/pricing` | Pricing plans |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth` | Login / register |
| DELETE | `/api/auth` | Logout |
| GET | `/api/capsules` | List user capsules |
| GET | `/api/capsules?slug=` | Get capsule by share slug |
| POST | `/api/capsules` | Create capsule |
| GET | `/api/capsules/[id]` | Get capsule by ID |
| PATCH | `/api/capsules/[id]` | Update capsule |
| DELETE | `/api/capsules/[id]` | Delete capsule |
| POST | `/api/upload` | Upload file (local) |

## Local File Uploads

Uploaded files are saved to `public/uploads/` for demo purposes. This is **local-only** and files are stored on the filesystem. For production, use object storage (S3, R2, etc.).

## Database

SQLite is used for local development. The database file is created at `dev.db` in the project root after running migrations.

### Commands

```bash
npx prisma migrate dev    # Run migrations
npm run db:seed           # Seed demo data
npx prisma studio         # Open database GUI
```

## Security Notes

- MVP uses simple cookie-based demo auth (no passwords)
- Capsule content is hidden on public pages until unlock date
- UI uses "Private by design" — production encryption can be added later
- Do not claim end-to-end encryption is fully implemented

## Future Improvements

- Real authentication (OAuth, email magic links)
- Object storage for media (S3/R2)
- End-to-end encryption
- AI Memory Movie generation
- Email reminders before unlock date
- Family sharing and collaboration
- Payment integration (Stripe)
- PostgreSQL for production
- Push notifications

## Deployment

### GitHub Pages (not supported for the full app)

GitHub Pages only serves static files. It **cannot** run this Next.js app (API routes, login, database, uploads). If you enable GitHub Pages on the `main` branch, you will only see the README or a static landing page — not the real app.

The repo includes a root `index.html` that explains this and links to Vercel.

### Deploy the full app on Vercel (recommended, free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New → Project** and import `Razzakowais28/Unlocked`
4. Click **Deploy** (defaults work — `vercel.json` is included)
5. Open your live URL (e.g. `https://unlocked.vercel.app`)

**Note:** The app uses SQLite locally. For a fully working live app (login, capsules, uploads), you will eventually need PostgreSQL and cloud storage on Vercel/Render. The landing page and UI will deploy immediately.

## License

MIT
