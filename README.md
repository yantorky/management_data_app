# Management Data Architect

> Enterprise-grade data management platform engineered for architecture firms  
> Combines industrial-strength backend infrastructure with intuitive professional-grade interfaces

---

## 🏗️ Vision

**Management Data Architect** is a purpose-built data management system for architecture firms, designed to handle complex project lifecycles—from proposal phase through completion. Built on proven enterprise technologies with security and scalability as core principles.

The platform intelligently manages project hierarchies, enforces ISO 19650 compliance standards, and provides role-based access control suitable for multi-disciplinary architectural teams.

---

## 🎯 Core Features

### Authentication & Authorization Layer
- **Multi-tier Admin Architecture** — Root administrator with token-based session management
- **JWT Token Infrastructure** — Secure stateless authentication with 24-hour expiration
- **Password Security** — bcrypt hashing with 12 salt rounds, meeting OWASP standards
- **Session Management** — Redis-backed session store with automatic cleanup

### Project Management Engine
- **Dual Project Classification**
  - **Current Projects** — Active engagements with real-time progress tracking
  - **Potential Projects** — Prospect opportunities with proposal management
- **ISO 19650-1 Compliance** — Automated folder structure generation matching architectural standards
- **Hierarchical Organization** — Multi-level project classification and metadata

### Enterprise Infrastructure
- **Multi-Platform Deployment** — Web (React), Desktop (Electron), Mobile (React Native)
- **Responsive Architecture** — Seamless experience across all screen sizes
- **Real-time Synchronization** — Live updates across connected clients
- **Data Persistence** — PostgreSQL with comprehensive backup strategies

---

## 🏛️ Technical Architecture

### Backend Infrastructure

```
┌─────────────────────────────────────────────┐
│         GraphQL API Layer                   │
│  (Request Validation & Type Safety)         │
├─────────────────────────────────────────────┤
│         Express.js Application              │
│  (Middleware Pipeline & Routing)            │
├─────────────────────────────────────────────┤
│     Service Layer (Business Logic)          │
│  (Project, Auth, Folder Management)         │
├─────────────────────────────────────────────┤
│         Data Access Layer (DAL)             │
│  (ORM Models & Query Optimization)          │
├─────────────────────────────────────────────┤
│  PostgreSQL + Redis Cache Layer             │
│  (Persistence & Performance)                │
└─────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│        React Component Tree              │
│    (UI State & Rendering Logic)          │
├─────────────────────────────────────────┤
│      TanStack Query + Zustand            │
│    (Server & Client State Mgmt)          │
├─────────────────────────────────────────┤
│      GraphQL Apollo Client               │
│    (API Communication Layer)             │
├─────────────────────────────────────────┤
│        Tailwind CSS + Radix UI           │
│    (Styling & Component Primitives)      │
├─────────────────────────────────────────┤
│      TypeScript Type System              │
│    (Runtime Type Safety)                 │
└─────────────────────────────────────────┘
```

---

## 📦 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Database** | PostgreSQL 14+ | ACID compliance, JSON support, enterprise reliability |
| **Cache** | Redis 7+ | Sub-millisecond response times, session management |
| **Backend** | Node.js 18+ LTS | Non-blocking I/O, large ecosystem, proven at scale |
| **API** | GraphQL with Apollo | Type-safe queries, precise data fetching, superior DX |
| **Frontend** | React 18 + TypeScript | Component reusability, type safety, large community |
| **State Mgmt** | TanStack Query + Zustand | Separation of concerns, caching, minimal boilerplate |
| **Styling** | Tailwind CSS | Utility-first, consistent design system, minimal CSS bloat |
| **Desktop** | Electron | Cross-platform binary distribution |
| **Mobile** | React Native | Code sharing with web, native performance |
| **Build Tools** | Vite + esbuild | Lightning-fast HMR, optimized production bundles |
| **Testing** | Jest + React Testing Library | Comprehensive coverage, accessible component testing |
| **Code Quality** | ESLint + Prettier | Consistent formatting, error prevention |

---

## 📂 Project Structure

```
management_data_app/
│
├── packages/
│   ├── backend/                    # Node.js Express + GraphQL Server
│   │   ├── src/
│   │   │   ├── config/             # Database, environment, constants
│   │   │   ├── graphql/
│   │   │   │   ├── schema/         # Type definitions
│   │   │   │   ├── resolvers/      # Query/Mutation handlers
│   │   │   │   └── middleware/     # Auth, validation
│   │   │   ├── models/             # TypeORM/Sequelize models
│   │   │   ├── services/           # Business logic layer
│   │   │   │   ├── AuthService.ts
│   │   │   │   ├── ProjectService.ts
│   │   │   │   ├── FolderService.ts
│   │   │   │   └── FileService.ts
│   │   │   ├── middleware/         # Express middleware
│   │   │   ├── utils/              # Helpers & utilities
│   │   │   ├── types/              # TypeScript interfaces
│   │   │   └── server.ts           # Entry point
│   │   ├── migrations/             # Database migrations
│   │   ├── tests/                  # Unit & integration tests
│   │   ├── .env.example
│   │   ├── .env.local.example
│   │   ├── docker-compose.yml
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                        # React SPA Application
│   │   ├── src/
│   │   │   ├── pages/              # Route components
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── ProjectsPage.tsx
│   │   │   │   └── ProjectDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── auth/           # Auth-related components
│   │   │   │   ├── dashboard/      # Dashboard widgets
│   │   │   │   ├── projects/       # Project management UI
│   │   │   │   ├── common/         # Reusable components
│   │   │   │   └── layout/         # Layout components
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useProjects.ts
│   │   │   │   └── useProject.ts
│   │   │   ├── services/           # API client services
│   │   │   │   ├── graphql/
│   │   │   │   │   ├── queries.ts
│   │   │   │   │   └── mutations.ts
│   │   │   │   └── api.ts
│   │   │   ├── store/              # Global state
│   │   │   │   ├── authStore.ts
│   │   │   │   └── projectStore.ts
│   │   │   ├── styles/             # Global styles
│   │   │   ├── types/              # Shared types
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── desktop/                    # Electron Application
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── main/               # Main process
│   │   │   ├── preload/            # Preload scripts
│   │   │   └── renderer/           # Renderer process (shares web code)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mobile/                     # React Native Application
│   │   ├── app/
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                     # Monorepo Shared Packages
│       ├── src/
│       │   ├── types/              # Shared TypeScript interfaces
│       │   ├── constants/          # App-wide constants
│       │   ├── utils/              # Shared utilities
│       │   ├── hooks/              # Shared React hooks
│       │   └── validators/         # Input validation schemas
│       ├── package.json
│       └── tsconfig.json
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # Continuous Integration
│   │   ├── cd.yml                  # Continuous Deployment
│   │   └── security.yml            # Security checks
│   └── CODEOWNERS
│
├── docs/
│   ├── ARCHITECTURE.md             # System design overview
│   ├── DATABASE.md                 # Schema & migrations
│   ├── API.md                      # GraphQL documentation
│   ├── DEPLOYMENT.md               # Production deployment
│   ├── SECURITY.md                 # Security practices
│   └── TROUBLESHOOTING.md          # Common issues
│
├── .env.example
├── .gitignore
├── .editorconfig
├── .prettierrc.json
├── .eslintrc.json
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### System Requirements

```
Node.js     ≥ 18.0.0
npm/pnpm    ≥ 9.0.0 / ≥ 8.0.0
PostgreSQL  ≥ 14.0
Redis       ≥ 7.0
Git         ≥ 2.30.0
```

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yantorky/management_data_app.git
cd management_data_app
pnpm install
```

#### 2. Database Configuration
```bash
# Copy environment template
cp packages/backend/.env.example packages/backend/.env

# Edit credentials
nano packages/backend/.env
```

**Example `.env` configuration:**
```env
# Database
DATABASE_URL=postgresql://admin:secure_password@localhost:5432/management_data_app
REDIS_URL=redis://localhost:6379/0

# Application
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173

# Security
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12

# File Storage
STORAGE_PATH=./storage/projects
```

#### 3. Database Setup
```bash
cd packages/backend

# Run migrations
pnpm run db:migrate

# Seed initial data (creates root admin account)
pnpm run db:seed
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd packages/backend
pnpm run dev
# Server starts at http://localhost:4000
# GraphQL Playground: http://localhost:4000/graphql
```

**Terminal 2 - Frontend:**
```bash
cd packages/web
pnpm run dev
# Application starts at http://localhost:5173
```

#### 5. Initial Admin Setup

Access `http://localhost:5173/setup` and complete:
1. Root admin credentials creation
2. ISO folder structure configuration
3. Project type definitions

---

## 🔐 Security Architecture

### Authentication Flow
```
User Login
    ↓
[Credentials Validation]
    ↓
[bcrypt Password Verification]
    ↓
[JWT Token Generation]
    ↓
[Redis Session Store]
    ↓
[Client Storage (HTTP-Only Cookie)]
    ↓
[Authenticated Requests with Bearer Token]
```

### Data Protection
- **Encryption at Rest** — Sensitive fields encrypted with AES-256
- **Encryption in Transit** — TLS 1.3 for all communications
- **Password Security** — OWASP standards with bcrypt hashing
- **CORS Configuration** — Strict origin policies
- **Rate Limiting** — 100 requests/minute per IP address
- **SQL Injection Prevention** — Parameterized queries via ORM

### Database Constraints
```sql
-- Row-level security
CREATE POLICY project_isolation ON projects
  FOR SELECT USING (owner_id = current_user_id);

-- Audit logging
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR NOT NULL,
  entity_id INTEGER NOT NULL,
  action VARCHAR NOT NULL,
  actor_id INTEGER NOT NULL,
  changes JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 ISO 19650 Compliance

The system automatically enforces ISO 19650-1:2018 (Information management using Building Information Modelling) folder structure:

### Standard Folder Hierarchy
```
Project_Name/
├── 00_Admin/
│   ├── Contracts
│   ├── Correspondence
│   └── Meetings
├── 10_General/
│   ├── Client Info
│   ├── Site Information
│   └── Project Brief
├── 20_Design/
│   ├── Concept
│   ├── Scheme Design
│   └── Design Development
├── 30_Technical/
│   ├── Specifications
│   ├── Details
│   └── Calculations
├── 40_Tender/
│   ├── Tender Documents
│   ├── Quotations
│   └── Award Letters
├── 50_Construction/
│   ├── Construction Drawings
│   ├── Site Information
│   └── RFIs & CIs
├── 60_As-Built/
│   ├── As-Built Drawings
│   ├── Commissioning
│   └── Handover Docs
└── 70_Operation/
    ├── Manuals
    ├── Maintenance Plans
    └── Warranties
```

---

## 🧪 Testing Strategy

### Test Pyramid
```
    /\
   /E2E\           ← End-to-end tests (5%)
  /------\
 /Integration\     ← Integration tests (15%)
/----------\
/Unit Tests\      ← Unit tests (80%)
/----------\
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
- Overall: ≥ 80%
- Critical paths: ≥ 90%
- Statements: ≥ 85%

---

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting** — Route-based lazy loading
- **Bundle Analysis** — Target < 200KB gzipped
- **Image Optimization** — WebP with fallbacks
- **Caching Strategy** — Service Worker integration

### Backend Optimization
- **Database Indexing** — Strategic indexes on frequently queried fields
- **Query Optimization** — N+1 query prevention via DataLoader
- **Caching Layer** — Redis for session & frequently accessed data
- **Connection Pooling** — PostgreSQL connection management

### Monitoring & Metrics
```
Target Metrics:
├── Time to First Byte (TTFB): < 200ms
├── First Contentful Paint (FCP): < 1s
├── Largest Contentful Paint (LCP): < 2.5s
├── Cumulative Layout Shift (CLS): < 0.1
├── API Response Time: < 500ms
├── Database Query Time: < 100ms
└── Cache Hit Ratio: > 85%
```

---

## 🔄 Development Workflow

### Git Branching Strategy (Git Flow)

```
main (production-ready)
  ↓
release/v1.x.x (release candidates)
  ↓
develop (integration branch)
  ↓
feature/* (feature branches)
fix/*     (bugfix branches)
hotfix/*  (emergency patches)
```

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Code style (formatting)
- `refactor` — Code refactoring
- `perf` — Performance improvements
- `test` — Test additions/modifications
- `chore` — Build/dependency updates

**Example:**
```
feat(auth): implement JWT token refresh mechanism

- Add refresh token generation on login
- Implement token rotation strategy
- Add refresh endpoint to GraphQL API
- Add automatic token refresh on 401 response

Closes #42
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/admin-dashboard
   ```

2. **Make Changes with Atomic Commits**
   ```bash
   git commit -m "feat(dashboard): add project metrics widget"
   ```

3. **Ensure Code Quality**
   ```bash
   pnpm run lint
   pnpm run type-check
   pnpm run test
   ```

4. **Push & Create PR**
   ```bash
   git push origin feature/admin-dashboard
   ```

5. **PR Checklist**
   - [ ] All tests passing
   - [ ] Code coverage maintained
   - [ ] Documentation updated
   - [ ] No console.log in production code
   - [ ] TypeScript strict mode compliant

---

## 📚 API Documentation

### GraphQL Schema Overview

**Authentication**
```graphql
type Mutation {
  login(email: String!, password: String!): AuthPayload!
  logout: Boolean!
  refreshToken: AuthPayload!
}

type AuthPayload {
  token: String!
  refreshToken: String!
  user: User!
}
```

**Project Management**
```graphql
type Query {
  projects(type: ProjectType!, limit: Int, offset: Int): [Project!]!
  project(id: ID!): Project
}

type Mutation {
  createProject(input: CreateProjectInput!): Project!
  updateProject(id: ID!, input: UpdateProjectInput!): Project!
  deleteProject(id: ID!): Boolean!
}

enum ProjectType {
  CURRENT
  POTENTIAL
}
```

**Folder Management**
```graphql
type Query {
  projectFolders(projectId: ID!): [Folder!]!
}

type Mutation {
  initializeProjectStructure(projectId: ID!): Project!
  createCustomFolder(projectId: ID!, path: String!): Folder!
}
```

Full API documentation: See `docs/API.md`

---

## 🛠️ Building for Production

### Web Application
```bash
cd packages/web
pnpm run build
pnpm run preview  # Test production build locally
```

Output: `dist/` directory (ready for deployment)

### Desktop Application
```bash
cd packages/desktop
pnpm run build
# Generates:
# - windows/management-data-app.exe
# - macos/management-data-app.dmg
# - linux/management-data-app.AppImage
```

### Docker Deployment
```bash
# Build Docker image
docker build -t management-data-app:1.0.0 .

# Run container
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  management-data-app:1.0.0
```

---

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Redis cluster operational
- [ ] SSL certificates valid
- [ ] CORS policies configured
- [ ] Rate limiting active
- [ ] Monitoring/logging enabled
- [ ] Backup procedures verified
- [ ] Disaster recovery tested
- [ ] Security scan passed

---

## 🔍 Monitoring & Logging

### Application Logs
```
INFO  | 2026-06-27T10:30:45Z | Server listening on port 4000
DEBUG | 2026-06-27T10:30:46Z | Database connection established
INFO  | 2026-06-27T10:30:47Z | Admin user logged in: admin@example.com
ERROR | 2026-06-27T10:31:00Z | Failed to create project: duplicate name
```

### Metrics Collection
- Request latency distribution
- Error rates by endpoint
- Database query performance
- Cache hit ratios
- User session duration

---

## 🤝 Contributing

See `CONTRIBUTING.md` for detailed guidelines on:
- Code standards
- Commit conventions
- PR process
- Testing requirements
- Documentation expectations

---

## 📄 License

Copyright © 2026 Yan Torky. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, or redistribution is strictly prohibited.

---

## 📞 Support

**Developer:** Yan Torky  
**Email:** contact@yantorky.dev  
**GitHub:** [@yantorky](https://github.com/yantorky)  
**Repository:** [management_data_app](https://github.com/yantorky/management_data_app)

---

<p align="center">
  <strong>Engineered with precision. Built for architects. Designed to scale.</strong>
</p>

<p align="center">
  <a href="https://github.com/yantorky/management_data_app">GitHub Repository</a> •
  <a href="./docs/ARCHITECTURE.md">Architecture Guide</a> •
  <a href="./docs/API.md">API Documentation</a>
</p>
