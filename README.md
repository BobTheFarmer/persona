# Persona FULL README

## Overview
Persona is an AI-powered campus clubs discovery platform for TAMU that builds a "Persona DNA" for every student across 5 domains: academic, professional, social, sports, and volunteering. It uses local transformer embeddings (all-MiniLM-L6-v2, 384-dim) to match students to clubs, recommend clubs, and discover club events - all with explainable "why" reasoning.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Drizzle ORM + pgvector extension
- **AI/ML**: Local all-MiniLM-L6-v2 via @xenova/transformers (384-dim vectors), pgvector indexes, no external API dependencies
- **Auth**: Replit Auth (OpenID Connect)
- **Routing**: wouter (frontend), Express (backend)

## Architecture

### Navigation
- Bottom navigation bar (mobile-style) with 5 tabs: My DNA, Clubs, Explore, Events, Friends
- No sidebar - uses `BottomNav` component fixed at bottom of screen

### Pages
- `/` - Landing page (unauthenticated) / Profile page (authenticated, own profile)
- `/profile/:userId` - View another user's profile (class/year badges, Main Club, Event History, Mutuals)
- `/recommendations` - Club recommendations across 5 campus domains
- `/explore` - Full-screen topographical map (Leaflet + CartoDB dark tiles) centered on TAMU MSC (30.6187, -96.3365). Shows events within 48h as category-coded markers with heat map overlay, clubs as domain-coded markers (toggled via button), popups with details + friend avatars + Google Maps links, and a color-coded legend.
- `/events` - Event discovery with persona+social+urgency scoring
- `/social` - Social matching with compatibility scores + "View Profile" links to /profile/:userId
- `/about` - About / How It Works page (TIDAL summary, interdisciplinary design, AI/ML explanation with code snippets). Opened by clicking the Persona logo in the header.

### Domains (Campus)
- `academic` - Academic clubs (IEEE, Coding Club, AI/ML, Research, etc.)
- `professional` - Professional development (Consulting, Entrepreneurship, Finance, etc.)
- `social` - Social/cultural clubs (Film, Gaming, Korean SA, Dance, etc.)
- `sports` - Club sports (Soccer, Climbing, Basketball, Pickleball, etc.)
- `volunteering` - Service organizations (Habitat, Big Event, Camp Kesem, etc.)

### Profile Page (redesigned, supports own + other profiles)
- Full-screen themed background (Oceanic, Aurora, Ember, or custom image)
- Cover banner uses theme image with gradient overlay
- Avatar + name + class standing badge + grad year badge + cluster badges
- Users table: gradYear, classStanding, mainClubItemId fields
- **Own Profile** (`/`): Settings menu (gear icon), theme switcher, layout editor
- **Other Profile** (`/profile/:userId`): Back button, Common/All event toggle, Mutuals section
- Glassy see-through sections with backdrop-blur-xl:
  - Top 3 Traits: highest scoring personality traits
  - Main Club: user's primary club with hybrid ML match score + judge tooltips
  - Event History: attended events list with ML match scores (Common/All toggle for other profiles)
  - Persona DNA Radar: full radar chart + bar breakdown
  - Gallery (Hobby Tags): combined hobby images + vertical reel cards with tags
  - Mutual Connections: shared high-match users between viewer and target (other profiles only)
- Theme images stored in `client/src/assets/images/theme-*.png`

### API Endpoints
- `GET /api/auth/user` - Current authenticated user
- `GET /api/taste-profile` - User's taste profile
- `POST /api/onboarding` - Complete onboarding with favorites + trait quiz
- `POST /api/onboarding/reset` - Reset onboarding (sets onboardingComplete to false)
- `GET /api/recommendations/:domain` - Get club recommendations for a domain (academic/professional/social/sports/volunteering)
- `POST /api/interactions` - Record user interaction (like/love/skip/save/view)
- `GET /api/interactions/collection` - Get user's saved/liked items collection
- `GET /api/social/matches` - Get matched users with scores
- `GET /api/friends` - Get current user's friends with shared clubs/events
- `GET /api/friends/suggestions` - Get friend suggestions with match scores
- `POST /api/friends/:friendId` - Add a friend
- `DELETE /api/friends/:friendId` - Remove a friend
- `GET /api/events` - Get all events (optionally filtered by category)
- `POST /api/events/:id/rsvp` - Toggle RSVP for an event
- `GET /api/events/:id/matches` - Get match info for a specific event
- `GET /api/events/:id/attendee-matches` - Get attendee match details for an event
- `GET /api/events/for-you` - Personalized events: finalScore = 0.45*personaScore + 0.30*socialScore + 0.25*urgencyScore
- `GET /api/explore/hobbies` - Get hobby recommendations
- `GET /api/explore/map-data` - Map data: events (48h window) + clubs with locations, friend overlays, RSVP counts, persona scores
- `GET /api/profile/:userId` - Get user profile data (traits, clusters, class/year)
- `GET /api/profile/:userId/main-club` - Get user's main club with hybrid ML match score for viewer
- `GET /api/profile/:userId/event-history?mode=all|common` - Event history with ML scores (common = shared events with viewer)
- `GET /api/profile/:userId/mutuals` - Mutual connections (users matching both viewer and target at >60%)
- `POST /api/demo/bootstrap` - Auto-create demo profile for authenticated user
- `POST /api/demo/reset` - Reset demo state (dev-only auth bypass)
- `GET /api/demo/story` - Demo script with talking points
- `GET /api/debug/ai-status` - AI readiness check
- `GET /api/debug/embedding-health` - Dashboard: embedding coverage, scoring mode status
- `GET /api/debug/embedding-similarity-sanity` - Per-domain cosine similarity proof
- `GET /api/debug/match-proof/:otherUserId` - Cold-start matching proof
- `POST /api/admin/backfill-embeddings` - Generate missing embeddings + recompute user profiles

### Hybrid AI/ML Engine (Embeddings-First)
- **Embeddings-First Architecture**: ML drives ranking; traits only explain. Fallback to traits only if embeddings missing.
- **Vector Similarity (55%)**: Local neural embeddings via @xenova/transformers all-MiniLM-L6-v2 (384-dim, 100% reliable, no external API), cosine similarity scoring
- **Collaborative Filtering (25%)**: Embedding-based neighbor discovery (top 20 users by tasteEmbedding cosine similarity), weighted action aggregation (love 2.0, save 1.5, like 1.0, view 0.3, skip -0.5), communityPicks with explanations
- **Trait Explainability (20%)**: 8-axis trait algebra for human-readable "why" explanations only
- **Scoring Methods**: `embedding` (vector-only), `hybrid` (vector+CF+traits), `trait_fallback` (no embeddings)
- **fallbackReason**: `missing_user_embedding`, `missing_item_embedding`, `missing_both_embeddings`, `invalid_embedding_dim`
- Geolocation-aware event scoring with Haversine distance + privacy radius (TAMU coords: 30.6187, -96.3365)
- User taste embeddings recomputed synchronously on every interaction and onboarding (deterministic, not fire-and-forget)
- Startup warning logged if any items/events/hobbies missing embeddings

### Urgency Scoring
- Events include urgencyScore (0-100), urgencyLabel, and deadline fields
- Computed from signupDeadline, duesDeadline, and dateTime
- Labels: "last chance" (24h), "closing soon" (48h), "this week" (72h), "upcoming" (7d), "next week" (14d), "plenty of time"

### Event Scoring (Events Tab)
- **finalScore** = 0.45 * personaScore + 0.30 * socialScore + 0.25 * urgencyScore
- **personaScore**: Embedding cosine similarity between user taste profile and event embedding
- **socialScore**: (avgSimilarity * 0.5 + friendBonus + attendeeBonus), capped at 100, min 15
- **urgencyScore**: Time-based urgency (100 for <24h, descending)
- Events include mutualFriendsGoingCount, mutualFriendsPreview (top 3), attendeePreview, whyRecommended
- "Mutuals" are attendees with >65% embedding match to the current user
- whyRecommended combines friends going + persona alignment + urgency + deal status

### Event Categories
- `parties` - Nightlife, bars, social gatherings (pink badges)
- `deals` - Food deals, student discounts, BOGO offers (emerald badges)
- `campus` - Campus events, tailgates, watch parties, pop-ups (blue badges)
- `study` - Study groups, exam prep, academic meetups (amber badges)
- `shows` - Concerts, open mics, vinyl markets, live music (purple badges)
- `misc` - Farmers markets, festivals, charity runs, art walks (teal badges)

### Event Data Model (New Fields)
- `dealExpiresAt` (timestamp) - When a deal/promo expires
- `priceInfo` (text) - Human-readable price/deal details
- `isDeal` (boolean) - Whether event has a deal/promotion
- `organizerName` (text) - Event organizer name (separate from clubName)

### Taste Engine (Explainability Layer)
- Trait-based similarity scoring across 8 axes: novelty, intensity, cozy, strategy, social, creativity, nostalgia, adventure
- Tag-to-trait mapping for building user profiles from preferences
- Distance-based RMS scoring for realistic match distribution (green 75+, yellow 50-74, red <50)
- Explainable matching with "why you match" insights
- Cluster generation (Engineering Leader, Creative Builder, Service Leader, etc.)

### Key Components
- `RadarChart` - SVG radar visualization of taste traits
- `MatchPill` - Color-coded match score badge (green/yellow/red)
- `BottomNav` - Fixed bottom navigation with 5 tabs
- `hobby-images.ts` - Mapping of hobby names to stock images
- `club-images.ts` - Mapping of club imageUrl keys to imported images
- `event-images.ts` - Mapping of event imageUrl keys to imported images
- `item-images.ts` - Mapping of item imageUrl keys to imported images

### Stock Images
- 16 hobby images stored in `client/src/assets/images/`
- Profile cover image at `client/src/assets/images/profile-cover.jpg`
- Theme images at `client/src/assets/images/theme-*.png`
- Imported via `@/assets/images/` alias
- Used in explore page hobby cards, profile personal images, and reels sections

### Database Tables
- `users` - Auth users (managed by Replit Auth) + locationLat/locationLng/privacyRadiusKm + gradYear/classStanding/mainClubItemId/instagramUrl/phoneNumber
- `sessions` - Session storage (managed by Replit Auth)
- `taste_profiles` - User taste DNA with 8 trait axes + clusters + embedding vector(384) + onboardingComplete flag
- `items` - Campus clubs across 5 domains with trait values + embedding vector(384) + meeting details + signup/instagram URLs + dues info + location coords
- `interactions` - User interactions with items (like/love/skip/save/view) with weight values
- `matches` - Cached match computations
- `hobbies` - Campus hobby entries with trait values + embedding vector(384)
- `events` - Lifestyle events with trait values + embedding vector(384) + locationLat/locationLng + dealExpiresAt/priceInfo/isDeal/organizerName + categories: parties/deals/campus/study/shows/misc
- `event_rsvps` - RSVP records linking users to events
- `friendships` - Bidirectional friend relationships between users

### Key Backend Files
- `server/hybrid-engine.ts` - Embeddings-first scoring: vector sim + CF + traits (explainability only)
- `server/collaborative-filtering.ts` - Embedding-based neighbor CF with weighted action aggregation
- `server/embeddings.ts` - Local @xenova/transformers embeddings (all-MiniLM-L6-v2, 384-dim), recomputeTasteEmbedding (synchronous), checkEmbeddingHealth
- `server/taste-engine.ts` - 8-axis trait algebra (explainability layer only)
- `server/seed.ts` - 50 TAMU campus clubs + 24 events + 16 hobbies + 10 seed users with embedding pipeline
- `server/routes.ts` - Express API routes (30+ endpoints) including debug/health, demo/reset, friends, profile, and admin/backfill endpoints
- `server/storage.ts` - DatabaseStorage class implementing IStorage interface for all CRUD operations
- `server/db.ts` - PostgreSQL pool and Drizzle ORM instance
- `server/index.ts` - Express app setup, middleware, server startup

### Key Frontend Files
- `client/src/App.tsx` - Root app with auth flow, header with Persona dropdown menu (About, Retake Quiz, Log Out), theme toggle
- `client/src/pages/onboarding.tsx` - Two-phase onboarding: intro/instructions screen then 6 Best-Worst Block questions
- `client/src/pages/profile.tsx` - Full-screen themed profile (own + other user) with glassy sections
- `client/src/pages/recommendations.tsx` - Club recommendations across 5 domains with urgency scoring
- `client/src/pages/explore.tsx` - Leaflet map with heat map overlay, marker spreading, event/club popups
- `client/src/pages/events.tsx` - Event discovery with persona+social+urgency scoring
- `client/src/pages/social.tsx` - Friends list + Discover tab with swipeable friend suggestions
- `client/src/pages/landing.tsx` - Landing page for unauthenticated users
- `client/src/pages/about.tsx` - About/How It Works page

### Seed Data
- 50 campus clubs: 10 per domain (academic, professional, social, sports, volunteering)
- 24 lifestyle events (parties, deals, study groups, concerts, campus events, misc) within 48h rolling window
- 16 campus-specific hobbies (intramural sports, hackathon building, tailgating, etc.)
- 10 seed users with diverse profiles, interactions, and RSVPs: Colin, Andy, Devon, Maya, Sophia, Marcus, Jake, Ravi, Emma, Lily
- Demo user profile: Tech Innovator / Hackathon Builder / Research Explorer

## User Preferences
- Dark mode by default
- Green accent color scheme (primary: hsl(142, 76%, 36%))
- Mobile-first bottom navigation design
- Modular/customizable profile layout

## Recent Changes
- Fixed nested `<a>` tag bug in social.tsx FriendListCard (caused React DOM warnings about `<a>` inside `<a>`). Changed outer `<Link>` to `div` with onClick navigation.
- Also fixed Instagram URL to use actual friend.instagramUrl instead of hardcoded URL.
