# Database Architecture & Schema

**Management Data Architect** - PostgreSQL Database Design

**Developer:** Yan Torky  
**Last Updated:** 2026-06-27  
**Database Version:** PostgreSQL 14+

---

## 📋 Table of Contents

- [Database Design Principles](#database-design-principles)
- [Schema Overview](#schema-overview)
- [Entity Relationships](#entity-relationships)
- [Table Specifications](#table-specifications)
- [Indexes & Performance](#indexes--performance)
- [Migration Strategy](#migration-strategy)
- [Backup & Recovery](#backup--recovery)

---

## 🏛️ Database Design Principles

### Core Design Philosophy

```
┌─────────────────────────────────────────┐
│      DATABASE DESIGN PRINCIPLES         │
├─────────────────────────────────────────┤
│ 1. ACID Compliance                      │
│    - Atomic: All or nothing             │
│    - Consistent: Valid state always     │
│    - Isolated: No dirty reads           │
│    - Durable: Persisted on disk         │
│                                         │
│ 2. Normalization (3NF)                  │
│    - Eliminate data redundancy          │
│    - Maintain referential integrity     │
│    - Optimize for queries               │
│                                         │
│ 3. Security First                       │
│    - Row-level security (RLS)           │
│    - Encrypted sensitive columns        │
│    - Audit trail for all changes        │
│                                         │
│ 4. Scalability                          │
│    - Partitioning strategy              │
│    - Index optimization                 │
│    - Connection pooling                 │
└─────────────────────────────────────────┘
```

---

## 📊 Schema Overview

### Database Diagram

```
USERS (Root Admin)
    ↓
CLIENTS
    ↓
PROJECTS (Current/Potential)
    ├── PROJECT_FOLDERS (ISO 19650)
    ├── PROJECT_FILES
    └── PROJECT_METADATA
         ↓
TEAM_MEMBERS
    ↓
AUDIT_LOGS (All Changes)
```

---

## 🔗 Entity Relationships

```sql
-- Users (Root Admin Management)
users (1) ──→ (many) audit_logs
    ↓
clients (1) ──→ (many) projects
    ↓
projects (1) ──→ (many) project_folders
projects (1) ──→ (many) project_files
projects (1) ──→ (many) team_members
projects (1) ──→ (many) project_metadata
    ↓
project_folders (1) ──→ (many) project_files
    ↓
audit_logs (all transactions)
```

---

## 📋 Table Specifications

### 1. Users Table (Root Admin)

```sql
-- Users: Root admin and system accounts
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  
  -- Password Management
  password_hash VARCHAR(255) NOT NULL,
  password_last_changed TIMESTAMP DEFAULT NOW(),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  
  -- Profile Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) GENERATED ALWAYS AS 
    (CONCAT(first_name, ' ', last_name)) STORED,
  
  -- Role & Permissions
  role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('ROOT_ADMIN', 'ADMIN', 'USER')),
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  
  -- Two-Factor Authentication
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  
  -- Audit Fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Constraints
  CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT password_hash_not_empty CHECK (LENGTH(password_hash) > 0)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### 2. Clients Table

```sql
-- Clients: Architecture firms and project owners
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  
  -- Address Information
  street_address VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  
  -- Business Information
  industry VARCHAR(100),
  company_size VARCHAR(50),
  tax_id VARCHAR(50),
  registration_number VARCHAR(100),
  
  -- Contact Person
  contact_first_name VARCHAR(100),
  contact_last_name VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  
  -- Relationship Management
  created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
  
  -- Audit Fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  notes TEXT
);

-- Indexes
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);
```

### 3. Projects Table

```sql
-- Projects: Current and Potential projects
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(50) UNIQUE,
  
  -- Project Classification
  type VARCHAR(50) NOT NULL CHECK (type IN ('CURRENT', 'POTENTIAL')),
  status VARCHAR(50) DEFAULT 'PLANNING' CHECK (
    status IN ('PLANNING', 'DESIGN', 'TENDER', 'CONSTRUCTION', 'COMPLETED', 'ARCHIVED')
  ),
  
  -- Client Relationship
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  estimated_completion DATE,
  
  -- Team Lead
  project_manager_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- ISO Folder Structure
  folder_structure_initialized BOOLEAN DEFAULT FALSE,
  folder_root_path VARCHAR(500),
  
  -- Project Metadata
  location VARCHAR(255),
  total_area DECIMAL(10, 2),
  budget DECIMAL(15, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Classification
  building_type VARCHAR(100),
  sector VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  
  -- Audit Fields
  created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date),
  CONSTRAINT positive_area CHECK (total_area IS NULL OR total_area > 0),
  CONSTRAINT positive_budget CHECK (budget IS NULL OR budget > 0)
);

-- Indexes
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_name_search ON projects USING GIN (to_tsvector('english', name));
```

### 4. Project Folders Table (ISO 19650)

```sql
-- Project Folders: ISO 19650-1 compliant folder structure
CREATE TABLE project_folders (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationship
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_folder_id BIGINT REFERENCES project_folders(id) ON DELETE CASCADE,
  
  -- Folder Information
  name VARCHAR(255) NOT NULL,
  folder_code VARCHAR(50),
  
  -- ISO Hierarchy Level
  hierarchy_level INTEGER,
  iso_category VARCHAR(50) CHECK (iso_category IN (
    '00_Admin', '10_General', '20_Design', '30_Technical',
    '40_Tender', '50_Construction', '60_As-Built', '70_Operation', 'CUSTOM'
  )),
  
  -- Path and Storage
  folder_path VARCHAR(500) NOT NULL UNIQUE,
  
  -- Access Control
  is_public BOOLEAN DEFAULT FALSE,
  visibility VARCHAR(50) DEFAULT 'TEAM' CHECK (visibility IN ('TEAM', 'CLIENT', 'PUBLIC')),
  
  -- Audit Fields
  created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Constraints
  CONSTRAINT unique_folder_per_project UNIQUE (project_id, folder_path),
  CONSTRAINT valid_hierarchy_level CHECK (hierarchy_level >= 0)
);

-- Indexes
CREATE INDEX idx_project_folders_project_id ON project_folders(project_id);
CREATE INDEX idx_project_folders_parent_id ON project_folders(parent_folder_id);
CREATE INDEX idx_project_folders_iso_category ON project_folders(iso_category);
CREATE INDEX idx_project_folders_path ON project_folders(folder_path);
```

### 5. Project Files Table

```sql
-- Project Files: File management and versioning
CREATE TABLE project_files (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationships
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  folder_id BIGINT NOT NULL REFERENCES project_folders(id) ON DELETE CASCADE,
  
  -- File Information
  original_filename VARCHAR(500) NOT NULL,
  stored_filename VARCHAR(500) NOT NULL UNIQUE,
  file_extension VARCHAR(20),
  mime_type VARCHAR(100),
  file_size BIGINT,
  
  -- File Storage
  storage_path VARCHAR(500) NOT NULL,
  storage_location VARCHAR(50) DEFAULT 'LOCAL' CHECK (storage_location IN ('LOCAL', 'S3', 'GCS')),
  storage_key VARCHAR(500),
  
  -- Versioning
  version INTEGER DEFAULT 1,
  is_latest BOOLEAN DEFAULT TRUE,
  
  -- File Metadata
  uploaded_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  checksum VARCHAR(64),
  
  -- Access Control
  is_archived BOOLEAN DEFAULT FALSE,
  access_level VARCHAR(50) DEFAULT 'TEAM' CHECK (access_level IN ('PRIVATE', 'TEAM', 'CLIENT', 'PUBLIC')),
  
  -- Audit Fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  description TEXT,
  
  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0),
  CONSTRAINT unique_file_version UNIQUE (project_id, original_filename, version)
);

-- Indexes
CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_files_folder_id ON project_files(folder_id);
CREATE INDEX idx_project_files_uploaded_by ON project_files(uploaded_by);
CREATE INDEX idx_project_files_created_at ON project_files(created_at DESC);
CREATE INDEX idx_project_files_checksum ON project_files(checksum);
```

### 6. Team Members Table

```sql
-- Team Members: Project team management
CREATE TABLE team_members (
  id BIGSERIAL PRIMARY KEY,
  
  -- Relationships
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role in Project
  role VARCHAR(100) NOT NULL CHECK (role IN (
    'PROJECT_MANAGER', 'ARCHITECT', 'ENGINEER', 'TECHNICIAN', 'INTERN', 'CONSULTANT'
  )),
  
  -- Permissions
  can_edit BOOLEAN DEFAULT TRUE,
  can_delete BOOLEAN DEFAULT FALSE,
  can_share BOOLEAN DEFAULT FALSE,
  can_approve BOOLEAN DEFAULT FALSE,
  
  -- Timeline
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Audit Fields
  added_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  added_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_team_member UNIQUE (project_id, user_id),
  CONSTRAINT valid_dates CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

-- Indexes
CREATE INDEX idx_team_members_project_id ON team_members(project_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);
```

### 7. Audit Logs Table

```sql
-- Audit Logs: Complete action trail for compliance
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  
  -- User Information
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  
  -- Action Information
  action VARCHAR(100) NOT NULL CHECK (action IN (
    'LOGIN', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE',
    'SHARE', 'UNSHARE', 'DOWNLOAD', 'UPLOAD', 'ARCHIVE'
  )),
  
  -- Entity Information
  entity_type VARCHAR(100) NOT NULL CHECK (entity_type IN (
    'USER', 'CLIENT', 'PROJECT', 'FOLDER', 'FILE', 'TEAM_MEMBER'
  )),
  entity_id BIGINT,
  entity_name VARCHAR(255),
  
  -- Change Details
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED')),
  error_message TEXT,
  
  -- Audit Fields
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Additional Context
  context JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_search ON audit_logs USING GIN (context);

-- Partitioning for performance (by month)
CREATE TABLE audit_logs_2026_06 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
```

### 8. Sessions Table (Redis Sync)

```sql
-- Sessions: Synchronized with Redis for performance
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Information
  ip_address INET,
  user_agent TEXT,
  device_name VARCHAR(255),
  
  -- Tokens
  access_token VARCHAR(1000),
  refresh_token VARCHAR(1000),
  
  -- Expiration
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Indexes
  CONSTRAINT session_not_empty CHECK (LENGTH(id) > 0)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
```

---

## ⚡ Indexes & Performance

### Query Performance Optimization

```sql
-- Frequently Used Queries with Indexes

-- 1. Get all projects for a client
SELECT * FROM projects 
WHERE client_id = $1 AND type = $2
ORDER BY created_at DESC;
-- Index: idx_projects_client_id, idx_projects_type

-- 2. Search projects by name
SELECT * FROM projects
WHERE to_tsvector('english', name) @@ plainto_tsquery('english', $1);
-- Index: idx_projects_name_search (GIST full-text search)

-- 3. Get project folder hierarchy
SELECT * FROM project_folders
WHERE project_id = $1 AND parent_folder_id IS NULL
ORDER BY hierarchy_level, name;
-- Index: idx_project_folders_project_id

-- 4. Audit trail for compliance
SELECT * FROM audit_logs
WHERE entity_type = $1 AND entity_id = $2
ORDER BY timestamp DESC
LIMIT 100;
-- Index: idx_audit_logs_entity_type, idx_audit_logs_entity_id

-- 5. List active user sessions
SELECT * FROM sessions
WHERE user_id = $1 AND is_active = TRUE AND expires_at > NOW();
-- Index: idx_sessions_user_id, idx_sessions_expires_at
```

### Index Strategy

```
┌─────────────────────────────────────────┐
│      INDEX OPTIMIZATION STRATEGY        │
├─────────────────────────────────────────┤
│ Foreign Keys      → B-tree indexes      │
│ Status/Type       → Partial indexes     │
│ Search queries    → GIST/GIN indexes    │
│ Date ranges       → BRIN indexes        │
│ High cardinality  → Hash indexes        │
│ Composite queries → Multi-column indexes│
└─────────────────────────────────────────┘
```

### Connection Pooling Configuration

```typescript
// PgBouncer Configuration (pgbouncer.ini)
[databases]
management_data_app = host=localhost port=5432 dbname=management_data_app

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 100
max_user_connections = 100
```

---

## 🔄 Migration Strategy

### TypeORM Migrations

```bash
# Generate new migration
npm run typeorm migration:generate src/database/migrations/AddProjectFields

# Run migrations
npm run typeorm migration:run

# Revert migrations
npm run typeorm migration:revert

# Show migration status
npm run typeorm migration:show
```

### Migration Example

```typescript
// src/database/migrations/1687891200000-InitialSchema.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1687891200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          // ... more columns
        ],
      })
    );

    // Create projects table with foreign key
    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
          },
          {
            name: 'client_id',
            type: 'bigint',
            isNullable: false,
          },
          // ... more columns
        ],
      })
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients',
        onDelete: 'CASCADE',
      })
    );

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_projects_client_id ON projects(client_id);
      CREATE INDEX idx_projects_type ON projects(type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('projects');
    await queryRunner.dropTable('users');
  }
}
```

---

## 💾 Backup & Recovery

### Backup Strategy

```bash
# Full backup (daily)
pg_dump -Fc management_data_app > backup_$(date +%Y%m%d).dump

# Compressed backup
pg_dump -Fc --compress=9 management_data_app > backup_$(date +%Y%m%d_%H%M%S).dump

# Backup with progress
pg_dump -Fc -v management_data_app > backup.dump 2> backup.log

# Backup specific schema
pg_dump -Fc -n public management_data_app > schema_backup.dump
```

### Recovery Process

```bash
# Restore from backup
pg_restore -d management_data_app backup_20260627.dump

# Restore with verbose output
pg_restore -v -d management_data_app backup_20260627.dump

# List backup contents
pg_restore -l backup_20260627.dump | less

# Restore specific table
pg_restore -d management_data_app -t users backup_20260627.dump
```

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh - Daily backup automation

BACKUP_DIR="/backups/postgresql"
RETENTION_DAYS=30
DB_NAME="management_data_app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -Fc --compress=9 $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.dump

# Compress
gzip $BACKUP_DIR/backup_$TIMESTAMP.dump

# Upload to cloud storage (S3)
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.dump.gz \
  s3://backups/management-data-app/

# Remove old backups
find $BACKUP_DIR -name "backup_*.dump.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$TIMESTAMP.dump.gz"
```

### Point-In-Time Recovery (PITR)

```sql
-- Enable archiving in postgresql.conf
archive_mode = on
archive_command = 'cp %p /backup/wal_archive/%f'

-- Restore to specific timestamp
SELECT pg_catalog.set_config('search_path', '', false);
-- Use backup and recovery to restore to specific time
```

---

## 🔍 Database Monitoring

### Performance Queries

```sql
-- Top 10 slowest queries
SELECT 
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 100
ORDER BY abs(correlation) DESC;

-- Active connections
SELECT 
  datname,
  usename,
  application_name,
  client_addr,
  state,
  query
FROM pg_stat_activity
WHERE state != 'idle';
```

---

**Database Architecture v1.0**  
**Last Updated:** 2026-06-27  
**Prepared by:** Yan Torky
