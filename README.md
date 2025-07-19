# KickStartX - Study Momentum PWA

KickStartX is a web-based Progressive Web App designed to help students and learners overcome procrastination by transforming study intent into daily momentum.

## 🚀 Features

### Core Functionality
- **Intent-driven reminders**: Record why your study goal matters to you
- **AI-powered micro challenges**: Warm-up questions to ease into study sessions
- **Daily topic planning**: Break down content into manageable daily chunks
- **Motivational nudges**: AI-generated reminders using your personal intent

### Key Components
1. **Intent Recorder**: Voice recording of personal motivation
2. **Content Analyzer**: Upload PDFs or links for automatic topic breakdown
3. **Momentum Builder**: Daily warm-up challenges and curiosity sparks
4. **Progress Tracker**: Visual tracking of completed topics and streaks

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for audio recordings and files)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🏗 Architecture

### Database Schema
- `tasks` table: User study tasks with intent recordings and content
- `audio-recordings` bucket: Voice recordings of user intentions
- `content-files` bucket: Uploaded PDFs and study materials

### Key Features
- Row Level Security (RLS) for data protection
- Real-time updates with Supabase
- Responsive design for mobile and desktop
- PWA capabilities for offline access

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kickstartx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Set up storage buckets for audio recordings and content files

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 Usage

### Creating a Study Task
1. **Define Goal**: Set title and description for your study objective
2. **Record Intent**: Voice record why this goal matters to you
3. **Add Content**: Upload PDF or provide link to study material
4. **Start Studying**: Begin with AI-generated warm-up challenges

### Study Session Flow
1. **Warm-up Challenges**: 5-10 questions to activate your brain
2. **Curiosity Spark**: Interesting fact related to your topic
3. **Focused Study**: Access your content with motivational context
4. **Progress Tracking**: Mark topics complete and build streaks

## 🔮 Future Enhancements

### AI Integration Roadmap
- **Gemini API**: Generate contextual motivational reminders
- **Content Analysis**: Automatic PDF parsing and topic extraction
- **ElevenLabs**: Convert text reminders to natural voice
- **Smart Scheduling**: AI-optimized study timing based on user patterns

### Advanced Features
- **Spaced Repetition**: Intelligent review scheduling
- **Social Features**: Study groups and accountability partners
- **Analytics**: Detailed progress insights and habit tracking
- **Offline Mode**: Full PWA functionality without internet

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with love by students, for students
- Inspired by the need to bridge the gap between study intentions and actions
- Special thanks to the open-source community for the amazing tools and libraries

---

**Ready to transform your study habits?** Start building momentum today with KickStartX! 🚀