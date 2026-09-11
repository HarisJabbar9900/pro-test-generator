/**
 * Lightweight Text & Language Validator
 * Free of heavy third-party parsing dependencies (no pdfjs, no mammoth, no tesseract)
 */

export function isValidHumanText(str) {
  if (!str || str.trim().length < 15) return false;

  const sample = str.slice(0, 2000);

  // 1. Check for authentic Unicode Urdu script characters
  const urduMatches = sample.match(/[\u0600-\u06FF]/g) || [];
  if (urduMatches.length / sample.length > 0.15) {
    return true; // Authentic Urdu Script
  }

  // 2. Check for authentic English dictionary words
  const EnglishDictionary = new Set([
    'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us',
    'computer','science','problem','analysis','solving','algorithm','flowchart','symbol','data','system','network','chapter','topic','class','unit','input','output','memory','program','software','hardware','variable','function','code','type','method','process','result','value','definition','explain','define','which','following'
  ]);

  const words = sample.toLowerCase().match(/[a-z]{2,}/g) || [];
  if (words.length < 3) return false;

  let realWordCount = 0;
  for (const w of words) {
    if (EnglishDictionary.has(w)) {
      realWordCount++;
    }
  }

  const realWordRatio = realWordCount / words.length;

  // Require at least 25% of words to be real English dictionary words
  return realWordRatio >= 0.25;
}
