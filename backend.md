# Gym-Git Backend Architecture & API Specification

This document defines the complete backend requirements, system architecture, API specifications, data contracts, and algorithmic expectations required by the **Gym-Git Frontend**. 

It serves as the definitive reference guide for backend engineers to implement a robust, production-ready backend service.

---

## 1. Overview & System Architecture

### 1.1 Purpose
**Gym-Git** is a GitHub-inspired workout tracking and analytics application. It visualizes daily workout activity using a contribution graph (heatmap), calculates plan-conforming scientific streaks, grades training intensity via a 0–100 Gym Power Score, and maps user performance to anime power tiers.

### 1.2 Tech Stack Recommendations
The backend service can be built using any modern web frameork (e.g., **Node.js/Express/NestJS**, **Go/Gin**, **Python/FastAPI**, or **Rust/Axum**). 
- **Database**: PostgreSQL (recommended with Prisma or TypeORM) or MongoDB.
- **Cache / Session**: Redis (optional, for token revocation and session management).
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies or Bearer headers, plus OAuth2 (Google Sign-In).

---

## 2. Global API Conventions

### 2.1 Base URL & Versioning
All API endpoints must be prefixed with `/api/v1`:
`https://api.gymgit.com/api/v1` (or `http://localhost:8080/api/v1` during local development).

### 2.2 Headers
- **Content-Type**: `application/json`
- **Authorization**: `Bearer <JWT_TOKEN>` (or HTTP-only session cookie `gym_session`)

### 2.3 Date & Timestamp Standard
- **Calendar Dates**: `YYYY-MM-DD` (e.g., `2026-07-26`). All daily workout logs are indexed strictly by local calendar date `YYYY-MM-DD`.
- **System Timestamps**: ISO 8601 UTC format (e.g., `2026-07-26T13:40:00.000Z`).

### 2.4 Standard Response Envelope
All API responses must follow a standardized JSON envelope structure.

#### Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

#### Error Response Envelope (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Hours must be a positive number between 0.1 and 24.",
    "details": [
      {
        "field": "hours",
        "issue": "Expected number greater than 0"
      }
    ]
  },
  "timestamp": "2026-07-26T13:40:00.000Z"
}
```

---

## 3. Data Models & Schemas

### 3.1 `User`
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID) | Yes | Unique user identifier |
| `email` | `string` | Yes | User email address (unique) |
| `name` | `string` | Yes | Display name |
| `avatarUrl` | `string` | No | Avatar image URL |
| `provider` | `'email' \| 'google'` | Yes | Auth provider used |
| `weeklyPlan` | `WeeklyPlan` | Yes | User's active training split plan |
| `createdAt` | `string` (ISO) | Yes | Account creation timestamp |
| `updatedAt` | `string` (ISO) | Yes | Profile update timestamp |

### 3.2 `WeeklyPlan`
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Plan ID (e.g., `'ppl-standard'`, `'full-body'`) |
| `name` | `string` | Yes | Plan display title |
| `description` | `string` | No | Short description of the training plan |
| `categories` | `string[]` | Yes | Array of workout categories (e.g. `["Push", "Pull", "Legs", "Cardio"]`) |

### 3.3 `GymLog`
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID) | Yes | Log entry ID |
| `userId` | `string` (UUID) | Yes | User ID reference |
| `date` | `string` | Yes | Format `YYYY-MM-DD` (Unique per user & date) |
| `hours` | `number` | Yes | Workout duration in decimal hours (e.g. `1.5` = 90 mins) |
| `workoutType` | `string` | Yes | Category (e.g. `'Push'`, `'Pull'`, `'Legs'`, `'Core'`, `'Cardio'`, `'Custom'`) |
| `notes` | `string` | No | Optional notes/session remarks |
| `createdAt` | `string` (ISO) | Yes | Creation timestamp |
| `updatedAt` | `string` (ISO) | Yes | Last update timestamp |

---

## 4. API Endpoints Specification

### 4.1 Authentication API

#### 1. Email/Password Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "selectedPlanId": "ppl-standard"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "user@example.com",
      "name": "USER",
      "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com",
      "provider": "email",
      "weeklyPlan": {
        "id": "ppl-standard",
        "name": "Push / Pull / Legs (PPL)",
        "description": "Classic 4-day active split focusing on movement patterns.",
        "categories": ["Push", "Pull", "Legs", "Cardio", "Custom"]
      }
    }
  }
}
```

#### 2. Google OAuth Login
- **Endpoint**: `POST /api/v1/auth/google`
- **Auth Required**: No
- **Request Body**:
```json
{
  "idToken": "google_oauth_id_token_string",
  "selectedPlanId": "ppl-standard"
}
```
- **Response** (`200 OK`): Same response object format as Email Login.

#### 3. Get Active Session (`Me`)
- **Endpoint**: `GET /api/v1/auth/me`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "user@example.com",
      "name": "Alex Developer",
      "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com",
      "provider": "google",
      "weeklyPlan": {
        "id": "ppl-standard",
        "name": "Push / Pull / Legs (PPL)",
        "categories": ["Push", "Pull", "Legs", "Cardio", "Custom"]
      }
    }
  }
}
```

#### 4. Update User Active Weekly Plan
- **Endpoint**: `PUT /api/v1/auth/plan`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "plan": {
    "id": "ppl-core",
    "name": "PPL + Core & Cardio",
    "description": "Comprehensive 5-day athletic split.",
    "categories": ["Push", "Pull", "Legs", "Core", "Cardio", "Custom"]
  }
}
```
- **Response** (`200 OK`): Returns updated `User` object.

#### 5. Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4.2 Gym Logs API

#### 1. Fetch Gym Logs
- **Endpoint**: `GET /api/v1/logs`
- **Auth Required**: Yes
- **Query Parameters**:
  - `startDate` (optional, string `YYYY-MM-DD`)
  - `endDate` (optional, string `YYYY-MM-DD`)
  - `workoutType` (optional, string)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "log-20260726-101",
      "date": "2026-07-26",
      "hours": 1.5,
      "workoutType": "Push",
      "notes": "Chest & Triceps focus",
      "updatedAt": "2026-07-26T18:30:00.000Z"
    },
    {
      "id": "log-20260724-102",
      "date": "2026-07-24",
      "hours": 1.25,
      "workoutType": "Pull",
      "notes": "Back & Biceps",
      "updatedAt": "2026-07-24T17:00:00.000Z"
    }
  ]
}
```

#### 2. Create or Update Log Entry
- **Endpoint**: `POST /api/v1/logs` (or `PUT /api/v1/logs/:date`)
- **Auth Required**: Yes
- **Behavior Note**: If a log for the specified date already exists, it MUST be updated. If `hours <= 0`, the log entry for that date should be deleted.
- **Request Body**:
```json
{
  "date": "2026-07-26",
  "hours": 1.5,
  "workoutType": "Push",
  "notes": "Heavy Bench & Dumbbell Incline"
}
```
- **Response** (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "log-20260726-101",
    "date": "2026-07-26",
    "hours": 1.5,
    "workoutType": "Push",
    "notes": "Heavy Bench & Dumbbell Incline",
    "updatedAt": "2026-07-26T19:00:00.000Z"
  }
}
```

#### 3. Delete Log Entry
- **Endpoint**: `DELETE /api/v1/logs/:date`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Workout log for date 2026-07-26 deleted successfully"
}
```

#### 4. Reset & Seed Demo Data
- **Endpoint**: `POST /api/v1/logs/reset`
- **Auth Required**: Yes
- **Description**: Generates 365 days of realistic historical seed data for testing/demo purposes.
- **Response** (`200 OK`): Returns array of newly generated `GymLog[]`.

---

### 4.3 Statistics & Scientific Analytics API

#### 1. Get Dashboard Overview Stats
- **Endpoint**: `GET /api/v1/stats`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "currentStreak": 14,
    "longestStreak": 32,
    "totalDays": 142,
    "totalHours": 184.5,
    "averageHoursPerSession": 1.3,
    "monthlyData": [
      { "month": "Jan", "monthIndex": 0, "year": 2026, "count": 18, "totalHours": 24.5 },
      { "month": "Feb", "monthIndex": 1, "year": 2026, "count": 2, "totalHours": 1.5 },
      { "month": "Mar", "monthIndex": 2, "year": 2026, "count": 12, "totalHours": 15.0 },
      { "month": "Apr", "monthIndex": 3, "year": 2026, "count": 16, "totalHours": 21.0 },
      { "month": "May", "monthIndex": 4, "year": 2026, "count": 22, "totalHours": 31.5 },
      { "month": "Jun", "monthIndex": 5, "year": 2026, "count": 1, "totalHours": 0.5 },
      { "month": "Jul", "monthIndex": 6, "year": 2026, "count": 15, "totalHours": 20.0 }
    ],
    "scientificStreak": {
      "currentStreakDays": 14,
      "longestStreakDays": 32,
      "complianceRate": 86,
      "currentWeekDone": 3,
      "currentWeekTarget": 4,
      "currentWeekStatus": "On Track"
    }
  }
}
```

#### 2. Get Gym Power Score & Anime Tier Breakdown
- **Endpoint**: `GET /api/v1/stats/power`
- **Auth Required**: Yes
- **Query Parameters**:
  - `days` (optional, integer, default: `30` or `365`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "consistencyScore": 42,
    "durationQualityScore": 23,
    "varietyScore": 20,
    "momentumScore": 10,
    "totalScore": 95,
    "character": {
      "name": "Saitama",
      "anime": "One Punch Man",
      "power": 95,
      "title": "One Punch God",
      "avatar": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=300",
      "quote": "100 Push-ups, 100 Sit-ups, 100 Squats, and 10km Running EVERY SINGLE DAY!",
      "tier": "SS",
      "color": "amber",
      "bgGlow": "from-amber-500/20 via-yellow-500/10 to-transparent",
      "border": "border-amber-500/50"
    },
    "activeDays": 22,
    "totalDays": 30,
    "avgSessionHours": 1.3,
    "uniqueTypesCount": 4,
    "evaluationText": "Ultra Instinct consistency! Perfect session duration and frequency."
  }
}
```

---

### 4.4 Prebuilt Weekly Plans API

#### 1. Fetch Available Plans
- **Endpoint**: `GET /api/v1/plans`
- **Auth Required**: No (or Yes)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "ppl-standard",
      "name": "Push / Pull / Legs (PPL)",
      "description": "Classic 4-day active split focusing on movement patterns.",
      "categories": ["Push", "Pull", "Legs", "Cardio", "Custom"]
    },
    {
      "id": "ppl-core",
      "name": "PPL + Core & Cardio",
      "description": "Comprehensive 5-day athletic split.",
      "categories": ["Push", "Pull", "Legs", "Core", "Cardio", "Custom"]
    },
    {
      "id": "upper-lower",
      "name": "Upper / Lower Split",
      "description": "4-day hypertrophy split split into upper & lower body.",
      "categories": ["Upper Body", "Lower Body", "Core & Cardio", "Custom"]
    },
    {
      "id": "full-body",
      "name": "Full Body & Functional",
      "description": "3-day full body strength & conditioning plan.",
      "categories": ["Full Body", "Cardio", "Mobility", "Custom"]
    }
  ]
}
```

---

## 5. Scientific Business Logic & Algorithms

The backend **must** mirror the scientific calculation logic expected by the frontend.

### 5.1 Scientific Plan-Conforming Streak Algorithm

#### Key Principles:
1. **Scheduled Rest Days DO NOT break your streak** as long as you meet your plan's target weekly frequency (e.g. 4 days/week).
2. Skipping workouts beyond rest limits breaks the streak.
3. Uses a **rolling 7-day window**:
   - For any date $D$, if the number of active gym sessions in the 7-day window $[D-6, D] \ge \text{targetDaysPerWeek} - 1$, then date $D$ is deemed **Compliant**.
   - If user actively logged a session on date $D$ ($\text{hours} > 0$), date $D$ is automatically **Compliant**.

#### Calculation Steps:
1. **Target Days Calculation**:
   $$\text{targetDaysPerWeek} = \min(6, \max(3, |\text{activePlanCategories}|))$$
2. **Date Compliance**:
   $$\text{Compliant}(D) = (\text{LoggedHours}(D) > 0) \lor (\text{ActiveSessionsInWindow}(D-6..D) \ge \max(2, \text{targetDaysPerWeek} - 1))$$
3. **Current Streak**: Count consecutive compliant days backward starting from Today (or Yesterday if Today is unlogged rest day).
4. **Longest Streak**: Find maximum consecutive compliant days across the past 365 days.
5. **Compliance Rate**:
   $$\text{ComplianceRate} = \text{Round}\left( \frac{\text{TotalCompliantDays}}{\text{TotalTrackedDays}} \times 100 \right)$$

---

### 5.2 Scientific Gym Power Score (0 – 100) Algorithm

The Gym Power Score is divided into four weighted components:

$$\text{PowerScore} = \text{Consistency} + \text{DurationQuality} + \text{Variety} + \text{Momentum}$$

#### 1. Consistency Score (0 – 45 Points)
- Target active days: $\text{targetActiveDays} = \text{Round}\left(\frac{\text{targetWeeklyDays}}{7} \times \text{periodTotalDays}\right)$
- Ratio: $r = \min\left(1.0, \frac{\text{activeDays}}{\text{targetActiveDays}}\right)$
- $\text{ConsistencyScore} = \text{Round}(r \times 45)$

#### 2. Session Duration Quality Score (0 – 25 Points)
- **Optimal session duration**: $0.75\text{h} \le \text{hours} \le 1.75\text{h}$ ($100\%$ quality score = $1.0$).
- **Overtraining penalty** ($\text{hours} > 1.75\text{h}$): $\max\left(0.4, 1.0 - (\text{hours} - 1.75) \times 0.25\right)$.
- **Under-duration** ($\text{hours} < 0.75\text{h}$): $\max\left(0.2, \frac{\text{hours}}{0.75}\right)$.
- $\text{DurationQualityScore} = \text{Round}(\text{AvgSessionQuality} \times 25)$

#### 3. Split Variety Score (0 – 20 Points)
- Rewards training multiple body parts / categories (target: $\ge 3$ distinct types).
- $\text{VarietyRatio} = \min\left(1.0, \frac{\text{uniqueTypesCount}}{3}\right)$
- $\text{VarietyScore} = \text{Round}(\text{VarietyRatio} \times 20)$

#### 4. Momentum Score (0 – 10 Points)
- Rewards overall active density:
  $$\text{MomentumRatio} = \min\left(1.0, \frac{\text{activeDays}}{\text{periodTotalDays} \times 0.5}\right)$$
- $\text{MomentumScore} = \text{Round}(\text{MomentumRatio} \times 10)$

---

### 5.3 Anime Character Power Tier Mapping

| Tier | Min Score | Max Score | Character Name | Anime | Title |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **D** | 0 | 14 | **Aqua** | Konosuba | Useless Goddess |
| **C** | 15 | 34 | **Mumen Rider** | One Punch Man | Class-C Hero of Justice |
| **B** | 35 | 54 | **Tanjiro Kamado** | Demon Slayer | Water Breathing Swordsman |
| **A** | 55 | 69 | **Izuku Midoriya (Deku)** | My Hero Academia | One For All Successor |
| **S** | 70 | 84 | **Monkey D. Luffy** | One Piece | Gear 5 Sun God Nika |
| **S+** | 85 | 94 | **Satoru Gojo** | Jujutsu Kaisen | The Honored One |
| **SS** | 95 | 100 | **Saitama** | One Punch Man | One Punch God |

---

## 6. Security, Validation & Performance Expectations

### 6.1 Authentication & Authorization
- Protect all `/api/v1/logs/*` and user-specific endpoints with authentication middleware.
- Verify JWT tokens on every request or validate HTTP-only cookie sessions.
- Users must only be able to read, modify, or delete **their own** gym logs.

### 6.2 Data Validation Rules
- **Date**: Must match regex `^\d{4}-\d{2}-\d{2}$` and be a valid calendar date.
- **Hours**: Decimal number, `0.0 <= hours <= 24.0`.
- **Workout Type**: Non-empty string, max length 50.
- **Notes**: String, max length 500.

### 6.3 Database Indexing Requirements
To guarantee sub-50ms analytics and graph rendering queries:
- **Composite Unique Index** on `gym_logs(user_id, date)`.
- **Index** on `gym_logs(user_id, date DESC)` for fast historical window scans.

### 6.4 CORS Configuration
Configure CORS headers to allow requests from the frontend origin:
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`
- Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Allowed Headers: `Content-Type, Authorization`
- Credentials: `true`

---

## 7. Summary Checklist for Backend Developers

- [ ] Setup API Router with prefix `/api/v1`.
- [ ] Implement Authentication routes (`/auth/login`, `/auth/google`, `/auth/me`, `/auth/plan`).
- [ ] Implement Gym Log CRUD routes with upsert logic (`/logs`).
- [ ] Implement Scientific Streak algorithm engine in backend analytics (`/stats`).
- [ ] Implement Gym Power Score & Anime Tier mapping engine (`/stats/power`).
- [ ] Implement Prebuilt Weekly Plans endpoint (`/plans`).
- [ ] Setup database composite indexes on `(user_id, date)`.
- [ ] Implement error handling middleware returning standard error envelope.
