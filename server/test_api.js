/**
 * Automated Verification Script for SpeakWrite AI REST APIs
 * Directly mounts Express app on an available ephemeral port.
 */

const http = require('http');
const app = require('./server');

async function request(baseUrl, path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting SpeakWrite AI Automated Verification Test Suite...\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const BASE_URL = `http://127.0.0.1:${port}`;
  console.log(`Server listening on test port ${port}`);

  try {
    // 1. Health check
    console.log('1️⃣ Testing Health Endpoint...');
    const health = await request(BASE_URL, '/api/health');
    console.log('Health Response:', health.body);
    if (health.status !== 200 || health.body.status !== 'online') {
      throw new Error('Health check failed!');
    }
    console.log('✅ Health check passed!\n');

    // 2. User Registration
    console.log('2️⃣ Testing User Registration...');
    const testEmail = `test_${Date.now()}@example.com`;
    const regRes = await request(BASE_URL, '/api/auth/register', { method: 'POST' }, {
      name: 'Sarah Jenkins',
      email: testEmail,
      password: 'SecurePassword123!',
      englishLevel: 'Intermediate'
    });
    console.log('Register Response:', regRes.body);
    if (regRes.status !== 201 || !regRes.body.token) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
    }
    const token = regRes.body.token;
    const authHeaders = { Authorization: `Bearer ${token}` };
    console.log('✅ User registration passed!\n');

    // 3. User Login
    console.log('3️⃣ Testing User Login...');
    const loginRes = await request(BASE_URL, '/api/auth/login', { method: 'POST' }, {
      email: testEmail,
      password: 'SecurePassword123!'
    });
    console.log('Login Response:', loginRes.body);
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error('Login failed!');
    }
    console.log('✅ Login passed!\n');

    // 4. Onboarding save
    console.log('4️⃣ Testing Onboarding Preferences...');
    const onboardRes = await request(BASE_URL, '/api/auth/onboarding', { method: 'POST', headers: authHeaders }, {
      englishLevel: 'Upper Intermediate',
      goals: ['Writing', 'Speaking', 'Confidence'],
      dailyGoal: 25,
      difficulties: ['I am afraid to speak', 'I make grammar mistakes']
    });
    console.log('Onboarding Response:', onboardRes.body);
    if (onboardRes.status !== 200 || onboardRes.body.user.dailyGoal !== 25) {
      throw new Error('Onboarding save failed!');
    }
    console.log('✅ Onboarding preferences passed!\n');

    // 5. Writing Topic Generation
    console.log('5️⃣ Testing Writing Topic Generation...');
    const topicRes = await request(BASE_URL, '/api/writing/topic', { method: 'POST', headers: authHeaders }, {
      category: 'Essay',
      difficulty: 'Intermediate'
    });
    console.log('Topic Result:', topicRes.body);
    if (topicRes.status !== 200 || !topicRes.body.topic) {
      throw new Error('Topic generation failed!');
    }
    console.log('✅ Writing topic generation passed!\n');

    // 6. Timed Writing Submission & AI Correction
    console.log('6️⃣ Testing Writing Submission with Intentional Grammar Errors...');
    const sampleAnswer = "In my opinion, I think college is very important. I am agree with this opinion because much people works very hard to achieve their dreams.";
    const writeRes = await request(BASE_URL, '/api/writing/submit', { method: 'POST', headers: authHeaders }, {
      topic: topicRes.body.topic,
      category: 'Essay',
      difficulty: 'Intermediate',
      timeLimit: 300,
      timeUsed: 120,
      answer: sampleAnswer
    });
    console.log('Writing Scores:', writeRes.body.submission?.scores);
    console.log('Overall Score (Weighted):', writeRes.body.submission?.score);
    console.log('Detected Mistakes:', writeRes.body.submission?.feedback?.mistakes);
    if (writeRes.status !== 201 || !writeRes.body.submission?.score) {
      throw new Error('Writing submission evaluation failed!');
    }
    console.log('✅ Writing evaluation & correction passed!\n');

    // 7. Voice Practice Evaluation
    console.log('7️⃣ Testing Speaking Evaluation...');
    const voiceRes = await request(BASE_URL, '/api/voice/evaluate', { method: 'POST', headers: authHeaders }, {
      scenario: 'Tell me about yourself.',
      transcript: 'Hello, um, I am an engineer and, like, I want to improve my speaking, you know, because public speaking makes me nervous.',
      duration: 35
    });
    console.log('Speaking Scores:', voiceRes.body.session?.scores);
    console.log('Filler Words Detected:', voiceRes.body.session?.feedback?.fillerWords);
    console.log('Pacing WPM:', voiceRes.body.session?.feedback?.paceWPM);
    if (voiceRes.status !== 201 || !voiceRes.body.session?.scores?.overallScore) {
      throw new Error('Speaking evaluation failed!');
    }
    console.log('✅ Speaking evaluation passed!\n');

    // 8. Voice Dialogue Conversation
    console.log('8️⃣ Testing AI Dialogue Conversation Partner...');
    const dialogueRes = await request(BASE_URL, '/api/voice/respond', { method: 'POST', headers: authHeaders }, {
      scenario: 'Job Interview',
      messageHistory: [
        { role: 'assistant', content: 'Welcome to our interview. Could you tell me about yourself?' },
        { role: 'user', content: 'I have worked for three years leading software development teams and building web applications.' }
      ]
    });
    console.log('AI Dialogue Reply:', dialogueRes.body.reply);
    if (dialogueRes.status !== 200 || !dialogueRes.body.reply) {
      throw new Error('Dialogue response failed!');
    }
    console.log('✅ AI dialogue conversation passed!\n');

    // 9. Video Simulation Practice Evaluation
    console.log('9️⃣ Testing Video Practice Evaluation...');
    const videoRes = await request(BASE_URL, '/api/video/evaluate', { method: 'POST', headers: authHeaders }, {
      scenario: 'Public Speaking',
      level: 3,
      transcript: 'Good morning everyone. Today I am honored to share our team breakthrough in clean energy. We faced numerous obstacles, but perseverance allowed us to deliver real results.',
      duration: 50
    });
    console.log('Video Practice Scores:', videoRes.body.session?.scores);
    console.log('Stage Fear Advice:', videoRes.body.session?.feedback?.stageFearTips);
    if (videoRes.status !== 201 || !videoRes.body.session?.scores?.overallScore) {
      throw new Error('Video practice evaluation failed!');
    }
    console.log('✅ Video simulation evaluation passed!\n');

    // 10. Progress Summary & History
    console.log('🔟 Testing Progress Analytics & Summary...');
    const progRes = await request(BASE_URL, '/api/progress', { headers: authHeaders });
    console.log('Progress Summary:', {
      writingScore: progRes.body.summary?.writingScore,
      speakingScore: progRes.body.summary?.speakingScore,
      confidenceScore: progRes.body.summary?.confidenceScore,
      totalSessions: progRes.body.summary?.totalSessions,
      improvementMessage: progRes.body.summary?.improvementMessage
    });
    if (progRes.status !== 200 || !progRes.body.summary) {
      throw new Error('Progress analytics failed!');
    }
    console.log('✅ Progress analytics passed!\n');

    // 11. Profile Update
    console.log('1️⃣1️⃣ Testing Profile Update...');
    const profRes = await request(BASE_URL, '/api/profile', { method: 'PUT', headers: authHeaders }, {
      name: 'Sarah Jenkins (Updated)',
      dailyGoal: 30,
      settings: {
        voiceAccent: 'nova',
        speechRate: 1.05,
        notificationsEnabled: true
      }
    });
    console.log('Updated Profile:', profRes.body.profile);
    if (profRes.status !== 200 || profRes.body.profile.name !== 'Sarah Jenkins (Updated)') {
      throw new Error('Profile update failed!');
    }
    console.log('✅ Profile update passed!\n');

    console.log('🎉 ALL 11 TEST SUITES PASSED FLAWLESSLY! SpeakWrite AI is 100% operational.');
  } catch (err) {
    console.error('❌ Test suite error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
