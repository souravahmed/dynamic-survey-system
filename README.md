# Dynamic Survey System (DSS)

A full-stack, survey management system featuring a dynamic form builder, role-based access control (RBAC), and submission tracking.

## 🚀 Project Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com) installed.
- **Node.js** (v20+) for local workspace management.

### Installation & Run

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd dynamic-survey-system
   ```

2. **Copy the `.env.example` file and rename it to `.env` both in the frontend and backend directories:**

3. **Build and start the stack:**

```bash
npm run dev
```

If you change dependencies:

```bash
 npm run dev:clean
```

## Tech Stack

**Frontend:** React (Vite), TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Yup, Lucide Icons

**Backend:** NestJS, TypeORM, SQLite (Persistent), Passport.js (JWT)

**Observability:** Prometheus, Grafana

## Design Decisions

- Designed a relational database Entities are `User`,`Survey`, `SurveyFields`, `SurveySubmission` and `SurveySubmissionAnswers` are linked via One-to-Many relations, ensuring high data integrity
- the SQLite database is persisted via a named volume `(backend-db-data`)
- Implemented a `RoleGuard` wrapper on the frontend and `RolesGuard` on the backend to strictly separate Admin and Officer functionalities
- Custom components using `Tailwind CSS` ensure a lightweight, modern design without the bloat of heavy UI frameworks like Material UI or Ant Design
- **Infrastructure as Code (IaC):** Grafana is fully provisioned via YAML, meaning data sources and dashboards are automatically configured on startup without manual UI steps.

## Assumptions

- An `Officer` can submit more than once of a `Survey`
- In dashboard basic statistics are displayed
- No need to drag and drop fields in survey builder
- Submissions are displayed in a table with pagination and expanded rows

## Limitations

- When a survey is taken by an `Officer`, it will still show up in the dashboard
- `Checkbox` responses are concatenated into comma-separated strings for simplified display in this version

## 📊 Observability & Monitoring (New)

The system includes a monitoring stack to track performance and reliability in real-time.

- **Prometheus:** Scrapes application metrics (CPU, Memory, Event Loop) and custom HTTP metrics (Traffic, Latency) via a dedicated NestJS Interceptor.
- **Grafana:** Visualizes metrics through an automated, provisioned dashboard available at `http://localhost:3001`.
- **Custom Metrics:** Tracks the "Golden Signals" including HTTP Throughput by API path.

### Accessing Dashboards

- **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
- **Grafana UI:** [http://localhost:3001](http://localhost:3001) (Default: `admin`/`admin`)
- **Metrics Endpoint:** [http://localhost:3000/metrics](http://localhost:3000/metrics)
