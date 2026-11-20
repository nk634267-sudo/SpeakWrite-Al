/**
 * Real OpenAI Service with Graceful Fallback
 * Integrates GPT-4o / GPT-3.5, Whisper, and TTS.
 * Gracefully delegates to mockAiService when keys are absent or errors occur.
 */

const mockAiService = require('./mockAiService');
const { calculateWritingScore, calculateSpeakingScore, calculateVideoScore } = require('./scoringService');

const hasOpenAiKey = () => {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key.trim().length > 10 && !key.startsWith('your_') && !key.includes('example'));
};

/**
 * Generate a dynamic writing topic using OpenAI or Fallback
 */
const generateWritingTopic = async (category, difficulty) => {
  if (!hasOpenAiKey()) {
    return mockAiService.generateWritingTopic(category, difficulty);
  }

  try {
    const prompt = `Generate a single compelling, high-quality English writing practice prompt for:
Category: ${category}
Difficulty: ${difficulty}

Respond with valid JSON in this exact structure:
{
  "topic": "The exact prompt text",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return parsed;
  } catch (err) {
    console.warn('OpenAI generateWritingTopic failed, falling back to mock service:', err.message);
    return mockAiService.generateWritingTopic(category, difficulty);
  }
};

/**
 * Evaluate Writing submission with strict JSON output
 */
const evaluateWriting = async (topic, answer, category, difficulty) => {
  if (!hasOpenAiKey()) {
    return mockAiService.evaluateWriting(topic, answer, category, difficulty);
  }

  try {
    const systemInstruction = `You are an expert English communication coach evaluating a learner's writing submission.
Topic: "${topic}"
Learner English Difficulty: "${difficulty}"
Category: "${category}"

Analyze the learner's writing thoroughly.
Provide realistic scores (0-100) for each of these 6 categories:
- grammar
- vocabulary
- sentenceStructure
- clarity
- organization
- spelling

Identify specific mistakes. For each mistake:
- "original": the exact error phrase or sentence from the text
- "correction": the corrected phrase
- "explanation": a friendly pedagogical explanation of WHY this is incorrect
- "category": one of ["Grammar", "Spelling", "Punctuation", "Vocabulary", "Sentence Structure", "Clarity"]

Also provide:
- "strengths": array of 2-4 encouraging things done well
- "weaknesses": array of 1-3 concrete areas to improve
- "vocabularySuggestions": array of 2-3 upgrades [{ "original": "...", "suggestion": "...", "explanation": "...", "example": "..." }]
- "practiceRecommendations": array of 2-3 specific actionable practice steps for tomorrow

Respond with valid JSON matching:
{
  "grammar": 70,
  "vocabulary": 68,
  "sentenceStructure": 75,
  "clarity": 72,
  "organization": 76,
  "spelling": 80,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "mistakes": [
    {
      "original": "...",
      "correction": "...",
      "explanation": "...",
      "category": "..."
    }
  ],
  "vocabularySuggestions": [
    {
      "original": "...",
      "suggestion": "...",
      "explanation": "...",
      "example": "..."
    }
  ],
  "practiceRecommendations": ["..."]
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Learner Answer:\n"""\n${answer}\n"""` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const rawParsed = JSON.parse(data.choices[0].message.content);

    // Apply strict weighted calculation to ensure mathematical derivation
    const computedScores = calculateWritingScore(rawParsed);

    return {
      ...computedScores,
      strengths: rawParsed.strengths || [],
      weaknesses: rawParsed.weaknesses || [],
      mistakes: rawParsed.mistakes || [],
      vocabularySuggestions: rawParsed.vocabularySuggestions || [],
      practiceRecommendations: rawParsed.practiceRecommendations || []
    };
  } catch (err) {
    console.warn('OpenAI evaluateWriting failed, using fallback:', err.message);
    return mockAiService.evaluateWriting(topic, answer, category, difficulty);
  }
};

/**
 * Evaluate Speaking submission
 */
const evaluateSpeaking = async (scenario, transcript, duration) => {
  if (!hasOpenAiKey()) {
    return mockAiService.evaluateSpeaking(scenario, transcript, duration);
  }

  try {
    const systemInstruction = `You are an expert oral English communication coach.
Scenario / Prompt: "${scenario}"
Duration: ${duration} seconds
Evaluate this transcript from a spoken practice session.

Provide scores (0-100) for:
- fluency
- grammar
- vocabulary
- pronunciation
- confidence

Include:
- strengths: array of strings
- weaknesses: array of strings
- pronunciationTips: array of strings
- recommendations: array of strings

Respond with valid JSON.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Spoken Transcript:\n"""\n${transcript}\n"""` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const rawParsed = JSON.parse(data.choices[0].message.content);
    const computedScores = calculateSpeakingScore(rawParsed);
    const mockDetails = mockAiService.evaluateSpeaking(scenario, transcript, duration);

    return {
      ...computedScores,
      paceWPM: mockDetails.paceWPM,
      fillerWords: mockDetails.fillerWords,
      strengths: rawParsed.strengths || mockDetails.strengths,
      weaknesses: rawParsed.weaknesses || mockDetails.weaknesses,
      pronunciationTips: rawParsed.pronunciationTips || mockDetails.pronunciationTips,
      recommendations: rawParsed.recommendations || mockDetails.recommendations
    };
  } catch (err) {
    console.warn('OpenAI evaluateSpeaking failed, using fallback:', err.message);
    return mockAiService.evaluateSpeaking(scenario, transcript, duration);
  }
};

/**
 * Generate dialogue conversation reply
 */
const generateConversationReply = async (scenario, messageHistory) => {
  if (!hasOpenAiKey()) {
    return mockAiService.generateConversationReply(scenario, messageHistory);
  }

  try {
    const systemInstruction = `You are a supportive, friendly, native English conversation partner helping an English learner practice.
Scenario: "${scenario}"
Guidelines:
- Keep your replies conversational, natural, and concise (2-4 sentences max).
- Acknowledge what the user said with warmth.
- Ask one clear, engaging follow-up question to encourage them to keep speaking.
- Do NOT sound like a test robot. Sound like a real, kind conversation partner.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          ...messageHistory.map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.choices[0].message.content.trim(),
      encouragement: "Great flow! You're expressing your ideas smoothly."
    };
  } catch (err) {
    console.warn('OpenAI conversation reply failed, using fallback:', err.message);
    return mockAiService.generateConversationReply(scenario, messageHistory);
  }
};

/**
 * Evaluate Video communication
 */
const evaluateVideo = async (scenario, level, transcript, duration) => {
  if (!hasOpenAiKey()) {
    return mockAiService.evaluateVideo(scenario, level, transcript, duration);
  }

  try {
    const systemInstruction = `You are an executive communication coach evaluating video practice for an English learner.
Scenario: "${scenario}"
Simulation Level: ${level} (1: Voice only, 2: Avatar, 3: Presentation, 4: Advanced simulation)
Spoken Transcript: "${transcript}"
Duration: ${duration} seconds

Provide category scores (0-100) for:
- communication
- clarity
- grammar
- vocabulary
- confidence
- relevance

Also provide:
- strengths: array of strings
- weaknesses: array of strings
- stageFearTips: array of 2-3 psychological framing & confidence-building tips (do not claim medical cures)
- bodyLanguageAdvice: array of 2-3 posture, eye contact, and gesture suggestions
- recommendations: array of next steps

Respond in valid JSON.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemInstruction }],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawParsed = JSON.parse(data.choices[0].message.content);
    const computedScores = calculateVideoScore(rawParsed);
    const mockDetails = mockAiService.evaluateVideo(scenario, level, transcript, duration);

    return {
      ...computedScores,
      paceWPM: mockDetails.paceWPM,
      fillerWords: mockDetails.fillerWords,
      strengths: rawParsed.strengths || mockDetails.strengths,
      weaknesses: rawParsed.weaknesses || mockDetails.weaknesses,
      stageFearTips: rawParsed.stageFearTips || mockDetails.stageFearTips,
      bodyLanguageAdvice: rawParsed.bodyLanguageAdvice || mockDetails.bodyLanguageAdvice,
      recommendations: rawParsed.recommendations || mockDetails.recommendations
    };
  } catch (err) {
    console.warn('OpenAI evaluateVideo failed, using fallback:', err.message);
    return mockAiService.evaluateVideo(scenario, level, transcript, duration);
  }
};

/**
 * Text-to-Speech (TTS) audio generator
 */
const textToSpeech = async (text, voice = 'alloy') => {
  if (!hasOpenAiKey()) {
    return null; // Frontend gracefully uses Web Speech API Synthesis
  }

  try {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || 'tts-1',
        input: text,
        voice: voice || 'alloy'
      })
    });

    if (!res.ok) {
      throw new Error(`TTS HTTP ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.warn('OpenAI TTS failed:', err.message);
    return null;
  }
};

module.exports = {
  hasOpenAiKey,
  generateWritingTopic,
  evaluateWriting,
  evaluateSpeaking,
  generateConversationReply,
  evaluateVideo,
  textToSpeech
};
