---
story_id: "8.1"
epic: "Phase 8: Documentation and Repository"
title: "Create README and Finalize Repository"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 8.1: Create README and Finalize Repository

## User Story
As a developer, I want to document the project so that others can understand and run the Event-Hub application.

## Acceptance Criteria

### 8.1.1 Update .gitignore
- [ ] Add SQLite database files:
  ```
  # SQLite Database
  *.db
  *.db-journal
  apps/Event-Hub-BE/*.db
  ```
- [ ] Verify no .db files are tracked by git
- [ ] Clean up any accidentally committed .db files

### 8.1.2 Create README.md
Create comprehensive README at project root:

**Required Sections:**

1. **Title and Description**
   - Event-Hub
   - Brief description of the project

2. **Prerequisites**
   - Node.js 20+
   - npm 10+
   - .NET SDK 8.0+
   - (Optional) Angular CLI

3. **Installation**
   ```bash
   git clone <repo-url>
   cd event-hub
   npm install
   ```

4. **Running the Application**
   
   **Backend:**
   ```bash
   cd apps/Event-Hub-BE
   dotnet run
   # API runs on https://localhost:5001
   ```
   
   **Frontend:**
   ```bash
   # In new terminal, from project root
   nx serve Event-Hub-FE
   # App runs on http://localhost:4200
   ```

5. **Development Scripts**
   Add to `package.json`:
   ```json
   "scripts": {
     "start:be": "cd apps/Event-Hub-BE && dotnet run",
     "start:fe": "nx serve Event-Hub-FE",
     "start:all": "npm run start:be & npm run start:fe"
   }
   ```

6. **Technology Stack**
   | Layer | Technology |
   |-------|------------|
   | Frontend | Angular 21, Angular Material, RxJS |
   | Backend | ASP.NET Core Web API |
   | Database | SQLite (EF Core) |
   | Monorepo | Nx |

7. **API Endpoints**
   | Method | Endpoint | Description |
   |--------|----------|-------------|
   | POST | `/api/events` | Create new event |
   | POST | `/api/events/query` | Query with filter/sort/page |

8. **Project Structure**
   Brief overview of folder structure

9. **Notes**
   - SQLite database auto-creates on first run
   - CORS configured for localhost:4200

### 8.1.3 Final Git Commit
- [ ] Stage all changes
- [ ] Meaningful commit message:
  ```
  feat: implement Event-Hub with Angular and .NET
  
  - Nx workspace with Angular FE and .NET BE
  - Event list with filtering, sorting, pagination
  - Create event form with validation
  - SQLite database with EF Core
  - Material Design UI
  ```
- [ ] Verify clean working directory

## README.md Template

```markdown
# Event-Hub

Nx monorepo workspace with Angular frontend and ASP.NET Core Web API backend for event tracking.

## Prerequisites

- Node.js 20+
- npm 10+
- .NET SDK 8.0+
- Angular CLI (optional, Nx handles it)

## Installation

```bash
git clone <your-repo-url>
cd event-hub
npm install
```

## Running the Application

### 1. Start Backend (.NET API)

```bash
cd apps/Event-Hub-BE
dotnet run
```

- API runs on `https://localhost:5001` (or `http://localhost:5000`)
- SQLite database auto-creates on first run (`eventhub.db`)
- CORS configured for Angular dev server

### 2. Start Frontend (Angular)

In a new terminal:

```bash
# From project root
nx serve Event-Hub-FE
```

- App runs on `http://localhost:4200`
- Navigate to http://localhost:4200

### 3. Verify Setup

- Open http://localhost:4200
- Create events via "Create Event" page
- View/filter/sort events in the Events list

## Development Scripts

```bash
# Run both (convenience)
npm run start:all

# Or separately:
npm run start:be    # .NET API
npm run start:fe    # Angular dev server
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 21, Angular Material, RxJS, Reactive Forms |
| State | BehaviorSubjects, Async pipes |
| Backend | ASP.NET Core Web API |
| Database | SQLite (Entity Framework Core) |
| Monorepo | Nx |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create new event |
| POST | `/api/events/query` | Query events with filter/sort/page |

### Event Model

```json
{
  "id": "guid",
  "userId": "string",
  "type": "PageView | Click | Purchase",
  "description": "string",
  "createdAt": "datetime"
}
```

## Project Structure

```
event-hub/
├── apps/
│   ├── Event-Hub-FE/          # Angular 21 application
│   │   ├── src/app/
│   │   │   ├── events/        # Event list, create
│   │   │   ├── core/          # Error handler
│   │   │   └── ...
│   │   └── ...
│   └── Event-Hub-BE/          # .NET Web API
│       ├── Controllers/
│       │   └── EventsController.cs
│       ├── Models/
│       ├── Data/
│       └── ...
├── libs/
│   └── event-hub/
│       ├── feature/           # UI components
│       ├── data/              # API services
│       └── shell/             # Layout
└── ...
```

## Notes

- SQLite database (`*.db` files) is gitignored and auto-creates on first run
- CORS is configured for `localhost:4200` in development
- All form fields are required when creating events
- Filtering and pagination happen server-side for performance
```

## Definition of Done
- [ ] .gitignore updated with *.db
- [ ] README.md complete with all sections
- [ ] package.json scripts added
- [ ] Final commit made
- [ ] Repository clean and ready

## Dependencies
- Story 7.1 (Integration) complete
- Application tested and working

## Final Checklist
- [ ] No secrets in code
- [ ] No hardcoded credentials
- [ ] No large binary files
- [ ] .db files not in repo
- [ ] node_modules not in repo
- [ ] README accurate and complete

## Notes
- This is the final story
- After this, project is ready for submission/sharing
- Ensure all links in README work
