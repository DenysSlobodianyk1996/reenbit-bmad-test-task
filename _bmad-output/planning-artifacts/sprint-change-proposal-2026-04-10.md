# Sprint Change Proposal

**Generated**: 2026-04-10  
**Project**: Event-Hub  
**Triggered By**: Workspace structure mismatch in Story 1.1  
**Classification**: Minor-Moderate (Developer agent can implement with backlog updates)

---

## Section 1: Issue Summary

### Problem Statement
The NX monorepo workspace at `/event-hub/` was initialized using the default "Angular" preset which created a demo "shop" application. This conflicts with the sprint plan which expects an Event-Hub specific workspace structure with:
- `apps/Event-Hub-FE` (Angular frontend)
- `apps/Event-Hub-BE` (.NET backend)
- `libs/event-hub/feature`, `data`, `shell` (Angular libraries)

### Current State
| Component | Current | Expected |
|-----------|---------|----------|
| Frontend App | `apps/shop` | `apps/Event-Hub-FE` |
| E2E Tests | `apps/shop-e2e` | None (or integrated) |
| Frontend Libs | `libs/shop` | `libs/event-hub/*` |
| Backend API | `apps/api` (Node/TS) | `apps/Event-Hub-BE` (.NET) |

### Discovery Context
Identified during Correct Course workflow execution when verifying readiness for Story 1.1 implementation.

---

## Section 2: Impact Analysis

### Epic Impact

**Phase 1: Project Initialization**
- Status: Minor impact
- Epic remains viable with story modifications
- Story 1.1 requires rewrite from "create" to "migrate/correct"

**Phases 2-8: Remaining Work**
- No impact on future epics
- Stories reference correct lib structure (`event-hub/*`) which aligns with proposal
- No dependency conflicts

### Artifact Conflicts

| Artifact | Conflict? | Required Action |
|----------|-----------|-----------------|
| PRD | No | Planning artifacts empty; stories are source of truth |
| Epics/Stories | Yes | Story 1.1 needs rewrite |
| Architecture | Partial | Backend tech mismatch (Node vs .NET) - must add .NET API |
| UI/UX | No | Angular Material theming remains applicable |

### Technical Impact

**Required Changes:**
1. Remove `apps/shop`, `apps/shop-e2e`, `libs/shop`
2. Generate new Angular app: `apps/Event-Hub-FE`
3. Generate Angular libraries: `libs/event-hub/feature`, `data`, `shell`
4. Create .NET Web API: `apps/Event-Hub-BE`
5. Add EF Core SQLite package
6. Configure CORS for Angular↔.NET communication
7. Clean up any shop-specific configurations

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment

**Rationale:**
- Workspace is functional and properly configured (NX, Angular tooling, ESLint, Prettier)
- Deleting and recreating would waste time
- Lower risk than rollback approach
- Maintains existing git history and CI configuration

**Justification:**
- Effort: Medium (half day to migrate)
- Risk: Low (standard NX operations)
- Timeline Impact: Minimal (same sprint)

### Alternative Considered: Rollback
- Rejected: Existing workspace has valuable tooling setup; recreation adds no value

---

## Section 4: Detailed Change Proposals

### Story 1.1: Initialize Nx Workspace and Projects (REVISED)

**OLD Story**: Focused on creating a fresh workspace  
**NEW Story**: Focused on correcting existing workspace structure

---

**Story ID**: 1.1  
**Epic**: Phase 1: Project Initialization  
**Status**: ready-for-dev (revised)  
**Created**: 2026-04-10  

---

### User Story
As a developer, I want to correct the NX workspace structure and set up Event-Hub specific projects so that the foundation matches the sprint plan requirements.

---

### Acceptance Criteria

#### 1.1.1 Remove Demo Application
- [ ] Remove shop app: `nx g rm apps/shop`
- [ ] Remove shop e2e: `nx g rm apps/shop-e2e`
- [ ] Remove shop libs: `nx g rm libs/shop`
- [ ] Verify no shop references remain in `nx.json`, `package.json`

#### 1.1.2 Generate Event-Hub Angular Application
- [ ] Generate Angular app: `nx g @nx/angular:app Event-Hub-FE --routing --style=scss`
- [ ] Verify app builds: `nx build Event-Hub-FE`
- [ ] Verify app runs: `nx serve Event-Hub-FE` accessible at localhost:4200

#### 1.1.3 Add Angular Material
- [ ] Add Angular Material: `nx g @angular/material:ng-add --project=Event-Hub-FE`
- [ ] Configure Material theme (Indigo/Pink)
- [ ] Verify Material imports work

#### 1.1.4 Generate Event-Hub Libraries
- [ ] Generate feature lib: `nx g @nx/angular:lib event-hub/feature --directory=libs/event-hub/feature`
- [ ] Generate data lib: `nx g @nx/angular:lib event-hub/data --directory=libs/event-hub/data`
- [ ] Generate shell lib: `nx g @nx/angular:lib event-hub/shell --directory=libs/event-hub/shell`
- [ ] All libs build successfully: `nx build event-hub-feature`

#### 1.1.5 Create .NET Web API
- [ ] Navigate to `apps/` folder
- [ ] Create .NET Web API: `dotnet new webapi -n Event-Hub-BE`
- [ ] Add EF Core SQLite: `dotnet add package Microsoft.EntityFrameworkCore.Sqlite`
- [ ] Project builds: `dotnet build apps/Event-Hub-BE`
- [ ] Project runs: `dotnet run --project apps/Event-Hub-BE` accessible at localhost:5000/5001

#### 1.1.6 Configure CORS
- [ ] Add CORS service in `apps/Event-Hub-BE/Program.cs`
- [ ] Configure policy for `http://localhost:4200`
- [ ] Apply CORS middleware before endpoints
- [ ] Test CORS by calling API from Angular port

#### 1.1.7 Clean Up
- [ ] Remove `apps/api` (Node/TS placeholder API) if not needed elsewhere
- [ ] Update `.gitignore` if needed
- [ ] Verify workspace lint passes: `nx lint`

---

### Commands Summary

```bash
# 1. Remove demo applications
nx g rm apps/shop
nx g rm apps/shop-e2e
nx g rm libs/shop

# 2. Generate Event-Hub Angular app
nx g @nx/angular:app Event-Hub-FE --routing --style=scss

# 3. Add Angular Material
nx g @angular/material:ng-add --project=Event-Hub-FE

# 4. Generate libs
nx g @nx/angular:lib event-hub/feature --directory=libs/event-hub/feature
nx g @nx/angular:lib event-hub/data --directory=libs/event-hub/data
nx g @nx/angular:lib event-hub/shell --directory=libs/event-hub/shell

# 5. Create .NET API
cd apps
dotnet new webapi -n Event-Hub-BE
cd Event-Hub-BE
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# 6. Optionally remove placeholder Node API
nx g rm apps/api
```

### CORS Configuration

```csharp
// Add to apps/Event-Hub-BE/Program.cs before app.UseRouting()
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// After builder.Build():
app.UseCors("AllowAngular");
```

---

### File Structure After Changes

```
event-hub/
├── apps/
│   ├── Event-Hub-FE/          # Angular app (replaces shop)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   └── styles.scss
│   │   ├── project.json
│   │   └── ...
│   └── Event-Hub-BE/          # .NET API (new)
│       ├── Controllers/
│       ├── Program.cs
│       ├── EventHubBE.csproj
│       └── ...
├── libs/
│   ├── event-hub/             # (replaces shop)
│   │   ├── feature/
│   │   ├── data/
│   │   └── shell/
│   └── shared/                # (existing, keep)
├── nx.json
├── package.json
└── ...
```

---

### Definition of Done
- [ ] All acceptance criteria met
- [ ] shop app completely removed
- [ ] Event-Hub-FE runs at localhost:4200
- [ ] Event-Hub-BE runs at localhost:5000/5001
- [ ] CORS working between ports
- [ ] All libraries build successfully
- [ ] No build errors or warnings
- [ ] Git committed with clear message

### Notes
- This story replaces the original workspace creation with workspace correction
- Keep existing tooling configuration (ESLint, Prettier, etc.)
- SQLite package added for Phase 2 database work

---

## Section 5: Implementation Handoff

### Scope Classification: Minor

**Rationale**: Changes are contained within Phase 1, do not affect other phases, and can be implemented by Developer agent without replanning.

### Handoff Recipients

| Role | Responsibility |
|------|----------------|
| **Developer Agent** | Execute Story 1.1 (revised) implementation |
| **Code Review** | Run `bmad-code-review` after completion |

### Success Criteria
1. All acceptance criteria in revised Story 1.1 pass
2. `nx build`, `nx lint`, `nx test` pass for all projects
3. Both FE and BE run independently
4. CORS test succeeds (API callable from Angular)
5. sprint-status.yaml updated to mark 1-1 as done

---

## Section 6: Approval

### Checklist Completion
- [x] Section 1: Trigger and Context
- [x] Section 2: Epic Impact Assessment
- [x] Section 3: Artifact Conflict Analysis
- [x] Section 4: Path Forward Evaluation
- [x] Section 5: Sprint Change Proposal Components
- [x] Section 6: Final Review

### Proposal Status
**APPROVED**

---

**Approved By**: Denysslobodianyk  
**Date**: 2026-04-10  
**Notes**: Proceed with Direct Adjustment approach. Delete shop app entirely.
