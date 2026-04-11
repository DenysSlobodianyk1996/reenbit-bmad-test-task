# Event-Hub-BE

.NET 10 Web API backend for the Event Hub application.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

## Project Structure

```
Event-Hub-BE/
├── Controllers/       # API controllers
│   └── EventsController.cs
├── Data/             # Database context
│   └── EventHubDbContext.cs
├── Models/           # Entity models and DTOs
│   ├── Event.cs
│   ├── EventType.cs  # Enum, saved as numbers in database, but support string values from JSON payload
│   ├── EventQueryRequest.cs
│   └── EventQueryResponse.cs
├── Properties/
├── appsettings.json
└── Program.cs
```

## Running the Application

### Using .NET CLI

```bash
# Navigate to the project folder
cd apps/Event-Hub-BE

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run
```

The API will be available at:
- HTTP: http://localhost:5000
- HTTPS: https://localhost:7000 (if configured)

### Using Nx

```bash
# From the workspace root
npx nx run Event-Hub-BE:serve

```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create a new event |
| POST | `/api/events/query` | Query events with filter/sort/pagination |

## Example Requests

### Create Event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "type": "Click",
    "description": "User clicked the buy button"
  }'
```

### Query Events

```bash
curl -X POST http://localhost:5000/api/events/query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user",
    "types": ["Click", "Purchase"],
    "sortBy": "CreatedAt",
    "sortOrder": "desc",
    "page": 1,
    "pageSize": 20
  }'
```

## Database

- **Provider**: SQLite
- **File**: `eventhub.db` (auto-created on startup)
- **Connection**: Configured in `Program.cs`

The database file is gitignored and will be recreated automatically when the app starts.

## Configuration

- `appsettings.json` - Production settings
- `appsettings.Development.json` - Development settings
- `Properties/launchSettings.json` - Launch profiles

## CORS

Configured to allow requests from `http://localhost:4200` (Angular frontend).
