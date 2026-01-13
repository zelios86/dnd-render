# D&D Character Management App

A mobile-first Progressive Web App for managing D&D 5e characters, inspired by DnDBeyond.

## Features

- ✅ **Character Creation Wizard** - Semi-automated character creation with auto-calculations
- ✅ **Character Sheet** - Complete character sheet with all stats and abilities
- ✅ **Rules Browser** - Browse spells, items, feats from D&D 5.5 (2024) API
- ✅ **Multi-Character Management** - Create and manage multiple characters
- ✅ **Mobile-First Design** - Optimized for mobile devices with touch-friendly UI
- ✅ **100% Free** - No database costs, file-based storage

## Tech Stack

### Backend
- **Express.js** - REST API server
- **File-based Storage** - JSON file storage (zero cost)
- **D&D 5e API** - Integration with dnd5eapi.co for game data
- **Auto-calculations** - Proficiency, HP, AC, modifiers, skills, saves

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Mobile-first styling
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher
- npm 10.1.0 or higher

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dnd-render
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables

Backend (.env):
```env
NODE_ENV=development
PORT=3000
OPEN5E_API_URL=https://api.open5e.com/v2
DND5E_API_URL=https://www.dnd5eapi.co/api
CORS_ORIGIN=http://localhost:5173
```

Frontend (frontend/.env):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Running the Application

1. Start the backend server
```bash
npm start
# or for development with auto-reload
npm run dev
```

2. Start the frontend dev server
```bash
cd frontend
npm run dev
```

3. Open your browser to `http://localhost:5173`

## API Endpoints

### Character Management
- `POST /api/characters` - Create new character
- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get single character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character
- `PATCH /api/characters/:id/hp` - Update HP
- `PATCH /api/characters/:id/spell-slots` - Update spell slots

### D&D 5e API Proxy
- `GET /api/dnd/races` - Get all races
- `GET /api/dnd/classes` - Get all classes
- `GET /api/dnd/spells` - Get spells (with filters)
- `GET /api/dnd/equipment` - Get equipment
- `GET /api/dnd/magic-items` - Get magic items
- `GET /api/dnd/feats` - Get feats
- `GET /api/dnd/conditions` - Get conditions

## Project Structure

```
dnd-render/
├── backend/
│   ├── data/
│   │   └── characters.json          # Character storage
│   ├── controllers/                 # Request handlers
│   ├── routes/                      # API routes
│   ├── services/                    # Business logic
│   │   ├── calculationService.js    # Auto-calculations
│   │   ├── dndApiService.js         # D&D API integration
│   │   └── storageService.js        # File storage
│   ├── middleware/                  # Express middleware
│   └── server.js                    # Main server file
├── frontend/
│   ├── src/
│   │   ├── api/                     # API client functions
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Utility functions
│   └── ...
├── .env                             # Backend environment variables
└── package.json                     # Backend dependencies
```

## Auto-Calculation Features

The app automatically calculates:
- **Proficiency Bonus** - Based on character level
- **Ability Modifiers** - From ability scores
- **Final Ability Scores** - Base scores + racial bonuses
- **Hit Points** - Class hit die + CON modifier
- **Armor Class** - Base AC + DEX modifier + equipment
- **Saving Throws** - Ability modifier + proficiency (if proficient)
- **Skills** - Ability modifier + proficiency bonus (if proficient)
- **Initiative** - DEX modifier
- **Spell Save DC** - 8 + proficiency + spellcasting ability modifier

## Deployment

### Backend (Render.com)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

### Frontend (Render.com or Vercel)
1. Create Static Site
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_BASE_URL=<backend-url>`

**Total Monthly Cost: $0.00** 💰

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or pull request.
