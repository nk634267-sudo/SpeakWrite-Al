/**
 * SpeakWrite AI Scoring Service
 * Strict weighted calculations for Writing, Speaking, and Video evaluation
 */

/**
 * Clamp a number between min and max
 */
const clamp = (num, min = 0, max = 100) => Math.min(Math.max(Math.round(num), min), max);

/**
 * Compute Writing Overall Score
 * Grammar: 25%
 * Vocabulary: 20%
 * Sentence Structure: 20%
 * Clarity: 15%
 * Organization: 10%
 * Spelling/Punctuation: 10%
 */
const calculateWritingScore = (categories) => {
  const grammar = clamp(categories.grammar ?? 70);
  const vocabulary = clamp(categories.vocabulary ?? 70);
  const sentenceStructure = clamp(categories.sentenceStructure ?? 70);
  const clarity = clamp(categories.clarity ?? 70);
  const organization = clamp(categories.organization ?? 70);
  const spelling = clamp(categories.spelling ?? 70);

  const weightedSum =
    grammar * 0.25 +
    vocabulary * 0.20 +
    sentenceStructure * 0.20 +
    clarity * 0.15 +
    organization * 0.10 +
    spelling * 0.10;

  return {
    overallScore: Math.round(weightedSum),
    grammar,
    vocabulary,
    sentenceStructure,
    clarity,
    organization,
    spelling
  };
};

/**
 * Compute Speaking Overall Score
 * Fluency: 25%
 * Grammar: 20%
 * Vocabulary: 20%
 * Pronunciation: 20%
 * Confidence: 15%
 */
const calculateSpeakingScore = (categories) => {
  const fluency = clamp(categories.fluency ?? 65);
  const grammar = clamp(categories.grammar ?? 65);
  const vocabulary = clamp(categories.vocabulary ?? 65);
  const pronunciation = clamp(categories.pronunciation ?? 65);
  const confidence = clamp(categories.confidence ?? 65);

  const weightedSum =
    fluency * 0.25 +
    grammar * 0.20 +
    vocabulary * 0.20 +
    pronunciation * 0.20 +
    confidence * 0.15;

  return {
    overallScore: Math.round(weightedSum),
    fluency,
    grammar,
    vocabulary,
    pronunciation,
    confidence
  };
};

/**
 * Compute Video Overall Score
 * Communication: 25%
 * Clarity: 20%
 * Grammar: 20%
 * Vocabulary: 15%
 * Confidence: 10%
 * Relevance: 10%
 */
const calculateVideoScore = (categories) => {
  const communication = clamp(categories.communication ?? 70);
  const clarity = clamp(categories.clarity ?? 70);
  const grammar = clamp(categories.grammar ?? 70);
  const vocabulary = clamp(categories.vocabulary ?? 70);
  const confidence = clamp(categories.confidence ?? 70);
  const relevance = clamp(categories.relevance ?? 70);

  const weightedSum =
    communication * 0.25 +
    clarity * 0.20 +
    grammar * 0.20 +
    vocabulary * 0.15 +
    confidence * 0.10 +
    relevance * 0.10;

  return {
    overallScore: Math.round(weightedSum),
    communication,
    clarity,
    grammar,
    vocabulary,
    confidence,
    relevance
  };
};

/**
 * Helper to detect common filler words from transcript
 */
const detectFillerWords = (text) => {
  if (!text) return [];
  const normalized = text.toLowerCase();
  const targets = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'sort of', 'kind of', 'i mean'];
  const results = [];

  for (const target of targets) {
    const regex = new RegExp(`\\b${target}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches && matches.length > 0) {
      results.push({ word: target, count: matches.length });
    }
  }

  return results;
};

module.exports = {
  calculateWritingScore,
  calculateSpeakingScore,
  calculateVideoScore,
  detectFillerWords
};
