/**
 * Intelligent Mock & Fallback AI Service
 * Provides realistic, pedagogical corrections and responses when OPENAI_API_KEY is not configured
 */

const {
  calculateWritingScore,
  calculateSpeakingScore,
  calculateVideoScore,
  detectFillerWords
} = require('./scoringService');

// Curated topic library by category and difficulty
const topicLibrary = {
  Essay: {
    Beginner: [
      'Describe your favorite holiday and why it is special to you.',
      'Why is spending time with family important in modern life?',
      'The benefits of having a daily routine for students.'
    ],
    Intermediate: [
      'Should college students be allowed to use mobile phones during lectures?',
      'The impact of remote working on work-life balance and productivity.',
      'Is social media creating a more connected or more lonely generation?'
    ],
    Advanced: [
      'Analyze whether artificial intelligence will enhance human creativity or render traditional skills obsolete.',
      'The ethical implications of genetic editing in modern healthcare.',
      'Universal basic income: An essential safety net or a disincentive to economic innovation?'
    ]
  },
  Paragraph: {
    Beginner: [
      'Describe the weather in your hometown during autumn.',
      'Write about your favorite meal and how it is prepared.'
    ],
    Intermediate: [
      'Explain how learning a foreign language changes how you view the world.',
      'Describe a challenge you recently overcame and what it taught you.'
    ],
    Advanced: [
      'Argue the psychological value of embracing discomfort to build emotional resilience.'
    ]
  },
  Email: {
    Beginner: [
      'Write an email inviting a friend to a weekend birthday gathering.',
      'Write an email asking a coworker to swap lunch shifts.'
    ],
    Intermediate: [
      'Write a formal email requesting an extension on a project deadline from your manager.',
      'Draft an email introducing yourself as the new project coordinator to an international client.'
    ],
    Advanced: [
      'Draft a sensitive email to a business partner addressing repeated service disruptions while preserving the relationship.'
    ]
  },
  'Interview Answer': {
    Beginner: [
      'How would you answer: "Tell me about your favorite hobbies and interests?"',
      'How would you answer: "Why do you want to learn English?"'
    ],
    Intermediate: [
      'How would you answer: "Tell me about a time you handled a difficult conflict with a team member."',
      'How would you answer: "What is your biggest professional weakness, and how do you manage it?"'
    ],
    Advanced: [
      'How would you answer: "Describe a high-stakes decision you made with incomplete data, and what the outcome was."'
    ]
  },
  Opinion: {
    Beginner: [
      'Do you prefer reading physical books or reading on a screen? Explain why.',
      'Is it better to live in a large city or a quiet countryside?'
    ],
    Intermediate: [
      'Should electric vehicles be mandatory by 2035 to fight climate change?',
      'Is university education still worth the financial investment for Gen Z?'
    ],
    Advanced: [
      'Should governments regulate algorithmic content feeds in the interest of mental public health?'
    ]
  },
  Story: {
    Beginner: [
      'Write a short story about an unexpected visitor who knocked on a rainy afternoon.',
      'Write a story about finding a lost puppy in the park.'
    ],
    Intermediate: [
      'Write a story about a traveler who missed the last train in a foreign city.',
      'Write a story about an unexpected reunion after ten years.'
    ],
    Advanced: [
      'Write a narrative exploring the internal monologue of a musician stepping onto the stage after a decade of silence.'
    ]
  }
};

/**
 * Generate writing topic
 */
const generateWritingTopic = (category = 'Essay', difficulty = 'Intermediate') => {
  const cat = topicLibrary[category] || topicLibrary.Essay;
  const list = cat[difficulty] || cat.Intermediate || topicLibrary.Essay.Intermediate;
  const randomIndex = Math.floor(Math.random() * list.length);
  return {
    category,
    difficulty,
    topic: list[randomIndex],
    tips: [
      'Focus on clear topic sentences.',
      'Use transitional words (furthermore, however, consequently).',
      'Aim for natural paragraph pacing.'
    ]
  };
};

/**
 * Intelligent writing analyzer
 */
const evaluateWriting = (topic, answer, category = 'Essay', difficulty = 'Intermediate') => {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const mistakes = [];
  const lower = answer.toLowerCase();

  // Rule 1: "I am agree" / "I am disagree"
  if (/\bi\s+am\s+agree\b/i.test(answer)) {
    mistakes.push({
      original: 'I am agree',
      correction: 'I agree',
      explanation: "'Agree' is already a verb, so the auxiliary verb 'am' is not needed.",
      category: 'Grammar'
    });
  }
  if (/\bi\s+am\s+disagree\b/i.test(answer)) {
    mistakes.push({
      original: 'I am disagree',
      correction: 'I disagree',
      explanation: "'Disagree' is a verb, so 'am' should not be used before it.",
      category: 'Grammar'
    });
  }

  // Rule 2: "much people" / "less people"
  if (/\bmuch\s+people\b/i.test(answer)) {
    mistakes.push({
      original: 'much people',
      correction: 'many people',
      explanation: "'People' is a countable noun, so use 'many' instead of 'much'.",
      category: 'Vocabulary'
    });
  }
  if (/\bless\s+people\b/i.test(answer)) {
    mistakes.push({
      original: 'less people',
      correction: 'fewer people',
      explanation: "'People' is countable; 'fewer' should be used for countable items.",
      category: 'Grammar'
    });
  }

  // Rule 3: "people works" / "they works"
  if (/\b(people|they|students|we)\s+(works|thinks|wants|needs|likes)\b/i.test(answer)) {
    const match = answer.match(/\b(people|they|students|we)\s+(works|thinks|wants|needs|likes)\b/i);
    if (match) {
      const verb = match[2];
      const baseVerb = verb.replace(/s$/, '');
      mistakes.push({
        original: match[0],
        correction: `${match[1]} ${baseVerb}`,
        explanation: `Subject-verb agreement: '${match[1]}' is plural, so use the base verb form without '-s'.`,
        category: 'Grammar'
      });
    }
  }

  // Rule 4: Lowercase 'i' pronoun
  if (/\b\s+i\s+\b/.test(answer) || /^i\s+/.test(answer)) {
    mistakes.push({
      original: 'i',
      correction: 'I',
      explanation: "The personal pronoun 'I' must always be capitalized in English.",
      category: 'Spelling & Punctuation'
    });
  }

  // Rule 5: Missing terminal punctuation
  if (!/[.!?]$/.test(answer.trim())) {
    mistakes.push({
      original: answer.trim().slice(-15),
      correction: `${answer.trim().slice(-15)}.`,
      explanation: 'Sentences must end with an appropriate punctuation mark (period, exclamation, or question mark).',
      category: 'Spelling & Punctuation'
    });
  }

  // Rule 6: "In my opinion, I think" redundancy
  if (/in\s+my\s+opinion[,\s]+i\s+think/i.test(answer)) {
    mistakes.push({
      original: 'In my opinion, I think',
      correction: 'In my opinion, / I think',
      explanation: "Both phrases mean the same thing. Choose one to avoid redundant phrasing.",
      category: 'Clarity'
    });
  }

  // Rule 7: "very good" / "very bad" suggestions
  const vocabSuggestions = [];
  if (/\bvery\s+good\b/i.test(answer)) {
    vocabSuggestions.push({
      original: 'very good',
      suggestion: 'exceptional / advantageous',
      explanation: 'Enhances nuance and demonstrates advanced lexical resource.',
      example: 'This initiative offers an exceptional foundation for young professionals.'
    });
  }
  if (/\bvery\s+important\b/i.test(answer)) {
    vocabSuggestions.push({
      original: 'very important',
      suggestion: 'crucial / imperative / paramount',
      explanation: 'Adds weight and authority to your academic or professional writing.',
      example: 'Clear cross-departmental communication is paramount during rapid expansion.'
    });
  }
  if (/\ba\s+lot\s+of\b/i.test(answer)) {
    vocabSuggestions.push({
      original: 'a lot of',
      suggestion: 'numerous / substantial / a myriad of',
      explanation: "'A lot of' can sound conversational; use more precise quantifiers.",
      example: 'The proposal presents numerous advantages for sustainable growth.'
    });
  }

  // Default vocabulary suggestion if none matched
  if (vocabSuggestions.length === 0) {
    vocabSuggestions.push(
      {
        original: 'good',
        suggestion: 'effective / beneficial',
        explanation: 'Provides clearer meaning regarding positive outcomes.',
        example: 'Adopting consistent habits produces highly effective learning outcomes.'
      },
      {
        original: 'show',
        suggestion: 'demonstrate / illustrate',
        explanation: 'Standard formal academic verb for presenting evidence.',
        example: 'Recent studies clearly demonstrate the benefits of structured practice.'
      }
    );
  }

  // Calculate scores based on error rate and word count
  const errorPenalty = mistakes.length * 6;
  const lengthBonus = Math.min(Math.floor(wordCount / 10), 10);

  const rawGrammar = Math.max(55, Math.min(95, 82 - errorPenalty + lengthBonus));
  const rawVocab = Math.max(58, Math.min(94, 78 + (vocabSuggestions.length > 2 ? 4 : 0) + lengthBonus));
  const rawStructure = Math.max(60, Math.min(92, 80 - Math.floor(errorPenalty / 2)));
  const rawClarity = Math.max(60, Math.min(95, 84 - Math.floor(errorPenalty / 3)));
  const rawOrg = Math.max(65, Math.min(96, 82 + (wordCount > 60 ? 6 : 0)));
  const rawSpelling = Math.max(60, Math.min(98, 88 - (mistakes.filter(m => m.category.includes('Punctuation') || m.category.includes('Spelling')).length * 7)));

  const computedScores = calculateWritingScore({
    grammar: rawGrammar,
    vocabulary: rawVocab,
    sentenceStructure: rawStructure,
    clarity: rawClarity,
    organization: rawOrg,
    spelling: rawSpelling
  });

  const strengths = [
    'You maintained a clear focus on the central prompt.',
    wordCount > 50 ? 'Good development of thoughts with supporting details.' : 'Good directness in answering the core question.',
    'Expressive tone that conveys your perspective genuinely.'
  ];

  const weaknesses = mistakes.length > 0
    ? ['Watch out for subject-verb agreement and auxiliary verb usage.', 'Review terminal punctuation and capitalization.']
    : ['Try integrating more varied compound and complex sentence structures to increase fluency.'];

  const practiceRecommendations = [
    'Write two sentences every morning focusing strictly on subject-verb agreements.',
    'Read your text aloud slowly before submitting to catch missing punctuation and natural pauses.',
    'Review the vocabulary suggestions above and try using "crucial" and "demonstrate" in your next submission.'
  ];

  return {
    ...computedScores,
    strengths,
    weaknesses,
    mistakes,
    vocabularySuggestions: vocabSuggestions,
    practiceRecommendations
  };
};

/**
 * Voice practice speech evaluation
 */
const evaluateSpeaking = (scenario, transcript, duration = 30) => {
  const words = (transcript || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(duration / 60, 0.1);
  const paceWPM = Math.round(wordCount / minutes);

  const fillerWords = detectFillerWords(transcript);
  const totalFillers = fillerWords.reduce((acc, f) => acc + f.count, 0);

  // Fluency evaluation: ideal speech pace is 110-150 WPM
  let fluencyScore = 75;
  if (paceWPM >= 100 && paceWPM <= 150) fluencyScore = 85;
  else if (paceWPM < 70) fluencyScore = 60;
  else if (paceWPM > 170) fluencyScore = 68;

  // Filler deduction
  fluencyScore = Math.max(45, fluencyScore - totalFillers * 3);

  const grammarScore = Math.max(50, 78 - (transcript.includes(' am ') ? 4 : 0));
  const vocabScore = Math.max(55, Math.min(92, 74 + Math.min(wordCount / 5, 12)));
  const pronunciationScore = 76;
  const confidenceScore = Math.max(50, Math.min(95, 70 - totalFillers * 4 + (wordCount > 30 ? 10 : 0)));

  const computedScores = calculateSpeakingScore({
    fluency: fluencyScore,
    grammar: grammarScore,
    vocabulary: vocabScore,
    pronunciation: pronunciationScore,
    confidence: confidenceScore
  });

  const strengths = [
    `Steady speaking attempt with ${wordCount} words expressed.`,
    totalFillers < 3 ? 'Minimal filler words used, maintaining listener engagement.' : 'Willingness to keep talking through hesitation.',
    'Clear attempt to address the prompt directly.'
  ];

  const weaknesses = [];
  if (totalFillers > 2) {
    weaknesses.push(`Detected ${totalFillers} filler words ("${fillerWords.map(f => f.word).join('", "')}"). Practice comfortable silent pauses instead.`);
  }
  if (paceWPM < 90) {
    weaknesses.push(`Speaking pace was ${paceWPM} WPM (ideal conversational pace is 110–140 WPM). Aim for smoother transitions between thoughts.`);
  } else if (paceWPM > 160) {
    weaknesses.push(`Speaking pace was fast (${paceWPM} WPM). Slow down slightly to ensure crystal-clear articulation.`);
  }

  return {
    ...computedScores,
    paceWPM,
    fillerWords,
    strengths,
    weaknesses: weaknesses.length ? weaknesses : ['Continue building confidence by expanding sentence length.'],
    pronunciationTips: [
      'Focus on the clear ending of consonants in words like "project", "talked", "confident".',
      'Use natural intonation: raise your pitch slightly when asking questions and lower it at the end of statements.'
    ],
    recommendations: [
      'Record yourself answering this same question a second time without looking at any notes.',
      'When you feel the urge to say "um" or "like", close your mouth and take a gentle one-second breath.'
    ]
  };
};

/**
 * AI Conversation Dialogue Responder
 */
const generateConversationReply = (scenario, messageHistory = []) => {
  const lastUserMsg = messageHistory.slice().reverse().find(m => m.role === 'user')?.content || '';
  const turnCount = messageHistory.filter(m => m.role === 'user').length;

  const replies = {
    'Job Interview': [
      "Thank you for sharing that. It gives me a great picture of your background. Could you describe a challenging project where you had to collaborate closely with someone whose working style differed from yours?",
      "That's a very insightful point. In this role, we often navigate tight deadlines with shifting priorities. How do you decide what tasks to prioritize when everything feels urgent?",
      "Excellent. Finally, where do you see your professional skills evolving over the next two to three years, and how does this role fit that vision?"
    ],
    'Daily Conversation': [
      "That sounds wonderful! I really enjoy hearing about how different people spend their days. Do you usually prefer staying in or exploring new places when you have free time?",
      "I completely understand. It's so refreshing to take a break and recharge. Have you picked up any new hobbies or interests lately?",
      "That's really interesting! It takes dedication to do that. What sparked your curiosity in it?"
    ],
    'IELTS Speaking': [
      "Let's move on to Part 2 of our speaking topic. Describe an memorable journey you took that did not go according to plan. You have one minute to think, then please speak.",
      "Thank you. Why do you think travel has become such a central aspiration for modern people compared to previous generations?",
      "Interesting perspective. Some argue that virtual tourism will reduce the need for physical travel. To what extent do you agree with that view?"
    ],
    'Public Speaking': [
      "Great start. Your opening establishes the topic. Now, imagine your audience has a few skeptical listeners in the front row. How would you hook their attention with an engaging story or a surprising statistic?",
      "That created much stronger imagery! Now, transition toward your main conclusion. What is the single takeaway message you want everyone in the hall to remember?",
      "Superb delivery. Notice how clear your central thesis sounded when you concluded with conviction."
    ]
  };

  const pool = replies[scenario] || replies['Daily Conversation'];
  const responseText = pool[Math.min(turnCount - 1, pool.length - 1)] ||
    `That is a very thoughtful answer. Could you elaborate a bit more on what inspired that perspective, and how you would handle that in a real-world setting?`;

  return {
    reply: responseText,
    encouragement: "You're speaking naturally! Keep your pacing steady."
  };
};

/**
 * Video Practice Evaluation
 */
const evaluateVideo = (scenario, level = 2, transcript = '', duration = 45) => {
  const words = (transcript || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(duration / 60, 0.1);
  const paceWPM = Math.round(wordCount / minutes);
  const fillerWords = detectFillerWords(transcript);
  const totalFillers = fillerWords.reduce((acc, f) => acc + f.count, 0);

  // Scores
  const comm = Math.max(60, Math.min(95, 80 + (wordCount > 40 ? 6 : 0) - totalFillers * 2));
  const clar = Math.max(55, Math.min(92, 78 - (paceWPM > 165 ? 8 : 0)));
  const gram = Math.max(60, 80 - (transcript.includes(' am ') ? 5 : 0));
  const voc = Math.max(60, Math.min(94, 76 + Math.min(wordCount / 6, 12)));
  const conf = Math.max(50, Math.min(95, 68 - totalFillers * 3 + (duration >= 30 ? 10 : 0)));
  const rel = Math.max(65, 85);

  const scores = calculateVideoScore({
    communication: comm,
    clarity: clar,
    grammar: gram,
    vocabulary: voc,
    confidence: conf,
    relevance: rel
  });

  return {
    ...scores,
    paceWPM,
    fillerWords,
    strengths: [
      'Maintained good composure in front of the camera.',
      `Spoke for ${duration} seconds with continuous engagement.`,
      'Addressed the scenario with a direct and clear opening.'
    ],
    weaknesses: totalFillers > 1
      ? [`Occasional hesitation with ${totalFillers} filler words. Pause comfortably instead.`]
      : ['Continue working on vocal projection and dynamic pitch variation.'],
    stageFearTips: [
      'Remember: Public speaking is an acquired mechanical skill, not an innate talent. Every practice session rewires your comfort zone.',
      'Focus on the listener rather than your own anxiety. When your goal is to help or inform the other person, self-consciousness naturally decreases.',
      'Take three slow diaphragmatic breaths before clicking record to lower heart rate.'
    ],
    bodyLanguageAdvice: [
      'Keep eye contact near the upper third of your screen where the camera lens is located.',
      'Maintain an open posture with relaxed shoulders and occasional natural hand gestures to emphasize key ideas.'
    ],
    recommendations: [
      `Try advancing to Level ${Math.min(level + 1, 4)} in this scenario to practice under slightly more dynamic conditions.`,
      'Re-record with a 5-second silence buffer before you begin speaking to center your thoughts.'
    ]
  };
};

module.exports = {
  generateWritingTopic,
  evaluateWriting,
  evaluateSpeaking,
  generateConversationReply,
  evaluateVideo
};
