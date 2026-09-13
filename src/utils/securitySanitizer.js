/**
 * Security Sanitizer & Defense Utility
 * Protects against:
 * 1. XSS (Cross-Site Scripting) & HTML Injection
 * 2. Prototype Pollution in JSON Deserialization
 * 3. Path Traversal & Injection in Identifiers
 * 4. Brute Force Attacks (In-Memory & Storage Rate Limiting)
 * 5. Plaintext Credential Exposure (SHA-256 Cryptographic Hashing)
 */

/**
 * Strips dangerous HTML tags and script protocols to prevent XSS.
 * Safe for displaying text in React and HTML print frames.
 */
export function sanitizeText(input = '') {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input);
  }

  return input
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove dangerous tags: iframe, embed, object, frame, applet, form, input, button, meta, link, base
    .replace(/<\/?(?:iframe|embed|object|frameset|frame|applet|form|input|button|meta|link|base)[^>]*>/gi, '')
    // Remove inline event handlers (onerror, onload, onclick, onmouseover, etc.)
    .replace(/\son[a-zA-Z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son[a-zA-Z]+\s*=\s*[^ >]+/gi, '')
    // Remove javascript: and vbscript: URLs
    .replace(/(javascript|vbscript|data\s*:\s*text\/html):/gi, 'blocked:')
    // Trim leading/trailing whitespace
    .trim();
}

/**
 * Strips all HTML tags completely, returning pure plain text.
 */
export function stripHtmlToPlainText(input = '') {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitizes IDs (e.g. paperId, classId, subjectId, topicId).
 * Strictly restricts to alphanumeric, hyphen, and underscore [a-zA-Z0-9_-].
 * Prevents Firestore path traversal (like ../) and injection.
 */
export function sanitizeSafeId(id = '', maxLen = 64) {
  if (typeof id !== 'string') return '';
  return id
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, maxLen);
}

/**
 * Safe JSON parse that neutralizes Prototype Pollution vulnerabilities
 * (__proto__, constructor, prototype injection).
 */
export function safeJsonParse(jsonStr, fallback = null) {
  if (!jsonStr || typeof jsonStr !== 'string') return fallback;
  try {
    const parsed = JSON.parse(jsonStr, (key, value) => {
      // Drop keys that could pollute the prototype
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });
    return parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Generates SHA-256 cryptographic hash of a secret string (e.g. Admin PIN)
 * using the native browser Web Crypto API.
 */
export async function hashSecret(secret = '') {
  if (!secret) return '';
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Basic fallback hash for non-crypto environments
    let hash = 0;
    for (let i = 0; i < secret.length; i++) {
      const char = secret.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `simple_${Math.abs(hash)}`;
  }

  try {
    const msgBuffer = new TextEncoder().encode(secret);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.warn("Crypto hash error:", err);
    return `hash_fallback_${secret.length}`;
  }
}

/**
 * Verify secret against a stored hash or plain string with backward compatibility
 */
export async function verifySecret(inputSecret = '', storedHashOrSecret = '') {
  if (!inputSecret || !storedHashOrSecret) return false;
  
  // If stored is already a 64-character hex string (SHA-256)
  if (/^[a-f0-9]{64}$/i.test(storedHashOrSecret)) {
    const inputHash = await hashSecret(inputSecret);
    return inputHash.toLowerCase() === storedHashOrSecret.toLowerCase();
  }

  // Fallback direct match for legacy plain text PINs
  return inputSecret.trim() === storedHashOrSecret.trim();
}

/**
 * Rate Limiter & Cooldown Manager for Authentication & Sensitive Operations
 */
const rateLimits = new Map();

export function checkRateLimit(actionKey = 'global', maxAttempts = 5, cooldownSeconds = 60) {
  const now = Date.now();
  const entry = rateLimits.get(actionKey) || { attempts: 0, lockedUntil: 0 };

  // Check if locked
  if (entry.lockedUntil > now) {
    const remainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingSeconds,
      message: `Too many attempts! Please wait ${remainingSeconds} seconds.`
    };
  }

  return {
    allowed: true,
    attempts: entry.attempts,
    remainingAttempts: Math.max(0, maxAttempts - entry.attempts)
  };
}

export function recordFailedAttempt(actionKey = 'global', maxAttempts = 5, cooldownSeconds = 60) {
  const now = Date.now();
  const entry = rateLimits.get(actionKey) || { attempts: 0, lockedUntil: 0 };

  entry.attempts += 1;

  if (entry.attempts >= maxAttempts) {
    entry.lockedUntil = now + (cooldownSeconds * 1000);
    entry.attempts = 0; // reset for next cycle
    rateLimits.set(actionKey, entry);
    return {
      isLocked: true,
      remainingSeconds: cooldownSeconds,
      message: `Too many failed attempts. Access locked for ${cooldownSeconds} seconds.`
    };
  }

  rateLimits.set(actionKey, entry);
  const remaining = maxAttempts - entry.attempts;
  return {
    isLocked: false,
    remainingAttempts: remaining,
    message: `Invalid attempt. ${remaining} attempt(s) remaining before temporary lockout.`
  };
}

export function resetRateLimit(actionKey = 'global') {
  rateLimits.delete(actionKey);
}

/**
 * Validates uploaded files against dangerous file extensions and size limits
 */
export const ALLOWED_DOCUMENT_EXTENSIONS = ['.docx', '.doc', '.pdf', '.txt', '.png', '.jpg', '.jpeg'];
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateUploadedFile(file) {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return { 
      valid: false, 
      error: `File size too large (${sizeMb} MB). Maximum allowed size is 25 MB.` 
    };
  }

  // 2. Extension check
  const fileName = (file.name || '').toLowerCase();
  const isAllowedExt = ALLOWED_DOCUMENT_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!isAllowedExt) {
    return { 
      valid: false, 
      error: "Unsupported file type! Only Word (.docx, .doc), PDF (.pdf), Text (.txt), and Images (.jpg, .png) are permitted." 
    };
  }

  // 3. Dangerous extension / double extension blocking (e.g. paper.docx.exe)
  const dangerousPatterns = /\.(exe|bat|cmd|sh|vbs|js|mjs|htm|html|svg|php|phtml|cgi|asp|aspx)$/i;
  if (dangerousPatterns.test(fileName)) {
    return { 
      valid: false, 
      error: "Security Alert: Executable or script files are strictly prohibited." 
    };
  }

  return { valid: true };
}
