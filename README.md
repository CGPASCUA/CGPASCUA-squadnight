# SquadNight

SquadNight is a game-night planning web application that helps friends organize squads, schedule gaming sessions, coordinate availability, and manage attendance.

**Live site:** https://cgpascua.github.io/CGPASCUA-squadnight/  
**API health check:** https://squadnight-api.onrender.com/healthz  
**Demo video:** Add your demonstration video link here.

## Features

- **Account authentication** — Register and log in to your account.
- **Squad management** — Create and manage squads, join squads, and view squad members.
- **Session planning** — Organize upcoming gaming sessions with your squad.
- **Game-night coordination** — Coordinate availability and plan sessions with other members.
- **Attendance tracking** — Manage attendance and see who is participating.
- **Session history** — Review previous gaming sessions and related information.
- **Responsive interface** — Navigate the application on supported desktop and mobile screen sizes.

## Built With

- **Frontend:** React, Vite, JavaScript, and CSS
- **Backend:** Node.js and Express
- **Database:** PostgreSQL
- **Authentication:** Token-based authentication
- **Frontend hosting:** GitHub Pages
- **API hosting:** Render
- **Database hosting:** PostgreSQL hosting provider

## Project Structure

```text
CGPASCUA-squadnight/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # API communication
│   │   ├── components/     # Reusable UI components
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── db/                 # Database schema and seed scripts
│   ├── server.js
│   ├── squadsRepo.js
│   ├── squadnightRepo.js
│   └── package.json
├── .env.example
└── README.md
```

## Getting Started

### Requirements

- Node.js 20 or later
- npm
- A PostgreSQL database for local backend development

### 1. Clone the repository

```bash
git clone https://github.com/cgpascua/CGPASCUA-squadnight.git
cd CGPASCUA-squadnight
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory using `.env.example` as a reference. Set `DATABASE_URL` to your PostgreSQL connection string and configure `CORS_ORIGINS` to include the frontend origin.

Do not commit `.env` or expose database credentials.

### 3. Initialize the database

Make sure your PostgreSQL database exists and the connection string is configured correctly. From the `server/` directory, run:

```bash
npm run db:schema
npm run db:seed
```

These commands create the database schema and load the seed data defined by the project.

### 4. Start the backend

From the `server/` directory:

```bash
npm run dev
```

The API should start on the port configured by the server.

### 5. Start the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Create `client/.env` if needed and configure the API URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

**Note:** The frontend API URL must match the actual backend address and port. Environment variables prefixed with `VITE_` are exposed in the browser, so never put passwords or secret keys in them.

## Deployment

### Frontend

The React frontend is deployed using GitHub Pages. The repository's Vite configuration and deployment workflow must match the repository name and hosting setup.

### Backend

The Express API is deployed separately from the frontend. The deployed server needs its environment variables configured in the hosting provider.

### Database

PostgreSQL stores application data. The backend must have a valid database connection, and the database schema must be initialized before database-backed features can work correctly.

The frontend, API, and database must be configured to communicate with one another for the deployed application to work as intended.

## API Health Checks

The deployed API provides health-check endpoints:

- `/healthz` — Checks whether the API process is running.
- `/readyz` — Checks whether the service is ready, including database connectivity where implemented.

A successful health check alone does not guarantee that every application feature is working; authentication, squad operations, session planning, and attendance should also be tested.

## Security

- Keep database credentials and private environment variables out of source control.
- Use HTTPS for deployed services.
- Validate user input on the server.
- Restrict cross-origin requests to trusted frontend origins.
- Do not store sensitive credentials in frontend environment variables.

## Author

**Author:** Add your name  
**Course / Section:** Add your course and section  
**Repository:** https://github.com/cgpascua/CGPASCUA-squadnight

## AI Use Disclosure

AI assistance was used during development to help with debugging, implementation guidance, and documentation. The final disclosure should accurately describe the tools used and the extent of their contributions.

See `AI-USAGE.md` if this file exists in the repository, and update it to reflect the actual development process.

## License

See the `LICENSE` file for the project's license.
