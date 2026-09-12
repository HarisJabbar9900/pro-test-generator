import { db } from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const DEFAULT_PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    nameUrdu: 'بیسک پلان',
    price: 3000,
    currency: 'PKR',
    durationLabel: '3 Months',
    durationUrdu: '3 ماہ (سہ ماہی رسائی)',
    durationDays: 90,
    maxPapers: 50,
    maxPapersLabel: '50 Examination Papers',
    maxPapersUrdu: '50 امتحانی پیپرز',
    badge: 'Starter',
    badgeUrdu: 'شروعاتی پلان',
    popular: false,
    color: 'blue',
    features: [
      '3 Months Full Platform Access',
      'Up to 50 Examination Papers',
      'Classes 9th & 10th All Subjects',
      'Official Board Pattern & Custom Watermark',
      'MCQs, Short & Long Question Bank Access',
      'Standard PDF Export with Complete Answer Keys'
    ],
    featuresUrdu: [
      '3 ماہ کے لیے مکمل پلیٹ فارم رسائی',
      '50 امتحانی پیپرز بنانے کی گنجائش',
      'نویں اور دسویں جماعت کے تمام مضامین',
      'آفیشل بورڈ پیٹرن اور کسٹم واٹر مارک',
      'کثیر الانتخابی، مختصر اور تفصیلی سوالات بینک',
      'مکمل جوابی کلید (Answer Key) کے ساتھ پی ڈی ایف'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Plan',
    nameUrdu: 'سلور پلان',
    price: 5000,
    currency: 'PKR',
    durationLabel: '6 Months',
    durationUrdu: '6 ماہ (نصف سال رسائی)',
    durationDays: 180,
    maxPapers: 150,
    maxPapersLabel: '150 Examination Papers',
    maxPapersUrdu: '150 امتحانی پیپرز',
    badge: 'Most Popular',
    badgeUrdu: 'سب سے مقبول',
    popular: true,
    color: 'indigo',
    features: [
      '6 Months Complete Platform Access',
      'Up to 150 Examination Papers',
      'Classes 9th, 10th, 11th & 12th Access',
      'Custom Academy Logo & Header Watermark',
      'Chapter Mix, Half Book & Full Book Tests',
      'Priority WhatsApp Support & Instant Help'
    ],
    featuresUrdu: [
      '6 ماہ کے لیے مکمل پلیٹ فارم رسائی',
      '150 امتحانی پیپرز بنانے کی گنجائش',
      'نویں، دسویں، گیارہویں اور بارہویں جماعتوں کی رسائی',
      'اکیڈمی کا نام، لوگو اور کسٹم واٹر مارک',
      'مکس چیپٹرز، ہاف بک اور فل بک گرینڈ ٹیسٹس',
      'فوری واٹس ایپ سپورٹ اور رہنمائی'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    nameUrdu: 'پلاٹینم پلان',
    price: 9000,
    currency: 'PKR',
    durationLabel: '12 Months (1 Year)',
    durationUrdu: '1 سال (سالانہ رسائی)',
    durationDays: 365,
    maxPapers: -1,
    maxPapersLabel: 'Unlimited Papers',
    maxPapersUrdu: 'لامحدود امتحانی پیپرز',
    badge: 'Best Value',
    badgeUrdu: 'بہترین ویلیو',
    popular: false,
    color: 'purple',
    features: [
      '1 Full Year Unlimited Access',
      'Unlimited Paper Generation',
      'All Classes, All Subjects & Question Banks',
      'Custom Question Additions & Instant Swapping',
      'Official Board Formatting & Bilingual Support',
      '24/7 Dedicated Priority Technical Support'
    ],
    featuresUrdu: [
      '1 سال کے لیے مکمل لامحدود رسائی',
      'لامحدود امتحانی پیپرز بنائیں (کوئی حد نہیں)',
      'تمام کلاسز، تمام مضامین اور مکمل سوالیہ ذخیرہ',
      'اپنے کسٹم سوالات شامل کرنے اور تبدیل کرنے کی سہولت',
      'بورڈ فارمیٹنگ اور دو لسانی (اردو اور انگلش) سپورٹ',
      '24/7 ترجیحی تکنیکی معاونت اور مدد'
    ]
  }
];

export const DEFAULT_PAYMENT_INFO = {
  contactPerson: 'Haris Jabbar',
  adminEmail: 'testgenerator76@gmail.com',
  easyPaisaTitle: 'Haris Jabbar',
  easyPaisaNumber: '0333-4354374',
  jazzCashTitle: 'Haris Jabbar',
  jazzCashNumber: '0333-4354374',
  bankName: 'Meezan Bank Ltd.',
  bankAccountTitle: 'Haris Jabbar',
  bankAccountNumber: '0101-0101010101',
  bankIban: 'PK00MEZN0000000101010101',
  adminWhatsApp: '923334354374',
  instructions: 'پیکیج فیس مندرجہ بالا کسی بھی اکاؤنٹ میں جمع کروا کر اسکرین شاٹ واٹس ایپ پر بھیجیں۔ آپ کا اکاؤنٹ فوری طور پر ایکٹیویٹ کر دیا جائے گا۔'
};

const STORAGE_KEY_PLANS = 'ptm_pricing_plans';
const STORAGE_KEY_PAYMENT = 'ptm_payment_info';

/**
 * Get pricing plans (from localStorage with fallback to default)
 */
export function getLocalPricingPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed;
      }
    }
  } catch (e) {}
  return DEFAULT_PRICING_PLANS;
}

/**
 * Get payment info (from localStorage with fallback to default)
 */
export function getLocalPaymentInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENT);
    if (raw) {
      return { ...DEFAULT_PAYMENT_INFO, ...JSON.parse(raw) };
    }
  } catch (e) {}
  return DEFAULT_PAYMENT_INFO;
}

/**
 * Fetch latest pricing plans and payment info from Firestore
 */
export async function fetchPricingFromFirestore() {
  try {
    const docRef = doc(db, "system_settings", "pricing_plans");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const plans = (Array.isArray(data.plans) && data.plans.length >= 3) ? data.plans : DEFAULT_PRICING_PLANS;
      const paymentInfo = data.paymentInfo ? { ...DEFAULT_PAYMENT_INFO, ...data.paymentInfo } : DEFAULT_PAYMENT_INFO;

      // Cache locally
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
      localStorage.setItem(STORAGE_KEY_PAYMENT, JSON.stringify(paymentInfo));

      return { plans, paymentInfo };
    }
  } catch (err) {
    console.warn("Firestore pricing fetch note:", err.message);
  }

  return {
    plans: getLocalPricingPlans(),
    paymentInfo: getLocalPaymentInfo()
  };
}

/**
 * Admin: Save updated plans & payment info to Firestore and LocalStorage
 */
export async function savePricingToFirestore(plans, paymentInfo) {
  // 1. Save to LocalStorage immediately
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEY_PAYMENT, JSON.stringify(paymentInfo));
  } catch (e) {}

  // 2. Save to Firestore
  try {
    const docRef = doc(db, "system_settings", "pricing_plans");
    await setDoc(docRef, {
      plans,
      paymentInfo,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn("Firestore pricing save note:", err.message);
    return false;
  }
}

/**
 * Admin: Reset to system default plans
 */
export async function resetPricingToDefaults() {
  return await savePricingToFirestore(DEFAULT_PRICING_PLANS, DEFAULT_PAYMENT_INFO);
}

/**
 * Strict Super Admin Validator: ONLY testgenerator76@gmail.com is EVER allowed Super Admin authority.
 * Prevents client-side spoofing / localStorage manipulation of isAdmin flag.
 */
export function isSuperAdmin(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  return email === 'testgenerator76@gmail.com' || email === 'testgenerator76';
}

/**
 * Check if a user has an active, paid, valid subscription
 */
export function isUserSubscribed(user) {
  if (!user) return false;
  // Super Admin always enjoys permanent full access
  if (isSuperAdmin(user)) return true;

  // Non-admin users MUST strictly meet all conditions:
  // 1. Valid package name (not missing, not 'None', not 'unpaid')
  if (!user.package || user.package === 'None' || user.package === 'unpaid') {
    return false;
  }

  // 2. Explicit active subscription status (must be strictly 'active')
  if (user.subscriptionStatus !== 'active') {
    return false;
  }

  // 3. User status must not be blocked
  if (user.status === 'blocked') {
    return false;
  }

  // 4. Must have a valid expiry date that is in the future
  if (!user.expiryDate) {
    return false;
  }
  const expiry = new Date(user.expiryDate);
  expiry.setHours(23, 59, 59, 999);
  if (isNaN(expiry.getTime()) || expiry < new Date()) {
    return false; // Expired or invalid date
  }

  return true;
}

/**
 * Teacher: Submit payment proof (Transaction ID / sender mobile)
 */
export async function submitPaymentProof(email, proofData) {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const submission = {
    ...proofData,
    submittedAt: new Date().toISOString(),
    submittedAtFormatted: new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' }),
    status: 'pending_verification'
  };

  // 1. Update Firestore user document
  try {
    const userRef = doc(db, "users", cleanEmail);
    await setDoc(userRef, {
      paymentProof: submission,
      subscriptionStatus: 'pending_verification'
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore payment proof submit note:", err.message);
  }

  // 2. Update LocalStorage cache
  try {
    const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
    const updated = localUsers.map(u => {
      if (u.email?.toLowerCase() === cleanEmail) {
        return { ...u, paymentProof: submission, subscriptionStatus: 'pending_verification' };
      }
      return u;
    });
    localStorage.setItem('ptm_registered_users', JSON.stringify(updated));

    // Update active user in session if matches
    const active = JSON.parse(sessionStorage.getItem('ptm_active_user') || localStorage.getItem('ptm_active_user') || '{}');
    if (active.email?.toLowerCase() === cleanEmail) {
      const updatedActive = { ...active, paymentProof: submission, subscriptionStatus: 'pending_verification' };
      sessionStorage.setItem('ptm_active_user', JSON.stringify(updatedActive));
    }
  } catch (e) {}

  return true;
}
