# Tutor Everywhere - Project Documentation (V2 Architecture)

## 1. Overview
**Tutor Everywhere** is a comprehensive global online tutoring marketplace designed to connect students with expert tutors. The platform facilitates the entire tutoring lifecycle, including tutor discovery, booking, payments, and session management. 
**V2 Upgrade**: The platform is evolving into a "Creator Hub" with AI-driven pricing, advanced negotiation tools, and a robust, scalable infrastructure.

## 2. Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.io-client
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (relational data) + Redis (Session/Cache)
- **ORM**: `pg` (node-postgres)
- **Authentication**: JWT (Access + Refresh Tokens) + httpOnly Cookies
- **File Storage**: Object Storage (AWS S3 / Cloudflare R2)
- **Real-time**: Socket.io
- **Language**: TypeScript

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (Planned for V2 scale)

## 3. Core Features (V2)

### For Students
- **Tutor Discovery**: AI-enhanced matching based on subject, budget, and goals.
- **Negotiation**: Structured offer/counter-offer system in chat.
- **Booking System**: Robust state-machine driven bookings with timezone support.
- **Wallet**: Secure deposits and escrow management.

### For Tutors (Creator Mode)
- **Creator Hub**: Upload and sell courses, PDF guides, and videos (tiered access).
- **AI Pricing Engine**: Get real-time price suggestions based on market demand and experience.
- **Smart Chat**: AI-assisted summaries, scheduling, and dispute prevention.
- **Earnings**: Analytics, withdrawal management, and automated escrow release.

### Core System Features
- **Advanced Auth**: Session invalidation, token rotation, and RBAC.
- **Escrow Payments**: Funds held securely until explicit release conditions are met.
- **Dispute Resolution**: Automated windows for dispute filing before fund release.

## 4. Database Schema (V2 Highlights)

### Identity & Access
- **users**: Core identity.
- **auth_sessions**: Active refresh tokens/sessions for security management.

### Commerce & Bookings
- **bookings**: Finite State Machine (`requested`, `accepted`, `scheduled`, `completed`, `disputed`, `cancelled`).
- **escrow_accounts**: Tracks held funds per booking with release timers.
- **offers**: Structured negotiation objects linked to bookings/chats.

### Creator Economy
- **content_collections**: Grouped resources (Courses).
- **content_items**: Individual files/videos.
- **content_access**: RBAC for content (Preview vs Paid).

### AI & Intelligence
- **pricing_snapshots**: Historical data for AI pricing models.
- **chat_metadata**: AI analysis of conversations (sentiment, summary).

## 5. API Reference (V2)

### Authentication (`/auth`)
- `POST /refresh`: Rotate access tokens.
- `POST /logout`: Invalidate session.

### Commerce (`/commerce`)
- `POST /offers`: Create a structured offer.
- `POST /bookings/:id/escrow/release`: Trigger fund release.

### Content (`/content`)
- `POST /upload`: Secure pre-signed URL generation for S3/R2 upload.
- `GET /:id/stream`: Secure file streaming/access.

## 6. Project Structure
```
Tutor Everywhere/
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/    # Request logic
│   │   ├── services/       # Business logic (EscrowService, AuthService)
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   └── utils/          # S3, AI helpers
│   └── Dockerfile
├── frontend/               # Next.js App
│   ├── app/                # Pages & Layouts
│   ├── components/         # Reusable UI components
│   └── lib/                # API clients & Utility functions
└── docker-compose.yml      # Orchestration
```
