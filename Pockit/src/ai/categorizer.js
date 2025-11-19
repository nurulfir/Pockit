import { CATEGORY_KEYWORDS, INCOME_KEYWORDS } from '../utils/keywords';

/**
 * Auto-categorize transaction based on description
 * Uses keyword matching with confidence scoring
 */
export const autoCategorize = (description, type = 'pengeluaran') => {
  if (!description) return { category: null, confidence: 0 };

  const cleanDesc = description.toLowerCase().trim();
  const keywords = type === 'pemasukan' ? INCOME_KEYWORDS : CATEGORY_KEYWORDS;
  
  let bestMatch = { category: null, score: 0, confidence: 0 };

  // Score each category
  Object.entries(keywords).forEach(([category, keywordList]) => {
    let score = 0;
    let matchedKeywords = [];

    keywordList.forEach(keyword => {
      if (cleanDesc.includes(keyword.toLowerCase())) {
        // Exact word match gets higher score
        const isExactWord = new RegExp(`\\b${keyword}\\b`, 'i').test(cleanDesc);
        const points = isExactWord ? 10 : 5;
        score += points;
        matchedKeywords.push(keyword);
      }
    });

    if (score > bestMatch.score) {
      bestMatch = {
        category,
        score,
        matchedKeywords,
        confidence: Math.min((score / 20) * 100, 100) // Convert to percentage
      };
    }
  });

  // If confidence is too low, return null
  if (bestMatch.confidence < 30) {
    return { category: null, confidence: 0, reason: 'Low confidence match' };
  }

  return {
    category: bestMatch.category,
    confidence: Math.round(bestMatch.confidence),
    matchedKeywords: bestMatch.matchedKeywords
  };
};

/**
 * Suggest alternative categories
 */
export const suggestCategories = (description, type = 'pengeluaran') => {
  if (!description) return [];

  const cleanDesc = description.toLowerCase().trim();
  const keywords = type === 'pemasukan' ? INCOME_KEYWORDS : CATEGORY_KEYWORDS;
  
  const scores = [];

  Object.entries(keywords).forEach(([category, keywordList]) => {
    let score = 0;

    keywordList.forEach(keyword => {
      if (cleanDesc.includes(keyword.toLowerCase())) {
        const isExactWord = new RegExp(`\\b${keyword}\\b`, 'i').test(cleanDesc);
        score += isExactWord ? 10 : 5;
      }
    });

    if (score > 0) {
      scores.push({
        category,
        confidence: Math.min((score / 20) * 100, 100)
      });
    }
  });

  return scores
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
    .map(s => ({ ...s, confidence: Math.round(s.confidence) }));
};

/**
 * Learn from user corrections (future enhancement)
 */
export const learnFromCorrection = (description, userCategory) => {
  // This would store user corrections to improve accuracy
  // For now, just log it
  console.log('Learning:', description, '->', userCategory);
  // In production: store in database or local storage for ML training
};