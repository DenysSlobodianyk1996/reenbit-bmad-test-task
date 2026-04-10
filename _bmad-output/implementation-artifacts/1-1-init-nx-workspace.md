---
story_id: "1.1"
epic: "Phase 1: Project Initialization"
title: "Initialize Nx Workspace and Projects"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 1.1: Initialize Nx Workspace and Projects

## User Story
As a developer, I want to set up an Nx workspace with Angular and .NET projects so that I have a foundation for the Event-Hub application.

## Acceptance Criteria

### 1.1.1 Nx Workspace Created
- [ ] Run `npx create-nx-workspace@latest event-hub`
- [ ] Select "Angular" preset
- [ ] Configure for integrated monorepo
- [ ] Workspace builds successfully with `nx build`

### 1.1.2 Angular Application Added
- [ ] Generate Angular app: `nx g @nx/angular:app Event-Hub-FE`
- [ ] Add Angular Material: `nx g @angular/material:ng-add`
- [ ] Configure Material theme (Indigo/Pink or similar)
- [ ] App runs successfully: `nx serve Event-Hub-FE` accessible at localhost:4200

### 1.1.3 Angular Libraries Added
- [ ] Generate feature lib: `nx g @nx/angular:lib event-hub/feature`
- [ ] Generate data lib: `nx g @nx/angular:lib event-hub/data`
- [ ] Generate shell lib: `nx g @nx/angular:lib event-hub/shell`
- [ ] All libs build successfully: `nx build event-hub-feature`

### 1.1.4 .NET Web API Added
- [ ] Navigate to `apps/` folder
- [ ] Create .NET Web API: `dotnet new webapi -n Event-Hub-BE`
- [ ] Add EF Core SQLite: `dotnet add package Microsoft.EntityFrameworkCore.Sqlite`
- [ ] Project builds: `dotnet build`
- [ ] Project runs: `dotnet run` accessible at localhost:5000/5001

### 1.1.5 CORS Configured
- [ ] Add CORS service in `Program.cs`
- [ ] Configure policy for `http://localhost:4200`
- [ ] Apply CORS middleware before endpoints
- [ ] Test CORS by calling API from Angular port

## Technical Requirements

### Commands Summary
```bash
# 1. Create Nx workspace
npx create-nx-workspace@latest event-hub

# 2. Generate Angular app (inside workspace)
nx g @nx/angular:app Event-Hub-FE

# 3. Add Angular Material
nx g @angular/material:ng-add

# 4. Generate libs
nx g @nx/angular:lib event-hub/feature
nx g @nx/angular:lib event-hub/data
nx g @nx/angular:lib event-hub/shell

# 5. Create .NET API (in apps folder)
cd apps
dotnet new webapi -n Event-Hub-BE
cd Event-Hub-BE
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

### CORS Configuration
```csharp
// Add to Program.cs before app.UseRouting()
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

## File Structure Created
```
event-hub/
├── apps/
│   ├── Event-Hub-FE/          # Angular app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   └── styles.scss
│   │   ├── project.json
│   │   └── ...
│   └── Event-Hub-BE/          # .NET API
│       ├── Controllers/
│       ├── Program.cs
│       ├── EventHubBE.csproj
│       └── ...
├── libs/
│   └── event-hub/
│       ├── feature/
│       ├── data/
│       └── shell/
├── nx.json
├── package.json
└── ...
```

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Both FE and BE run independently
- [ ] CORS working between ports
- [ ] No build errors or warnings
- [ ] Git initialized with initial commit

## Notes
- This is the foundation story - all subsequent work depends on this
- Keep it simple, no custom code yet - just project scaffolding
- SQLite package added for Phase 2
