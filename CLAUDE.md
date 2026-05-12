Farra App

Nightlife and events discovery app — find out what's happening around you tonight.

## Stack
- **Mobile**: React Native + Expo
- **Web**: Next.js (admin panel)
- **API**: Node.js + Fastify + TypeScript
- **Database**: Supabase (PostgreSQL + RLS)
- **Cache**: Redis (Upstash)
- **Monorepo**: Turborepo + npm workspaces

## Structure
farra-app/
├── apps/
│   ├── mobile/     ← React Native + Expo
│   └── web/        ← Next.js admin panel
├── packages/
│   ├── api/        ← Fastify API
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── db.ts
│   │       │   ├── redis.ts
│   │       │   └── errors.ts
│   │       ├── modules/
│   │       │   ├── events/
│   │       │   ├── attendance/
│   │       │   ├── venues/
│   │       │   ├── auth/
│   │       │   ├── auction/
│   │       │   ├── reviews/
│   │       │   └── admin/
│   │       └── server.ts
│   └── shared/     ← types, validators, utils
└── supabase/
└── migrations/

## Database Tables
- `users` — mirror of auth.users
- `venues` — bars, clubs, restaurants
- `events` — events linked to venues
- `attendance` — user presence confirmations

## API Endpoints (so far)
- `GET /health` — health check
- `GET /api/events` — list published events

## MVP Features (build these first)
1. SSO Google/Apple login
2. List events by location and date
3. Event detail + "Irei" attendance confirmation
4. Attendance counter per event
5. External ticket link
6. Basic admin panel (CRUD events)
7. Carousel (manual for now, auction comes later)

## Phase 2 (do not build yet)
- Auction system for carousel slots
- Post-event reviews with stars
- Google Places fallback
- Municipality → state fallback
- Push notifications
- Admin Premium subscription

## Business Model
- **Carousel auction**: admins pay daily to appear in featured slots
- **Commission**: % on ticket sales via exclusive discount codes
- **Admin Premium**: monthly subscription for analytics + auction credits

## Rules
- TypeScript everywhere, strict mode
- Zod for all validations
- RLS enabled on all tables
- Never expose service_role key to client
- Monolith first, microservices never (until 500k+ users)
- Mobile uses anon key, API uses service_role key