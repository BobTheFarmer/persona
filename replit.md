# Persona

## Overview
Persona is an AI-powered campus clubs discovery platform for TAMU. It builds a "Persona DNA" for every student across five domains: academic, professional, social, sports, and volunteering. The platform uses local transformer embeddings to match students to clubs, recommend clubs, and discover club events, all with explainable reasoning. Its main purpose is to enhance student engagement and community building on campus by providing personalized recommendations.

## User Preferences
- Dark mode by default
- Green accent color scheme (primary: hsl(142, 76%, 36%))
- Mobile-first bottom navigation design
- Modular/customizable profile layout

## System Architecture
The application features a mobile-first UI with a bottom navigation bar. Core pages include a personalized profile, club recommendations across five campus domains, an interactive map for events and clubs, event discovery with social and urgency scoring, and social matching.

The system utilizes an Embeddings-First Hybrid AI/ML Engine, where local neural embeddings (all-MiniLM-L6-v2) drive ranking, supplemented by collaborative filtering based on user interactions and an 8-axis trait algebra for explainable "why" insights. User taste embeddings are recomputed synchronously on every interaction. Event scoring incorporates persona, social, and urgency factors, with events categorized for easy discovery. The profile page is customizable, featuring themed backgrounds, avatar, class/year badges, and sections for top traits, main club, event history, Persona DNA radar, gallery, and mutual connections.

The backend is built with Node.js/Express, providing a comprehensive set of API endpoints for user authentication, taste profile management, onboarding, recommendations, social interactions, event RSVPs, and profile data retrieval. The data model includes users, taste profiles, clubs (items), interactions, hobbies, events, event RSVPs, and friendships, all leveraging PostgreSQL with the pgvector extension for efficient vector similarity search.

Key components include a `RadarChart` for visualizing taste traits, `MatchPill` for score badges, `BottomNav` for primary navigation, and various image mappings for consistent UI.

## External Dependencies
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, wouter (routing)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM and pgvector extension
- **AI/ML**: @xenova/transformers (local all-MiniLM-L6-v2 for embeddings)
- **Authentication**: Replit Auth (OpenID Connect)
- **Mapping**: Leaflet, CartoDB (dark tiles)