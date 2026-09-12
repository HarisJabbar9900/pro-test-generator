import React, { useState } from 'react';
import { 
  BookOpen, Lock, Mail, User, School, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, 
  Globe, Database, KeyRound, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import libraryBg from '../assets/library_books_bg.jpg';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { recordUserLoginEvent } from '../utils/userActivityTracker';

export default function AuthPortal({ onLoginSuccess }) {
  // Language toggle: default is English as requested ('en' | 'ur')
  const [lang, setLang] = useState('en'); 
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state (prefill remembered email for standard teachers only, never admin)
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
  const [regInstitute, setRegInstitute] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Senior Subject Teacher');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

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
  // ACTION: Login Handler
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage(
        lang === 'ur'
          ? 'برائے مہربانی ای میل اور پاسورڈ دونوں درج کریں۔'
          : 'Please enter both Email/Username and Password.'
      );
      return;
    }

    // 1. ADMIN CREDENTIALS VERIFICATION (testgenerator76@gmail.com / 9900)
    const isAdminAccount = (
      cleanEmail === 'testgenerator76@gmail.com' ||
      cleanEmail === 'testgenerator76' ||
      cleanEmail === 'admin'
    );

    if (isAdminAccount) {
      if (cleanPass === '9900') {
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

        // SECURITY: Admin session is strictly saved ONLY in sessionStorage for the active tab/window.
        // Admin credentials and sessions must NEVER be stored in persistent localStorage.
        sessionStorage.setItem('ptm_active_user', JSON.stringify(adminUser));
        try {
          localStorage.removeItem('ptm_active_user');
          localStorage.removeItem('ptm_remembered_email');
        } catch (e) {}

        try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (err) {}
        setSuccessMessage(
          lang === 'ur'
            ? 'ایڈمن لاگ ان کامیاب! تمام اپلوڈ اور ایڈمن ٹولز انلاک ہو گئے۔'
            : 'Admin Login Successful! All upload and management tools unlocked.'
        );
        setTimeout(() => onLoginSuccess(adminUser), 350);
        return;
      } else {
        setErrorMessage(
          lang === 'ur'
            ? 'ایڈمن پاسورڈ درست نہیں ہے۔ برائے مہربانی درست پاسورڈ درج کریں۔'
            : 'Incorrect Admin password! Please enter the valid password for this admin account.'
        );
        return;
      }
    }

    // 2. STANDARD REGISTERED USER LOGIN VERIFICATION
    setIsLoading(true);

    try {
      let loggedUser = null;
      let fbUser = null;

      // A. Try Firebase Auth (if available)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        fbUser = userCredential.user;
      } catch (fbErr) {
        console.warn("Firebase Auth sign-in attempt:", fbErr.message);
      }

      // B. Fetch authoritative user document from Firestore 'users'
      let firestoreData = null;
      try {
        const userDocRef = doc(db, "users", cleanEmail);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          firestoreData = userSnap.data();
        }
      } catch (dbErr) {
        console.warn("Firestore lookup note:", dbErr.message);
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
        const isAdmin = Boolean(firestoreData.isAdmin || cleanEmail === 'testgenerator76@gmail.com');

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
          name: firestoreData.name || (fbUser?.displayName) || cleanEmail.split('@')[0],
          email: cleanEmail,
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
        const matched = localUsers.find(u => u.email?.toLowerCase() === cleanEmail);

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

          const isAdmin = Boolean(matched.isAdmin || cleanEmail === 'testgenerator76@gmail.com');
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
      if (!loggedUser && fbUser) {
        loggedUser = {
          name: fbUser.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
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

      // F. If not found anywhere -> strictly throw error!
      if (!loggedUser) {
        throw new Error(
          lang === 'ur'
            ? 'یہ اکاؤنٹ موجود نہیں ہے۔ برائے مہربانی پہلے "نیا اکاؤنٹ بنائیں" پر رجسٹر کریں۔'
            : 'No account found with these credentials! Please verify or click "Create Account" to register.'
        );
      }

      // Login Successful: Save session strictly in sessionStorage & record log
      const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
      loggedUser.lastLogin = nowFormatted;
      recordLoginLog(loggedUser).catch(() => {});

      // Tab-isolated active session
      sessionStorage.setItem('ptm_active_user', JSON.stringify(loggedUser));
      try {
        localStorage.removeItem('ptm_active_user');
        if (rememberMe && !loggedUser.isAdmin && cleanEmail !== 'testgenerator76@gmail.com') {
          localStorage.setItem('ptm_remembered_email', cleanEmail);
        } else {
          localStorage.removeItem('ptm_remembered_email');
        }
      } catch (e) {}

      // Check if user just registered to route them directly to pricing
      const justRegistered = sessionStorage.getItem('ptm_just_registered') === 'true' || 
                             sessionStorage.getItem('ptm_just_registered') === cleanEmail;
      if (justRegistered) {
        try { sessionStorage.removeItem('ptm_just_registered'); } catch (e) {}
      }
      const isNewRegistration = Boolean(justRegistered || (!loggedUser.isAdmin && (!loggedUser.package || loggedUser.package === 'None')));

      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (err) {}
      setSuccessMessage(
        lang === 'ur'
          ? 'خوش آمدید! آپ کا لاگ ان کامیاب رہا۔'
          : `Welcome, ${loggedUser.name}! Login successful.`
      );
      setTimeout(() => onLoginSuccess(loggedUser, isNewRegistration), 300);

    } catch (err) {
      console.warn("Login Failure:", err);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
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

    if (!regName.trim()) {
      setErrorMessage(lang === 'ur' ? 'برائے مہربانی اپنا مکمل نام درج کریں۔' : 'Please enter your Full Name.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage(lang === 'ur' ? 'برائے مہربانی اپنا ای میل درج کریں۔' : 'Please enter your Email Address.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage(lang === 'ur' ? 'پاسورڈ کم از کم 4 حروف کا ہونا چاہیے۔' : 'Password must be at least 4 characters long.');
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
      const emailKey = regEmail.trim().toLowerCase();
      const newUser = {
        name: regName.trim(),
        email: emailKey,
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
        await setDoc(doc(db, "users", emailKey), {
          ...newUser,
          password: regPassword
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn("Firestore registration note:", firestoreErr.message);
      }

      // 2. Try Firebase Auth Account Creation
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailKey, regPassword);
        await updateProfile(userCredential.user, { displayName: regName.trim() });
      } catch (fbErr) {
        console.warn("Firebase Auth create notice:", fbErr.message);
      }

      // 3. Save to Local Registered Users Backup
      const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
      const filtered = localUsers.filter(u => u.email?.toLowerCase() !== emailKey);
      filtered.push({
        ...newUser,
        password: regPassword
      });
      localStorage.setItem('ptm_registered_users', JSON.stringify(filtered));

      // 4. Mark that this user just registered so login automatically sends them to pricing
      try {
        sessionStorage.setItem('ptm_just_registered', emailKey);
      } catch (e) {}

      // 5. PREPARE LOGIN VIEW FOR THE USER (As requested: redirect to login tab)
      setLoginEmail(emailKey);
      setLoginPassword('');
      setActiveTab('login');

      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (err) {}

      setSuccessMessage(
        lang === 'ur'
          ? 'اکاؤنٹ کامیابی سے بن گیا! اب پاسورڈ درج کر کے لاگ ان کریں اور اپنا پیکیج منتخب کریں۔'
          : 'Account created successfully! Please sign in to choose your subscription package.'
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
      
      {/* 1. CINEMATIC LIBRARY WITH BOOKS BACKGROUND */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${libraryBg})` }}
      />

      {/* 2. OPTICAL BLUR & DARK ATMOSPHERIC VIGNETTE OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-indigo-950/90 backdrop-blur-[7px]" />

      {/* 3. CENTRAL EXECUTIVE AUTH CONTAINER - FOCUSED & CLEAN */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden animate-fadeIn my-auto p-6 sm:p-8 flex flex-col justify-between">
        
        <div>
          {/* BRAND HEADER INSIDE CARD */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <BookOpen className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                PRO TEST MAKER
              </h2>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                {lang === 'ur' ? 'امتحانی پورٹل و سمارٹ جنریٹر' : 'Exam & Assessment Portal'}
              </span>
            </div>
          </div>
            
            {/* TOP BAR: LANGUAGE SWITCHER & TABS */}
            <div className="flex items-center justify-between gap-3 mb-5">
              
              {/* Tab Switcher: Sign In | Register */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 flex-1 max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'لاگ ان' : 'Sign In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{lang === 'ur' ? 'رجسٹر' : 'Register'}</span>
                </button>
              </div>

              {/* Language Switcher Toggle */}
              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300 shrink-0 cursor-pointer shadow-2xs"
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
            {/* VIEW 1: SIGN IN FORM (HANDLES ADMIN & REGISTERED USERS)      */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                
                {/* Email / Username Field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'ای میل ایڈریس یا یوزر نیم *' : 'Email Address or Username *'}
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={lang === 'ur' ? 'ای میل درج کریں' : 'Enter email or username'}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">
                      {lang === 'ur' ? 'پاسورڈ *' : 'Password *'}
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'ur' ? 'محفوظ لاگ ان' : 'Secure Session'}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Email & Security Notice */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
                    />
                    <span>{lang === 'ur' ? 'ای میل یاد رکھیں' : 'Remember email'}</span>
                  </label>
                  
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'ur' ? 'محفوظ سیشن' : 'Encrypted Login'}</span>
                  </span>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50 mt-1"
                >
                  <span>
                    {isLoading 
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
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'ur' ? 'یہاں رجسٹر کریں' : 'Register now'}
                    </button>
                  </p>
                </div>

              </form>
            )}

            {/* ------------------------------------------------------------- */}
            {/* VIEW 2: TEACHER REGISTRATION FORM                            */}
            {/* ------------------------------------------------------------- */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3 animate-fadeIn">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'مکمل نام *' : 'Full Name *'}
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={lang === 'ur' ? 'مثلاً: پروفیسر محمد اسلم' : 'e.g. Prof. Muhammad Aslam'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Institute Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ur' ? 'ادارے یا اسکول کا نام' : 'School / College / Academy Name'}
                  </label>
                  <div className="relative flex items-center">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={regInstitute}
                      onChange={(e) => setRegInstitute(e.target.value)}
                      placeholder={lang === 'ur' ? 'مثلاً: پنجاب کالج' : 'e.g. Punjab College / High School'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email & Role Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      {lang === 'ur' ? 'ای میل ایڈریس *' : 'Email Address *'}
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="teacher@school.com"
                        className="w-full pl-9 pr-2 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      {lang === 'ur' ? 'عہدہ' : 'Designation / Role'}
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Senior Subject Teacher">{lang === 'ur' ? 'سبجیکٹ ٹیچر' : 'Subject Teacher'}</option>
                      <option value="Head of Department">{lang === 'ur' ? 'ہیڈ آف ڈیپارٹمنٹ' : 'Head of Department'}</option>
                      <option value="School Principal">{lang === 'ur' ? 'پرنسپل' : 'Principal'}</option>
                      <option value="Academy Director">{lang === 'ur' ? 'اکیڈمی ڈائریکٹر' : 'Academy Director'}</option>
                    </select>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      {lang === 'ur' ? 'پاسورڈ (کم از کم 4) *' : 'Password (min 4) *'}
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      {lang === 'ur' ? 'تصدیق پاسورڈ *' : 'Confirm Password *'}
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Database notice */}
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-medium">
                  <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'ur'
                      ? 'اکاؤنٹ کلاؤڈ ڈیٹا بیس میں محفوظ کیا جائے گا۔ رجسٹریشن کے بعد لاگ ان پیج کھلے گا۔'
                      : 'Account will be saved to cloud database. You will then be redirected to Sign In.'}
                  </span>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50 mt-1"
                >
                  <span>
                    {isLoading 
                      ? (lang === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Creating Account...') 
                      : (lang === 'ur' ? 'رجسٹر کریں اور لاگ ان پر جائیں' : 'Register & Proceed to Sign In')}
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
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'ur' ? 'لاگ ان کریں' : 'Sign in here'}
                    </button>
                  </p>
                </div>

              </form>
            )}

          </div>

          {/* FOOTER GUARANTEE BADGE */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ur' ? 'ایس این سی نصاب سے ہم آہنگ' : 'SNC Curriculum Aligned'}</span>
            </span>
            <span>PRO TEST MAKER © 2026</span>
          </div>

      </div>

    </div>
  );
}
