<div align="center">

![Management Data Architect](https://img.shields.io/badge/Management%20Data%20Architect-v1.0.0-blue?style=for-the-badge&logo=github)

# 🏗️ Management Data Architect

> **Enterprise-Grade Data Management Platform for Architecture Firms**
>
> Seamlessly manage project lifecycles with ISO 19650 compliance, role-based access control, and professional-grade multi-platform interfaces.

[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react)](https://reactjs.org)
[![GraphQL](https://img.shields.io/badge/GraphQL-API-e535ab?style=flat-square&logo=graphql)](https://graphql.org)

---

</div>

## 📋 Table of Contents

- [Vision](#-vision)
- [Key Features](#-key-features)
- [Tech Stack](#-technology-stack)
- [Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Security](#-security-architecture)
- [ISO Compliance](#-iso-19650-compliance)
- [Development](#-development-workflow)
- [Contributing](#-contributing)
- [Support](#-support)

---

## 🎯 Vision

**Management Data Architect** is purpose-built data management infrastructure for architecture firms. We combine industrial-strength backend technology with intuitive professional interfaces to handle complex project lifecycles—from initial proposal through final handover.

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│     Data Management That Grows With Your Practice       │
├─────────────────────────────────────────────────────────┤
│ ✓ Multi-disciplinary team collaboration                │
│ ✓ ISO 19650 compliance built-in                        │
│ ✓ Enterprise-grade security & scalability              │
│ ✓ Cross-platform access (Web, Desktop, Mobile)         │
│ ✓ Real-time synchronization & notifications            │
└─────────────────────────────────────────────────────────┘
```

</div>

---

## ✨ Key Features

### 🔐 Authentication & Authorization

```
┌──────────────────────────────────────────┐
│   ROOT ADMIN AUTHENTICATION SYSTEM       │
├──────────────────────────────────────────┤
│ • Multi-tier role-based access control   │
│ • JWT token-based sessions (24h expiry)  │
│ • bcrypt password hashing (12 rounds)    │
│ • Redis-backed session management        │
│ • Audit logging for compliance           │
└──────────────────────────────────────────┘
```

### 📊 Project Management

```
┌──────────────────────────────────────────┐
│    INTELLIGENT PROJECT CLASSIFICATION    │
├──────────────────────────────────────────┤
│ ▶ CURRENT PROJECTS                       │
│   └─ Active engagements with tracking    │
│                                          │
│ ▶ POTENTIAL PROJECTS                     │
│   └─ Prospects & proposal management     │
│                                          │
│ ▶ HIERARCHICAL METADATA                  │
│   └─ Multi-level organization            │
└──────────────────────────────────────────┘
```

### 🏗️ ISO 19650 Folder Structure

```
┌──────────────────────────────────────────┐
│  AUTOMATED FOLDER HIERARCHY CREATION     │
├──────────────────────────────────────────┤
│ ✓ Auto-generates ISO-compliant structure │
│ ✓ Enforces naming conventions            │
│ ✓ Customizable templates per project     │
│ ✓ Validation & constraint checks         │
│ ✓ Audit trail for all changes            │
└──────────────────────────────────────────┘
```

### 💻 Multi-Platform Deployment

<div align="center">

| Platform | Technology | Features |
|----------|-----------|----------|
| **Web** | React 18 + TypeScript | Responsive SPA, real-time updates |
| **Desktop** | Electron | Cross-platform binaries (Win/Mac/Linux) |
| **Mobile** | React Native | Native performance (iOS & Android) |
| **Backend** | Node.js + Express | GraphQL API, 24/7 availability |

</div>

---

## 📦 Technology Stack

### Backend Infrastructure

```
┌─────────────────────────────────────────────────────────┐
│                    BACKEND LAYERS                       │
├─────────────────────────────────────────────────────────┤
│  ┌────��───────────────────────────────────────────────┐ │
│  │ GraphQL API (Apollo)                               │ │
│  │ ✓ Type-safe queries  ✓ Precise data fetching       │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Express.js Application Server                      │ │
│  │ ✓ Middleware pipeline  ✓ Request handling          │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Service Layer (Business Logic)                     │ │
│  │ ✓ Auth  ✓ Projects  ✓ Folders  ✓ Files           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Data Access Layer (TypeORM)                        │ │
│  │ ✓ Query optimization  ✓ Relationships             │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ PostgreSQL + Redis                                 │ │
│  │ ✓ ACID transactions  ✓ Session caching             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYERS                      │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐ │
│  │ React Components (TypeScript)                      │ │
│  │ ✓ Reusable  ✓ Type-safe  ✓ Optimized rendering   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ State Management (Zustand + TanStack Query)        │ │
│  │ ✓ Client state  ✓ Server cache  ✓ Synchronization │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ GraphQL Client (Apollo)                            │ │
│  │ ✓ API calls  ✓ Caching  ✓ Error handling          │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Styling (Tailwind CSS + Radix UI)                  │ │
│  │ ✓ Utility-first  ✓ Accessible  ✓ Customizable     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Technology Comparison Table

<div align="center">

| Layer | Technology | Why We Chose It |
|-------|-----------|-----------------|
| **Database** | PostgreSQL 14+ | ⭐⭐⭐⭐⭐ ACID, JSON, Enterprise-grade |
| **Cache** | Redis 7+ | ⭐⭐⭐⭐⭐ Sub-ms latency, Session mgmt |
| **Backend** | Node.js 18 LTS | ⭐⭐⭐⭐⭐ Non-blocking I/O, Scalable |
| **API** | GraphQL | ⭐⭐⭐⭐⭐ Type-safe, Precise queries |
| **Frontend** | React 18 | ⭐⭐⭐⭐⭐ Components, Large ecosystem |
| **State** | Zustand + TanStack | ⭐⭐⭐⭐⭐ Minimal, Composable |
| **Styling** | Tailwind CSS | ⭐⭐⭐⭐⭐ Utility-first, Consistent |
| **Desktop** | Electron | ⭐⭐⭐⭐⭐ Cross-platform distribution |
| **Mobile** | React Native | ⭐⭐⭐⭐⭐ Code sharing, Native perf |
| **Build** | Vite + esbuild | ⭐⭐⭐⭐⭐ Lightning-fast, Optimized |
| **Testing** | Jest + RTL | ⭐⭐⭐⭐⭐ Comprehensive, Accessible |
| **Quality** | ESLint + Prettier | ⭐⭐⭐⭐⭐ Consistent, Automated |

</div>

---

## 🏛️ System Architecture

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
├──────────┬──────────────────┬────────────────────────────┤
│          │                  │                            │
│   WEB    │    DESKTOP       │      MOBILE                │
│ (React)  │   (Electron)     │  (React Native)            │
│          │                  │                            │
└──────────┴──────────────────┴────────────────────────────┘
              │
              │ HTTP/HTTPS + GraphQL
              │
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY                           │
│  (Rate Limiting, Auth, Request Validation)              │
└─────────────────────────────────────────────────────────┘
              │
┌─────────────────────────────────────────────────────────┐
│              APPLICATION SERVER                         │
│              (Express + GraphQL)                         │
├─────────────────────────────────────────────────────────┤
│ • Auth Service       • Project Service                  │
│ • Folder Service     • File Service                     │
│ • Audit Service      • Notification Service             │
└─────────────────────────────────────────────────────────┘
              │
     ┌────────┴────────┐
     │                 │
┌────▼────┐      ┌────▼────┐
│PostgreSQL│      │  Redis  │
│(Primary) │      │(Cache)  │
└──────────┘      └─────────┘
```

### Data Flow Diagram

```
USER ACTION
    │
    ▼
┌──────────────────┐
│ React Component  │
│ (Event Handler)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ GraphQL Mutation/    │
│ Query Request        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Express Middleware   │
│ (Auth, Validation)   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ GraphQL Resolver     │
│ (Business Logic)     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Service Layer        │
│ (Core Logic)         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Database Layer       │
│ (TypeORM)            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ PostgreSQL / Redis   │
│ (Data Storage)       │
└──────────────────────┘
```

---

## 📂 Project Structure

```
management_data_app/                    ← Root workspace
│
├── 📦 packages/                        ← Monorepo packages
│   │
│   ├── 🔧 backend/                    ← Express + GraphQL Server
│   │   ├── src/
│   │   │   ├── config/                # Environment & DB config
│   │   │   ├── graphql/               # Schema & Resolvers
│   │   │   │   ├── schema/
│   │   │   │   ├── resolvers/
│   │   │   │   └── middleware/
│   │   │   ├── models/                # TypeORM Models
│   │   │   ├── services/              # Business Logic
│   │   │   │   ├── AuthService.ts
│   │   │   │   ├── ProjectService.ts
│   │   │   │   ├── FolderService.ts
│   │   │   │   └── FileService.ts
│   │   │   ├── middleware/            # Express Middleware
│   │   │   ├── utils/                 # Helpers
│   │   │   ├── types/                 # TypeScript Interfaces
│   │   │   └── server.ts              # Entry Point
│   │   ├── migrations/                # DB Migrations
│   │   ├── tests/                     # Test Suite
│   │   ├── .env.example
│   │   ├── docker-compose.yml
│   │   └── package.json
│   │
│   ├── 🎨 web/                        ← React Web Application
│   │   ├── src/
│   │   │   ├── pages/                 # Route Pages
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── ProjectsPage.tsx
│   │   │   │   └── SetupPage.tsx
│   │   │   ├── components/            # React Components
│   │   │   │   ├── auth/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── projects/
│   │   │   │   ├── common/
│   │   │   │   └── layout/
│   │   │   ├── hooks/                 # Custom Hooks
│   │   │   ├── services/              # API Client
│   │   │   ├── store/                 # Zustand Stores
│   │   │   ├── styles/                # Global Styles
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── 🖥️ desktop/                    ← Electron Application
│   │   ├── src/
│   │   │   ├── main/                  # Main Process
│   │   │   ├── preload/               # Preload Scripts
│   │   │   └── renderer/              # Renderer Process
│   │   └── package.json
│   │
│   ├── 📱 mobile/                     ← React Native App
│   │   ├── app/
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── 🔗 shared/                     ← Shared Packages
│       ├── src/
│       │   ├── types/                 # Shared Types
│       │   ├── constants/             # Constants
│       │   ├── utils/                 # Utilities
│       │   └── validators/            # Validators
│       └── package.json
│
├── 📚 docs/                           ← Documentation
│   ├── ARCHITECTURE.md                # System Design
│   ├── DATABASE.md                    # DB Schema
│   ├── API.md                         # GraphQL API
│   ├── DEPLOYMENT.md                  # Deployment Guide
│   ├── SECURITY.md                    # Security Practices
│   └── TROUBLESHOOTING.md             # Common Issues
│
├── ⚙️ .github/
│   ├── workflows/
│   │   ├── ci.yml                     # CI Pipeline
│   │   ├── cd.yml                     # CD Pipeline
│   │   └── security.yml               # Security Checks
│   └── CODEOWNERS
│
├── 🔧 Configuration Files
│   ├── .editorconfig                  # Editor Config
│   ├── .prettierrc.json               # Prettier Config
│   ├── .eslintrc.json                 # ESLint Config
│   ├── .gitignore                     # Git Ignore
│   ├── tsconfig.base.json             # TypeScript Config
│   ├── docker-compose.yml             # Docker Compose
│   ├── pnpm-workspace.yaml            # Monorepo Config
│   └── package.json                   # Root Package
│
├── 📋 Documentation
│   ├── README.md                      ← You are here
│   ├── CONTRIBUTING.md                # Contribution Guide
│   ├── LICENSE                        # License
│   └── .env.example                   # Environment Template
```

---

## 🚀 Quick Start

### Prerequisites

<div align="center">

```
✓ Node.js ≥ 18.0.0
✓ npm/pnpm ≥ 9.0.0
✓ PostgreSQL ≥ 14.0
✓ Redis ≥ 7.0
✓ Git ≥ 2.30.0
```

</div>

### Installation (5 minutes)

**Step 1: Clone Repository**
```bash
git clone https://github.com/yantorky/management_data_app.git
cd management_data_app
pnpm install
```

**Step 2: Configure Database**
```bash
cd packages/backend
cp .env.example .env
# Edit .env with your database credentials
```

**Step 3: Initialize Database**
```bash
pnpm run db:migrate
pnpm run db:seed
```

**Step 4: Start Development Servers**

Terminal 1 - Backend:
```bash
cd packages/backend
pnpm run dev
# → GraphQL: http://localhost:4000/graphql
```

Terminal 2 - Frontend:
```bash
cd packages/web
pnpm run dev
# → Web: http://localhost:5173
```

### First Login

```
Email:    admin@management-data.local
Password: (from seed output)
```

---

## 🔐 Security Architecture

### Authentication Flow

```
LOGIN REQUEST
     │
     ▼
┌─────────────────────────┐
│ Credential Validation   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ bcrypt Password Verify  │
│ (12 salt rounds)        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ JWT Token Generation    │
│ (24-hour expiry)        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Redis Session Store     │
│ (Distributed cache)     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ HTTP-Only Cookie        │
│ (Client storage)        │
└─────────────────────────┘
```

### Security Features Checklist

- ✅ **Encryption at Rest** — AES-256 for sensitive data
- ✅ **Encryption in Transit** — TLS 1.3 for all connections
- ✅ **Password Security** — OWASP bcrypt standards
- ✅ **CORS** — Strict origin policies
- ✅ **Rate Limiting** — 100 req/min per IP
- ✅ **SQL Injection** — Parameterized queries via ORM
- ✅ **XSS Protection** — Input sanitization & CSP headers
- ✅ **CSRF** — Token-based protection
- ✅ **Audit Logging** — Complete action trail
- ✅ **Session Management** — Redis-backed, auto-cleanup

---

## 📊 ISO 19650 Compliance

### Standard Folder Structure

<div align="center">

```
PROJECT/
│
├─ 00_ADMIN/                    Admin & Contracts
│  ├─ Contracts
│  ├─ Correspondence
│  └─ Meetings
│
├─ 10_GENERAL/                  General Info
│  ├─ Client Information
│  ├─ Site Survey
│  └─ Project Brief
│
├─ 20_DESIGN/                   Design Documentation
│  ├─ Concept Design
│  ├─ Scheme Design
│  └─ Design Development
│
├─ 30_TECHNICAL/                Technical Specs
│  ├─ Specifications
│  ├─ Technical Details
│  └─ Calculations
│
├─ 40_TENDER/                   Tender Documents
│  ├─ Tender Pack
│  ├─ Quotations
│  └─ Award Letters
│
├─ 50_CONSTRUCTION/             Construction Info
│  ├─ Construction Drawings
│  ├─ Site Notices
│  └─ Requests for Information
│
├─ 60_AS-BUILT/                 As-Built Docs
│  ├─ As-Built Drawings
│  ├─ Commissioning
│  └─ Handover Documents
│
└─ 70_OPERATION/                Operation Docs
   ├─ Operation Manuals
   ├─ Maintenance Plans
   └─ Warranties
```

</div>

---

## 🧪 Testing

### Test Coverage Strategy

```
     ╱╲         End-to-End Tests (5%)
    ╱──╲        → User workflows, integration
   ╱────╲       
  ╱──────╲      Integration Tests (15%)
 ╱────────╲     → API endpoints, database
╱──────────╲    
Unit Tests (80%)
→ Functions, components, utilities
```

### Running Tests

```bash
# Unit tests
pnpm run test

# With coverage report
pnpm run test:coverage

# Watch mode (development)
pnpm run test:watch

# Integration tests
pnpm run test:integration

# E2E tests (Playwright)
pnpm run test:e2e
```

### Coverage Targets

```
├─ Overall Coverage:      ≥ 80%
├─ Critical Paths:        ≥ 90%
├─ Statements:            ≥ 85%
├─ Branches:              ≥ 80%
├─ Functions:             ≥ 80%
└─ Lines:                 ≥ 85%
```

---

## 📈 Performance Metrics

### Target Performance

<div align="center">

| Metric | Target | Status |
|--------|--------|--------|
| Time to First Byte (TTFB) | < 200ms | ⚡ |
| First Contentful Paint (FCP) | < 1s | ⚡ |
| Largest Contentful Paint (LCP) | < 2.5s | ⚡ |
| API Response Time | < 500ms | ⚡ |
| Database Query Time | < 100ms | ⚡ |
| Cache Hit Ratio | > 85% | ⚡ |

</div>

### Optimization Strategies

**Frontend:**
- Code splitting & lazy loading
- Image optimization (WebP)
- Service Worker caching
- Bundle < 200KB gzipped

**Backend:**
- Database indexing
- Query optimization (DataLoader)
- Redis caching layer
- Connection pooling

---

## 🔄 Development Workflow

### Git Flow Strategy

```
main (production)
  ↑
  │─ hotfix/* (emergency patches)
  │
release/v1.x.x (release candidates)
  │
develop (integration)
  │
  ├─ feature/* (new features)
  ├─ fix/* (bug fixes)
  └─ chore/* (maintenance)
```

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore`

**Example:**
```
feat(auth): implement JWT token refresh

- Add refresh token generation
- Implement token rotation
- Add GraphQL refresh endpoint
- Add automatic token refresh on 401

Closes #42
```

---

## 🤝 Contributing

### Code Standards

- ✅ **TypeScript Strict Mode** — Full type safety
- ✅ **ESLint + Prettier** — Automated formatting
- ✅ **80%+ Test Coverage** — Comprehensive testing
- ✅ **JSDoc Comments** — Self-documenting code
- ✅ **No console.log** — Production-ready

### Pull Request Checklist

- [ ] All tests passing
- [ ] Coverage maintained (≥ 80%)
- [ ] Documentation updated
- [ ] No console.log in production
- [ ] TypeScript strict mode compliant
- [ ] Commit messages follow convention

See `CONTRIBUTING.md` for detailed guidelines.

---

## 📚 Documentation

- 📖 [Architecture Guide](./docs/ARCHITECTURE.md) — System design & patterns
- 🗄️ [Database Schema](./docs/DATABASE.md) — PostgreSQL structure
- 📡 [GraphQL API](./docs/API.md) — Complete API documentation
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md) — Production setup
- 🔒 [Security Guide](./docs/SECURITY.md) — Security best practices
- 🆘 [Troubleshooting](./docs/TROUBLESHOOTING.md) — Common issues

---

## 📊 API Quick Reference

### Authentication

```graphql
mutation login {
  login(email: "admin@example.com", password: "secure") {
    token
    refreshToken
    user { id email role }
  }
}
```

### Projects

```graphql
query {
  projects(type: CURRENT, limit: 10) {
    id name type status createdAt
  }
}

mutation {
  createProject(input: {
    name: "Museum Project"
    type: CURRENT
    client: "City Council"
  }) {
    id folderStructure { path status }
  }
}
```

---

## 🛠️ Production Deployment

### Docker Deployment

```bash
docker build -t management-data-app:1.0.0 .
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  management-data-app:1.0.0
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Redis operational
- [ ] SSL certificates valid
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Monitoring enabled
- [ ] Backups verified
- [ ] Security scan passed

---

## 📞 Support

<div align="center">

**Developer:** Yan Torky  
**Email:** contact@yantorky.dev  
**GitHub:** [@yantorky](https://github.com/yantorky)  
**Repository:** [management_data_app](https://github.com/yantorky/management_data_app)

---

### 📄 License

Copyright © 2026 Yan Torky. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, or redistribution is strictly prohibited.

---

<div align="center">

### ⭐ Show Your Support

If this project is helpful, please consider giving it a star!

[![Star on GitHub](https://img.shields.io/github/stars/yantorky/management_data_app?style=social)](https://github.com/yantorky/management_data_app)

</div>

---

<div align="center">

**Engineered with precision. Built for architects. Designed to scale.**

*Professional architecture data management starts here.*

</div>
