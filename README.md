# Nexlayer Quiz Platform 🧠

A comprehensive quiz application built specifically for the Nexlayer AI-Native Cloud Platform. Test your knowledge of cloud deployment, AI integration, CLI commands, and configuration management with our interactive quiz system.

## 🌟 Features

### 📚 Comprehensive Quiz Content
- **46+ Questions** across 3 specialized quizzes
- **Nexlayer Fundamentals** (16 questions) - Core platform concepts
- **AI-Native Cloud Deployment** (15 questions) - Advanced deployment strategies  
- **Configuration & CLI** (15 questions) - Hands-on technical skills

### 🎨 Modern UI/UX
- **Purple/Blue Gradient Theme** - Consistent Nexlayer branding
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Enhanced user experience with CSS transitions
- **Dark/Light Mode** - Automatic theme detection

### 🏆 Interactive Features
- **Real-time Progress Tracking** - Visual progress bars during quizzes
- **Performance Badges** - Achievement system based on scores
- **Detailed Results** - Comprehensive score breakdown with visual stats
- **Quiz Statistics** - Dashboard with completion metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Supabase account (for backend)
- Docker Desktop (for local Supabase development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexlayer-quiz-spark
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Start local Supabase (requires Docker)
   npx supabase start
   
   # Apply migrations with comprehensive Nexlayer questions
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   Visit: `http://localhost:8080` (or alternate port if 8080 is busy)

## 📊 Database Schema

### Core Tables
- **`quizzes`** - Quiz metadata (title, description, difficulty)
- **`questions`** - Individual quiz questions  
- **`question_options`** - Multiple choice answers
- **`quiz_sessions`** - User quiz attempts and scores
- **`user_responses`** - Individual question responses

### Key Features
- **Row Level Security (RLS)** - Secure data access
- **Comprehensive Indexing** - Optimized query performance
- **Migration System** - Version-controlled schema changes

## 🎯 Quiz Content Overview

### 1. Nexlayer Fundamentals (16 Questions)
Core concepts including:
- Platform overview and value proposition
- Basic deployment workflows
- Key terminology and concepts
- Getting started procedures

### 2. AI-Native Cloud Deployment (15 Questions)  
Advanced topics covering:
- AI workload optimization
- Scaling strategies
- Performance monitoring
- Integration patterns

### 3. Configuration & CLI (15 Questions)
Technical implementation details:
- Command-line interface usage
- Configuration file management
- Environment setup
- Troubleshooting procedures

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) to Blue (#3B82F6) gradients
- **Secondary**: Muted grays for backgrounds and text
- **Accent**: Success (green), Warning (yellow), Error (red)

### Typography
- **Headings**: Bold weights with gradient text effects
- **Body**: Clean, readable fonts with proper contrast
- **Code**: Monospace font for technical content

### Components
Built with **shadcn/ui** components:
- Cards, Buttons, Badges, Progress bars
- Dialogs, Tooltips, Form controls
- Responsive layout system

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Two column grid
- **Desktop**: > 1024px - Full multi-column layout

### Features
- Touch-friendly interface on mobile
- Optimized typography scaling
- Adaptive component sizing
- Progressive enhancement

## 🧪 Development

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Ready for Vercel/Netlify

### Code Structure
```
src/
├── components/
│   ├── quiz/                 # Quiz-specific components
│   │   ├── QuizDashboard.tsx # Main landing page
│   │   ├── QuizList.tsx      # Quiz selection
│   │   ├── QuizTaker.tsx     # Interactive quiz interface
│   │   └── QuizResults.tsx   # Results display
│   └── ui/                   # Reusable UI components
├── integrations/
│   └── supabase/            # Database client & types
├── pages/
│   └── Index.tsx            # Main application shell
└── lib/
    └── utils.ts             # Utility functions
```

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build  
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
npm run lint         # Code linting
```

## 🚢 Deployment

### Supabase Setup
1. Create new Supabase project
2. Run migrations: `supabase/migrations/20250806000000_nexlayer_quiz_data.sql`
3. Configure RLS policies
4. Update environment variables

### Frontend Deploy
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables
4. Set up custom domain (optional)

---

**Built with ❤️ for the Nexlayer Community**

Transform your cloud deployment knowledge with our comprehensive quiz platform. From fundamentals to advanced concepts, master the AI-Native Cloud Platform where no infrastructure PhD is required! 🚀
