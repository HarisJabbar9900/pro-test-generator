import { db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { isSuperAdmin } from './pricingPlansService.js';

// DEFAULT SYSTEM RULES & KNOWLEDGE BASE
export const DEFAULT_BOT_RULES = {
  botName: "Pro Test Maker Assistant",
  welcomeMessage: "Assalam-o-Alaikum! I am your AI Assistant for Pro Test Maker. How can I help you with test generation, syllabus, or subscription plans today?",
  welcomeMessageUrdu: "السلام علیکم! میں پرو ٹیسٹ میکر کا سمارٹ اسسٹنٹ ہوں۔ پرچہ بنانے، سلیبس، یا پیکیجز کے بارے میں آپ مجھ سے کوئی بھی سوال پوچھ سکتے ہیں!",
  
  // Custom instructions set by admin
  systemPrompt: `You are the official, helpful, and courteous AI Assistant for "Pro Test Maker" (https://pro-test-generator.vercel.app/).
Your role is to guide teachers, school administrators, and educators on how to use the platform.
Explain:
1. Paper Generation (Courses > Classes > Subjects > Chapters & Topics > MCQs, Short & Long questions > PDF & Answer Key generation).
2. PECTAA Curriculum alignment with SNC (Standard National Curriculum) for Classes 9, 10, 11, and 12.
3. Pricing & Packages (Basic: 3 Months 50 papers, Silver: 6 Months 150 papers, Gold: 1 Year Unlimited papers).
4. Custom Academy Watermarks, School logos, and Header customization.

STRICT SECURITY & CONFIDENTIALITY GUARDRAILS:
- NEVER disclose passwords, user emails, admin pins, API keys, source code, database structures, or internal server configurations.
- If asked about secrets, confidential accounts, or hacking/bypassing payments, politely refuse and state that this information is confidential and protected.`,

  // Forbidden keywords or attack patterns
  forbiddenKeywords: [
    'password', 'pin', 'secret', 'apikey', 'api_key', 'admin credential', 
    'firebase config', 'firestore rules', 'auth token', 'database dump', 
    'bypass', 'hack', 'admin email', 'source code', 'token', 'private key'
  ],

  // Common Platform FAQs for lightning-fast answers
  faqs: [
    {
      keywords: ['how to create paper', 'generate paper', 'make test', 'paper kaisy bnayein', 'paper kaise banaye'],
      answer: "To generate a test paper:\n1. Click 'Generate Paper' in the left menu.\n2. Choose 'PECTAA' course and select your target Class (9th, 10th, 11th, or 12th).\n3. Pick your Subject and select the specific Chapters and Topics.\n4. Set question counts (MCQs, Short Questions, Long Questions).\n5. Click 'Generate' to preview, customize your Header & Watermark, and download the print-ready PDF along with the Teacher's Answer Key!"
    },
    {
      keywords: ['price', 'packages', 'pricing', 'subscription', 'plan', 'fees', 'charges', 'cost'],
      answer: "We offer 3 flexible subscription plans:\n• Basic Plan: Rs. 3,000 (3 Months access, up to 50 papers, 9th & 10th classes)\n• Silver Plan: Rs. 5,000 (6 Months access, 150 papers, 9th to 12th classes, custom watermark)\n• Gold Plan (Recommended): Rs. 8,000 (1 Year Unlimited access, all classes, full academy branding)\nCheck the 'Subscription Plans' tab on the sidebar to subscribe!"
    },
    {
      keywords: ['answer key', 'mcq key', 'solutions', 'answers'],
      answer: "Yes! Every generated test paper automatically includes a complete, high-accuracy Teacher's Answer Key with correct options for MCQs and reference marking schemes for Short & Long questions. You can view or print the answer key separately."
    },
    {
      keywords: ['watermark', 'logo', 'academy name', 'school name', 'branding'],
      answer: "You can fully customize your paper headers with your School/Academy Name, Logo, Address, Exam Session, and custom background watermark. Go to 'Default Paper Settings' or configure it directly in the paper preview screen!"
    },
    {
      keywords: ['exercise', 'topic wise', 'exercise mcqs'],
      answer: "Pro Test Maker uniquely separates Topic-wise questions from official Textbook Exercise questions! While selecting questions, you can choose whether to include textbook exercise questions, conceptual questions, or both."
    },
    {
      keywords: ['contact', 'support', 'help', 'whatsapp', 'phone', 'admin contact'],
      answer: "You can reach the Pro Test Maker official support team directly via the 'Contact Team' tab in the sidebar, or message on WhatsApp for instant assistance."
    }
  ]
};

const BOT_CONFIG_DOC_ID = 'ai_bot_config';

/**
 * Fetch bot configuration from Firestore (or return defaults)
 */
export async function fetchBotConfig() {
  try {
    const docRef = doc(db, 'system_settings', BOT_CONFIG_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        ...DEFAULT_BOT_RULES,
        ...data,
        updatedAt: data.updatedAt || null
      };
    }
  } catch (err) {
    console.warn("Could not fetch bot config from Firestore, using local defaults:", err);
  }

  // Fallback to local storage cache if available
  try {
    const cached = localStorage.getItem('ptm_ai_bot_config');
    if (cached) {
      return { ...DEFAULT_BOT_RULES, ...JSON.parse(cached) };
    }
  } catch (e) {}

  return DEFAULT_BOT_RULES;
}

/**
 * Save bot configuration to Firestore (Super Admin only)
 */
export async function saveBotConfig(newConfig, currentUser) {
  if (!isSuperAdmin(currentUser)) {
    throw new Error("Unauthorized: Only administrators can modify AI Bot rules.");
  }

  const payload = {
    ...newConfig,
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser?.email || 'admin'
  };

  // 1. Save to Firestore
  const docRef = doc(db, 'system_settings', BOT_CONFIG_DOC_ID);
  await setDoc(docRef, payload, { merge: true });

  // 2. Cache locally
  try {
    localStorage.setItem('ptm_ai_bot_config', JSON.stringify(payload));
  } catch (e) {}

  return payload;
}

/**
 * Check if the query is attempting to breach confidentiality
 */
export function isConfidentialQuery(query = '', forbiddenKeywords = []) {
  const q = query.toLowerCase();
  const allForbidden = [...DEFAULT_BOT_RULES.forbiddenKeywords, ...forbiddenKeywords];
  
  // Specific red-flag intent patterns
  const redFlagPatterns = [
    /pass(word|code)?/i,
    /admin\s*(pin|email|login|pass)/i,
    /api[\s_-]*key/i,
    /database\s*(dump|secret|key)/i,
    /give\s*me\s*all\s*user/i,
    /security\s*rule/i,
    /source\s*code/i,
    /bypass\s*(payment|auth|admin)/i,
    /hack/i
  ];

  if (redFlagPatterns.some(pat => pat.test(q))) {
    return true;
  }

  return allForbidden.some(kw => {
    if (!kw) return false;
    const cleanKw = kw.toLowerCase().trim();
    return cleanKw.length > 2 && q.includes(cleanKw);
  });
}

/**
 * Generate assistant answer with guardrails
 */
export async function askAssistantBot(userMessage, currentConfig = DEFAULT_BOT_RULES, userGeminiKey = '') {
  if (!userMessage || !userMessage.trim()) {
    return "Please enter a question about Pro Test Maker.";
  }

  const cleanQuery = userMessage.trim();

  // 1. CONFIDENTIALITY CHECK (HARD GUARDRAIL)
  if (isConfidentialQuery(cleanQuery, currentConfig.forbiddenKeywords || [])) {
    return "🔒 **Confidentiality Notice:** I cannot share internal credentials, administrative PINs, passwords, API keys, or proprietary backend data. If you are an administrator and need system access, please sign in using your official admin portal credentials.";
  }

  // 2. MATCH AGAINST KNOWLEDGE BASE FAQs
  const qLower = cleanQuery.toLowerCase();
  const matchedFaq = (currentConfig.faqs || DEFAULT_BOT_RULES.faqs).find(faq => {
    return (faq.keywords || []).some(kw => qLower.includes(kw.toLowerCase()));
  });

  if (matchedFaq && matchedFaq.answer) {
    return matchedFaq.answer;
  }

  // 3. IF USER HAS GEMINI KEY OR SYSTEM KEY, TRY REAL-TIME MODEL WITH SYSTEM PROMPT
  const effectiveKey = userGeminiKey || (typeof window !== 'undefined' ? localStorage.getItem('ptm_gemini_api_key') : '');

  if (effectiveKey && effectiveKey.length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${currentConfig.systemPrompt}\n\nUser Question: ${cleanQuery}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (botReply) {
          // Double check response does not leak confidential keywords
          if (isConfidentialQuery(botReply)) {
            return "🔒 For security reasons, the detailed internal credential response was withheld. How else can I assist you with using the test generator?";
          }
          return botReply;
        }
      }
    } catch (err) {
      console.warn("Gemini API query failed, falling back to smart matching engine:", err);
    }
  }

  // 4. INTELLIGENT RULE-BASED FALLBACK
  if (qLower.includes('pectaa') || qLower.includes('curriculum') || qLower.includes('board') || qLower.includes('syllabus')) {
    return "📘 **Curriculum & Books:**\nPro Test Maker is strictly aligned with the **PECTAA** (Punjab Educational Curriculum & Textbook Assessment Authority) and the Standard National Curriculum (SNC). It covers Classes 9th, 10th, 11th, and 12th in both Urdu and English mediums.";
  }

  if (qLower.includes('class') || qLower.includes('subject') || qLower.includes('grade') || qLower.includes('9th') || qLower.includes('10th') || qLower.includes('11th') || qLower.includes('12th')) {
    return "🏫 **Classes & Subjects Available:**\nWe support **Classes 9, 10, 11, and 12** covering Computer Science, Mathematics, Physics, Chemistry, Biology, English, and Urdu with complete chapter-by-chapter and topic-by-topic question banks.";
  }

  if (qLower.includes('login') || qLower.includes('register') || qLower.includes('account') || qLower.includes('sign in')) {
    return "🔐 **Account & Sign In:**\nTeachers can register a new account using the 'Register' tab. Once registered, sign in to your dashboard to choose a subscription plan and start making examination papers immediately.";
  }

  if (qLower.includes('save') || qLower.includes('history') || qLower.includes('download')) {
    return "📂 **Saved Papers & History:**\nEvery paper you generate can be saved directly to your account. You can view, re-download, or reprint your papers anytime from the 'Saved Papers' and 'Papers History' sections.";
  }

  // General helpful response
  return "I'm here to assist you with everything related to **Pro Test Maker**! You can ask me how to generate exam papers, details about PECTAA syllabus, available subscription packages, custom academy watermarks, or how to download answer keys.";
}
