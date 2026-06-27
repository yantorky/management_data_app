# Contributing Guidelines

**Management Data Architect** welcomes contributions from developers and architects who want to improve the platform. This document outlines standards and procedures for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Commit Conventions](#commit-conventions)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Pledge
- Be respectful and professional in all interactions
- Welcome diverse perspectives and experiences
- Focus on constructive feedback
- Report unacceptable behavior to maintainers

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js        ≥ 18.0.0
npm/pnpm       ≥ 9.0.0 / ≥ 8.0.0
PostgreSQL     ≥ 14.0
Redis          ≥ 7.0
Git            ≥ 2.30.0
```

### Fork & Clone

```bash
# 1. Fork repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/management_data_app.git
cd management_data_app

# 3. Add upstream remote
git remote add upstream https://github.com/yantorky/management_data_app.git

# 4. Keep your fork updated
git fetch upstream
git rebase upstream/develop
```

---

## 💻 Development Setup

### Windows Setup

#### 1. Install Dependencies

**PowerShell (as Administrator):**
```powershell
# Install Node.js LTS
winget install OpenJS.NodeJS.LTS

# Install PostgreSQL
winget install PostgreSQL.PostgreSQL

# Install Redis
# Download from: https://github.com/microsoftarchive/redis/releases

# Install Git
winget install Git.Git

# Install pnpm
npm install -g pnpm@latest
```

**Or using Chocolatey:**
```powershell
choco install nodejs postgresql redis git -y
npm install -g pnpm@latest
```

#### 2. Configure PostgreSQL

```powershell
# Start PostgreSQL
net start postgresql-x64-14

# Connect to PostgreSQL
psql -U postgres

# Create development database
CREATE DATABASE management_data_app_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password_123';
ALTER ROLE dev_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE management_data_app_dev TO dev_user;
\q
```

#### 3. Configure Redis

```powershell
# Start Redis (if installed as service)
net start Redis

# Or run Redis Server manually
redis-server
```

#### 4. Setup Project

```powershell
# Clone and install
git clone https://github.com/yantorky/management_data_app.git
cd management_data_app
pnpm install

# Configure backend
cd packages/backend
cp .env.example .env

# Edit .env with your credentials
notepad .env
```

**Example .env for Windows:**
```env
DATABASE_URL=postgresql://dev_user:dev_password_123@localhost:5432/management_data_app_dev
REDIS_URL=redis://localhost:6379/0
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_dev_secret_key_change_in_production
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12
STORAGE_PATH=./storage/projects
LOG_LEVEL=debug
```

#### 5. Run Development

```powershell
# Terminal 1 - Backend
cd packages/backend
pnpm run dev

# Terminal 2 - Frontend
cd packages/web
pnpm run dev

# Terminal 3 - Database migrations
cd packages/backend
pnpm run db:migrate
pnpm run db:seed
```

---

### macOS Setup

#### 1. Install Dependencies

**Using Homebrew:**
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node@18 postgresql redis git

# Install pnpm
npm install -g pnpm@latest
```

#### 2. Configure PostgreSQL

```bash
# Start PostgreSQL service
brew services start postgresql

# Connect and create database
psql postgres

# SQL commands:
CREATE DATABASE management_data_app_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password_123';
ALTER ROLE dev_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE management_data_app_dev TO dev_user;
\q
```

#### 3. Configure Redis

```bash
# Start Redis service
brew services start redis

# Verify Redis is running
redis-cli ping
# Expected output: PONG
```

#### 4. Setup Project

```bash
# Clone and install
git clone https://github.com/yantorky/management_data_app.git
cd management_data_app
pnpm install

# Configure backend
cd packages/backend
cp .env.example .env

# Edit .env
nano .env
```

**Example .env for macOS:**
```env
DATABASE_URL=postgresql://dev_user:dev_password_123@localhost:5432/management_data_app_dev
REDIS_URL=redis://localhost:6379/0
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_dev_secret_key_change_in_production
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12
STORAGE_PATH=./storage/projects
LOG_LEVEL=debug
```

#### 5. Run Development

```bash
# Terminal 1 - Backend
cd packages/backend
pnpm run dev

# Terminal 2 - Frontend
cd packages/web
pnpm run dev

# Terminal 3 - Database
cd packages/backend
pnpm run db:migrate
pnpm run db:seed
```

---

### Linux Setup (Ubuntu/Debian)

#### 1. Install Dependencies

```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Git
sudo apt install -y git

# Install pnpm
sudo npm install -g pnpm@latest
```

#### 2. Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE management_data_app_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password_123';
ALTER ROLE dev_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE management_data_app_dev TO dev_user;
\q
```

#### 3. Configure Redis

```bash
# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping
# Expected output: PONG
```

#### 4. Setup Project

```bash
# Clone and install
git clone https://github.com/yantorky/management_data_app.git
cd management_data_app
pnpm install

# Configure backend
cd packages/backend
cp .env.example .env

# Edit .env
nano .env
```

**Example .env for Linux:**
```env
DATABASE_URL=postgresql://dev_user:dev_password_123@localhost:5432/management_data_app_dev
REDIS_URL=redis://localhost:6379/0
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_dev_secret_key_change_in_production
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12
STORAGE_PATH=./storage/projects
LOG_LEVEL=debug
```

#### 5. Run Development

```bash
# Terminal 1 - Backend
cd packages/backend
pnpm run dev

# Terminal 2 - Frontend
cd packages/web
pnpm run dev

# Terminal 3 - Database
cd packages/backend
pnpm run db:migrate
pnpm run db:seed
```

---

### Docker Setup (All Platforms)

#### 1. Install Docker

- **Windows/macOS:** [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux:** `sudo apt install docker.io docker-compose`

#### 2. Start Development Environment

```bash
cd management_data_app

# Start all services (PostgreSQL, Redis)
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

#### 3. Setup Project

```bash
# Install dependencies
pnpm install

# Configure backend
cd packages/backend
cp .env.example .env
```

**Example .env for Docker:**
```env
DATABASE_URL=postgresql://admin:password123@postgres:5432/management_data_app_dev
REDIS_URL=redis://redis:6379/0
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_dev_secret_key_change_in_production
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12
STORAGE_PATH=./storage/projects
LOG_LEVEL=debug
```

#### 4. Run Development

```bash
# Terminal 1 - Backend
cd packages/backend
pnpm run dev

# Terminal 2 - Frontend
cd packages/web
pnpm run dev

# Terminal 3 - Database migrations
cd packages/backend
pnpm run db:migrate
pnpm run db:seed
```

#### 5. Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# View Docker stats
docker stats
```

---

## 📝 Code Standards

### TypeScript

```typescript
// ✅ GOOD - Explicit types
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

async function getUser(id: string): Promise<User | null> {
  const user = await db.users.findById(id);
  return user ?? null;
}

// ❌ BAD - Implicit any
function getUser(id) {
  return db.users.findById(id);
}
```

### React Components

```typescript
// ✅ GOOD - Typed component with JSDoc
interface ProjectCardProps {
  projectId: string;
  onSelect: (id: string) => void;
}

/**
 * ProjectCard - Displays a single project summary
 * @param projectId - ID of the project to display
 * @param onSelect - Callback when project is selected
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  projectId,
  onSelect,
}) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProject(projectId).then(setProject);
  }, [projectId]);

  return (
    <div className="p-4 border rounded-lg">
      <h3>{project?.name}</h3>
      <button onClick={() => onSelect(projectId)}>View Details</button>
    </div>
  );
};

// ❌ BAD - No types, unclear props
function ProjectCard({ projectId, onSelect }) {
  const [project, setProject] = useState();
  
  useEffect(() => {
    fetchProject(projectId).then(setProject);
  }, [projectId]);

  return <div onClick={() => onSelect(projectId)}>{project.name}</div>;
}
```

### Express Routes

```typescript
// ✅ GOOD - Typed middleware and handlers
interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

router.get(
  '/projects',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const projects = await ProjectService.getUserProjects(req.user.id);
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// ❌ BAD - No types, error handling unclear
router.get('/projects', authenticate, (req, res) => {
  ProjectService.getUserProjects(req.user.id)
    .then(projects => res.json(projects))
    .catch(error => res.send(error));
});
```

### File Naming Convention

```
// Components: PascalCase
components/
├── ProjectCard.tsx
├── UserProfile.tsx
└── DashboardLayout.tsx

// Utilities: camelCase
utils/
├── formatDate.ts
├── validateEmail.ts
└── calculateMetrics.ts

// Constants: UPPER_SNAKE_CASE
constants/
├── API_ENDPOINTS.ts
├── ERROR_MESSAGES.ts
└── ISO_FOLDERS.ts

// Folders: kebab-case
src/
├── api-client/
├── auth-service/
└── project-management/
```

### Code Comments

```typescript
// ✅ GOOD - Explains WHY, not WHAT
/**
 * Calculates project progress based on completed milestones
 * Uses weighted scoring to prioritize critical path items
 * @param projectId - The project identifier
 * @returns Progress percentage (0-100)
 */
function calculateProgress(projectId: string): number {
  // Critical milestones weighted at 2x to reflect importance
  const weightedScore = milestones
    .filter(m => m.projectId === projectId)
    .reduce((sum, m) => sum + (m.isCritical ? 2 : 1) * m.weight, 0);
  
  return Math.round(weightedScore / maxScore * 100);
}

// ❌ BAD - Comments just repeat code
function calculateProgress(projectId) {
  // Filter milestones by project ID
  const filtered = milestones.filter(m => m.projectId === projectId);
  
  // Map to scores
  const scores = filtered.map(m => m.weight);
  
  // Sum scores
  const total = scores.reduce((a, b) => a + b, 0);
  
  return total;
}
```

---

## 🔄 Git Workflow

### Creating a Feature Branch

```bash
# Update your local develop branch
git fetch upstream
git rebase upstream/develop

# Create feature branch
git checkout -b feature/admin-dashboard

# Make commits (follow conventions below)
git add .
git commit -m "feat(admin): add dashboard components"

# Push to your fork
git push origin feature/admin-dashboard
```

### Branch Naming Convention

```
feature/feature-name          # New features
fix/bug-name                   # Bug fixes
docs/documentation-name        # Documentation
refactor/component-name        # Refactoring
perf/optimization-name         # Performance improvements
test/test-name                 # Tests
chore/maintenance-name         # Maintenance tasks
```

---

## 📤 Pull Request Process

### 1. Before Creating PR

```bash
# Ensure branch is up to date
git fetch upstream
git rebase upstream/develop

# Run quality checks
pnpm run lint
pnpm run type-check
pnpm run test
pnpm run test:coverage

# Fix any issues
pnpm run format
```

### 2. Create Pull Request

**Use this template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Breaking change

## Motivation
Why these changes are needed

## Testing
How to test the changes

## Checklist
- [ ] Tests passing
- [ ] Coverage maintained (≥80%)
- [ ] Documentation updated
- [ ] No console.log in production
- [ ] TypeScript strict mode compliant
- [ ] Conventional commits used

## Screenshots (if applicable)
```

### 3. Code Review Process

- At least 1 approval required
- All tests must pass
- No merge conflicts
- Coverage not decreased

### 4. Merging

```bash
# Update your branch
git fetch upstream
git rebase upstream/develop

# Merge to develop
# (Maintainers will merge via GitHub UI)
git push origin feature/admin-dashboard
```

---

## 🧪 Testing Requirements

### Unit Tests

```typescript
// Example: auth.service.test.ts
import { AuthService } from './auth.service';
import { DatabaseMock } from '../../test/mocks';

describe('AuthService', () => {
  let service: AuthService;
  let db: DatabaseMock;

  beforeEach(() => {
    db = new DatabaseMock();
    service = new AuthService(db);
  });

  describe('login', () => {
    it('should return user and token on valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'secure_password';
      
      // Act
      const result = await service.login(email, password);
      
      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(email);
    });

    it('should throw error on invalid credentials', async () => {
      // Arrange
      const email = 'wrong@example.com';
      const password = 'wrong_password';
      
      // Act & Assert
      await expect(service.login(email, password))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
});
```

### Integration Tests

```typescript
// Example: auth.integration.test.ts
describe('Authentication Flow', () => {
  let app: Express.Application;
  let db: TestDatabase;

  beforeAll(async () => {
    db = await TestDatabase.connect();
    app = setupApp(db);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('should complete login flow end-to-end', async () => {
    // 1. User registers
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'secure_password',
        name: 'Test User',
      });

    expect(registerRes.status).toBe(201);
    const userId = registerRes.body.user.id;

    // 2. User logs in
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'newuser@example.com',
        password: 'secure_password',
      });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    // 3. User accesses protected resource
    const protectedRes = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedRes.status).toBe(200);
    expect(protectedRes.body).toHaveProperty('data');
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm run test

# Run specific test file
pnpm run test auth.service.test.ts

# Watch mode (auto-rerun on changes)
pnpm run test:watch

# Generate coverage report
pnpm run test:coverage

# Coverage report location
open coverage/index.html
```

### Coverage Targets

```
Line Coverage:       ≥ 85%
Branch Coverage:     ≥ 80%
Function Coverage:   ≥ 80%
Statement Coverage:  ≥ 85%
```

---

## 📚 Documentation

### Code Documentation

Use JSDoc for all public APIs:

```typescript
/**
 * Creates a new project with ISO-compliant folder structure
 * 
 * @param input - Project creation parameters
 * @param input.name - Project name (required, max 100 chars)
 * @param input.type - Project type: 'CURRENT' or 'POTENTIAL'
 * @param input.clientId - Associated client ID
 * 
 * @returns Promise resolving to created project
 * 
 * @throws {ValidationError} If input validation fails
 * @throws {DatabaseError} If database operation fails
 * 
 * @example
 * ```typescript
 * const project = await projectService.create({
 *   name: 'Museum Renovation',
 *   type: 'CURRENT',
 *   clientId: 'client-123',
 * });
 * ```
 */
async function createProject(input: CreateProjectInput): Promise<Project> {
  // Implementation
}
```

### README Updates

Update README.md if your changes:
- Add new features
- Change API endpoints
- Modify setup process
- Add new dependencies

### Changelog Entry

Add entry to `CHANGELOG.md`:

```markdown
## [Unreleased]

### Added
- New admin dashboard with project analytics
- Real-time folder structure validation

### Fixed
- Fixed JWT token refresh race condition
- Fixed incorrect ISO folder hierarchy validation

### Changed
- Updated PostgreSQL minimum version to 14.0
```

---

## 📌 Commit Conventions

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Code style (formatting, semicolons, etc.)
- `refactor` — Code refactoring
- `perf` — Performance improvements
- `test` — Test additions/modifications
- `chore` — Build/dependency updates
- `ci` — CI/CD configuration

### Scope

Component or module affected: `auth`, `projects`, `dashboard`, etc.

### Subject

- Use imperative mood ("add" not "adds")
- Don't capitalize first letter
- No period at end
- Max 50 characters

### Body

Explain WHAT and WHY, not HOW:

```
- Add multi-factor authentication for root admin
- Improve JWT token refresh to prevent race conditions
- Closes #142
```

### Footer

Reference issues:
```
Closes #142
Fixes #143
Related to #144
```

### Examples

**Good commits:**
```
feat(auth): implement JWT token refresh mechanism

Add automatic token refresh on 401 response
Implement token rotation strategy for security
Use exponential backoff for refresh retries

Closes #142

fix(projects): prevent duplicate project creation

Add unique constraint on project name per account
Add race condition prevention in service layer

Fixes #143

docs(setup): add Windows installation guide

Include PostgreSQL and Redis configuration steps
Add environment variable examples for Windows

Related to #144
```

**Bad commits:**
```
Fixed bugs                    # Vague, not imperative
auth stuff updated            # No type/scope
refactored the whole app      # Too broad
added feature                 # No scope
```

---

## 🔍 Code Review Guidelines

### What Reviewers Look For

- ✅ Code follows established patterns
- ✅ TypeScript strict mode compliant
- ✅ Tests included and passing
- ✅ Documentation updated
- ✅ No console.log in production
- ✅ No hardcoded secrets
- ✅ Performance considered
- ✅ Error handling implemented

### Providing Feedback

```
❌ BAD FEEDBACK
"This is wrong"
"Change this"

✅ GOOD FEEDBACK
"Consider using the utility function `formatDate()` 
from `utils/` instead of inline formatting 
to maintain consistency across the app."

"This could have race conditions if two requests 
happen simultaneously. Add a lock or make the 
operation atomic."
```

---

## 📞 Getting Help

- **Questions?** Open a discussion on GitHub
- **Found a bug?** Create an issue with details
- **Need guidance?** Ask in pull request comments
- **Have ideas?** Start a discussion

---

## ✅ Final Checklist

Before submitting PR:

- [ ] Branch created from `develop`
- [ ] Code follows TypeScript strict mode
- [ ] All tests pass: `pnpm run test`
- [ ] Coverage maintained: `pnpm run test:coverage`
- [ ] Linting passes: `pnpm run lint`
- [ ] Formatting applied: `pnpm run format`
- [ ] Type checking passes: `pnpm run type-check`
- [ ] No console.log in production code
- [ ] Commits follow convention
- [ ] PR description is clear
- [ ] Documentation updated
- [ ] No merge conflicts

---

**Thank you for contributing to Management Data Architect! 🚀**
