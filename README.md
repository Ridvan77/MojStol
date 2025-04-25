# Restaurant Table Reservation System

## About Project
This web application enables easy management of restaurant table reservations. Main functionalities include:
- **For users**: Browse restaurants and make online table reservations
- **For restaurants**: Create restaurant profiles and manage reservations
- **For administrators**: Complete control over the system and all its components

## Technologies
- **Backend**: .NET Core
- **Frontend**: Angular + Bootstrap
- **Database**: SQL Server

## Installation and Setup

### Backend
1. Clone the repository
2. Navigate to backend directory
3. Update `appsettings.json` with your database connection string:
```json
"ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER; Database=MojStolDb; Trusted_Connection=True; MultipleActiveResultSets=True; TrustServerCertificate=True"
}
```
4. Execute the following commands:
```bash
dotnet rebuild
dotnet ef migrations add InitialMigration or add-migration InitialMigration
dotnet ef database update or update-database
dotnet run --project backend.csproj
```

### Frontend
1. Navigate to frontend directory
2. Execute the following commands:
```bash
npm install
ng serve
```
3. Open application at `http://localhost:4200`



Admin Role Login:
    adil+1@edu.fit.ba
    AdminPass
Owner Role Login:
    adil+2@edu.fit.ba
    UserPass
User Role Login:
    adil+3@edu.fit.ba
    OwnerPass

## Prerequisites
- .NET Core SDK
- Node.js and npm
- SQL Server
- Angular CLI

