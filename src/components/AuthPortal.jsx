import React, { useState } from 'react';
import { 
  BookOpen, Lock, Mail, User, School, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, 
  Globe, KeyRound, Award, Phone, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import libraryBg from '../assets/library_books_bg.jpg';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { recordUserLoginEvent } from '../utils/userActivityTracker';
import { checkRateLimit, recordFailedAttempt, resetRateLimit, sanitizeText } from '../utils/securitySanitizer';

export default function AuthPortal({ onLoginSuccess }) {
  // Language toggle: default is English as requested ('en' | 'ur')
  const [lang, setLang] = useState('en'); 
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Security Lockout Countdown Timer
  React.useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Login form state (Email or Mobile Number input)
  const [loginEmail, setLoginEmail] = useState(() => {
    try {
      const saved = localStorage.getItem('ptm_remembered_email') || '';
      if (saved.toLowerCase() === 'testgenerator76@gmail.com') return '';
      return saved;
    } catch (e) {
      return '';
    }
  });
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regInstitute, setRegInstitute] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Senior Subject Teacher');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Helper: Normalize Pakistani & International Phone Numbers into standardized formats
  const getPhoneVariations = (input) => {
    const raw = (input || '').trim();
    const digitsOnly = raw.replace(/\D/g, '');
    let stdPhone = digitsOnly;
    if (digitsOnly.startsWith('923') && digitsOnly.length === 12) {
      stdPhone = '0' + digitsOnly.slice(2);
    } else if (digitsOnly.startsWith('3') && digitsOnly.length === 10) {
      stdPhone = '0' + digitsOnly;
    }

    const variations = [
      raw,
      digitsOnly,
      stdPhone,
      stdPhone ? `+92${stdPhone.startsWith('0') ? stdPhone.slice(1) : stdPhone}` : null,
      stdPhone ? `92${stdPhone.startsWith('0') ? stdPhone.slice(1) : stdPhone}` : null
    ].filter(Boolean);

    return {
      raw,
      digitsOnly,
      stdPhone,
      variations: Array.from(new Set(variations))
    };
  };

  // Record Login activity log into Firestore & localStorage
  const recordLoginLog = async (user) => {
    const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    const nowIso = new Date().toISOString();

    // 1. Update user's lastLogin in Firestore
    if (user?.email) {
      try {
        const userRef = doc(db, "users", user.email.toLowerCase().trim());
        await setDoc(userRef, {
          lastLogin: nowFormatted,
          lastLoginIso: nowIso
        }, { merge: true });
      } catch (e) {}
    }

    // 2. Update user's lastLogin in localStorage
    try {
      const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
      const updated = localUsers.map(u => {
        if (u.email?.toLowerCase() === user.email?.toLowerCase()) {
          return { ...u, lastLogin: nowFormatted, lastLoginIso: nowIso };
        }
        return u;
      });
      localStorage.setItem('ptm_registered_users', JSON.stringify(updated));
    } catch (e) {}

    // 3. Append to login activity logs
    const logEntry = {
      id: `log-${Date.now()}`,
      userName: user.name || 'User',
      userEmail: user.email || 'unknown',
      phone: user.phone || '',
      institute: user.institute || 'Educators Academy',
      role: user.role || 'Teacher',
      timestamp: nowFormatted,
      timeIso: nowIso,
      isAdmin: !!user.isAdmin
    };

    try {
      const existingLogs = JSON.parse(localStorage.getItem('ptm_login_logs') || '[]');
      const newLogs = [logEntry, ...existingLogs.slice(0, 99)];
      localStorage.setItem('ptm_login_logs', JSON.stringify(newLogs));
    } catch (e) {}

    // 4. Save to Firestore collection 'login_logs'
    try {
      const logDocRef = doc(db, "login_logs", logEntry.id);
      await setDoc(logDocRef, logEntry);
    } catch (e) {}

    // 5. Update user-specific activity and login counter
    try {
      recordUserLoginEvent(user.email, user.name);
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // ACTION: Login Handler (Email OR Phone Number)
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // A. Rate Limit Check
    const rateStatus = checkRateLimit('auth_portal_login', 5, 60);
    if (!rateStatus.allowed) {
      setLockoutSeconds(rateStatus.remainingSeconds);
      setErrorMessage(
        lang === 'ur'
          ? `سیکیورٹی الرٹ: بہت زیادہ غلط کوششیں! براہ کرم ${rateStatus.remainingSeconds} سیکنڈ انتظار کریں۔`
          : `Security Alert: Too many failed attempts! Please wait ${rateStatus.remainingSeconds}s before retrying.`
      );
      return;
    }

    const rawInput = sanitizeText(loginEmail.trim());
    const cleanPass = loginPassword.trim();

    if (!rawInput || !cleanPass) {
      setErrorMessage(
        lang === 'ur'
          ? 'برائے مہربانی ای میل یا فون نمبر اور پاسورڈ دونوں درج کریں۔'
          : 'Please enter both Email or Phone Number and Password.'
      );
      return;
    }

    // 1. ADMIN CREDENTIALS VERIFICATION (testgenerator76@gmail.com / 9900)
    const isAdminAccount = (
      rawInput.toLowerCase() === 'testgenerator76@gmail.com' ||
      rawInput.toLowerCase() === 'testgenerator76' ||
      rawInput.toLowerCase() === 'admin'
    );

    if (isAdminAccount) {
      if (cleanPass === '9900') {
        resetRateLimit('auth_portal_login');
        const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
        const adminUser = {
          name: 'System Administrator',
          email: 'testgenerator76@gmail.com',
          institute: 'Central Examination Board',
          role: 'Super Administrator',
          isAdmin: true,
          lastLogin: nowFormatted,
          loginTime: new Date().toISOString()
        };

        recordLoginLog(adminUser).catch(() => {});

        // SECURITY: Admin session is strictly saved ONLY in sessionStorage for active tab
        sessionStorage.setItem('ptm_active_user', JSON.stringify(adminUser));
        try {
          localStorage.removeItem('ptm_active_user');
          localStorage.removeItem('ptm_remembered_email');
        } catch (e) {}

        try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (err) {}
        setSuccessMessage(
          lang === 'ur'
            ? 'ایڈمن لاگ ان کامیاب! تمام پورٹل ٹولز فعال ہو گئے۔'
            : 'Admin Login Successful! All management tools unlocked.'
        );
        setTimeout(() => onLoginSuccess(adminUser), 300);
        return;
      } else {
        const attemptRes = recordFailedAttempt('auth_portal_login', 5, 60);
        if (attemptRes.isLocked) {
          setLockoutSeconds(attemptRes.remainingSeconds);
        }
        await new Promise(r => setTimeout(r, 600));
        setErrorMessage(
          lang === 'ur'
            ? `ایڈمن پاسورڈ درست نہیں ہے۔ (${attemptRes.remainingAttempts || 0} کوششیں باقی ہیں)`
            : `Incorrect Admin password! (${attemptRes.remainingAttempts || 0} attempt(s) remaining)`
        );
        return;
      }
    }

    // 2. STANDARD REGISTERED USER LOGIN VERIFICATION (By Email OR Phone Number)
    setIsLoading(true);

    try {
      let loggedUser = null;
      let fbUser = null;
      const isEmail = rawInput.includes('@');
      const cleanEmail = isEmail ? rawInput.toLowerCase() : '';
      const phoneData = !isEmail ? getPhoneVariations(rawInput) : null;
      let resolvedEmail = cleanEmail;

      // A. Fetch authoritative user document from Firestore 'users'
      let firestoreData = null;

      if (isEmail) {
        try {
          const userDocRef = doc(db, "users", cleanEmail);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            firestoreData = userSnap.data();
            resolvedEmail = cleanEmail;
          }
        } catch (dbErr) {
          console.warn("Firestore lookup note:", dbErr.message);
        }
      } else if (phoneData) {
        // Query users by phone number variations
        try {
          for (const cand of phoneData.variations) {
            if (firestoreData) break;
            // 1. Direct phone query
            const q1 = query(collection(db, "users"), where("phone", "==", cand));
            const snap1 = await getDocs(q1);
            if (!snap1.empty) {
              firestoreData = snap1.docs[0].data();
              resolvedEmail = firestoreData.email || snap1.docs[0].id;
              break;
            }
            // 2. Clean digits query
            const q2 = query(collection(db, "users"), where("phoneClean", "==", cand));
            const snap2 = await getDocs(q2);
            if (!snap2.empty) {
              firestoreData = snap2.docs[0].data();
              resolvedEmail = firestoreData.email || snap2.docs[0].id;
              break;
            }
            // 3. Standardized phone query
            const q3 = query(collection(db, "users"), where("phoneStd", "==", cand));
            const snap3 = await getDocs(q3);
            if (!snap3.empty) {
              firestoreData = snap3.docs[0].data();
              resolvedEmail = firestoreData.email || snap3.docs[0].id;
              break;
            }
          }
        } catch (dbErr) {
          console.warn("Firestore phone lookup note:", dbErr.message);
        }
      }

      // B. Try Firebase Auth (if resolved email is available)
      if (resolvedEmail) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, resolvedEmail, cleanPass);
          fbUser = userCredential.user;
        } catch (fbErr) {
          console.warn("Firebase Auth sign-in attempt:", fbErr.message);
        }
      }

      // C. If Firestore user exists, verify credentials and load exact subscription state
      if (firestoreData) {
        const passwordMatches = (firestoreData.password === cleanPass) || Boolean(fbUser);
        if (!passwordMatches) {
          throw new Error(
            lang === 'ur'
              ? 'پاسورڈ درست نہیں ہے! برائے مہربانی دوبارہ کوشش کریں۔'
              : 'Incorrect password! Please re-check your password.'
          );
        }

        // 1. Check if user is blocked
        if (firestoreData.status === 'blocked') {
          throw new Error(
            lang === 'ur'
              ? 'آپ کا اکاؤنٹ ایڈمن کی طرف سے معطل / بلاک کر دیا گیا ہے۔ برائے مہربانی ایڈمنسٹریٹر سے رابطہ کریں۔'
              : 'Your account has been suspended/blocked by the administrator. Please contact support.'
          );
        }

        // 2. Check Admin status
        const isAdmin = Boolean(firestoreData.isAdmin || resolvedEmail === 'testgenerator76@gmail.com');

        // 3. Strict Subscription Validation: Non-admins MUST have active subscription status and future expiry
        let isSubscribed = false;
        let finalPackage = 'None';
        let finalStatus = 'unpaid';
        let finalExpiry = firestoreData.expiryDate || null;
        let finalQuota = 0;

        if (isAdmin) {
          isSubscribed = true;
          finalPackage = 'Unlimited Admin';
          finalStatus = 'active';
          finalQuota = -1;
        } else if (
          firestoreData.subscriptionStatus === 'active' &&
          firestoreData.package &&
          firestoreData.package !== 'None' &&
          firestoreData.package !== 'unpaid'
        ) {
          if (firestoreData.expiryDate) {
            const exp = new Date(firestoreData.expiryDate);
            exp.setHours(23, 59, 59, 999);
            if (!isNaN(exp.getTime()) && exp >= new Date()) {
              isSubscribed = true;
              finalPackage = firestoreData.package;
              finalStatus = 'active';
              finalQuota = firestoreData.maxPapers !== undefined ? firestoreData.maxPapers : -1;
            }
          }
        }

        loggedUser = {
          name: firestoreData.name || (fbUser?.displayName) || resolvedEmail.split('@')[0],
          email: resolvedEmail,
          phone: firestoreData.phone || (phoneData ? phoneData.raw : ''),
          institute: firestoreData.institute || 'Educators Academy',
          role: firestoreData.role || 'Teacher',
          package: finalPackage,
          subscriptionStatus: finalStatus,
          expiryDate: finalExpiry,
          maxPapers: finalQuota,
          status: firestoreData.status || 'active',
          paymentProof: firestoreData.paymentProof || null,
          isAdmin: isAdmin,
          uid: fbUser?.uid || null
        };
      }

      // D. Check Local Registered Users Cache (if Firestore doc was not found)
      if (!loggedUser) {
        const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
        const matched = localUsers.find(u => {
          if (isEmail && u.email?.toLowerCase() === cleanEmail) return true;
          if (!isEmail && phoneData) {
            const uDigits = (u.phone || '').replace(/\D/g, '');
            const uCleanDigits = (u.phoneClean || '').replace(/\D/g, '');
            const uStdDigits = (u.phoneStd || '').replace(/\D/g, '');
            return (
              phoneData.variations.includes(u.phone) ||
              phoneData.variations.includes(u.phoneClean) ||
              phoneData.variations.includes(u.phoneStd) ||
              (uDigits && (uDigits === phoneData.digitsOnly || uDigits === phoneData.stdPhone)) ||
              (uCleanDigits && (uCleanDigits === phoneData.digitsOnly || uCleanDigits === phoneData.stdPhone)) ||
              (uStdDigits && (uStdDigits === phoneData.stdPhone))
            );
          }
          return false;
        });

        if (matched) {
          const passwordMatches = (matched.password === cleanPass) || Boolean(fbUser);
          if (!passwordMatches) {
            throw new Error(
              lang === 'ur'
                ? 'پاسورڈ درست نہیں ہے! برائے مہربانی دوبارہ کوشش کریں۔'
                : 'Incorrect password! Please re-check your password.'
            );
          }

          if (matched.status === 'blocked') {
            throw new Error(
              lang === 'ur'
                ? 'آپ کا اکاؤنٹ ایڈمن کی طرف سے معطل / بلاک کر دیا گیا ہے۔ برائے مہربانی ایڈمنسٹریٹر سے رابطہ کریں۔'
                : 'Your account has been suspended/blocked by the administrator. Please contact support.'
            );
          }

          const isAdmin = Boolean(matched.isAdmin || matched.email?.toLowerCase() === 'testgenerator76@gmail.com');
          let finalPackage = 'None';
          let finalStatus = 'unpaid';
          let finalExpiry = matched.expiryDate || null;
          let finalQuota = 0;

          if (isAdmin) {
            finalPackage = 'Unlimited Admin';
            finalStatus = 'active';
            finalQuota = -1;
          } else if (
            matched.subscriptionStatus === 'active' &&
            matched.package &&
            matched.package !== 'None' &&
            matched.package !== 'unpaid'
          ) {
            if (matched.expiryDate) {
              const exp = new Date(matched.expiryDate);
              exp.setHours(23, 59, 59, 999);
              if (!isNaN(exp.getTime()) && exp >= new Date()) {
                finalPackage = matched.package;
                finalStatus = 'active';
                finalQuota = matched.maxPapers !== undefined ? matched.maxPapers : -1;
              }
            }
          }

          loggedUser = {
            ...matched,
            package: finalPackage,
            subscriptionStatus: finalStatus,
            expiryDate: finalExpiry,
            maxPapers: finalQuota,
            status: matched.status || 'active',
            isAdmin: isAdmin,
            uid: fbUser?.uid || null
          };
          delete loggedUser.password;
        }
      }

      // E. Fallback to Firebase Auth user if registered only via FB Auth
      if (!loggedUser && fbUser && resolvedEmail) {
        loggedUser = {
          name: fbUser.displayName || resolvedEmail.split('@')[0],
          email: resolvedEmail,
          phone: phoneData ? phoneData.raw : '',
          role: 'Senior Teacher / Examiner',
          institute: 'Educators Academy',
          package: 'None',
          subscriptionStatus: 'unpaid',
          expiryDate: null,
          maxPapers: 0,
          status: 'active',
          isAdmin: false,
          uid: fbUser.uid
        };
      }

      // F. If not found anywhere -> strictly throw error
      if (!loggedUser) {
        throw new Error(
          lang === 'ur'
            ? 'اس ای میل یا موبائل نمبر سے کوئی اکاؤنٹ نہیں ملا۔ برائے مہربانی "نیا اکاؤنٹ بنائیں" پر کلک کریں۔'
            : 'No account found with this Email or Phone Number! Please click "Register" to create one.'
        );
      }

      // Login Successful: Save session in sessionStorage & record log
      const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
      loggedUser.lastLogin = nowFormatted;
      recordLoginLog(loggedUser).catch(() => {});

      // Tab-isolated active session
      sessionStorage.setItem('ptm_active_user', JSON.stringify(loggedUser));
      try {
        localStorage.removeItem('ptm_active_user');
        if (rememberMe && !loggedUser.isAdmin && loggedUser.email !== 'testgenerator76@gmail.com') {
          localStorage.setItem('ptm_remembered_email', rawInput);
        } else {
          localStorage.removeItem('ptm_remembered_email');
        }
      } catch (e) {}

      // Check if user just registered to route them directly to pricing
      const justRegistered = sessionStorage.getItem('ptm_just_registered') === 'true' || 
                             sessionStorage.getItem('ptm_just_registered') === loggedUser.email;
      if (justRegistered) {
        try { sessionStorage.removeItem('ptm_just_registered'); } catch (e) {}
      }
      const isNewRegistration = Boolean(justRegistered || (!loggedUser.isAdmin && (!loggedUser.package || loggedUser.package === 'None')));

      resetRateLimit('auth_portal_login');
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (err) {}
      setSuccessMessage(
        lang === 'ur'
          ? 'خوش آمدید! آپ کا لاگ ان کامیاب رہا۔'
          : `Welcome back, ${loggedUser.name}! Login successful.`
      );
      setTimeout(() => onLoginSuccess(loggedUser, isNewRegistration), 280);

    } catch (err) {
      const attemptRes = recordFailedAttempt('auth_portal_login', 5, 60);
      if (attemptRes.isLocked) {
        setLockoutSeconds(attemptRes.remainingSeconds);
      }
      await new Promise(r => setTimeout(r, 600));
      console.warn("Login Failure:", err);
      setErrorMessage(
        attemptRes.isLocked
          ? (lang === 'ur' ? `بہت زیادہ غلط کوششیں! لاگ ان ${attemptRes.remainingSeconds} سیکنڈ کے لیے لاک ہو گیا ہے۔` : `Too many failed attempts! Access locked for ${attemptRes.remainingSeconds}s.`)
          : (err.message || 'Login failed. Please check your credentials.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ACTION: Registration Handler (Saves to DB, then redirects to Login)
  // -------------------------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanName = regName.trim();
    const cleanPhone = regPhone.trim();
    const phoneInfo = getPhoneVariations(cleanPhone);
    const cleanEmail = regEmail.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage(lang === 'ur' ? 'برائے مہربانی اپنا مکمل نام درج کریں۔' : 'Please enter your Full Name.');
      return;
    }
    if (!phoneInfo.digitsOnly || phoneInfo.digitsOnly.length < 10) {
      setErrorMessage(
        lang === 'ur' 
          ? 'برائے مہربانی درست 11 ہندسوں کا موبائل / واٹس ایپ نمبر درج کریں (مثلاً: 03001234567)۔' 
          : 'Please enter a valid Phone / WhatsApp number (e.g. 03001234567).'
      );
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(lang === 'ur' ? 'برائے مہربانی درست ای میل ایڈریس درج کریں۔' : 'Please enter a valid Email Address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage(
        lang === 'ur' 
          ? 'پاسورڈ کم از کم 6 ہندسوں یا حروف کا ہونا چاہیے۔' 
          : 'Password must be at least 6 digits or characters long.'
      );
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage(lang === 'ur' ? 'دونوں پاسورڈ ایک جیسے نہیں ہیں۔' : 'Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
      const nowIso = new Date().toISOString();
      const newUser = {
        name: cleanName,
        phone: cleanPhone,
        phoneClean: phoneInfo.digitsOnly,
        phoneStd: phoneInfo.stdPhone,
        email: cleanEmail,
        institute: regInstitute.trim() || 'Educators Academy',
        role: regRole,
        isAdmin: false,
        package: 'None',
        subscriptionStatus: 'unpaid',
        expiryDate: null,
        maxPapers: 0,
        createdAt: nowFormatted,
        createdIso: nowIso,
        lastLogin: nowFormatted,
        lastLoginIso: nowIso
      };

      // 1. Save to Firebase Firestore Collection 'users'
      try {
        await setDoc(doc(db, "users", cleanEmail), {
          ...newUser,
          password: regPassword
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn("Firestore registration note:", firestoreErr.message);
      }

      // 2. Try Firebase Auth Account Creation
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, regPassword);
        await updateProfile(userCredential.user, { displayName: cleanName });
      } catch (fbErr) {
        console.warn("Firebase Auth create notice:", fbErr.message);
      }

      // 3. Save to Local Registered Users Backup
      const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
      const filtered = localUsers.filter(u => u.email?.toLowerCase() !== cleanEmail);
      filtered.push({
        ...newUser,
        password: regPassword
      });
      localStorage.setItem('ptm_registered_users', JSON.stringify(filtered));

      // 4. Mark that this user just registered so login automatically sends them to pricing
      try {
        sessionStorage.setItem('ptm_just_registered', cleanEmail);
      } catch (e) {}

      // 5. PREPARE LOGIN VIEW FOR THE USER (prefills phone or email)
      setLoginEmail(cleanPhone || cleanEmail);
      setLoginPassword('');
      setActiveTab('login');

      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (err) {}

      setSuccessMessage(
        lang === 'ur'
          ? 'اکاؤنٹ کامیابی سے بن گیا! اب پاسورڈ درج کر کے لاگ ان کریں۔'
          : 'Account created successfully! Please sign in with your password.'
      );

    } catch (err) {
      console.warn("Registration Error:", err);
      setErrorMessage(err.message || 'Failed to register account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-6 select-none overflow-x-hidden font-sans">
      
      {/* 1. CRISP, SHARP CINEMATIC LIBRARY WITH BOOKS BACKGROUND (NO BLURRING OF IMAGE) */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
        style={{ 
          backgroundImage: `url(${libraryBg})`,
          filter: 'contrast(1.08) brightness(0.85) saturate(1.12)'
        }}
      />

      {/* 2. RICH OPTICAL VIGNETTE & POLISHED GRADIENT (KEEPS BOOKSHELVES CRISP & READABLE) */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/55 to-indigo-950/75 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.2)_0%,rgba(2,6,23,0.82)_100%)] pointer-events-none" />

      {/* 3. CENTRAL EXECUTIVE AUTH CONTAINER - SLEEK, BEAUTIFUL & PROFESSIONAL */}
      <div className="relative z-10 w-full max-w-[480px] sm:max-w-[520px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45),0_0_1px_1px_rgba(255,255,255,0.3)] rounded-[26px] overflow-hidden animate-fadeIn my-auto p-6 sm:p-8 flex flex-col justify-between">
        
        <div>
          {/* BRAND HEADER */}
          <div className="flex items-center justify-center gap-3.5 mb-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 ring-4 ring-blue-500/10">
              <BookOpen className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                PRO TEST MAKER
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                  {lang === 'ur' ? 'امتحانی پورٹل و سمارٹ جنریٹر' : 'Exam & Assessment Portal'}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  SNC 2026
                </span>
              </div>
            </div>
          </div>
            
          {/* TOP BAR: TABS (SIGN IN / REGISTER) + LANGUAGE SWITCHER */}
          <div className="flex items-center justify-between gap-3 mb-5">
            
            {/* Tab Switcher: Sign In | Register */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 flex-1 shadow-inner">
              <button
                type="button"
                id="btn-tab-signin"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'لاگ ان' : 'Sign In'}</span>
              </button>

              <button
                type="button"
                id="btn-tab-register"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Register'}</span>
              </button>
            </div>

            {/* Language Switcher Toggle */}
            <button
              type="button"
              id="btn-lang-toggle"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200/80 shrink-0 cursor-pointer shadow-xs"
              title={lang === 'en' ? 'Switch to Urdu' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'اردو' : 'English'}</span>
            </button>

          </div>

          {/* ERROR NOTIFICATION ALERT */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* SUCCESS NOTIFICATION ALERT */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="leading-snug">{successMessage}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: SIGN IN FORM (SUPPORTS EMAIL OR PHONE NUMBER)         */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
              
              {/* Email / Mobile Number Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'ای میل ایڈریس یا موبائل نمبر *' : 'Email Address or Mobile Number *'}
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {lang === 'ur' ? 'موبائل یا ای میل' : 'Email / Phone'}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1 text-slate-400 pointer-events-none">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] text-slate-300">/</span>
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    id="login-identifier-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={lang === 'ur' ? 'موبائل نمبر یا ای میل (مثلاً: 03001234567)' : 'e.g. 03001234567 or teacher@school.com'}
                    className="w-full pl-14 pr-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all shadow-xs"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {lang === 'ur' 
                    ? 'آپ اپنی رجسٹرڈ ای میل یا موبائل نمبر کے ذریعے لاگ ان کر سکتے ہیں' 
                    : 'You can sign in using your registered Mobile Number OR Email'}
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'اکاؤنٹ پاسورڈ *' : 'Password *'}
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ur' ? 'محفوظ سیشن' : '256-bit Encrypted'}</span>
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="login-password-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    id="toggle-login-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember credentials */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer accent-blue-600"
                  />
                  <span>{lang === 'ur' ? 'لاگ ان معلومات یاد رکھیں' : 'Remember my login info'}</span>
                </label>
              </div>

              {/* Submit Sign In Button */}
              <button
                type="submit"
                id="submit-login-btn"
                disabled={isLoading || lockoutSeconds > 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 mt-1"
              >
                <span>
                  {lockoutSeconds > 0
                    ? (lang === 'ur' ? `لاک آؤٹ (${lockoutSeconds} سیکنڈ)` : `Locked (${lockoutSeconds}s)`)
                    : isLoading 
                      ? (lang === 'ur' ? 'تصدیق ہو رہی ہے...' : 'Verifying credentials...') 
                      : (lang === 'ur' ? 'پورٹل میں داخل ہوں' : 'Sign In to Dashboard')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch to Register link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'ur' ? 'نیا اکاؤنٹ بنانا چاہتے ہیں؟ ' : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer ml-1"
                  >
                    {lang === 'ur' ? 'یہاں رجسٹر کریں' : 'Register here'}
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 2: TEACHER REGISTRATION FORM (MODERN, CLEAN & COMPACT)  */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 animate-fadeIn">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {lang === 'ur' ? 'مکمل نام *' : 'Full Name *'}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    id="register-fullname-input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={lang === 'ur' ? 'مثلاً: پروفیسر محمد اسلم' : 'e.g. Prof. Muhammad Aslam'}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* 2-Column Row: Mobile / WhatsApp Number & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Mobile / WhatsApp Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'موبائل / واٹس ایپ نمبر *' : 'Mobile / WhatsApp *'}
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      id="register-phone-input"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all shadow-xs font-mono"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'ای میل ایڈریس *' : 'Email Address *'}
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      id="register-email-input"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="teacher@school.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2-Column Row: Institute Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* School / College / Academy Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'ادارہ / اسکول کا نام' : 'School / College / Academy'}
                  </label>
                  <div className="relative flex items-center">
                    <School className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      id="register-institute-input"
                      value={regInstitute}
                      onChange={(e) => setRegInstitute(e.target.value)}
                      placeholder={lang === 'ur' ? 'مثلاً: پنجاب کالج' : 'e.g. Punjab College'}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Designation / Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'عہدہ / ڈیزگنیشن' : 'Designation / Role'}
                  </label>
                  <select
                    id="register-role-select"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer shadow-xs"
                  >
                    <option value="Senior Subject Teacher">{lang === 'ur' ? 'سبجیکٹ ٹیچر' : 'Subject Teacher'}</option>
                    <option value="Head of Department">{lang === 'ur' ? 'ہیڈ آف ڈیپارٹمنٹ' : 'Head of Department'}</option>
                    <option value="School Principal">{lang === 'ur' ? 'پرنسپل' : 'Principal'}</option>
                    <option value="Academy Director">{lang === 'ur' ? 'اکیڈمی ڈائریکٹر' : 'Academy Director'}</option>
                  </select>
                </div>
              </div>

              {/* 2-Column Row: Password (min 6 digits) & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'پاسورڈ (کم از کم 6 ہندسے) *' : 'Password (min 6 digits) *'}
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      id="register-password-input"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-9 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none shadow-xs"
                    />
                    <button
                      type="button"
                      id="toggle-register-password"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      aria-label="Toggle password"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'تصدیق پاسورڈ *' : 'Confirm Password *'}
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      id="register-confirmpassword-input"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50/90 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                id="submit-register-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                <span>
                  {isLoading 
                    ? (lang === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Creating Account...') 
                    : (lang === 'ur' ? 'اکاؤنٹ بنائیں اور لاگ ان کریں' : 'Register & Proceed to Sign In')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Back to login */}
              <div className="text-center pt-1">
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'ur' ? 'پہلے سے اکاؤنٹ موجود ہے؟ ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer ml-1"
                  >
                    {lang === 'ur' ? 'یہاں لاگ ان کریں' : 'Sign in here'}
                  </button>
                </p>
              </div>

            </form>
          )}

        </div>

        {/* FOOTER GUARANTEE BADGE */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'ur' ? 'ایس این سی نصاب سے ہم آہنگ' : 'SNC Curriculum Aligned'}</span>
          </span>
          <span className="text-slate-400 font-medium">PRO TEST MAKER © 2026</span>
        </div>

      </div>

    </div>
  );
}
