import React, { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import PTMSidebar from './components/PTMSidebar';
import PTMHeader from './components/PTMHeader';
import AuthPortal from './components/AuthPortal';
import CourseSelectionView from './components/CourseSelectionView';
import ClassSelectionView from './components/ClassSelectionView';
import SubjectSelectionView from './components/SubjectSelectionView';
import PTMTopicSelectionView from './components/PTMTopicSelectionView';
import PTMDashboardView from './components/PTMDashboardView';
import PaperCanvas from './components/PaperCanvas';
import ConfirmationModal from './components/ConfirmationModal';
import ContactTeamModal from './components/ContactTeamModal';
import { confirmAction } from './utils/confirmDialog';

// Directly imported primary user views (guarantees instant navigation without loading delays or stale chunk 404s)
import PTMSecondaryViews from './components/PTMSecondaryViews';
import PricingPlansView from './components/PricingPlansView';
import ContactTeamView from './components/ContactTeamView';
import DateSheetPlannerView from './components/DateSheetPlannerView';
import AppLoadingScreen from './components/AppLoadingScreen';
import PublicPaperSolutionView from './components/PublicPaperSolutionView';

// Auto-retrying lazy loader for heavy administrative modules and modals
function lazyWithRetry(componentImport) {
  return React.lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn("Chunk load error (deployment update), auto-reloading to fetch newest version:", error);
      const isRetried = sessionStorage.getItem('ptm_chunk_retry');
      if (!isRetried) {
        sessionStorage.setItem('ptm_chunk_retry', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem('ptm_chunk_retry');
      throw error;
    }
  });
}

const UploadMaterialSection = lazyWithRetry(() => import('./components/UploadMaterialSection'));
const MaterialOverviewSection = lazyWithRetry(() => import('./components/MaterialOverviewSection'));
const ManualQuestionPickerModal = lazyWithRetry(() => import('./components/ManualQuestionPickerModal'));
const AdminPinModal = lazyWithRetry(() => import('./components/AdminPinModal'));
const AdminPortalSection = lazyWithRetry(() => import('./components/AdminPortalSection'));
const AdminQuestionBankManagerView = lazyWithRetry(() => import('./components/AdminQuestionBankManagerView'));
const AIAssistantBotModal = lazyWithRetry(() => import('./components/AIAssistantBotModal'));
const BoardPairingSchemeModal = lazyWithRetry(() => import('./components/BoardPairingSchemeModal'));
import { DEFAULT_PAPER_CONFIG } from './utils/sampleData';
import { isUserSubscribed, isSuperAdmin } from './utils/pricingPlansService';
import { 
  getQuestionBank, 
  generatePaperFromTopics,
  mergeChapter1NewTopics
} from './utils/questionBankService';
import { computeSyllabusText } from './utils/syllabusHelper';
import { recordPaperCreated, recordPaperDeleted } from './utils/userActivityTracker';
import { 
  fetchBankFromFirebase, 
  syncBankToFirebase, 
  subscribeToCloudBank, 
  testFirebaseConnection
} from './utils/firebaseBankService';
import { ArrowLeft, CheckCircle2, AlertTriangle, X, Cloud, Bot } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { notify } from './utils/notify';

import { db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Log security banner to console
if (typeof window !== 'undefined') {
  console.log(
    '%c🛡️ PRO TEST MAKER SECURITY SHIELD ACTIVE\nClient-side tampering, memory injection, or unauthorized API access is prohibited and continuously audited.',
    'color: #059669; font-weight: bold; font-size: 13px; background: #ecfdf5; padding: 6px 10px; border-radius: 6px;'
  );
}

export default function App() {
  // Current Logged-in User State (Requires Login/Register gate before opening app)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // 1. Sanitize local registered users cache so unapproved accounts never retain old defaults
      try {
        const localReg = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
        let regChanged = false;
        const sanitizedReg = localReg.map(u => {
          if (!isSuperAdmin(u)) {
            if (u.subscriptionStatus !== 'active') {
              regChanged = true;
              return { ...u, isAdmin: false, package: 'None', subscriptionStatus: 'unpaid', maxPapers: 0, expiryDate: null };
            }
          }
          return u;
        });
        if (regChanged) {
          localStorage.setItem('ptm_registered_users', JSON.stringify(sanitizedReg));
        }
      } catch (e) {}

      // 2. CRITICAL SECURITY: Purge any lingering admin account from persistent localStorage.
      // Admin sessions must NEVER persist across new browser tabs, shared links, or public machines.
      try {
        const localStored = localStorage.getItem('ptm_active_user');
        if (localStored) {
          const parsedLocal = JSON.parse(localStored);
          if (isSuperAdmin(parsedLocal) || !parsedLocal.email) {
            localStorage.removeItem('ptm_active_user');
          }
        }
      } catch (e) {}

      // 3. MANDATORY AUTHENTICATION GATE:
      // Every fresh visit, new tab, new window, or shared link MUST strictly require login.
      // We read active session ONLY from sessionStorage (the current tab's active session).
      const stored = sessionStorage.getItem('ptm_active_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (!isSuperAdmin(u)) {
          // Never allow non-admin account to claim isAdmin: true
          u.isAdmin = false;
          if (u.subscriptionStatus !== 'active') {
            u.package = 'None';
            u.subscriptionStatus = 'unpaid';
            u.maxPapers = 0;
            u.expiryDate = null;
          }
          try {
            sessionStorage.setItem('ptm_active_user', JSON.stringify(u));
          } catch (e) {}
        } else {
          u.isAdmin = true;
        }
        return u;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Calculate whether active user has an active, paid subscription
  const userSubscribed = useMemo(() => isUserSubscribed(currentUser), [currentUser]);

  const handleLogout = () => {
    confirmAction({
      title: "Logout Confirmation",
      message: "Are you sure you want to log out of your session?",
      confirmText: "Log Out",
      cancelText: "Stay Logged In",
      type: "danger",
      onConfirm: () => {
        try {
          localStorage.removeItem('ptm_active_user');
          sessionStorage.removeItem('ptm_active_user');
          localStorage.removeItem('ptm_active_paper_data');
          localStorage.removeItem('ptm_active_paper_step');
        } catch (e) {}
        try { toast.dismiss(); } catch (e) {}
        setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
        setSelectedTopicIds([]);
        setPaperStep('course');
        setActiveNav('pricing');
        setSavedPapers([]);
        setCurrentUser(null);
        notify.info("Logged out successfully. Please sign in again.");
      }
    });
  };

  // Inactivity Auto-Logout (Exempt for Admin - Unlimited Session)
  useEffect(() => {
    // Admin has permanent unlimited active session
    if (!currentUser || currentUser?.isAdmin) return;

    let timeoutId;
    const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes for Teachers

    const performAutoLogout = () => {
      try {
        localStorage.removeItem('ptm_active_user');
        sessionStorage.removeItem('ptm_active_user');
        localStorage.removeItem('ptm_active_paper_data');
        localStorage.removeItem('ptm_active_paper_step');
      } catch (e) {}
      try { toast.dismiss(); } catch (e) {}
      setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
      setSelectedTopicIds([]);
      setPaperStep('course');
      setActiveNav('pricing');
      setSavedPapers([]);
      setCurrentUser(null);
      // Silent logout: no session expiration toast notification shown to the user
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(performAutoLogout, INACTIVITY_LIMIT);
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(evt => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(evt => {
        window.removeEventListener(evt, resetTimer);
      });
    };
  }, [currentUser]);

  // Question Bank State
  const [bank, setBank] = useState(() => getQuestionBank());

  // Layout & Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ptm_active_user');
      const u = stored ? JSON.parse(stored) : null;
      if (!u || !isUserSubscribed(u)) {
        return 'pricing';
      }
    } catch (e) {}
    return 'dashboard';
  });

  // Universal Interface Language State ('en' | 'ur')
  const [appLanguage, setAppLanguage] = useState(() => {
    try {
      return localStorage.getItem('ptm_app_language') || 'ur';
    } catch (e) {
      return 'ur';
    }
  });

  // State to manage cinematic initial boot experience
  const [isAppBooting, setIsAppBooting] = useState(true);

  // Detect if user scanned a QR code or opened a shared solution link (?paper_solution=...)
  const [scannedPaperId, setScannedPaperId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('paper_solution') || null;
    }
    return null;
  });

  const handleToggleLanguage = () => {
    setAppLanguage(prev => {
      const next = prev === 'ur' ? 'en' : 'ur';
      try {
        localStorage.setItem('ptm_app_language', next);
      } catch (e) {}
      notify.info(next === 'ur' ? "اردو زبان فعال کر دی گئی ہے (Urdu Active)" : "English mode activated.");
      return next;
    });
  };

  // Strict Paywall Lock: Non-subscribed users are strictly restricted to 'pricing'
  useEffect(() => {
    if (currentUser && !userSubscribed) {
      if (activeNav !== 'pricing') {
        setActiveNav('pricing');
      }
    }
  }, [currentUser, userSubscribed, activeNav]);

  // Continuous real-time sync of currentUser with Firestore:
  // Instantly applies Admin approvals, quota changes, suspensions, and prevents DevTools spoofing
  useEffect(() => {
    if (!currentUser?.email || isSuperAdmin(currentUser)) return;

    const cleanEmail = currentUser.email.toLowerCase().trim();
    const userRef = doc(db, "users", cleanEmail);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        notify.error("اکاؤنٹ معطل (Account Not Found)", {
          description: "آپ کا اکاؤنٹ فائر بیس کلاؤڈ ریکارڈ میں نہیں ملا۔ برائے مہربانی دوبارہ لاگ ان کریں۔"
        });
        setCurrentUser(null);
        try {
          localStorage.removeItem('ptm_active_user');
          sessionStorage.removeItem('ptm_active_user');
        } catch (e) {}
        return;
      }

      const liveData = snap.data();
      const isLiveSubscribed = Boolean(
        liveData.subscriptionStatus === 'active' && 
        liveData.package && 
        liveData.package !== 'None' && 
        liveData.package !== 'unpaid'
      );

      // Instant lock if user is suspended
      if (liveData.status === 'blocked') {
        notify.error("اکاؤنٹ بلاک ہے (Account Suspended)", {
          description: "آپ کا اکاؤنٹ ایڈمنسٹریٹر کی طرف سے معطل کیا گیا ہے۔"
        });
        setActiveNav('pricing');
      }

      // Instant lock if expiry date has passed
      if (liveData.expiryDate) {
        const exp = new Date(liveData.expiryDate);
        exp.setHours(23, 59, 59, 999);
        if (isNaN(exp.getTime()) || exp < new Date()) {
          setActiveNav('pricing');
        }
      }

      const updatedUser = {
        ...currentUser,
        ...liveData,
        isAdmin: false, // Security: non-super-admin accounts can NEVER retain isAdmin: true
        package: liveData.package || (isLiveSubscribed ? liveData.package : 'None'),
        subscriptionStatus: liveData.subscriptionStatus || (isLiveSubscribed ? 'active' : 'unpaid'),
        maxPapers: liveData.maxPapers !== undefined ? liveData.maxPapers : (isLiveSubscribed ? -1 : 0),
        expiryDate: liveData.expiryDate || null,
        status: liveData.status || 'active'
      };

      setCurrentUser(updatedUser);
      try {
        sessionStorage.setItem('ptm_active_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }, (err) => {
      console.warn("Firestore live user sync note:", err.message);
    });

    return () => unsubscribe();
  }, [currentUser?.email]);



  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  // Admin PIN Security State
  const [showPinModal, setShowPinModal] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Generate Paper Step State: Always starts cleanly from Step 1 ('course')
  // Deep steps are never stored in localStorage so teacher is never trapped in old topics
  const [paperStep, setPaperStep] = useState('course');
  const [selectedCourse, setSelectedCourse] = useState(() => {
    try {
      return localStorage.getItem('ptm_active_course') || 'PECTAA';
    } catch (e) {
      return 'PECTAA';
    }
  });
  const [selectedClass, setSelectedClass] = useState(() => {
    try {
      return localStorage.getItem('ptm_active_class') || '9th';
    } catch (e) {
      return '9th';
    }
  });

  // Saved Papers Repository State (Stored in LocalStorage)
  const [savedPapers, setSavedPapers] = useState(() => {
    try {
      const raw = localStorage.getItem('ptm_saved_papers');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Firebase Live Test & Contact & AI Bot Modals State
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAiBotModal, setShowAiBotModal] = useState(false);
  const [showPairingSchemeModal, setShowPairingSchemeModal] = useState(false);

  // Sync Question Bank with Firebase Cloud Firestore (real-time single subscription)
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeToCloudBank((cloudBank) => {
      if (!isMounted || !cloudBank) return;
      const { bank: merged } = mergeChapter1NewTopics(cloudBank);
      setBank(merged);
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Active Subject & Chapters for the Selected Class
  const currentClassData = bank[selectedClass] || { subjects: [] };
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    return bank['9th']?.subjects[0]?.id || '';
  });

  const currentSubject = useMemo(() => {
    if (!currentClassData?.subjects) return null;
    return currentClassData.subjects.find(s => s.id === selectedSubjectId) || currentClassData.subjects[0] || null;
  }, [currentClassData, selectedSubjectId]);

  const currentChapters = useMemo(() => {
    // Strictly return only the chapters of the currently selected subject.
    // Never fall back to other subjects or Computer Science!
    return currentSubject?.chapters || [];
  }, [currentSubject]);

  const [selectedTopicIds, setSelectedTopicIds] = useState([]);

  // Reset selected topics whenever subject or class changes (unselected by default)
  useEffect(() => {
    setSelectedTopicIds([]);
  }, [selectedSubjectId, selectedClass]);

  // If selected class changes, pick first available subject
  useEffect(() => {
    const firstSub = bank[selectedClass]?.subjects[0];
    if (firstSub && (!selectedSubjectId || !bank[selectedClass]?.subjects.some(s => s.id === selectedSubjectId))) {
      setSelectedSubjectId(firstSub.id);
    }
  }, [selectedClass, bank]);

  // Paper Configuration & Generated Paper Data (Persisted so questions and settings are never lost!)
  const [paperConfig, setPaperConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('ptm_default_paper_settings');
      const activeClass = localStorage.getItem('ptm_active_class') || '9th';
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...DEFAULT_PAPER_CONFIG, 
          ...parsed,
          gradeClass: `${activeClass} Class`
        };
      }
      return {
        ...DEFAULT_PAPER_CONFIG,
        gradeClass: `${activeClass} Class`
      };
    } catch (e) {}
    return { ...DEFAULT_PAPER_CONFIG, gradeClass: '9th Class' };
  });

  // Synchronize paperConfig.gradeClass whenever selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      const normalizedClass = `${selectedClass} Class`;
      setPaperConfig(prev => {
        if (prev.gradeClass !== normalizedClass) {
          return { ...prev, gradeClass: normalizedClass };
        }
        return prev;
      });
    }
  }, [selectedClass]);

  // Ensure viewport immediately scrolls to top whenever activeNav or paperStep changes
  // so mobile users never land in empty whitespace below the fold
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeNav, paperStep]);
  const [paperData, setPaperData] = useState(() => {
    try {
      const raw = localStorage.getItem('ptm_active_paper_data');
      return raw ? JSON.parse(raw) : { mcqs: [], shortQuestions: [], longQuestions: [] };
    } catch (e) {
      return { mcqs: [], shortQuestions: [], longQuestions: [] };
    }
  });

  // Calculate whether an active draft paper exists with generated questions
  const hasActiveDraft = useMemo(() => {
    return Boolean(
      paperData && 
      ((paperData.mcqs && paperData.mcqs.length > 0) || 
       (paperData.shortQuestions && paperData.shortQuestions.length > 0) || 
       (paperData.longQuestions && paperData.longQuestions.length > 0))
    );
  }, [paperData]);

  // Auto-sync active draft to localStorage ONLY when questions exist (never persist intermediate wizard steps)
  useEffect(() => {
    if (!currentUser) return;
    try {
      if (hasActiveDraft) {
        localStorage.setItem('ptm_active_paper_data', JSON.stringify(paperData));
        localStorage.setItem('ptm_active_course', selectedCourse);
        localStorage.setItem('ptm_active_class', selectedClass);
      } else {
        localStorage.removeItem('ptm_active_paper_data');
      }
      // Never save intermediate wizard steps ('topics', 'class', etc.) to avoid trapped state
      localStorage.removeItem('ptm_active_paper_step');
    } catch (e) {}
  }, [hasActiveDraft, paperData, selectedCourse, selectedClass, currentUser]);

  // Navigation Guard & Browser History State Synchronizer
  const navigateTo = (navId, step = null, replace = false) => {
    // 1. Super Admin Route Protection
    const adminRoutes = ['upload_material', 'admin_portal', 'question_bank_editor'];
    if (adminRoutes.includes(navId) && !isSuperAdmin(currentUser)) {
      notify.error("غیر مجاز رسائی (Unauthorized Access)", {
        description: "یہ فیچر صرف سپر ایڈمنسٹریٹر کے لیے مخصوص ہے۔"
      });
      return;
    }

    // 2. Paywall Protection
    if (currentUser && !userSubscribed && navId !== 'pricing') {
      notify.warning("پہلے پیکیج حاصل کریں (Subscription Required)", {
        description: "ڈیش بورڈ اور پیپرز بنانے کے لیے برائے مہربانی پہلے پیکیج منتخب کر کے فیس جمع کروائیں۔"
      });
      setActiveNav('pricing');
      return;
    }

    const nextNav = navId;
    // When opening generate_paper from navigation (unless specified), start fresh from step 1 'course'
    const nextStep = step !== null ? step : (navId === 'generate_paper' ? 'course' : null);

    setActiveNav(nextNav);
    if (nextStep !== null) {
      setPaperStep(nextStep);
    }

    // Push browser history state so Back button navigates within app instead of closing browser/tab
    try {
      const stateObj = { nav: nextNav, step: nextStep, timestamp: Date.now() };
      if (replace) {
        window.history.replaceState(stateObj, '');
      } else {
        window.history.pushState(stateObj, '');
      }
    } catch (e) {}
  };

  const handleSafeNavigate = (navId, step = null) => {
    navigateTo(navId, step);
  };

  // Universal Back Button Handler for UI Navigation Arrow
  const handleUniversalBack = () => {
    if (activeNav === 'generate_paper') {
      if (paperStep === 'canvas') {
        // Preserves the generated draft in memory & localStorage
        notify.info(appLanguage === 'ur' 
          ? "آپ کا تیار کردہ پیپر ڈرافٹ میں محفوظ ہے (Draft Preserved)" 
          : "Paper saved to active draft in memory."
        );
        navigateTo('dashboard');
      } else if (paperStep === 'topics') {
        navigateTo('generate_paper', 'subject');
      } else if (paperStep === 'subject') {
        navigateTo('generate_paper', 'class');
      } else if (paperStep === 'class') {
        navigateTo('generate_paper', 'course');
      } else {
        navigateTo('dashboard');
      }
    } else {
      navigateTo('dashboard');
    }
  };

  // State refs for Popstate Listener
  const activeNavRef = useRef(activeNav);
  activeNavRef.current = activeNav;
  const paperStepRef = useRef(paperStep);
  paperStepRef.current = paperStep;
  const hasActiveDraftRef = useRef(hasActiveDraft);
  hasActiveDraftRef.current = hasActiveDraft;

  // Browser History & Popstate Event Listener:
  // Fixes: "window sy back jaty tu website band ho jati hy"
  useEffect(() => {
    try {
      if (!window.history.state) {
        window.history.replaceState({ nav: activeNavRef.current, step: paperStepRef.current, root: true }, '');
      }
    } catch (e) {}

    let lastBackPressTime = 0;

    const handlePopState = (event) => {
      const currentNav = activeNavRef.current;
      const currentStep = paperStepRef.current;

      // If browser history has our state, navigate according to it
      if (event.state && event.state.nav) {
        if (currentNav === 'generate_paper' && currentStep === 'canvas' && event.state.step !== 'canvas') {
          notify.info(appLanguage === 'ur' 
            ? "آپ کا تیار کردہ پیپر ڈرافٹ میں محفوظ ہے (Draft Preserved)" 
            : "Your generated paper is safely preserved in drafts."
          );
        }
        setActiveNav(event.state.nav);
        if (event.state.step) {
          setPaperStep(event.state.step);
        }
        return;
      }

      // Fallback if popped past initial entry:
      // PREVENT BROWSER FROM EXITING/CLOSING THE TAB!
      try {
        window.history.pushState({ nav: 'dashboard', step: null, root: true }, '');
      } catch (e) {}

      if (currentNav === 'generate_paper') {
        if (currentStep === 'canvas') {
          notify.info(appLanguage === 'ur' 
            ? "آپ کا تیار کردہ پیپر ڈرافٹ میں محفوظ ہے (Draft Preserved)" 
            : "Your generated paper is safely preserved in drafts."
          );
          setActiveNav('dashboard');
        } else if (currentStep === 'topics') {
          setPaperStep('subject');
        } else if (currentStep === 'subject') {
          setPaperStep('class');
        } else if (currentStep === 'class') {
          setPaperStep('course');
        } else {
          setActiveNav('dashboard');
        }
      } else if (currentNav !== 'dashboard') {
        setActiveNav('dashboard');
      } else {
        const now = Date.now();
        if (now - lastBackPressTime < 2500) {
          window.history.back();
        } else {
          lastBackPressTime = now;
          notify.info(appLanguage === 'ur'
            ? "آپ ڈیش بورڈ پر ہیں۔ دوبارہ بیک دبائیں اگر باہر جانا چاہتے ہیں۔"
            : "Press Back again if you want to exit the application."
          );
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [appLanguage]);

  // Dynamic View & Step Title Resolver for Breadcrumbs and Top Navigation Bar
  const getViewTitle = (nav, step, lang) => {
    const isUrdu = lang === 'ur';
    if (nav === 'generate_paper') {
      if (step === 'course') return isUrdu ? 'مرحلہ 1: نصاب کا انتخاب' : 'Step 1: Select Course';
      if (step === 'class') return isUrdu ? 'مرحلہ 2: جماعت کا انتخاب' : 'Step 2: Select Class';
      if (step === 'subject') return isUrdu ? 'مرحلہ 3: مضمون کا انتخاب' : 'Step 3: Select Subject';
      if (step === 'topics') return isUrdu ? 'مرحلہ 4: اسباق و ٹاپکس کا انتخاب' : 'Step 4: Select Topics';
      if (step === 'canvas') return isUrdu ? 'مرحلہ 5: امتحانی پرچہ و پرنٹنگ' : 'Step 5: Paper Canvas';
      return isUrdu ? 'پیپر جنریٹر' : 'Paper Generator';
    }
    const titles = {
      dashboard: isUrdu ? 'ڈیش بورڈ' : 'Dashboard',
      saved_papers: isUrdu ? 'محفوظ شدہ امتحانی پیپرز' : 'Saved Papers Archive',
      past_papers: isUrdu ? 'ماضی کے بورڈ پیپرز' : 'Past Board Papers',
      model_papers: isUrdu ? 'ماڈل پیپرز' : 'Official Model Papers',
      teachers: isUrdu ? 'اساتذہ ڈائریکٹری' : 'Faculty & Teachers',
      papers_history: isUrdu ? 'پیپرز ہسٹری' : 'Papers History',
      login_history: isUrdu ? 'لاگ ان سیشن لاگز' : 'Login Audit',
      user_management: isUrdu ? 'یوزر مینجمنٹ' : 'User Management',
      default_paper_settings: isUrdu ? 'پیپر ڈیفالٹ سیٹنگز' : 'Paper Default Settings',
      pricing: isUrdu ? 'پیکیجز و سبسکرپشن' : 'Subscription & Pricing',
      contact: isUrdu ? 'رابطہ و سپورٹ' : 'Contact Support',
      date_sheet_planner: isUrdu ? 'ڈیٹ شیٹ پلانر' : 'Date Sheet Planner',
      upload_material: isUrdu ? 'سوالات اپلوڈ مٹیریل' : 'Upload Material',
      directory: isUrdu ? 'مٹیریل ڈائریکٹری' : 'Material Directory',
      admin_portal: isUrdu ? 'ایڈمن پورٹل' : 'Admin Portal',
      question_bank_editor: isUrdu ? 'سوالات بینک ایڈیٹر' : 'Question Bank Editor'
    };
    return titles[nav] || (isUrdu ? 'صفحہ' : 'Page');
  };

  // Handle Login Success: Guarantees a fresh empty paper for every login
  const handleLoginSuccess = (user, isNewRegistration = false) => {
    // Dismiss any old stale/queued toasts (e.g. past session expiry or logout notices)
    try {
      toast.dismiss();
    } catch (e) {}

    // 1. Fresh empty paper state for every login (new user never sees old paper)
    setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
    setSelectedTopicIds([]);
    setPaperStep('course');
    
    // If user is newly registered OR not subscribed, route straight to pricing!
    if (isNewRegistration || !isUserSubscribed(user)) {
      setActiveNav('pricing');
    } else {
      setActiveNav('dashboard');
    }

    try {
      localStorage.removeItem('ptm_active_paper_data');
      localStorage.removeItem('ptm_active_paper_step');
    } catch (e) {}

    // 2. Load user's own saved papers if any exist, or start fresh with empty array
    if (user?.email) {
      const userKey = `ptm_saved_papers_${user.email.toLowerCase()}`;
      try {
        const raw = localStorage.getItem(userKey);
        setSavedPapers(raw ? JSON.parse(raw) : []);
      } catch (e) {
        setSavedPapers([]);
      }
    } else {
      setSavedPapers([]);
    }

    setCurrentUser(user);
  };

  // Handle User Profile Updates (Name, Institute, Role)
  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      sessionStorage.setItem('ptm_active_user', JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const [showManualPicker, setShowManualPicker] = useState(false);
  const [manualPickerTab, setManualPickerTab] = useState('all');

  // Available questions for live question swapping
  const availableBankQuestions = useMemo(() => {
    const allMcqs = [];
    const allShorts = [];
    const allLongs = [];

    (currentChapters || []).forEach(ch => {
      (ch.topics || []).forEach(t => {
        if (t.mcqs) allMcqs.push(...t.mcqs);
        if (t.shortQuestions) allShorts.push(...t.shortQuestions);
        if (t.longQuestions) allLongs.push(...t.longQuestions);
      });
    });

    return { mcqs: allMcqs, shortQuestions: allShorts, longQuestions: allLongs };
  }, [currentChapters]);

  // Marks Calculation
  const totalPaperMarks = useMemo(() => {
    const mcqTotal = (paperData.mcqs || []).reduce((acc, q) => acc + (q.marks || 1), 0);
    const shortTotal = (paperData.shortQuestions || []).reduce((acc, q) => acc + (q.marks || 2), 0);
    const longTotal = (paperData.longQuestions || []).reduce((acc, q) => acc + (q.marks || 5), 0);
    return mcqTotal + shortTotal + longTotal;
  }, [paperData]);

  // Handle Generate Paper from CTM Topic Selection
  const handleGeneratePaperFromCTM = (params) => {
    setSelectedTopicIds(params.selectedTopicIds);

    const calculatedSyllabus = computeSyllabusText(currentChapters, params.selectedTopicIds, {
      questionType: params.questionType,
      mcqCount: params.mcqCount,
      shortCount: params.shortCount,
      longCount: params.longCount
    });

    // Resolve accurate subject name: if currentChapters are Computer Science chapters, set Computer Science
    let resolvedSubjectName = currentSubject?.name || 'Computer Science';
    const isCsChapter = (currentChapters || []).some(ch => 
      ch.name?.toLowerCase().includes('network') || 
      ch.name?.toLowerCase().includes('computational') ||
      ch.name?.toLowerCase().includes('algorithm')
    );
    if (isCsChapter) {
      resolvedSubjectName = 'Computer Science';
    }

    // Update paper config header details
    setPaperConfig(prev => ({
      ...prev,
      subject: resolvedSubjectName,
      gradeClass: `${selectedClass} Class`,
      language: params.language,
      showAnswerLines: params.showAnswerLines,
      showChapterName: params.showChapterName,
      totalMarks: params.totalMarks || prev.totalMarks || 50,
      syllabus: calculatedSyllabus || prev.syllabus || 'Chapter 2 (Topic: 2.1 to 2.12)'
    }));

    const generated = generatePaperFromTopics(selectedClass, currentSubject?.id, {
      selectedTopicIds: params.selectedTopicIds,
      chapters: currentChapters,
      pooledMcqCount: params.mcqCount,
      pooledMcqMarks: params.mcqMarks,
      pooledShortCount: params.shortCount,
      pooledShortMarks: params.shortMarks,
      pooledLongCount: params.longCount,
      pooledLongMarks: params.longMarks,
      isRandom: true,
      dataSelectionCategories: params.dataSelectionCategories
    });

    setPaperData(prev => {
      let nextMcqs = [];
      let nextShorts = [];
      let nextLongs = [];

      if (params.questionType === 'MCQ') {
        nextMcqs = (generated.mcqs && generated.mcqs.length > 0) ? generated.mcqs : [];
      } else if (params.questionType === 'SHORT') {
        nextShorts = (generated.shortQuestions && generated.shortQuestions.length > 0) ? generated.shortQuestions : [];
      } else if (params.questionType === 'LONG') {
        nextLongs = (generated.longQuestions && generated.longQuestions.length > 0) ? generated.longQuestions : [];
      } else if (params.questionType === 'MCQ_SHORT') {
        nextMcqs = (generated.mcqs && generated.mcqs.length > 0) ? generated.mcqs : [];
        nextShorts = (generated.shortQuestions && generated.shortQuestions.length > 0) ? generated.shortQuestions : [];
      } else if (params.questionType === 'SUBJECTIVE') {
        nextShorts = (generated.shortQuestions && generated.shortQuestions.length > 0) ? generated.shortQuestions : [];
        nextLongs = (generated.longQuestions && generated.longQuestions.length > 0) ? generated.longQuestions : [];
      } else {
        // ALL / Combined (MCQs + Shorts + Longs)
        nextMcqs = (generated.mcqs && generated.mcqs.length > 0) ? generated.mcqs : [];
        nextShorts = (generated.shortQuestions && generated.shortQuestions.length > 0) ? generated.shortQuestions : [];
        nextLongs = (generated.longQuestions && generated.longQuestions.length > 0) ? generated.longQuestions : [];
      }

      return {
        ...prev,
        ...generated,
        mcqs: nextMcqs,
        shortQuestions: nextShorts,
        longQuestions: nextLongs
      };
    });

    setPaperStep('canvas');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Direct 1-Click Test Paper Generation from Date-Sheet Planner
  const handleGenerateSpecificPaperFromDateSheet = ({ classKey, subjectId, topicIds = [], syllabus, testNumber, examTitle }) => {
    setSelectedClass(classKey);
    setSelectedSubjectId(subjectId);
    setSelectedTopicIds(topicIds);

    const targetClassData = bank[classKey] || {};
    const targetSubject = (targetClassData.subjects || []).find(s => s.id === subjectId) || targetClassData.subjects?.[0] || {};
    const targetChapters = targetSubject.chapters || [];

    setPaperConfig(prev => ({
      ...prev,
      subject: targetSubject.name || prev.subject,
      gradeClass: `${classKey} Class`,
      examTitle: examTitle || `Class Test #${testNumber || 1}`,
      syllabus: syllabus || prev.syllabus || 'Special Test Session'
    }));

    // Auto generate 10 MCQs, 5 Shorts, 2 Longs
    const generated = generatePaperFromTopics(classKey, subjectId, {
      selectedTopicIds: topicIds,
      chapters: targetChapters,
      pooledMcqCount: 10,
      pooledMcqMarks: 1,
      pooledShortCount: 5,
      pooledShortMarks: 2,
      pooledLongCount: 2,
      pooledLongMarks: 5,
      isRandom: true
    });

    setPaperData({
      mcqs: generated.mcqs || [],
      shortQuestions: generated.shortQuestions || [],
      longQuestions: generated.longQuestions || []
    });

    setActiveNav('generate_paper');
    setPaperStep('canvas');

    notify.success(`ٹیسٹ #${testNumber} کا پیپر کامیابی سے تیار کر لیا گیا ہے۔ (Test Paper Generated)`);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Instant 1-Click Test Generator from Dashboard Presets
  const handleGeneratePaperFromPreset = ({
    preset,
    classKey,
    subjectId,
    chapterIds = [],
    language = 'bilingual',
    customTitle,
    syllabus,
    mcqCount: overrideMcqCount,
    mcqMarks: overrideMcqMarks,
    shortCount: overrideShortCount,
    shortMarks: overrideShortMarks,
    longCount: overrideLongCount,
    longMarks: overrideLongMarks,
    timeAllowed: overrideTimeAllowed,
    totalMarks: overrideTotalMarks
  }) => {
    const targetClass = classKey || selectedClass || '10th';
    const targetClassData = bank[targetClass] || {};
    const targetSubject = (targetClassData.subjects || []).find(s => s.id === subjectId) || targetClassData.subjects?.[0] || {};
    const targetChapters = targetSubject.chapters || [];

    const activeChapters = (chapterIds && chapterIds.length > 0)
      ? targetChapters.filter(ch => chapterIds.includes(ch.id))
      : targetChapters;

    const collectedTopicIds = [];
    activeChapters.forEach(ch => {
      (ch.topics || []).forEach(t => collectedTopicIds.push(t.id));
    });

    let mcqCount = overrideMcqCount !== undefined ? Number(overrideMcqCount) : (preset.mcqCount ?? 5);
    let mcqMarks = overrideMcqMarks !== undefined ? Number(overrideMcqMarks) : (preset.mcqMarks ?? 1);
    let shortCount = overrideShortCount !== undefined ? Number(overrideShortCount) : (preset.shortCount ?? 5);
    let shortMarks = overrideShortMarks !== undefined ? Number(overrideShortMarks) : (preset.shortMarks ?? 2);
    let longCount = overrideLongCount !== undefined ? Number(overrideLongCount) : (preset.longCount ?? 2);
    let longMarks = overrideLongMarks !== undefined ? Number(overrideLongMarks) : (preset.longMarks ?? 5);
    let timeAllowed = overrideTimeAllowed || preset.time || '35 Mins';
    let totalMarks = overrideTotalMarks || ((mcqCount * mcqMarks) + (shortCount * shortMarks) + (longCount * longMarks));

    let computedSyllabus = syllabus;
    if (!computedSyllabus) {
      if (activeChapters.length === 1) {
        const ch = activeChapters[0];
        computedSyllabus = `Chapter ${ch?.chapterNumber || 1}: ${ch?.name || 'Unit'}`;
      } else if (activeChapters.length > 1 && activeChapters.length < targetChapters.length) {
        computedSyllabus = `Chapters: ${activeChapters.map(c => c.chapterNumber || c.name).join(', ')}`;
      } else {
        computedSyllabus = 'Complete Syllabus (Full Book)';
      }
    }

    setSelectedCourse('Computer Science');
    setSelectedClass(targetClass);
    setSelectedSubjectId(targetSubject.id);
    setSelectedTopicIds(collectedTopicIds);

    setPaperConfig(prev => ({
      ...prev,
      institute: currentUser?.institute || prev.institute || 'Educators Academy',
      subject: targetSubject.name || prev.subject || 'Computer Science',
      gradeClass: `${targetClass} Class`,
      examTitle: customTitle || `${preset.title} (${preset.marks} Marks)`,
      timeAllowed: timeAllowed || preset.time,
      totalMarks: preset.marks,
      syllabus: computedSyllabus,
      language: language || 'bilingual',
      date: new Date().toISOString().split('T')[0]
    }));

    const generated = generatePaperFromTopics(targetClass, targetSubject.id, {
      selectedTopicIds: collectedTopicIds,
      chapters: activeChapters,
      pooledMcqCount: mcqCount,
      pooledMcqMarks: mcqMarks,
      pooledShortCount: shortCount,
      pooledShortMarks: shortMarks,
      pooledLongCount: longCount,
      pooledLongMarks: longMarks,
      isRandom: true
    });

    setPaperData({
      mcqs: generated.mcqs || [],
      shortQuestions: generated.shortQuestions || [],
      longQuestions: generated.longQuestions || []
    });

    setActiveNav('generate_paper');
    setPaperStep('canvas');

    notify.success(`${preset.title} پیپر کامیابی سے تیار ہو گیا ہے!`, {
      description: `کل نمبر: ${preset.marks} | دورانیہ: ${preset.time}`
    });

    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleOpenPresetInManualMode = ({ preset, classKey, subjectId }) => {
    const targetClass = classKey || selectedClass || '10th';
    const targetClassData = bank[targetClass] || {};
    const targetSubject = (targetClassData.subjects || []).find(s => s.id === subjectId) || targetClassData.subjects?.[0] || {};

    setSelectedCourse('Computer Science');
    setSelectedClass(targetClass);
    setSelectedSubjectId(targetSubject.id);

    setPaperConfig(prev => ({
      ...prev,
      institute: currentUser?.institute || prev.institute || 'Educators Academy',
      subject: targetSubject.name || prev.subject || 'Computer Science',
      gradeClass: `${targetClass} Class`,
      examTitle: `${preset.title} (${preset.marks} Marks)`,
      timeAllowed: preset.time,
      totalMarks: preset.marks,
      presetType: preset.id
    }));

    setActiveNav('generate_paper');
    setPaperStep('topics');
  };

  // Handler for 1-Click Board Pairing Scheme Generation
  const handleApplyBoardPairingPaper = (newPaperData, newPaperConfig) => {
    setPaperConfig(prev => ({
      ...prev,
      ...newPaperConfig,
      institute: currentUser?.institute || prev.institute || 'Educators Academy'
    }));
    setPaperData(newPaperData);
    if (newPaperConfig.pairingMeta?.classKey) {
      setSelectedClass(newPaperConfig.pairingMeta.classKey);
    }
    setActiveNav('generate_paper');
    setPaperStep('canvas');
  };

  // Printing & Word Export Handlers with Paywall & Subscription Guards
  const handlePrintPaper = () => {
    if (currentUser && !isSuperAdmin(currentUser) && !userSubscribed) {
      notify.error("سبسکرپشن درکار ہے (Subscription Required)", {
        description: "پیپر پرنٹ کرنے کے لیے ایکٹو پیکیج درکار ہے۔"
      });
      setActiveNav('pricing');
      return;
    }
    window.print();
  };

  const handleExportDocx = () => {
    if (currentUser && !isSuperAdmin(currentUser) && !userSubscribed) {
      notify.error("سبسکرپشن درکار ہے (Subscription Required)", {
        description: "ورڈ فائل ڈاؤنلوڈ کرنے کے لیے ایکٹو پیکیج درکار ہے۔"
      });
      setActiveNav('pricing');
      return;
    }

    const paperElement = document.getElementById('printable-paper') || document.querySelector('.a4-paper');
    if (!paperElement) return;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${paperConfig.examTitle || 'Test Paper'}</title>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.4; }
        h1 { font-size: 18pt; text-align: center; text-transform: uppercase; margin: 0; }
        h2 { font-size: 14pt; text-align: center; margin: 5pt 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; }
        td, th { border: 1pt solid black; padding: 4pt; }
        .no-print { display: none; }
      </style>
      </head>
      <body>
        ${paperElement.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });

    // Compute descriptive download filename with chapter name and topic names
    let syllabus = (paperConfig?.syllabus || '').trim();
    if (!syllabus || syllabus === 'Complete Syllabus' || syllabus.includes('Full Book')) {
      syllabus = computeSyllabusText(currentChapters, selectedTopicIds, {
        mcqCount: paperData.mcqs?.length || 0,
        shortCount: paperData.shortQuestions?.length || 0,
        longCount: paperData.longQuestions?.length || 0
      });
    }

    // Clean for filename (remove illegal filesystem chars: \ / : * ? " < > |)
    const cleanSyllabus = syllabus
      .replace(/[:*?"<>|\\\/]/g, '-')
      .replace(/\s+/g, ' ')
      .replace(/[()]/g, '')
      .trim();

    const subjectStr = (paperConfig?.subject || currentSubject?.name || 'Paper').replace(/[\s]+/g, '_');
    const gradeStr = (paperConfig?.gradeClass || selectedClass || '').replace(/[\s]+/g, '_');
    const syllabusStr = cleanSyllabus.replace(/[\s]+/g, '_');

    let filename = `${subjectStr}_${gradeStr}`;
    if (syllabusStr) {
      filename += `_${syllabusStr}`;
    }
    filename = filename.replace(/_+/g, '_').replace(/^_|_$/g, '') + '.doc';

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Canvas Question Edit Handlers
  const handleEditQuestion = (sectionKey, index, field, value) => {
    setPaperData(prev => {
      const list = [...(prev[sectionKey] || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: value };
      }
      return { ...prev, [sectionKey]: list };
    });
  };

  const handleEditMcqOption = (mcqIndex, optIndex, value) => {
    setPaperData(prev => {
      const list = [...prev.mcqs];
      if (list[mcqIndex] && list[mcqIndex].options) {
        const opts = [...list[mcqIndex].options];
        opts[optIndex] = value;
        list[mcqIndex] = { ...list[mcqIndex], options: opts };
      }
      return { ...prev, mcqs: list };
    });
  };

  const handleRemoveQuestion = (sectionKey, index) => {
    setPaperData(prev => {
      const list = [...(prev[sectionKey] || [])].filter((_, i) => i !== index);
      return { ...prev, [sectionKey]: list };
    });
  };

  const handleUpdateMarks = (sectionKey, index, marksVal) => {
    const num = parseInt(marksVal, 10) || 1;
    setPaperData(prev => {
      const list = [...(prev[sectionKey] || [])];
      if (list[index]) {
        list[index] = { ...list[index], marks: num };
      }
      return { ...prev, [sectionKey]: list };
    });
  };

  const handleBankUpdated = (updatedBank) => {
    setBank(updatedBank);
    syncBankToFirebase(updatedBank).catch(err => {
      console.warn("Could not sync updated bank to Firebase:", err);
    });
  };

  const handleTestFirebase = async () => {
    setShowFirebaseModal(true);
    setFirebaseStatus('testing');
    const res = await testFirebaseConnection();
    setFirebaseStatus(res);
  };

  // Save Paper into Saved Papers Archive (and download .doc)
  const handleSavePaper = async () => {
    // 1. Strict Authorization & Live Cloud Subscription Check for Non-Admin
    if (currentUser && !isSuperAdmin(currentUser)) {
      if (!userSubscribed) {
        notify.error("پہلے پیکیج حاصل کریں (Subscription Required)", {
          description: "پیپرز بنانے اور محفوظ کرنے کے لیے پہلے پیکیج خرید کر اکاؤنٹ ایکٹیویٹ کروائیں۔"
        });
        setActiveNav('pricing');
        return;
      }

      if (currentUser.status === 'blocked') {
        notify.error("اکاؤنٹ بلاک ہے (Account Blocked)", {
          description: "آپ کا اکاؤنٹ ایڈمن کی طرف سے بلاک کیا گیا ہے۔ آپ مزید پیپرز محفوظ نہیں کر سکتے۔"
        });
        return;
      }

      // Live check with Firestore to prevent browser memory/React DevTools manipulation
      try {
        const liveSnap = await getDoc(doc(db, "users", currentUser.email.toLowerCase().trim()));
        if (!liveSnap.exists() || liveSnap.data().subscriptionStatus !== 'active' || liveSnap.data().status === 'blocked') {
          notify.error("غیر مجاز رسائی (Unauthorized Access)", {
            description: "آپ کے اکاؤنٹ کا تصدیق شدہ فعال پیکیج نہیں ملا۔"
          });
          setActiveNav('pricing');
          return;
        }

        if (liveSnap.data().expiryDate) {
          const liveExp = new Date(liveSnap.data().expiryDate);
          liveExp.setHours(23, 59, 59, 999);
          if (liveExp < new Date()) {
            notify.error("پیکج کی میعاد ختم (Subscription Expired)", {
              description: `آپ کا پیکج ختم ہو چکا ہے۔ برائے مہربانی پیکیج کی تجدید کروائیں۔`
            });
            setActiveNav('pricing');
            return;
          }
        }
      } catch (cloudErr) {
        console.warn("Cloud verification note:", cloudErr.message);
      }

      const maxPapers = currentUser.maxPapers ?? -1;
      if (maxPapers > 0 && savedPapers.length >= maxPapers) {
        notify.error("پیپرز کی حد مکمل ہو گئی (Paper Limit Reached)", {
          description: `آپ کے پیکج میں کل ${maxPapers} پیپرز کی حد تھی۔ آپ پہلے ہی ${savedPapers.length} پیپرز بنا چکے ہیں۔ کوٹہ بڑھانے کے لیے ایڈمن سے رابطہ کریں۔`
        });
        return;
      }
    }

    // 2. Safe export only after all security verifications pass
    try {
      handleExportDocx();
    } catch (e) {}

    let syllabus = (paperConfig?.syllabus || '').trim();
    if (!syllabus || syllabus === 'Complete Syllabus' || syllabus.includes('Full Book')) {
      syllabus = computeSyllabusText(currentChapters, selectedTopicIds, {
        mcqCount: paperData.mcqs?.length || 0,
        shortCount: paperData.shortQuestions?.length || 0,
        longCount: paperData.longQuestions?.length || 0
      });
    }

    const newPaper = {
      id: `paper-${Date.now()}`,
      title: `${paperConfig.subject || currentSubject?.name || 'Subject'} - ${paperConfig.gradeClass || selectedClass} (${syllabus || paperConfig.examTitle || 'Exam'})`,
      subject: paperConfig.subject || currentSubject?.name || 'Subject',
      gradeClass: paperConfig.gradeClass || selectedClass,
      date: paperConfig.date || new Date().toISOString().split('T')[0],
      totalMarks: totalPaperMarks,
      mcqCount: paperData.mcqs?.length || 0,
      shortCount: paperData.shortQuestions?.length || 0,
      longCount: paperData.longQuestions?.length || 0,
      paperConfig: { ...paperConfig },
      paperData: { ...paperData },
      selectedCourse,
      selectedClass,
      selectedSubjectId,
      selectedTopicIds,
      savedAt: new Date().toLocaleString()
    };

    setSavedPapers(prev => {
      const updated = [newPaper, ...prev.filter(p => p.id !== newPaper.id)];
      try {
        const userKey = currentUser?.email ? `ptm_saved_papers_${currentUser.email.toLowerCase()}` : 'ptm_saved_papers';
        localStorage.setItem(userKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Record created paper stat & activity for this user
    if (currentUser?.email) {
      recordPaperCreated(currentUser.email, newPaper.title);
    }

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    notify.success("Paper saved to 'Saved Papers'!", {
      description: "You can view, re-open, or print it anytime from the sidebar without losing your progress."
    });
  };

  const handleOpenSavedPaper = (saved) => {
    if (!saved) return;
    if (saved.paperConfig) setPaperConfig(saved.paperConfig);
    if (saved.paperData) setPaperData(saved.paperData);
    if (saved.selectedCourse) setSelectedCourse(saved.selectedCourse);
    if (saved.selectedClass) setSelectedClass(saved.selectedClass);
    if (saved.selectedSubjectId) setSelectedSubjectId(saved.selectedSubjectId);
    if (saved.selectedTopicIds) setSelectedTopicIds(saved.selectedTopicIds);

    setActiveNav('generate_paper');
    setPaperStep('canvas');
  };

  const handleDeleteSavedPaper = (paperId) => {
    const targetPaper = savedPapers.find(p => p.id === paperId);
    confirmAction({
      title: "Delete Saved Paper",
      message: "Are you sure you want to delete this saved paper from your archive? This action cannot be undone.",
      confirmText: "Delete Paper",
      cancelText: "Keep Paper",
      type: "danger",
      onConfirm: () => {
        setSavedPapers(prev => {
          const updated = prev.filter(p => p.id !== paperId);
          try {
            const userKey = currentUser?.email ? `ptm_saved_papers_${currentUser.email.toLowerCase()}` : 'ptm_saved_papers';
            localStorage.setItem(userKey, JSON.stringify(updated));
          } catch (e) {}
          // Record deleted paper stat & activity for this user
          if (currentUser?.email) {
            recordPaperDeleted(currentUser.email, targetPaper?.title || 'Examination Paper');
          }
          notify.info("Paper removed from Saved Papers.");
          return updated;
        });
      }
    });
  };

  const handleStartNewPaper = () => {
    if (currentUser && !userSubscribed) {
      notify.warning("پہلے پیکیج حاصل کریں (Subscription Required)", {
        description: "نیا پیپر بنانے کے لیے پہلے پیکیج کا انتخاب کریں۔"
      });
      setActiveNav('pricing');
      return;
    }

    confirmAction({
      title: "Start New Paper",
      message: "Start a new paper? Any previously saved papers will remain safe in your archive.",
      confirmText: "Start New",
      cancelText: "Cancel",
      type: "info",
      onConfirm: () => {
        setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
        setPaperStep('course');
        setActiveNav('generate_paper');
      }
    });
  };

  // Public Solution & Answer Key Viewer (Opens when QR Code is scanned on mobile)
  if (scannedPaperId) {
    return (
      <PublicPaperSolutionView 
        paperId={scannedPaperId} 
        onGoHome={() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('paper_solution');
          window.history.replaceState({}, '', url.pathname);
          setScannedPaperId(null);
        }} 
      />
    );
  }

  // Require Authentication before opening application
  if (!currentUser) {
    return (
      <>
        {isAppBooting && <AppLoadingScreen onComplete={() => setIsAppBooting(false)} />}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          theme="light"
          duration={3500}
          toastOptions={{
            style: {
              borderRadius: '16px',
              boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
              fontFamily: 'inherit'
            }
          }}
        />
        <AuthPortal key="ptm-auth-portal-v2" onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="h-screen bg-[#f4f7f9] text-slate-800 flex font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {isAppBooting && <AppLoadingScreen onComplete={() => setIsAppBooting(false)} />}
      
      {/* LEFT SIDEBAR (EXPANDED W-64 OR COLLAPSED MINI-ICON RAIL W-16 ON DESKTOP, SLIDE-OVER DRAWER ON MOBILE) */}
      <PTMSidebar
        collapsed={!sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeNav={activeNav}
        setActiveNav={(navId) => {
          if (navId === 'ai_assistant') {
            setShowAiBotModal(true);
            setMobileSidebarOpen(false);
            return;
          }
          handleSafeNavigate(navId);
          setMobileSidebarOpen(false);
        }}
        onOpenContact={() => handleSafeNavigate('contact')}
        userName={currentUser?.name || "Senior Teacher"}
        expiryDate={currentUser?.expiryDate || "N/A"}
        accessType={currentUser?.isAdmin ? "Administrator (Full Access)" : (currentUser?.role || "Subject Teacher")}
        packageType={currentUser?.institute || "Educators Academy"}
        currentUser={currentUser}
        userSubscribed={userSubscribed}
        onLogout={handleLogout}
        appLanguage={appLanguage}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* MAIN VIEWPORT CONTAINER (INDEPENDENT SMOOTH SCROLLING) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden transition-all duration-500 ease-in-out">
        
        {/* TOP PTM HEADER BAR */}
        <PTMHeader
          sidebarOpen={sidebarOpen || mobileSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onGoHome={() => {
            handleSafeNavigate('generate_paper');
            setMobileSidebarOpen(false);
          }}
          onOpenContact={() => handleSafeNavigate('contact')}
          onOpenFirebaseStatus={handleTestFirebase}
          onOpenAiBot={() => setShowAiBotModal(true)}
          onOpenAdmin={() => {
            setMobileSidebarOpen(false);
            if (isAdminUnlocked) {
              setActiveNav('admin_portal');
            } else {
              setShowPinModal(true);
            }
          }}
          onOpenUserAudit={() => handleSafeNavigate('login_history')}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          appLanguage={appLanguage}
          onToggleLanguage={handleToggleLanguage}
        />

        {/* MAIN BODY CONTENT AREA */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 w-full overflow-x-hidden">
          {/* UNIVERSAL TOP BACK & NAVIGATION ARROW BAR (FOR ALL NON-DASHBOARD PAGES) */}
          {activeNav !== 'dashboard' && (
            <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs no-print">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
                <button
                  type="button"
                  onClick={handleUniversalBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-xl text-xs font-black border border-blue-200 transition-all active:scale-95 cursor-pointer shadow-2xs group"
                  title={appLanguage === 'ur' ? 'پیچھے جائیں (Back)' : 'Go Back'}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>{appLanguage === 'ur' ? 'واپس جائیں • Back' : 'Back'}</span>
                </button>

                {/* Breadcrumb Path */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                  <button 
                    type="button"
                    onClick={() => navigateTo('dashboard')} 
                    className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
                  >
                    {appLanguage === 'ur' ? 'ڈیش بورڈ' : 'Dashboard'}
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-800">
                    {getViewTitle(activeNav, paperStep, appLanguage)}
                  </span>
                </div>
              </div>

              {/* Right-side Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {hasActiveDraft && !(activeNav === 'generate_paper' && paperStep === 'canvas') && (
                  <button
                    type="button"
                    onClick={() => navigateTo('generate_paper', 'canvas')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Resume editing active draft paper"
                  >
                    <span>📝 {appLanguage === 'ur' ? 'جاری ڈرافٹ پیپر' : 'Resume Draft Paper'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigateTo('dashboard')}
                  className="text-[11px] font-bold text-slate-600 hover:text-blue-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🏠 {appLanguage === 'ur' ? 'ڈیش بورڈ' : 'Dashboard'}</span>
                </button>
              </div>
            </div>
          )}

          <React.Suspense fallback={<div className="p-8 text-center text-slate-400 font-semibold animate-pulse">Loading View...</div>}>

          {/* 0. ADMIN PORTAL (PIN PROTECTED - DIRECT CLASS, SUBJECT, CHAPTER, TOPIC & QUESTION MANAGER) */}
          {activeNav === 'admin_portal' && (
            <AdminPortalSection
              bank={bank}
              onBankUpdated={handleBankUpdated}
              currentUser={currentUser}
              onExit={() => {
                navigateTo('generate_paper', 'course');
              }}
            />
          )}

          {/* 0.1 QUESTION BANK & LIVE ANSWER KEY EDITOR */}
          {activeNav === 'question_bank_editor' && (
            <AdminQuestionBankManagerView
              bank={bank}
              onBankUpdated={handleBankUpdated}
              onExit={() => {
                navigateTo('generate_paper', 'course');
              }}
            />
          )}

          {/* 1. GENERATE PAPER MULTI-STEP FLOW */}
          {activeNav === 'generate_paper' && (
            <>
              {/* STEP 1: SELECT COURSE */}
              {paperStep === 'course' && (
                <CourseSelectionView
                  onSelectCourse={(courseId) => {
                    setSelectedCourse(courseId);
                    navigateTo('generate_paper', 'class');
                  }}
                  onBackToDashboard={() => navigateTo('dashboard')}
                  hasActiveDraft={hasActiveDraft}
                  onResumeDraft={() => navigateTo('generate_paper', 'canvas')}
                />
              )}

              {/* STEP 2: SELECT CLASS */}
              {paperStep === 'class' && (
                <ClassSelectionView
                  courseName={selectedCourse}
                  bank={bank}
                  onSelectClass={(classKey) => {
                    setSelectedClass(classKey);
                    setPaperConfig(prev => ({
                      ...prev,
                      gradeClass: `${classKey} Class`
                    }));
                    navigateTo('generate_paper', 'subject');
                  }}
                  onBack={() => navigateTo('generate_paper', 'course')}
                />
              )}

              {/* STEP 3: SELECT SUBJECT */}
              {paperStep === 'subject' && (
                <SubjectSelectionView
                  selectedClass={selectedClass}
                  subjects={currentClassData.subjects || []}
                  onSelectSubject={(subjectId) => {
                    setSelectedSubjectId(subjectId);
                    const subjObj = (currentClassData.subjects || []).find(s => s.id === subjectId);
                    setPaperConfig(prev => ({
                      ...prev,
                      subject: subjObj?.name || prev.subject,
                      gradeClass: `${selectedClass} Class`
                    }));
                    navigateTo('generate_paper', 'topics');
                  }}
                  onBack={() => navigateTo('generate_paper', 'class')}
                />
              )}

              {/* STEP 4: CHAPTER & TOPIC SELECTION + EXACT 2-ROW FILTER BAR */}
              {paperStep === 'topics' && (
                <PTMTopicSelectionView
                  selectedCourse={selectedCourse}
                  selectedClass={selectedClass}
                  currentSubject={currentSubject}
                  currentChapters={currentChapters}
                  selectedTopicIds={selectedTopicIds}
                  setSelectedTopicIds={setSelectedTopicIds}
                  onGeneratePaper={handleGeneratePaperFromCTM}
                  onBackToSubjects={() => navigateTo('generate_paper', 'subject')}
                  onBackToClasses={() => navigateTo('generate_paper', 'class')}
                />
              )}

              {/* STEP 5: LIVE PAPER PREVIEW & ACTION CANVAS */}
              {paperStep === 'canvas' && (
                <div className="p-4 max-w-6xl mx-auto space-y-4">
                  {/* Return Bar to Topics & Dashboard */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs no-print">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          notify.info(appLanguage === 'ur' 
                            ? "آپ کا تیار کردہ پیپر ڈرافٹ میں محفوظ ہے (Draft Preserved)" 
                            : "Paper saved to active draft in memory."
                          );
                          navigateTo('dashboard');
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Return to Dashboard while keeping paper saved in draft"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{appLanguage === 'ur' ? '← ڈیش بورڈ (ڈرافٹ محفوظ)' : '← Back to Dashboard (Draft Saved)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setManualPickerTab('all');
                          setShowManualPicker(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <span>📋 {appLanguage === 'ur' ? 'دستی سوالات منتخب کریں' : 'Manual Selector'}</span>
                      </button>

                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{appLanguage === 'ur' ? 'ڈرافٹ خودکار محفوظ ہے' : 'Draft Auto-Saved'}</span>
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <span className="text-slate-500">Total Marks:</span>
                      <span className="text-blue-600 font-black text-sm px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200">{totalPaperMarks}</span>
                    </div>
                  </div>

                  {/* Paper Canvas */}
                  <PaperCanvas
                    config={paperConfig}
                    setConfig={setPaperConfig}
                    currentUser={currentUser}
                    userSubscribed={userSubscribed}
                    selectedClass={selectedClass}
                    paperConfig={paperConfig}
                    setPaperConfig={setPaperConfig}
                    data={paperData}
                    paperData={paperData}
                    setPaperData={setPaperData}
                    onEditQuestion={handleEditQuestion}
                    onEditMcqOption={handleEditMcqOption}
                    onRemoveQuestion={handleRemoveQuestion}
                    onUpdateMarks={handleUpdateMarks}
                    availableBankQuestions={availableBankQuestions}
                    onAddQuestion={(sectionKey) => {
                      setManualPickerTab(sectionKey || 'all');
                      setShowManualPicker(true);
                    }}
                    onOpenGeneratorModal={() => setPaperStep('topics')}
                    onExportDocx={handleSavePaper}
                    onSavePaper={handleSavePaper}
                    onResetPaper={() => {
                      confirmAction({
                        title: "Reset Paper",
                        message: "Are you sure you want to reset this paper? All selected questions and customizations will be cleared.",
                        confirmText: "Reset Paper",
                        cancelText: "Keep Paper",
                        type: "warning",
                        onConfirm: () => {
                          setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
                          setPaperStep('topics');
                          notify.info("Paper has been reset");
                        }
                      });
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* 2. DASHBOARD VIEW */}
          {activeNav === 'dashboard' && (
            <PTMDashboardView
              onGoToGenerate={() => {
                navigateTo('generate_paper', 'course');
              }}
              onGoToUpload={() => {
                if (isSuperAdmin(currentUser)) {
                  navigateTo('upload_material');
                } else {
                  notify.info("سوالات اپلوڈ کرنے کی سہولت صرف ایڈمن کے لیے مخصوص ہے۔ (Admin Access Required)");
                }
              }}
              onGoToDirectory={() => navigateTo('directory')}
              onGoToSettings={() => navigateTo('default_paper_settings')}
              onNavigate={(navId) => {
                navigateTo(navId);
              }}
              bank={bank}
              selectedClass={selectedClass}
              savedPapers={savedPapers}
              currentUser={currentUser}
              appLanguage={appLanguage}
              onToggleLanguage={handleToggleLanguage}
              onOpenSavedPaper={handleOpenSavedPaper}
              onDeleteSavedPaper={handleDeleteSavedPaper}
              onExportDocx={handleExportDocx}
              paperConfig={paperConfig}
              setPaperConfig={setPaperConfig}
              onGenerateFromPreset={handleGeneratePaperFromPreset}
              onOpenPresetInManualMode={handleOpenPresetInManualMode}
              hasActiveDraft={hasActiveDraft}
              onResumeDraft={() => navigateTo('generate_paper', 'canvas')}
              onDiscardDraft={() => {
                confirmAction({
                  title: "Discard Draft Paper",
                  message: "Are you sure you want to clear the active draft paper from memory?",
                  confirmText: "Discard Draft",
                  cancelText: "Keep Draft",
                  type: "warning",
                  onConfirm: () => {
                    setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
                    try {
                      localStorage.removeItem('ptm_active_paper_data');
                    } catch (e) {}
                    notify.info("ڈرافٹ ختم کر دیا گیا (Draft Cleared)");
                  }
                });
              }}
              activeDraftInfo={hasActiveDraft ? { subject: paperConfig.subject, gradeClass: paperConfig.gradeClass, totalMarks: totalPaperMarks } : null}
              onOpenPairingSchemeModal={() => setShowPairingSchemeModal(true)}
            />
          )}

          {/* 3. MATERIAL UPLOAD VIEW (ADMIN ONLY) */}
          {activeNav === 'upload_material' && (
            isSuperAdmin(currentUser) ? (
              <div className="p-4 max-w-7xl mx-auto space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                  </button>
                </div>
                <UploadMaterialSection
                  bank={bank}
                  selectedClass={selectedClass}
                  setSelectedClass={setSelectedClass}
                  onBankUpdated={handleBankUpdated}
                  onGoToGenerator={() => {
                    navigateTo('generate_paper', 'course');
                  }}
                />
              </div>
            ) : (
              <div className="p-8 max-w-md mx-auto text-center space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold leading-relaxed">
                  ⚠️ سوالات اور نیا مٹیریل اپلوڈ کرنے کی سہولت صرف ایڈمنسٹریٹر کے لیے مخصوص ہے۔ (Admin Access Required)
                </div>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            )
          )}

          {/* 4. MATERIAL DIRECTORY (TOPICS & NUMBERS OVERVIEW) */}
          {activeNav === 'directory' && (
            <div className="p-4 max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between no-print">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
              </div>
              <MaterialOverviewSection
                bank={bank}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                onBankUpdated={handleBankUpdated}
                onGoToGenerator={() => {
                  navigateTo('generate_paper', 'course');
                }}
                onGoToUpload={() => navigateTo('upload_material')}
              />
            </div>
          )}

          {/* 5. SECONDARY PTM VIEWS (Saved Papers, Past Papers, Model Papers, Teachers, etc.) */}
          {['saved_papers', 'past_papers', 'model_papers', 'teachers', 'papers_history', 'login_history', 'user_management', 'default_paper_settings'].includes(activeNav) && (
            <div className="w-full max-w-full min-w-0 overflow-x-hidden">
              <PTMSecondaryViews
                activeNav={activeNav}
                currentUser={currentUser}
                paperConfig={paperConfig}
                setPaperConfig={setPaperConfig}
                onGoToGenerate={() => navigateTo('generate_paper', 'course')}
                savedPapers={savedPapers}
                onOpenSavedPaper={handleOpenSavedPaper}
                onDeleteSavedPaper={handleDeleteSavedPaper}
                onStartNewPaper={handleStartNewPaper}
                onResumeCurrentDraft={() => navigateTo('generate_paper', 'canvas')}
                hasActiveDraft={hasActiveDraft}
                onExportDocx={handleExportDocx}
                onNavigate={navigateTo}
                onBack={() => navigateTo('dashboard')}
                appLanguage={appLanguage}
                onToggleLanguage={handleToggleLanguage}
                onOpenPairingSchemeModal={() => setShowPairingSchemeModal(true)}
              />
            </div>
          )}

          {/* 6. PRICING & SUBSCRIPTION PACKAGES VIEW */}
          {activeNav === 'pricing' && (
            <PricingPlansView
              currentUser={currentUser}
              userSubscribed={userSubscribed}
              onNavigate={navigateTo}
              onGoToDashboard={() => navigateTo('dashboard')}
              onLogout={handleLogout}
              appLanguage={appLanguage}
              onToggleLanguage={handleToggleLanguage}
            />
          )}

          {/* 7. FULL-SCREEN DEDICATED CONTACT & ADMIN SUPPORT HUB */}
          {activeNav === 'contact' && (
            <ContactTeamView
              currentUser={currentUser}
              onGoToGenerate={() => navigateTo('generate_paper', 'course')}
              onResumeCurrentDraft={() => navigateTo('generate_paper', 'canvas')}
              onBackToDashboard={() => navigateTo('dashboard')}
              hasActiveDraft={hasActiveDraft}
              appLanguage={appLanguage}
              onToggleLanguage={handleToggleLanguage}
            />
          )}

          {/* 8. AUTOMATIC DATE-SHEET & MONTHLY SYLLABUS TEST PLANNER */}
          {activeNav === 'date_sheet_planner' && (
            <DateSheetPlannerView
              bank={bank}
              selectedClass={selectedClass}
              paperConfig={paperConfig}
              currentUser={currentUser}
              onGoToGenerator={() => navigateTo('generate_paper', 'course')}
              onGenerateSpecificPaper={handleGenerateSpecificPaperFromDateSheet}
              onBackToDashboard={() => navigateTo('dashboard')}
              appLanguage={appLanguage}
              onToggleLanguage={handleToggleLanguage}
            />
          )}

          </React.Suspense>
        </main>
      </div>

      {/* FIREBASE LIVE CONNECTION TEST MODAL */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-slate-800">
            <button 
              onClick={() => setShowFirebaseModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <Cloud className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Firebase Cloud Status</h3>
                <p className="text-xs text-slate-500">Real-time Question Bank Connection</p>
              </div>
            </div>

            {firebaseStatus === 'testing' && (
              <div className="py-6 text-center space-y-2">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-slate-600">Connecting to Cloud Firestore...</p>
              </div>
            )}

            {firebaseStatus && firebaseStatus !== 'testing' && (
              <div className="space-y-3 py-2">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  firebaseStatus.success 
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                    : 'bg-amber-50/70 border-amber-200 text-amber-800'
                }`}>
                  {firebaseStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-bold">{firebaseStatus.message}</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Project ID: <span className="font-mono font-bold text-slate-800">protestmaker-bf157</span>
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <p>✔ Real-time sync across devices active</p>
                  <p>✔ Any added topics and questions save automatically</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowFirebaseModal(false)}
              className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MANUAL QUESTION PICKER MODAL */}
      <React.Suspense fallback={null}>
        {showManualPicker && (
          <ManualQuestionPickerModal
            isOpen={showManualPicker}
            onClose={() => setShowManualPicker(false)}
            initialTab={manualPickerTab}
            currentChapters={currentChapters}
            selectedTopicIds={selectedTopicIds}
            currentPaperData={paperData}
            defaultMarks={{ mcqMarks: 1, shortMarks: 2, longMarks: 5 }}
            onApplySelection={(selectedData) => {
              setPaperData(selectedData);
              try {
                confetti({
                  particleCount: 70,
                  spread: 60,
                  origin: { y: 0.6 }
                });
              } catch (e) {}
            }}
          />
        )}
      </React.Suspense>

      {/* GLOBAL NOTIFICATION TOASTER (SONNER) */}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        theme="light"
        duration={3500}
        toastOptions={{
          style: {
            borderRadius: '16px',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
            fontFamily: 'inherit'
          }
        }}
      />

      {/* CONTACT PRO TEST MAKER TEAM MODAL */}
      <ContactTeamModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        currentUser={currentUser}
      />

      {/* FLOATING AI ASSISTANT LAUNCHER WIDGET */}
      {!showAiBotModal && (
        <button
          type="button"
          onClick={() => setShowAiBotModal(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group border border-white/20 cursor-pointer no-print"
          title="Ask Pro Test Maker AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <span className="hidden sm:inline font-black text-xs pr-1">Ask AI</span>
        </button>
      )}

      {/* AI ASSISTANT BOT MODAL */}
      <React.Suspense fallback={null}>
        {showAiBotModal && (
          <AIAssistantBotModal
            isOpen={showAiBotModal}
            onClose={() => setShowAiBotModal(false)}
            currentUser={currentUser}
            onOpenPricing={() => handleSafeNavigate('pricing')}
            onOpenContact={() => handleSafeNavigate('contact')}
          />
        )}
      </React.Suspense>

      {/* BOARD PAIRING SCHEME & BLUEPRINT MODAL */}
      <React.Suspense fallback={null}>
        {showPairingSchemeModal && (
          <BoardPairingSchemeModal
            isOpen={showPairingSchemeModal}
            onClose={() => setShowPairingSchemeModal(false)}
            bank={bank}
            selectedClass={selectedClass}
            selectedSubjectId={selectedSubjectId}
            currentUser={currentUser}
            onApplyBoardPaper={handleApplyBoardPairingPaper}
            appLanguage={appLanguage}
          />
        )}
      </React.Suspense>

      {/* GLOBAL PROFESSIONAL CONFIRMATION MODAL */}
      <ConfirmationModal />

    </div>
  );
}
