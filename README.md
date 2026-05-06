# Reflekt - Mental Health Tracker

A full-stack mental health tracking application built with Django REST Framework (backend) and React + Vite (frontend).

## 🏗️ Project Structure

```
reflekt/
├── backend/                 # Django REST API
│   ├── core/               # Main Django app
│   ├── reflct/             # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                # Backend environment variables
├── frontend/               # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env               # Frontend environment variables
├── .gitignore
├── package.json           # Root scripts for development
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd reflekt
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

   Or install manually:
   ```bash
   # Backend dependencies
   cd backend
   pip install -r requirements.txt

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Setup environment variables:**

   Copy the example environment files and update with your API keys:

   ```bash
   # Backend .env (backend/.env)
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys

   # Frontend .env (frontend/.env)
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env if needed
   ```

4. **Run database migrations:**
   ```bash
   cd backend
   python manage.py migrate
   ```

5. **Start development servers:**
   ```bash
   # From project root
   npm run dev

   # Or run separately:
   # Terminal 1 - Backend
   cd backend && python manage.py runserver 8001

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 🔧 Configuration

### Backend Environment Variables (`.env`)

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3

# API Keys
GOOGLE_API_KEY=your-google-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# LLM Configuration
LLM_PROVIDER=gemini  # or 'claude'

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_BASE_URL=http://127.0.0.1:8001/api
VITE_APP_ENV=development
```

## 📱 Features

- **User Authentication** - JWT-based login/registration
- **Journal Entries** - Audio transcription and text refinement
- **Burnout Tracking** - Automated burnout score calculation
- **Personalized Recommendations** - AI-powered mental health suggestions
- **Statistics Dashboard** - Visual analytics of mental health trends
- **Responsive Design** - Mobile-friendly interface

## 🛠️ Development Scripts

### Root Level Scripts
- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run build:frontend` - Build frontend for production

### Backend Scripts
- `cd backend && python manage.py runserver 8001` - Start Django server
- `cd backend && python manage.py migrate` - Run database migrations
- `cd backend && python manage.py createsuperuser` - Create admin user

### Frontend Scripts
- `cd frontend && npm run dev` - Start Vite dev server
- `cd frontend && npm run build` - Build for production
- `cd frontend && npm run lint` - Run ESLint

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login

### Core Features
- `GET /api/stats/` - Get burnout statistics
- `GET /api/recommendations/` - Get recommendations
- `POST /api/recommendations/` - Generate new recommendation
- `POST /api/journal/` - Process audio journal entry

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
