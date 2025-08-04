# 🧠 MindMapGPT

An AI-powered web application that helps users create structured mind maps from their thoughts, questions, or prompts using **Google Gemini AI**. The tool simplifies brainstorming, note-taking, and idea organization with AI assistance.

## 🚀 Features

- **🔐 Secure Authentication** - Register, login, and session management
- **🧠 AI-Powered Mind Maps** - Create structured mind maps using Gemini AI
- **📚 Curated Resources** - Get AI-generated learning resources for any topic
- **📈 Learning Roadmaps** - Generate personalized learning paths
- **📊 Dashboard** - View and manage all your mind maps
- **💾 Persistent Storage** - PostgreSQL database with Prisma ORM
- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, Tailwind CSS, TypeScript |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| AI | Google Gemini 1.5 Flash |
| Hosting | Vercel (Frontend), Railway/Render (Backend) |

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Gemini API key
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd MindMapGPT
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Update .env with your credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/mindmapgpt"
# JWT_SECRET="your-super-secret-jwt-key"
# GEMINI_API_KEY="your-gemini-api-key"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start the development server
npm run dev
```

The backend will be running on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 📁 Project Structure

```
MindMapGPT/
├── Backend/
│   ├── server.js              # Main Express server
│   ├── config/
│   │   ├── database.js        # Prisma client
│   │   └── auth.js           # JWT configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── mindMapController.js # Mind map operations
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   └── mindMap.js        # Mind map routes
│   ├── services/
│   │   └── geminiService.js  # Gemini AI integration
│   ├── utils/
│   │   └── validation.js     # Input validation
│   └── prisma/
│       └── schema.prisma     # Database schema
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/         # Login & register pages
│   │   │   ├── dashboard/    # User dashboard
│   │   │   ├── mindmap/      # Mind map viewer
│   │   │   └── page.tsx      # Landing page
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx # Authentication context
│   │   └── lib/
│   │       └── api.ts        # API client
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login existing user
- `GET /api/me` - Get current user
- `POST /api/logout` - Logout user

### Mind Maps
- `POST /api/mindmap` - Create mind map (with AI generation)
- `GET /api/mindmaps` - List user's mind maps
- `GET /api/mindmap/:id` - Get mind map by ID
- `PUT /api/mindmap/:id` - Update mind map
- `DELETE /api/mindmap/:id` - Delete mind map

### AI-Powered Features
- `GET /api/mindmap/:id/resources` - Generate learning resources
- `GET /api/mindmap/:id/roadmap` - Generate learning roadmap

## 🎯 User Flow

1. **Unauthenticated User**
   - Visit homepage → See landing page
   - Click "Get Started" → Register page
   - Click "Sign In" → Login page

2. **Registration**
   - Fill out registration form
   - Submit → Automatically logged in → Dashboard

3. **Login**
   - Enter credentials
   - Submit → Dashboard

4. **Dashboard**
   - View all mind maps
   - Create new mind map with AI
   - Click on mind map → View details

5. **Mind Map Viewer**
   - View AI-generated mind map structure
   - Generate learning resources
   - Generate learning roadmap
   - Export, edit, or share options

## 🤖 AI Integration

### Mind Map Generation
- Uses Google Gemini 1.5 Flash model
- Generates structured mind maps from user prompts
- Creates logical hierarchies with main concepts and sub-concepts

### Learning Resources
- Curates relevant video tutorials, articles, and documentation
- Provides platform information and descriptions
- Links to external learning materials

### Learning Roadmaps
- Creates personalized learning paths
- Breaks down topics into phases with time estimates
- Provides actionable tasks for each phase

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mindmapgpt"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
GEMINI_API_KEY="your-gemini-api-key-here"
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables (including GEMINI_API_KEY)
3. Deploy automatically

## 🔮 Future Enhancements

- [ ] Real-time collaboration (Socket.io/WebRTC)
- [ ] Drag & drop mind map editing
- [ ] Export to PDF/PNG
- [ ] Advanced mind map visualization
- [ ] Team dashboards and shared folders
- [ ] Integration with more AI models
- [ ] Voice-to-mind-map conversion
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub. 