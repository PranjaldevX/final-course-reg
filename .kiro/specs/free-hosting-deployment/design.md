# Design Document: Free Hosting Deployment for AMU Course Registration System

## Overview

This design document provides a comprehensive technical blueprint for deploying the AMU Course Registration System to free hosting platforms. The system consists of three primary components:

- **Frontend**: React + Vite + TypeScript application with Tailwind CSS and shadcn/ui components
- **Backend**: Node.js + Express + TypeScript REST API with Prisma ORM
- **Database**: PostgreSQL relational database with complex schema (15+ tables)

### Design Philosophy

The deployment architecture prioritizes:
1. **Zero Cost**: All components deployed on free tiers
2. **Production Ready**: HTTPS, automated deployments, monitoring
3. **Developer Experience**: Simple setup, clear documentation, automated CI/CD
4. **Performance**: CDN caching, connection pooling, cold start optimization
5. **Security**: Environment variable management, CORS configuration, JWT authentication

### Recommended Platform Stack

Based on the codebase analysis and requirements, the following platforms are specifically recommended:

| Component | Platform | Justification |
|-----------|----------|---------------|
| **Frontend** | Vercel | Best-in-class Vite/React support, automatic deployments from Git, global CDN, 100GB bandwidth/month |
| **Backend** | Render.com | 750 hours/month free tier, persistent disk storage for file uploads, automatic HTTPS, zero-config deployments |
| **Database** | Neon.tech | Serverless PostgreSQL, 0.5GB storage, always-on (no cold starts), Prisma-optimized, automatic backups |
| **Monitoring** | UptimeRobot | 50 free monitors, 5-minute intervals, keeps backend warm, email/SMS alerts |

### Key Technical Decisions

1. **Vercel for Frontend**: Chosen over Netlify/Cloudflare Pages for superior Vite build optimization and automatic preview deployments
2. **Render.com for Backend**: Chosen over Railway/Fly.io for persistent disk storage (critical for CSV uploads) and longer free tier hours
3. **Neon.tech for Database**: Chosen over Supabase/ElephantSQL for serverless architecture (no cold starts), better connection pooling, and Prisma compatibility
4. **Memory Storage for Uploads**: Using multer's memory storage with immediate processing avoids disk I/O bottlenecks

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Vercel - Frontend Hosting"
        CDN[Vercel Edge Network CDN]
        Static[Static Assets<br/>HTML/CSS/JS]
        CDN --> Static
    end
    
    subgraph "Render.com - Backend Hosting"
        API[Express API Server<br/>Node.js 18+]
        Prisma[Prisma Client]
        Multer[Multer File Handler<br/>Memory Storage]
        Disk[Persistent Disk<br/>500MB]
        API --> Prisma
        API --> Multer
        Multer -.->|Optional Persistence| Disk
    end
    
    subgraph "Neon.tech - Database Hosting"
        PG[PostgreSQL 15<br/>Serverless]
        Pool[Connection Pool<br/>Max 5 connections]
        Backup[Automated Backups<br/>7-day retention]
        PG --> Pool
        PG --> Backup
    end
    
    subgraph "UptimeRobot - Monitoring"
        Monitor[Health Check Monitor<br/>5-minute intervals]
        Alert[Email/SMS Alerts]
        Monitor --> Alert
    end
    
    Browser -->|HTTPS| CDN
    Static -->|API Calls<br/>VITE_API_BASE_URL| API
    Prisma -->|SSL Connection<br/>DATABASE_URL| Pool
    Monitor -->|GET /health| API
    
    style Vercel fill:#000,stroke:#fff,color:#fff
    style Render.com fill:#4a5568,stroke:#fff,color:#fff
    style Neon.tech fill:#00e699,stroke:#000,color:#000
    style UptimeRobot fill:#4c51bf,stroke:#fff,color:#fff
```

### Deployment Flow Diagram

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as GitHub Repository
    participant Vercel as Vercel
    participant Render as Render.com
    participant Neon as Neon.tech Database
    
    Dev->>Git: git push origin main
    
    par Frontend Deployment
        Git->>Vercel: Webhook trigger
        Vercel->>Vercel: npm install
        Vercel->>Vercel: npm run build (Vite)
        Vercel->>Vercel: Deploy to CDN
        Vercel->>Dev: Deployment success ✓
    and Backend Deployment
        Git->>Render: Webhook trigger
        Render->>Render: npm install
        Render->>Render: npm run build (TypeScript)
        Render->>Render: prisma generate
        Render->>Neon: prisma migrate deploy
        Neon->>Render: Migration success
        Render->>Render: npm start
        Render->>Dev: Deployment success ✓
    end
    
    Dev->>Vercel: Test frontend
    Vercel->>Render: API request
    Render->>Neon: Database query
    Neon->>Render: Query result
    Render->>Vercel: API response
    Vercel->>Dev: Page rendered
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "Authentication Flow"
        A1[Login Request] --> A2[JWT Generation]
        A2 --> A3[Token Storage]
        A3 --> A4[Authenticated Requests]
    end
    
    subgraph "CSV Upload Flow"
        B1[CSV File] --> B2[Multer Memory Buffer]
        B2 --> B3[PapaParse Validation]
        B3 --> B4[Prisma Batch Insert]
        B4 --> B5[Database Commit]
    end
    
    subgraph "Registration Flow"
        C1[Student Request] --> C2[Eligibility Check]
        C2 --> C3[Prerequisite Validation]
        C3 --> C4[Course Registration]
        C4 --> C5[Audit Log]
    end
    
    style Authentication Flow fill:#e3f2fd
    style CSV Upload Flow fill:#fff3e0
    style Registration Flow fill:#f3e5f5
```

## Components and Interfaces

### 1. Frontend Component (Vercel)

#### Build Configuration

**File**: `frontend/package.json`
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**File**: `frontend/vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### Vercel Configuration

**File**: `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Environment Variables (Vercel Dashboard)

```bash
# Production
VITE_API_BASE_URL=https://amu-course-registration-api.onrender.com

# Preview/Development
VITE_API_BASE_URL=https://amu-course-registration-api-dev.onrender.com
```

### 2. Backend Component (Render.com)

#### Build Configuration

**File**: `backend/package.json` (Updated)
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "prisma generate",
    "migrate:deploy": "prisma migrate deploy"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Render.com Configuration

**File**: `render.yaml` (Root directory)
```yaml
services:
  - type: web
    name: amu-course-registration-api
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build && npx prisma generate
    startCommand: npx prisma migrate deploy && npm start
    healthCheckPath: /test
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: OTP_EXPIRY_MINUTES
        value: 5
      - key: OTP_MAX_ATTEMPTS
        value: 3
      - key: RESET_TOKEN_EXPIRY_MINUTES
        value: 15
      - key: RESET_TOKEN_MAX_ATTEMPTS
        value: 3
      - key: CORS_ORIGIN
        value: https://amu-course-registration.vercel.app
    disk:
      name: uploads
      mountPath: /opt/render/project/src/uploads
      sizeGB: 1
```

#### Updated CORS Configuration

**File**: `backend/src/app.ts` (Modified)
```typescript
import express from "express";
import cors from "cors";

const app = express();

// Dynamic CORS configuration for deployment
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ["http://localhost:8080", "http://localhost:8081"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

// Rest of configuration...
export default app;
```

#### Health Check Endpoint

**File**: `backend/src/app.ts` (Add)
```typescript
// Enhanced health check for monitoring
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Database connection failed"
    });
  }
});
```

### 3. Database Component (Neon.tech)

#### Prisma Configuration for Neon

**File**: `backend/prisma/schema.prisma` (Updated datasource)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```

#### Connection Pooling Configuration

**File**: `backend/src/lib/prisma.ts` (New file)
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Connection pool configuration for Neon
export const prismaConfig = {
  connection_limit: 5,
  pool_timeout: 10,
  connect_timeout: 10,
};
```

#### Neon Connection String Format

```bash
# Standard connection (pooled)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"

# Direct connection (for migrations)
DIRECT_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=10"
```

### 4. File Upload Handling

#### Current Implementation (Memory Storage)

The current implementation uses memory storage which is optimal for Render's free tier:

**File**: `backend/src/routes/upload.routes.ts` (Current)
```typescript
const upload = multer({
  storage: multer.memoryStorage(), // Keeps files in memory
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});
```

#### Upload Controller (Processes from memory)

**File**: `backend/src/controllers/upload.controller.ts`
```typescript
export const uploadCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // File is in memory as req.file.buffer
    const csvData = req.file.buffer.toString('utf-8');
    
    // Parse CSV using PapaParse
    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    // Process and insert into database
    // ... validation and insertion logic
    
    res.json({
      success: true,
      message: `Processed ${results.data.length} records`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload processing failed" });
  }
};
```

**Rationale**: Memory storage is preferred because:
1. CSV files are processed immediately and not stored long-term
2. Avoids disk I/O overhead on Render's free tier
3. Simpler deployment (no persistent volume configuration needed)
4. Files are validated and inserted into PostgreSQL directly

### 5. Environment Variable Management

#### Backend Environment Variables (Render.com Dashboard)

```bash
# Server Configuration
NODE_ENV=production
PORT=10000

# Database (from Neon.tech)
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# JWT Configuration (Generate secure random string)
JWT_SECRET=<generate-32-char-random-string>

# OTP Configuration
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3

# Password Reset Configuration
RESET_TOKEN_EXPIRY_MINUTES=15
RESET_TOKEN_MAX_ATTEMPTS=3

# CORS Configuration
CORS_ORIGIN=https://amu-course-registration.vercel.app,https://amu-course-registration-*.vercel.app
```

#### Frontend Environment Variables (Vercel Dashboard)

```bash
# Production Environment
VITE_API_BASE_URL=https://amu-course-registration-api.onrender.com

# Preview Environment (for PR previews)
VITE_API_BASE_URL=https://amu-course-registration-api-dev.onrender.com
```

#### Environment Validation Middleware

**File**: `backend/src/middlewares/env-validation.ts` (New file)
```typescript
export const validateEnvironment = () => {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PORT',
    'CORS_ORIGIN'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};
```

**File**: `backend/src/server.ts` (Updated)
```typescript
import app from "./app";
import { validateEnvironment } from "./middlewares/env-validation";

// Validate environment before starting
validateEnvironment();

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
```

## Data Models

The existing Prisma schema remains unchanged. Key considerations for deployment:

### Connection Pooling Strategy

```typescript
// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=5&pool_timeout=10',
    },
  },
});
```

### Migration Strategy

1. **Initial Setup**: Run migrations manually on Neon database
   ```bash
   npx prisma migrate deploy
   ```

2. **Automated Deployments**: Migrations run automatically via Render's build command
   ```yaml
   startCommand: npx prisma migrate deploy && npm start
   ```

3. **Rollback Strategy**: Maintain migration history in `_prisma_migrations` table

### Database Seeding

**File**: `backend/prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed initial data
  console.log('🌱 Seeding database...');
  
  // Example: Create admin teacher account
  await prisma.teacher.upsert({
    where: { email: 'admin@amu.ac.in' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@amu.ac.in',
      password_hash: '<bcrypt-hashed-password>',
      role: 'admin',
      department: 'Computer Science',
    },
  });

  console.log('✅ Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run manually after initial deployment:
```bash
npx prisma db seed
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

