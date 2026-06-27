# Production Deployment Guide

**Management Data Architect** - Enterprise Deployment Manual

**Developer:** Yan Torky  
**Last Updated:** 2026-06-27  
**Version:** 1.0.0

---

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Infrastructure Requirements](#infrastructure-requirements)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [AWS Deployment](#aws-deployment)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring & Alerting](#monitoring--alerting)
- [Backup & Disaster Recovery](#backup--disaster-recovery)
- [Performance Tuning](#performance-tuning)
- [Scaling Strategy](#scaling-strategy)

---

## ✅ Pre-Deployment Checklist

### Security Verification

- [ ] All secrets stored in environment variables
- [ ] No hardcoded credentials in codebase
- [ ] SSL/TLS certificates obtained and valid
- [ ] Database encryption enabled
- [ ] Redis password configured
- [ ] Firewall rules configured
- [ ] WAF (Web Application Firewall) enabled
- [ ] DDoS protection configured
- [ ] Security headers verified
- [ ] Rate limiting configured

### Code Quality

- [ ] All tests passing: `pnpm run test`
- [ ] Coverage ≥ 80%: `pnpm run test:coverage`
- [ ] No linting errors: `pnpm run lint`
- [ ] Type checking passed: `pnpm run type-check`
- [ ] No console.log in production code
- [ ] Dependencies updated: `npm audit --production`
- [ ] Code review completed
- [ ] Performance benchmarks acceptable

### Infrastructure

- [ ] PostgreSQL 14+ configured
- [ ] Redis 7+ configured
- [ ] Backup system operational
- [ ] Monitoring tools installed
- [ ] Log aggregation configured
- [ ] CDN configured for static assets
- [ ] Email service configured
- [ ] DNS records updated

### Documentation

- [ ] Deployment runbook prepared
- [ ] Rollback procedure documented
- [ ] Incident response plan ready
- [ ] Team trained on deployment

---

## 🏗️ Infrastructure Requirements

### Minimum Production Setup

```
┌─────────────────────────────────────────────┐
│        PRODUCTION INFRASTRUCTURE            │
├─────────────────────────────────────────────┤
│                                             │
│ Load Balancer (HTTPS)                       │
│      ↓                                       │
│ ┌─────────────────────────────────────┐    │
│ │   Application Server Cluster (3x)   │    │
│ │   - Node.js + Express + GraphQL     │    │
│ │   - Horizontal auto-scaling         │    │
│ │   - Health checks enabled           │    │
│ └─────────────────────────────────────┘    │
│      ↓                                       │
│ ┌─────────────────────────────────────┐    │
│ │  PostgreSQL Primary (Replication)   │    │
│ │  - RAID-10 storage                  │    │
│ │  - Automated backups                │    │
│ │  - Point-in-time recovery           │    │
│ └─────────────────────────────────────┘    │
│      ↓                                       │
│ ┌─────────────────────────────────────┐    │
│ │   Redis Cluster (3 nodes)           │    │
│ │   - Sentinel for failover           │    │
│ │   - Persistence enabled             │    │
│ │   - TLS encryption                  │    │
│ └─────────────────────────────────────┘    │
│      ↓                                       │
│ ┌─────────────────────────────────────┐    │
│ │   External Services                 │    │
│ │   - CloudFlare CDN                  │    │
│ │   - SendGrid (Email)                │    │
│ │   - AWS S3 (File storage)           │    │
│ │   - Datadog (Monitoring)            │    │
│ └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Server Specifications

| Component | Minimum | Recommended | Production |
|-----------|---------|-------------|------------|
| **CPU** | 2 cores | 4 cores | 8+ cores |
| **RAM** | 4 GB | 8 GB | 16+ GB |
| **Disk** | 50 GB SSD | 100 GB SSD | 500+ GB SSD |
| **Network** | 100 Mbps | 1 Gbps | 10 Gbps |

---

## 🐳 Docker Deployment

### Dockerfile Configuration

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build backend
WORKDIR /app/packages/backend
RUN pnpm run build

# Build frontend
WORKDIR /app/packages/web
RUN pnpm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built artifacts
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/packages/web/dist ./public

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run with dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

EXPOSE 4000
```

### Docker Compose for Production

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:latest
    container_name: management_data_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./certbot/www:/var/www/certbot:ro
    networks:
      - management_data_network
    restart: unless-stopped
    depends_on:
      - app1
      - app2
      - app3

  # Application Servers (3 instances)
  app1:
    image: management-data-app:1.0.0
    container_name: management_data_app1
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/management_data_app
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis-master:6379/0
      NODE_ENV: production
      PORT: 4000
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRY: 24h
      BCRYPT_ROUNDS: 12
      LOG_LEVEL: info
      STORAGE_PATH: /app/storage
    volumes:
      - app_storage:/app/storage
    networks:
      - management_data_network
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis-master:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  app2:
    image: management-data-app:1.0.0
    container_name: management_data_app2
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/management_data_app
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis-master:6379/0
      NODE_ENV: production
      PORT: 4000
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRY: 24h
      BCRYPT_ROUNDS: 12
      LOG_LEVEL: info
      STORAGE_PATH: /app/storage
    volumes:
      - app_storage:/app/storage
    networks:
      - management_data_network
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis-master:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  app3:
    image: management-data-app:1.0.0
    container_name: management_data_app3
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/management_data_app
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis-master:6379/0
      NODE_ENV: production
      PORT: 4000
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRY: 24h
      BCRYPT_ROUNDS: 12
      LOG_LEVEL: info
      STORAGE_PATH: /app/storage
    volumes:
      - app_storage:/app/storage
    networks:
      - management_data_network
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis-master:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: management_data_postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: management_data_app
      POSTGRES_INITDB_ARGS: "-c max_connections=200 -c shared_buffers=256MB"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    networks:
      - management_data_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5
    command:
      - "postgres"
      - "-c"
      - "log_statement=all"
      - "-c"
      - "log_duration=on"

  # Redis Cache
  redis-master:
    image: redis:7-alpine
    container_name: management_data_redis_master
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - management_data_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Sentinel for failover
  redis-sentinel:
    image: redis:7-alpine
    container_name: management_data_redis_sentinel
    ports:
      - "26379:26379"
    volumes:
      - ./sentinel.conf:/etc/redis/sentinel.conf
      - sentinel_data:/data
    networks:
      - management_data_network
    restart: unless-stopped
    command: redis-sentinel /etc/redis/sentinel.conf
    depends_on:
      - redis-master

volumes:
  postgres_data:
  redis_data:
  sentinel_data:
  app_storage:

networks:
  management_data_network:
    driver: bridge
```

### Deployment Steps

```bash
# 1. Build Docker image
docker build -t management-data-app:1.0.0 .

# 2. Tag for registry
docker tag management-data-app:1.0.0 registry.example.com/management-data-app:1.0.0

# 3. Push to registry
docker push registry.example.com/management-data-app:1.0.0

# 4. Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify deployment
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f app1

# 6. Run migrations
docker-compose -f docker-compose.prod.yml exec app1 pnpm run db:migrate

# 7. Seed initial data
docker-compose -f docker-compose.prod.yml exec app1 pnpm run db:seed
```

---

## ☸️ Kubernetes Deployment

### Kubernetes Manifests

```yaml
# k8s/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: management-data-app

---
# k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: management-data-app
data:
  NODE_ENV: production
  PORT: "4000"
  LOG_LEVEL: info

---
# k8s/secret.yml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: management-data-app
type: Opaque
stringData:
  DATABASE_URL: postgresql://admin:password@postgres.default:5432/management_data_app
  REDIS_URL: redis://redis.default:6379/0
  JWT_SECRET: your-secret-key-here
  BCRYPT_ROUNDS: "12"

---
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: management-data-app
  namespace: management-data-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: management-data-app
  template:
    metadata:
      labels:
        app: management-data-app
    spec:
      containers:
      - name: app
        image: registry.example.com/management-data-app:1.0.0
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 4000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 4000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        volumeMounts:
        - name: storage
          mountPath: /app/storage
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: app-storage

---
# k8s/service.yml
apiVersion: v1
kind: Service
metadata:
  name: management-data-app
  namespace: management-data-app
spec:
  type: LoadBalancer
  selector:
    app: management-data-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 4000
    name: http
  - protocol: TCP
    port: 443
    targetPort: 4000
    name: https

---
# k8s/ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: management-data-app
  namespace: management-data-app
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls-cert
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: management-data-app
            port:
              number: 80

---
# k8s/hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: management-data-app-hpa
  namespace: management-data-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: management-data-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Kubernetes Deployment Steps

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yml

# 2. Create secrets
kubectl apply -f k8s/secret.yml

# 3. Deploy application
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml

# 4. Setup ingress
kubectl apply -f k8s/ingress.yml

# 5. Configure auto-scaling
kubectl apply -f k8s/hpa.yml

# 6. Monitor rollout
kubectl rollout status deployment/management-data-app -n management-data-app

# 7. Check pod status
kubectl get pods -n management-data-app

# 8. View logs
kubectl logs -f deployment/management-data-app -n management-data-app

# 9. Run migrations
kubectl exec -it deployment/management-data-app -n management-data-app -- pnpm run db:migrate
```

---

## 🔐 SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx \
  --email contact@example.com \
  -d app.example.com \
  --agree-tos \
  --no-eff-email

# Auto-renewal setup
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
# /etc/nginx/nginx.conf
server {
    listen 80;
    server_name app.example.com;
    
    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Upstream servers
    upstream app_backend {
        least_conn;
        server app1:4000 max_fails=3 fail_timeout=30s;
        server app2:4000 max_fails=3 fail_timeout=30s;
        server app3:4000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }
    
    # Reverse proxy
    location / {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connection_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://app_backend;
    }
}
```

---

## 📊 Monitoring & Alerting

### Datadog Setup

```yaml
# datadog-agent-values.yaml
datadog:
  apiKey: ${DD_API_KEY}
  appKey: ${DD_APP_KEY}
  site: datadoghq.com
  
  apm:
    enabled: true
    
  logs:
    enabled: true
    containerCollectAll: true
    
  processAgent:
    enabled: true
    
  kubeStateMetricsCore:
    enabled: true
    
  tags:
    - env:production
    - service:management-data-app
    - version:1.0.0
```

### Application Monitoring

```typescript
// src/middleware/monitoring.ts
import StatsD from 'node-dogstatsd';

const dogstatsd = new StatsD.StatsD({
  host: process.env.DD_AGENT_HOST || 'localhost',
  port: 8125,
  tags: [
    `env:${process.env.NODE_ENV}`,
    `service:management-data-app`,
  ],
});

export function monitoringMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Track response time
    dogstatsd.histogram('http.request.duration', duration, {
      tags: [
        `route:${req.route?.path || 'unknown'}`,
        `method:${req.method}`,
        `status:${res.statusCode}`,
      ],
    });
    
    // Track request count
    dogstatsd.increment('http.requests', 1, {
      tags: [
        `status:${res.statusCode}`,
        `method:${req.method}`,
      ],
    });
  });
  
  next();
}
```

### Alert Rules

```yaml
# datadog-alerts.yml
monitors:
  - name: "High CPU Usage"
    type: metric_alert
    query: "avg(last_5m):avg:system.cpu.user{app:management-data-app} > 0.8"
    alert_message: "CPU usage is high: {{value}}"
    priority: "P2"
    
  - name: "Database Connection Pool Exhausted"
    type: metric_alert
    query: "avg(last_5m):max:postgresql.connections{db:management_data_app} > 90"
    alert_message: "Database connections: {{value}}"
    priority: "P1"
    
  - name: "High Error Rate"
    type: metric_alert
    query: "avg(last_5m):sum:trace.web.request.errors{app:management-data-app} > 100"
    alert_message: "Error rate is high: {{value}} errors/min"
    priority: "P2"
    
  - name: "Redis Memory Usage"
    type: metric_alert
    query: "avg(last_5m):redis.memory.used{app:management-data-app} > 80"
    alert_message: "Redis memory: {{value}}%"
    priority: "P3"
```

---

## 💾 Backup & Disaster Recovery

### Automated Backup Pipeline

```bash
#!/bin/bash
# backup-pipeline.sh

BACKUP_DIR="/backups"
RETENTION_DAYS=30
S3_BUCKET="s3://backups-management-data-app"

# Database backup
pg_dump -Fc --compress=9 management_data_app | \
  aws s3 cp - $S3_BUCKET/database/backup_$(date +%Y%m%d_%H%M%S).dump

# Redis backup
redis-cli --rdb /tmp/redis.rdb
aws s3 cp /tmp/redis.rdb $S3_BUCKET/redis/redis_$(date +%Y%m%d_%H%M%S).rdb
rm /tmp/redis.rdb

# Application data
tar czf /tmp/app_data.tar.gz /app/storage
aws s3 cp /tmp/app_data.tar.gz $S3_BUCKET/application/data_$(date +%Y%m%d_%H%M%S).tar.gz
rm /tmp/app_data.tar.gz

# Cleanup old backups
aws s3 ls $S3_BUCKET/database/ | while read -r line; do
  createdate=$(echo $line | awk {'print $1" "$2'})
  createdate=$(date -d "$createdate" +%s)
  olderdate=$(date --date "$RETENTION_DAYS days ago" +%s)
  
  if [[ $createdate -lt $olderdate ]]; then
    filename=$(echo $line | awk {'print $4'})
    aws s3 rm $S3_BUCKET/database/$filename
  fi
done

echo "Backup completed: $(date)"
```

### Disaster Recovery Plan

```
DISASTER RECOVERY PROCEDURES

RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 15 minutes

1. DATABASE RECOVERY (15 minutes)
   - Restore latest backup from S3
   - Verify data integrity
   - Check replication status

2. APPLICATION RECOVERY (30 minutes)
   - Redeploy containers from registry
   - Restore application data
   - Run migrations
   - Verify health checks

3. CACHE RECOVERY (10 minutes)
   - Restore Redis snapshot
   - Verify cache connectivity
   - Warm up cache if needed

4. VERIFICATION (5 minutes)
   - Run smoke tests
   - Check application endpoints
   - Verify user access
```

---

## ⚡ Performance Tuning

### PostgreSQL Optimization

```ini
# /etc/postgresql/15/main/postgresql.conf

# Memory Settings
shared_buffers = 4GB                    # 25% of system RAM
effective_cache_size = 12GB             # 75% of system RAM
maintenance_work_mem = 1GB
work_mem = 50MB

# Connection Settings
max_connections = 200
max_prepared_transactions = 100

# Query Planning
random_page_cost = 1.1                  # For SSD
effective_io_concurrency = 200

# Replication
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB

# Logging
log_statement = all
log_duration = on
log_lock_waits = on
log_checkpoints = on
log_autovacuum_min_duration = 0
```

### Redis Optimization

```conf
# redis.conf

# Memory Management
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1                      # Save if 1 key changed in 15 min
save 300 10                     # Save if 10 keys changed in 5 min
save 60 10000                   # Save if 10000 keys changed in 1 min

# Replication
replica-read-only yes
replica-serve-stale-data no

# Security
requirepass ${REDIS_PASSWORD}
```

### Application Optimization

```typescript
// Backend Performance Tips

// 1. Database Query Optimization
const projects = await projectRepository
  .createQueryBuilder('project')
  .leftJoinAndSelect('project.client', 'client')
  .leftJoinAndSelect('project.folders', 'folders')
  .where('project.id = :id', { id: projectId })
  .cache(300000) // Cache 5 minutes
  .getOne();

// 2. Connection Pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 3. Response Compression
app.use(compression({ level: 6, threshold: 1024 }));

// 4. Request Timeout
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});
```

---

## 📈 Scaling Strategy

### Horizontal Scaling

```
┌─────────────────────────────────────┐
│          SCALING LAYERS             │
├─────────────────────────────────────┤
│                                     │
│ Layer 1: Load Balancer              │
│ - Nginx/HAProxy                     │
│ - Distribute traffic                │
│                                     │
│ Layer 2: Application Servers        │
│ - 3-10 Node.js instances            │
│ - Auto-scaling based on CPU/Memory  │
│                                     │
│ Layer 3: Cache Layer                │
│ - Redis Cluster (3+ nodes)          │
│ - Distributed caching               │
│                                     │
│ Layer 4: Database                   │
│ - Primary-Replica replication       │
│ - Read replicas for queries         │
│                                     │
│ Layer 5: Object Storage             │
│ - AWS S3 / CloudFront CDN           │
│ - Distributed file delivery         │
│                                     │
└─────────────────────────────────────┘
```

### Auto-Scaling Configuration

```yaml
# Auto-scaling rules
scaling_policies:
  scale_up:
    metric: cpu_utilization
    threshold: 70%
    cooldown: 300s
    increment: 2 instances
    
  scale_down:
    metric: cpu_utilization
    threshold: 30%
    cooldown: 600s
    decrement: 1 instance
    min_instances: 3
    max_instances: 10
```

---

## 🚀 Post-Deployment

### Health Checks

```bash
# 1. Application Health
curl -v https://app.example.com/health

# 2. Database Connectivity
docker exec postgres psql -U admin -d management_data_app -c "SELECT 1"

# 3. Redis Connectivity
docker exec redis redis-cli ping

# 4. Check Logs
docker-compose logs -f app1

# 5. Verify Backups
aws s3 ls s3://backups-management-data-app/
```

### Rollback Procedure

```bash
# 1. Identify current version
kubectl rollout history deployment/management-data-app -n management-data-app

# 2. Rollback to previous version
kubectl rollout undo deployment/management-data-app -n management-data-app

# 3. Verify rollback
kubectl rollout status deployment/management-data-app -n management-data-app

# 4. Check service status
kubectl get pods -n management-data-app
```

---

**Deployment Guide v1.0**  
**Last Updated:** 2026-06-27  
**Prepared by:** Yan Torky
