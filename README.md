# Briefly

> **Your day. Your news. One brief.**

Briefly is an AI-powered personalized news and audio briefing platform that turns a large stream of daily news into a concise experience users can **discover, read, save, and listen to**.

It combines a production-oriented web application with a modular FastAPI backend, an NLP pipeline, a **self-hosted DeepSeek model**, automated summarization, Named Entity Recognition, text-to-speech, Cloudflare R2 audio storage, Supabase persistence/authentication, client-side caching, and a persistent Spotify-style audio player.

---

## Table of Contents

- [Overview](#overview)
- [Core Workflow](#core-workflow)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [NLP Pipeline](#nlp-pipeline)
- [AI Infrastructure](#ai-infrastructure)
- [News Ingestion](#news-ingestion)
- [Summarization](#summarization)
- [Audio Pipeline](#audio-pipeline)
- [Database and Persistence](#database-and-persistence)
- [Authentication and Security](#authentication-and-security)
- [Admin Panel](#admin-panel)
- [Caching and Performance](#caching-and-performance)
- [Web Application](#web-application)
- [Routes](#routes)
- [Backend Architecture](#backend-architecture)
- [Health and Monitoring](#health-and-monitoring)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Testing and QA](#testing-and-qa)
- [Project Structure](#project-structure)
- [NLP / Academic Relevance](#nlp--academic-relevance)
- [Business Model](#business-model)
- [Design Philosophy](#design-philosophy)
- [Privacy](#privacy)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

# Overview

Briefly solves a simple problem:

**There is too much news to consume every day.**

Instead of opening many news websites, reading long articles, and manually deciding what matters, Briefly processes news through an NLP/LLM pipeline and presents important stories as concise, personalized summaries and audio briefings.

The product has two primary experiences:

### Reading

Users can:

- browse daily stories
- explore topics
- read summaries
- save stories
- revisit recent content
- discover stories based on interests

### Listening

Users can:

- play the daily briefing
- listen to available story audio
- continue listening while navigating the application
- use a persistent audio player
- move through a briefing queue
- track playback progress

---

# Core Workflow

```text
News API
   |
   v
Ingestion
   |
   v
Normalization + Deduplication
   |
   v
NLP Preprocessing
   |
   +--> Sentence Segmentation
   |
   +--> Named Entity Recognition
   |
   v
Story Selection
   |
   v
Self-Hosted DeepSeek
   |
   v
Structured Summaries
   |
   v
Daily Briefing
   |
   v
Fish Audio S2.1
   |
   v
MP3 Audio
   |
   v
Cloudflare R2
   |
   v
Supabase Metadata
   |
   v
Briefly Web App
```

---

# Features

## Personalized Home

The authenticated home page is an editorial, content-first experience containing:

- Today's Briefing
- Continue Listening
- Today's Top Stories
- For You
- Explore Topics
- Recently Played
- Saved Stories

Content comes from the actual backend and user preferences rather than static mock data.

## Daily Briefing

The daily briefing combines multiple relevant stories into a concise reading/listening experience.

It supports:

- multiple stories
- story ordering
- summaries
- categories
- source information
- audio
- briefing metadata
- idempotent generation states

## Explore

Users can discover stories through topics such as:

- Technology
- Business
- Markets
- Science
- World
- Startups
- AI
- Climate
- Sports
- Culture

## Saved Stories

Users can save stories for later.

Saved state is persisted for the authenticated user and survives navigation and refresh.

## Recent Activity

The application keeps relevant reading/listening activity so users can return to content they recently consumed.

## Persistent Audio Player

The audio experience follows a streaming-app interaction model.

Desktop:

- fixed bottom player

Mobile:

- mini-player above bottom navigation

Audio continues while moving between:

```text
Home
Explore
Library
Recent
Saved
Settings
```

## Light and Dark Mode

The application supports:

- Light
- Dark
- system-aware behavior where configured

Themes use centralized semantic tokens.

## Responsive UI

The application is designed for mobile, tablet and desktop widths rather than simply shrinking one desktop layout.

---

# Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Web UI | React | Application UI |
| Cross-platform foundation | Expo | Web/mobile application foundation |
| Web compatibility | React Native Web | Cross-platform rendering |
| Routing | Expo Router | Navigation/routing |
| Backend | Python | API/NLP services |
| API | FastAPI | REST backend |
| Validation | Pydantic | Structured validation |
| NLP | spaCy | Preprocessing + NER |
| LLM | DeepSeek | Summarization/generation |
| LLM hosting | Self-hosted infrastructure | Model inference |
| News | News API integration | News ingestion |
| TTS | Fish Audio S2.1 | Audio generation |
| Database | Supabase PostgreSQL | Persistent data |
| Auth | Supabase Auth | Authentication |
| Object storage | Cloudflare R2 | Audio storage |
| R2 SDK | boto3 | S3-compatible storage access |
| Testing | pytest | Backend testing |
| Web hosting | Vercel | Frontend deployment |
| API hosting | Render | Backend deployment |
| DNS | Cloudflare | Domain management |

---

# Architecture

```text
                         ┌──────────────────────┐
                         │     Briefly Web      │
                         │ React / Expo Web     │
                         └──────────┬───────────┘
                                    |
                                    v
                         ┌──────────────────────┐
                         │      FastAPI API     │
                         └──────────┬───────────┘
                                    |
              ┌─────────────────────┼─────────────────────┐
              |                     |                     |
              v                     v                     v
       ┌─────────────┐      ┌──────────────┐      ┌─────────────┐
       │  Supabase   │      │   News API   │      │  DeepSeek   │
       │ PostgreSQL  │      │   Provider   │      │ Self-hosted │
       └─────────────┘      └──────────────┘      └──────┬──────┘
                                                          |
                                                          v
                                                   ┌─────────────┐
                                                   │ Summarizer  │
                                                   └──────┬──────┘
                                                          |
                                                          v
                                                   ┌─────────────┐
                                                   │ Fish Audio  │
                                                   └──────┬──────┘
                                                          |
                                                          v
                                                   ┌─────────────┐
                                                   │ Cloudflare  │
                                                   │     R2      │
                                                   └─────────────┘
```

The backend is intentionally modular so providers can be replaced without rewriting business logic.

---

# NLP Pipeline

Briefly is an actual NLP pipeline, not only an LLM API wrapper.

## 1. Text Cleaning

Input articles are normalized through processing such as:

- URL cleanup
- Unicode normalization
- whitespace normalization
- text cleanup
- sentence segmentation

## 2. Sentence Segmentation

Article text is split into meaningful sentences before downstream processing.

## 3. Named Entity Recognition

spaCy is used for Named Entity Recognition.

Relevant entity types include:

```text
PERSON
ORG
GPE
MONEY
```

This helps preserve important people, organizations, locations and financial information.

## 4. Entity Retention

The pipeline can compare important entities before and after summarization to evaluate information retention.

## 5. Compression Ratio

The system can calculate:

```text
Compression Ratio =
Summary Length / Original Length
```

This gives a measurable indication of summarization compression.

## 6. Structured LLM Output

LLM responses are validated using structured schemas before being used by the rest of the application.

This helps prevent:

- malformed responses
- missing fields
- unexpected formats
- downstream parsing failures

---

# AI Infrastructure

## Self-Hosted DeepSeek

Briefly uses a **DeepSeek model hosted on our own infrastructure** for the core language-generation/summarization workflow.

The model is not directly exposed to the browser.

Conceptually:

```text
Briefly Backend
      |
      v
LLM Provider Layer
      |
      v
Self-Hosted DeepSeek
      |
      v
Structured Output
      |
      v
Pydantic Validation
      |
      v
Briefing / Summary
```

The model endpoint and model identifier are configurable through environment variables.

This architecture provides control over:

- model deployment
- inference infrastructure
- data flow
- model configuration
- provider independence
- future model upgrades

---

# News Ingestion

The backend uses a News API provider through an abstraction layer.

The ingestion service:

1. fetches articles
2. normalizes fields
3. cleans content
4. generates content fingerprints
5. deduplicates articles
6. runs NLP processing
7. prepares articles for summarization

A SHA-256 fingerprint can be used to identify duplicate normalized content.

```text
Article
   |
   v
Normalize
   |
   v
Fingerprint
   |
   v
Duplicate?
  / YES  NO
 |    |
Skip Process
```

---

# Summarization

Selected articles are passed to the self-hosted DeepSeek model.

The summarization service is responsible for:

- concise summaries
- structured output
- entity preservation
- validation
- compression metrics
- preparation of briefing content

Business logic is kept separate from the HTTP API layer so it can be tested independently.

---

# Audio Pipeline

Briefly uses **Fish Audio S2.1** for text-to-speech.

```text
Briefing Script
      |
      v
Fish Audio S2.1
      |
      v
Audio File
      |
      v
Cloudflare R2
      |
      v
Signed/controlled access
      |
      v
Global Web Audio Player
```

The frontend must never receive Fish Audio credentials.

The application also explicitly handles missing audio URLs. It must never render an audio element with an empty `src`.

---

# Cloudflare R2

Cloudflare R2 is used for persistent audio/object storage.

The bucket should remain private.

A recommended flow is:

```text
Database
   |
   | R2 object key
   v
Backend
   |
   | Generate signed URL
   v
Frontend
   |
   v
Audio Player
```

Temporary signed URLs must not be treated as permanent database values.

---

# Database and Persistence

Supabase PostgreSQL is used for relational persistence.

The database can contain data relating to:

### Users

- authenticated users
- profile/preferences

### Content

- articles
- stories
- summaries
- categories
- briefings

### Personalization

- user interests
- saved stories
- recent activity
- listening progress

### Processing

- briefing state
- audio metadata
- storage references

The repository migrations/schema are the authoritative source for exact table names and columns.

---

# Authentication and Security

Supabase Auth handles authentication.

Protected application routes include:

```text
/app
/app/explore
/app/library
/app/recent
/app/saved
/app/settings
```

User-specific data must be associated with the authenticated user.

Row Level Security should protect user-owned database records.

## Never expose these to the browser

```text
SUPABASE_SERVICE_ROLE_KEY
NEWS_API_KEY
LLM_API_KEY
FISH_AUDIO_API_KEY
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
INTERNAL_API_SECRET
```

Private credentials belong only on trusted backend/infrastructure environments.

---

# Admin Panel

Briefly includes a production-grade Admin Panel located at `/admin`.
This panel provides secure, server-side verified access to:
- **System Monitoring**: Dashboard metrics for users, active sessions, audio generations, and more.
- **User Management**: View, search, and manage all users.
- **Access Control**: Super administrators can securely **ban**, **unban**, or **suspend** users from the platform.
- **Audit Logs**: Immutable tracking of all administrative actions.
- **System Errors**: Real-time error monitoring.

Admin access is determined by the `role` attribute in the user's `raw_user_meta_data`. Valid roles are `admin` and `super_admin`.

**For full setup, architecture, and deployment instructions regarding the Admin Panel, please refer to the dedicated [ADMIN.md](./ADMIN.md) file.**

---

# Caching and Performance

Briefly avoids unnecessary repeated API requests.

Content such as:

- Top Stories
- For You
- Explore results
- briefing data

can use client-side caching with appropriate freshness/revalidation.

Conceptually:

```text
Request
  |
  v
Cache exists?
  |
 YES --------------------> Show cached data
  |
  NO
  |
  v
API request
  |
  v
Store in cache
  |
  v
Render
```

For stale data:

```text
Cached data
   |
   v
Show immediately
   |
   v
Background revalidation
```

User-owned persistent data is not treated as disposable cache.

```text
Client cache
→ news/API responses

Supabase
→ saved stories, interests, history, preferences

R2
→ audio files
```

Audio progress should not cause the entire React application to rerender on every time update.

---

# Web Application

The UI is designed as a premium editorial product.

The design language emphasizes:

- strong typography
- left-aligned hierarchy
- restrained colors
- subtle motion
- meaningful whitespace
- content-first layouts
- audio-first interactions
- responsive behavior

The interface intentionally avoids:

- neon colors
- excessive gradients
- glassmorphism
- huge shadows
- excessive pills
- excessive rounded cards
- unnecessary animations
- generic SaaS dashboards
- fake metrics
- fake production data

---

# Application Routes

## Public

The current project may include public routes such as:

```text
/
/features
/pricing
/about
/privacy-policy
/terms-of-service
```

The exact public route set should follow the repository.

## Authenticated

```text
/app
/app/explore
/app/library
/app/recent
/app/saved
/app/settings
```

All authenticated routes share the same application shell.

---

# Application Shell

Desktop layout:

```text
┌───────────────┬───────────────────────────────────────┐
│   BRIEFLY     │                                       │
│               │       Scrollable Content              │
│   Home        │                                       │
│   Explore     │                                       │
│   Library     │                                       │
│   Recent      │                                       │
│   Saved       │                                       │
│               │                                       │
│               │                                       │
│   Settings    │                                       │
│   User        │                                       │
├───────────────┴───────────────────────────────────────┤
│                 GLOBAL AUDIO PLAYER                   │
└───────────────────────────────────────────────────────┘
```

The desktop sidebar is fixed to the viewport.

The main content scrolls independently.

On mobile, the desktop sidebar is replaced by mobile navigation.

---

# Audio Player

The global player tracks:

- current track
- queue
- playing/paused state
- current time
- duration
- volume
- loading state
- error state

It persists across navigation.

### Desktop

Fixed bottom player.

### Mobile

Mini-player above bottom navigation with an expanded full-player experience.

When a story finishes, the next queued item can play automatically where the briefing queue supports it.

---

# Backend Architecture

The backend follows a modular FastAPI structure.

Conceptually:

```text
backend/
├── api/
├── providers/
│   ├── news/
│   ├── llm/
│   ├── fish_audio/
│   └── r2/
├── services/
│   ├── ingestion/
│   ├── summarization/
│   ├── audio/
│   └── daily_briefing/
├── nlp/
│   ├── cleaning/
│   ├── segmentation/
│   └── ner/
├── core/
│   └── supabase/
├── models/
└── tests/
```

The exact directory names should follow the actual repository.

---

# Services

## IngestionService

Responsible for:

- news retrieval
- normalization
- deduplication
- NLP preparation

## SummarizationService

Responsible for:

- model interaction
- structured summaries
- validation
- compression/entity metrics

## AudioService

Responsible for:

- TTS
- audio processing
- R2 upload
- audio metadata

## DailyBriefingService

Responsible for:

- briefing orchestration
- story ordering
- processing state
- idempotency
- final readiness

---

# Briefing State Machine

The daily briefing workflow uses explicit states such as:

```text
PENDING
   |
   v
PROCESSING
   |
   +------> FAILED
   |
   v
READY
```

This makes generation idempotent and allows failed operations to be retried safely.

---

# Health and Monitoring

The backend includes health endpoints such as:

```text
GET /health
GET /api/v1/health/ready
GET /api/v1/health/dashboard
POST /api/v1/health/test-all
```

They are intended to provide:

- liveness
- readiness
- dependency diagnostics
- human-readable health information

Diagnostic endpoints must be protected appropriately in production.

Dependencies that can be checked include:

- Supabase
- News API
- self-hosted DeepSeek
- Fish Audio
- Cloudflare R2

---

# Environment Variables

Backend variables may include:

```env
NEWS_API_KEY=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

LLM_BASE_URL=
LLM_API_KEY=
LLM_MODEL=

FISH_AUDIO_API_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

INTERNAL_API_SECRET=
```

The exact names used by the repository are authoritative.

For self-hosted DeepSeek:

```env
LLM_BASE_URL=
LLM_MODEL=
LLM_API_KEY=
```

should point to the configured inference service.

Frontend variables must contain only values that are safe to expose to browsers.

Never commit real credentials.

---

# Local Development

## Prerequisites

Install:

- Node.js
- npm/pnpm/yarn as required by the repository
- Python
- Git
- Python virtual environment tooling

Required service access:

- Supabase
- News API
- self-hosted DeepSeek
- Fish Audio
- Cloudflare R2

## Frontend

Install dependencies:

```bash
npm install
```

Run the project's configured web development command.

The current workflow may use:

```bash
npm run web
```

Always verify the actual scripts in `package.json`.

## Backend

Create a virtual environment:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scriptsctivate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install backend dependencies using the repository's dependency file and run FastAPI using the configured application entry point.

---

# Production Deployment

The intended production architecture is:

```text
Cloudflare
    |
    +--> briefly.devdope.tech
             |
             v
           Vercel
             |
             v
       Briefly Web App

api.briefly.devdope.tech
             |
             v
           Render
             |
       ┌─────┼─────┐
       v     v     v
   Supabase DeepSeek R2
                 |
             Fish Audio
```

---

# Vercel Deployment

The web application is intended to run on Vercel.

Production URL:

```text
https://briefly.devdope.tech
```

Deployment steps:

1. Use the new Vercel account.
2. Import the repository.
3. Detect/use the actual project framework.
4. Configure the correct root directory.
5. Configure the correct build command.
6. Add production environment variables.
7. Deploy.
8. Add `briefly.devdope.tech`.
9. Configure the DNS record shown by Vercel in Cloudflare.
10. Verify HTTPS and routing.
11. Run production QA.

Old Vercel project IDs, URLs and account associations should not be reused when moving to the new account.

---

# Cloudflare DNS

Cloudflare manages the `devdope.tech` zone.

The intended relationship is:

```text
devdope.tech
    |
    +-- briefly.devdope.tech
                |
                v
              Vercel
```

The exact DNS record and target must be taken from the Vercel custom-domain screen.

Do not guess the target.

Do not modify unrelated DevDope DNS records.

---

# Render Backend

The FastAPI backend is intended to be hosted on Render.

Production API:

```text
https://api.briefly.devdope.tech
```

Persistent data must remain in:

- Supabase
- Cloudflare R2

Do not rely on the Render local filesystem for permanent data.

Production CORS must allow the actual Briefly frontend origin.

---

# Supabase Setup

Supabase provides:

- PostgreSQL
- Auth
- database persistence
- user data
- application metadata
- RLS

Production authentication redirects should include:

```text
https://briefly.devdope.tech
```

and any exact callback paths required by the authentication implementation.

---

# Cloudflare R2 Setup

R2 is used for generated audio.

Recommended production configuration:

```text
Private bucket
S3-compatible API
Backend-only credentials
Signed client access
```

Audio object references belong in the database.

Temporary signed URLs should be generated as required.

---

# Testing and QA

## Backend

Use the project's configured test suite, including `pytest` where available.

Test:

- provider behavior
- service logic
- NLP
- idempotency
- error handling
- mocked external services

## Frontend

Test:

- authentication
- routing
- saved stories
- recent activity
- interests
- caching
- audio
- theme
- responsive layouts

## Browser

Check for:

- console errors
- React warnings
- audio errors
- failed requests
- 404/401/403/429/500 responses
- CORS errors
- localhost requests in production
- duplicate API requests

---

# Project Structure

The exact repository structure is authoritative, but the logical organization is:

```text
briefly/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── state/
│   ├── theme/
│   └── assets/
│
├── backend/
│   ├── api/
│   ├── providers/
│   ├── services/
│   ├── nlp/
│   ├── core/
│   ├── models/
│   └── tests/
│
├── database/
│   └── migrations/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# NLP / Academic Relevance

Briefly demonstrates practical NLP concepts including:

- text preprocessing
- sentence segmentation
- Named Entity Recognition
- abstractive summarization
- LLM-based language generation
- structured model output
- information compression
- entity retention
- evaluation
- model auditing
- real-world inference infrastructure

The project connects NLP concepts to a complete product pipeline:

```text
Raw Language
     |
     v
Preprocessing
     |
     v
NLP Representation
     |
     v
LLM
     |
     v
Generated Language
     |
     v
Audio
     |
     v
Human-facing Product
```

---

# Business Model

The project's planned pricing model is:

| Plan | Price |
|---|---:|
| Free | ₹0/month |
| Plus | ₹149/month or ₹999/year |
| Pro | ₹299/month |
| Teams | ₹199/user/month |

These are product/business-model figures and do not imply that payment processing is currently live.

## Illustrative Unit Economics

```text
Price              ₹149
Variable Cost       ₹35
Contribution       ₹114
Contribution Margin 76.5%
```

These are illustrative assumptions for the project.

## Illustrative KPIs

```text
DAU                  8,420
MAU                 31,280
Audio Completion       68%
Free → Premium         7.4%
MRR                 ₹1.86L
```

These are illustrative business-model/project figures unless connected to verified production analytics.

---

# Design Philosophy

Briefly intentionally uses:

- editorial hierarchy
- strong typography
- left-aligned layouts
- restrained colors
- subtle motion
- clear controls
- responsive content
- content-first cards
- audio-first interactions

Briefly avoids:

- neon
- excessive gradients
- glassmorphism
- giant shadows
- excessive pills
- excessive rounded cards
- unnecessary animation
- generic SaaS dashboard styling
- fake data
- fake production metrics

The authenticated product is visually aligned with the public landing page so the experience feels like one product.

---

# Privacy

Briefly separates:

### Public content

News and story information intended for users.

### User data

- interests
- saved stories
- recent activity
- listening progress
- account/profile data

### Private infrastructure

- API credentials
- model infrastructure
- R2 credentials
- service-role credentials
- internal secrets

Private infrastructure credentials must remain server-side.

User-specific records should be protected by authentication and database access controls.

---

# Failure Handling

The application is designed to handle external-service failures without silently pretending operations succeeded.

Examples:

### News API failure

Use available cached data where appropriate or return a clear error.

### DeepSeek failure

Briefing processing should fail safely and expose a valid processing/error state.

### Fish Audio failure

Text content can remain available depending on the current workflow.

### R2 failure

Audio storage should fail without corrupting unrelated database state.

### Supabase failure

The application should show a meaningful error instead of falsely reporting successful persistence.

---

# Performance Principles

Briefly follows these principles:

- cache reusable news data
- deduplicate requests
- avoid unnecessary global rerenders
- isolate audio state
- optimize images/media
- lazy-load where useful
- keep persistent data in durable services
- avoid storing sensitive data in browser storage
- use background revalidation for stale news

---

# Future Roadmap

Potential future work includes:

- stronger personalization
- semantic news clustering
- multilingual summaries
- multilingual TTS
- improved recommendation models
- source-quality analysis
- configurable briefing length
- advanced audio controls
- native mobile widgets
- push notifications
- scheduled daily briefings
- recommendation feedback loops
- factuality evaluation
- automated bias audits
- model comparison experiments
- additional self-hosted models
- model fine-tuning/adapters
- advanced analytics
- organization/team functionality
- production billing

---

# Development Principles

Briefly follows:

### Separation of concerns

Frontend, API, NLP, providers, storage and database logic remain separate.

### Provider abstraction

External integrations are isolated behind provider layers where appropriate.

### Validation

External and LLM-generated data is validated before use.

### Security boundaries

Private credentials stay on trusted infrastructure.

### Persistent data vs cache

User-owned data is not treated as temporary cache.

### Idempotency

Briefing generation can be safely retried.

### Graceful degradation

Failure of one dependency should not unnecessarily break unrelated functionality.

---

# Credits

Briefly combines:

- Natural Language Processing
- Large Language Models
- self-hosted AI infrastructure
- backend engineering
- cloud infrastructure
- database engineering
- text-to-speech
- audio storage
- responsive web development
- product design

Major technologies/services:

- React
- Expo
- React Native Web
- Expo Router
- Python
- FastAPI
- spaCy
- DeepSeek
- Fish Audio S2.1
- Supabase
- PostgreSQL
- Cloudflare R2
- Cloudflare DNS
- Vercel
- Render
- News API
- Pydantic
- pytest
- boto3

---

# License

Add the project's actual license here before public release.

For example:

```text
MIT License
```

should only be used if an MIT `LICENSE` file has actually been added.

---

# Final Product Summary

Briefly brings together:

```text
✓ News ingestion
✓ Text preprocessing
✓ Sentence segmentation
✓ Named Entity Recognition
✓ LLM summarization
✓ Self-hosted DeepSeek inference
✓ Structured model output
✓ Daily briefing generation
✓ Text-to-speech
✓ Cloudflare R2 audio storage
✓ Personalized interests
✓ Saved stories
✓ Recent activity
✓ Listening progress
✓ Persistent audio player
✓ Explore experience
✓ Responsive web application
✓ Light mode
✓ Dark mode
✓ Supabase authentication
✓ PostgreSQL persistence
✓ Client-side caching
✓ FastAPI backend
✓ Production-oriented security
✓ Vercel deployment
✓ Render deployment
✓ Cloudflare DNS
```

> **Briefly's goal is simple: reduce the time it takes to understand what matters today.**
