# SpeakWrite AI

> **"Practice privately. Make mistakes safely. Speak confidently."**

SpeakWrite AI is a complete, production-ready full-stack web application designed to help English learners and professionals overcome hesitation, improve grammar and vocabulary, conquer stage fear, and build real-world communication confidence.

---

## The Core Learning Journey

```
       TOPIC
         ↓
   TIMED WRITING
         ↓
   AI CORRECTION
         ↓
   VOICE PRACTICE
         ↓
 AI VOICE FEEDBACK
         ↓
   VIDEO PRACTICE
         ↓
AI PERFORMANCE FEEDBACK
         ↓
 PROGRESS TRACKING
         ↓
IMPROVED CONFIDENCE
```

---

## Key Features

1. **Timed Writing Practice**:
   - Customizable categories (Essay, Paragraph, Story, Email, Letter, Opinion, Interview Answer, Daily Journal, Presentation Topic).
   - Difficulty selection (Beginner, Intermediate, Advanced).
   - Countdown timer (1m quick test, 5m, 10m, 15m, 30m) with live word counter and target indicator.
   - **Auto-submission on timer expiration**: Locks the textarea immediately and evaluates the response.
   - [Start], [Pause], [Resume], [Submit], and [Save Draft] controls.

2. **AI Writing Correction & Diagnostic**:
   - **Strict 6-Category Weighted Scoring**:
     - Grammar: 25%
     - Vocabulary: 20%
     - Sentence Structure: 20%
     - Clarity: 15%
     - Organization: 10%
     - Spelling & Punctuation: 10%
   - **Interactive In-Text Mistake Highlighting**: Click any error directly in your submitted text to inspect the rule and correction.
   - **Detailed Mistakes Table**: Original error sentence, corrected phrasing, mistake category, and pedagogical explanation.
   - Things you did well (Strengths), Things to improve (Weaknesses), and Better vocabulary upgrades with example sentences.

3. **AI Voice Practice**:
   - Live microphone capture with browser MediaRecorder and Web Audio API.
   - Real-time animated audio waveform visualizer responding to voice volume.
   - Live speech recognition transcript capture.
   - **Speaking Score Dimensions**:
     - Fluency: 25%
     - Grammar: 20%
     - Vocabulary: 20%
     - Pronunciation: 20%
     - Confidence: 15%
   - Filler word detector (`um`, `like`, `you know`, `actually`, etc.) and speaking tempo (Words Per Minute).

4. **AI Voice Conversation**:
   - 10 real-world conversational scenarios (Daily Conversation, Job Interview, College Interview, Travel, Restaurant, Customer Service, Group Discussion, IELTS Speaking, Public Speaking, Self Introduction).
   - Natural, supportive conversational partner that asks thoughtful follow-up questions.
   - AI audio response playback with Play, Pause, and Replay controls.
   - Multi-turn conversation diagnostic scorecard upon session completion.

5. **AI Video Practice (Stage Fear Desensitization)**:
   - **Progressive Difficulty Levels**:
     - Level 1: AI voice only (low pressure)
     - Level 2: AI avatar interviewer
     - Level 3: Presentation simulation
     - Level 4: Advanced boardroom and conference simulation
   - Real-time camera preview with face centering guide and microphone status.
   - Multimodal evaluation: Communication (25%), Clarity (20%), Grammar (20%), Vocabulary (15%), Confidence (10%), Relevance (10%).
   - Actionable stage fear management and nonverbal body language advice.

6. **Confidence Progress Tracking**:
   - Longitudinal skill tracking across all 8 dimensions.
   - Interactive weekly trend charts and competency radar balance visualizations using Recharts.
   - Personalized encouraging insights and streak monitoring.

7. **Practice Archive & History**:
   - Filter by practice type (Writing, Voice, Video) or minimum score.
   - Click any record to reopen the full diagnostic report and mistakes table.

8. **User Profile & Onboarding**:
   - 4-step interactive onboarding wizard saving English proficiency level, improvement targets, daily commitment, and main difficulties.
   - Personalized settings for AI voice persona, speech pace, and daily reminder alerts.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Recharts, Canvas Confetti.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `multer`.
- **Database**: Dual-mode engine supporting MongoDB (`mongoose`) and an automatic zero-config **Embedded Persistent Storage Engine** (`server/data/store.json`) for seamless out-of-the-box execution without requiring MongoDB installation.
- **AI & Audio Engine**: Real OpenAI integration (GPT-4o, Whisper STT, TTS) with an automatic context-aware **Intelligent Mock AI Fallback Service** when offline or when no `OPENAI_API_KEY` is provided.

---

## Installation & Quickstart

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone or Open the Repository
```bash
cd speakwrite-ai
```

### 2. Install All Dependencies
You can install all dependencies across the root, client, and server in one command:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the `server` directory (or edit `server/.env`):
```bash
# Server port
PORT=5000

# Client origin for CORS
CLIENT_URL=http://localhost:5173

# Optional: MongoDB URI (If empty, the embedded database store will be used automatically)
MONGODB_URI=

# JWT Secret for user session tokens
JWT_SECRET=speakwrite_super_secret_jwt_key_987654321_production

# Optional: OpenAI API Key (If empty, the intelligent mock AI service handles all prompts gracefully)
OPENAI_API_KEY=
```

### 4. Run the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Automated Verification Tests

To run the complete automated test suite testing registration, login, onboarding, timed writing, AI grammar correction, speaking evaluation, dialogue responses, video simulation scoring, progress analytics, and profile updates:

```bash
cd server
node test_api.js
```

---

## License
MIT License. Created for English learners worldwide to build communication confidence safely.
