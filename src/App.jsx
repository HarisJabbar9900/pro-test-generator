import React, { useState, useMemo, useEffect } from 'react';
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

// Code-split secondary views & modals for maximum initial load performance
const PTMSecondaryViews = React.lazy(() => import('./components/PTMSecondaryViews'));
const UploadMaterialSection = React.lazy(() => import('./components/UploadMaterialSection'));
const MaterialOverviewSection = React.lazy(() => import('./components/MaterialOverviewSection'));
const ManualQuestionPickerModal = React.lazy(() => import('./components/ManualQuestionPickerModal'));
const AdminPinModal = React.lazy(() => import('./components/AdminPinModal'));
const AdminPortalSection = React.lazy(() => import('./components/AdminPortalSection'));
const AdminQuestionBankManagerView = React.lazy(() => import('./components/AdminQuestionBankManagerView'));
const PricingPlansView = React.lazy(() => import('./components/PricingPlansView'));
const ContactTeamView = React.lazy(() => import('./components/ContactTeamView'));
const AIAssistantBotModal = React.lazy(() => import('./components/AIAssistantBotModal'));
const DateSheetPlannerView = React.lazy(() => import('./components/DateSheetPlannerView'));
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
      setPaperData({ mcqs: [], shortQuestions: [], longQuestions: [] });
      setSelectedTopicIds([]);
      setPaperStep('course');
      setActiveNav('pricing');
      setSavedPapers([]);
      setCurrentUser(null);
      notify.warning("Session Expired (سیشن ختم ہو گیا)", {
        description: "غیر حاضری کی وجہ سے آپ کا سیشن ختم کر دیا گیا ہے۔ برائے مہربانی دوبارہ لاگ ان کریں۔"
      });
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

  // Navigation Guard: Strict role-based routing and paywall enforcement
  const handleSafeNavigate = (navId) => {
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
    setActiveNav(navId);
  };

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

  // Generate Paper Step State (Persisted so switching sidebar views never resets step)
  const [paperStep, setPaperStep] = useState(() => {
    try {
      return localStorage.getItem('ptm_active_paper_step') || 'course';
    } catch (e) {
      return 'course';
    }
  });
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
  const [paperData, setPaperData] = useState(() => {
    try {
      const raw = localStorage.getItem('ptm_active_paper_data');
      return raw ? JSON.parse(raw) : { mcqs: [], shortQuestions: [], longQuestions: [] };
    } catch (e) {
      return { mcqs: [], shortQuestions: [], longQuestions: [] };
    }
  });

  // Auto-sync active draft and step to localStorage
  useEffect(() => {
    if (!currentUser) return;
    try {
      localStorage.setItem('ptm_active_paper_step', paperStep);
      localStorage.setItem('ptm_active_course', selectedCourse);
      localStorage.setItem('ptm_active_class', selectedClass);
      localStorage.setItem('ptm_active_paper_data', JSON.stringify(paperData));
    } catch (e) {}
  }, [paperStep, selectedCourse, selectedClass, paperData, currentUser]);

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
      let nextMcqs = prev?.mcqs || [];
      let nextShorts = prev?.shortQuestions || [];
      let nextLongs = prev?.longQuestions || [];

      if (params.questionType === 'MCQ') {
        // User picked MCQs: preserve existing short and long questions!
        nextMcqs = (generated.mcqs && generated.mcqs.length > 0) ? generated.mcqs : (prev?.mcqs || []);
      } else if (params.questionType === 'SHORT') {
        // User picked Short Questions: preserve existing mcqs and long questions!
        nextShorts = (generated.shortQuestions && generated.shortQuestions.length > 0) ? generated.shortQuestions : (prev?.shortQuestions || []);
      } else if (params.questionType === 'LONG') {
        // User picked Long Questions: preserve existing mcqs and short questions!
        nextLongs = (generated.longQuestions && generated.longQuestions.length > 0) ? generated.longQuestions : (prev?.longQuestions || []);
      } else {
        // ALL question types
        nextMcqs = (generated.mcqs && generated.mcqs.length > 0) ? generated.mcqs : (prev?.mcqs || []);
        nextShorts = (generated.shortQuestions && generated.shortQuestions.length > 0) ? generated.shortQuestions : (prev?.shortQuestions || []);
        nextLongs = (generated.longQuestions && generated.longQuestions.length > 0) ? generated.longQuestions : (prev?.longQuestions || []);
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

  // Require Authentication before opening application
  if (!currentUser) {
    return (
      <>
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
        <AuthPortal onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="h-screen bg-[#f4f7f9] text-slate-800 flex font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
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
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />

        {/* MAIN BODY CONTENT AREA */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 w-full overflow-x-hidden">
          <React.Suspense fallback={<div className="p-8 text-center text-slate-400 font-semibold animate-pulse">Loading View...</div>}>

          {/* 0. ADMIN PORTAL (PIN PROTECTED - DIRECT CLASS, SUBJECT, CHAPTER, TOPIC & QUESTION MANAGER) */}
          {activeNav === 'admin_portal' && (
            <AdminPortalSection
              bank={bank}
              onBankUpdated={handleBankUpdated}
              currentUser={currentUser}
              onExit={() => {
                setActiveNav('generate_paper');
                setPaperStep('course');
              }}
            />
          )}

          {/* 0.1 QUESTION BANK & LIVE ANSWER KEY EDITOR */}
          {activeNav === 'question_bank_editor' && (
            <AdminQuestionBankManagerView
              bank={bank}
              onBankUpdated={handleBankUpdated}
              onExit={() => {
                setActiveNav('generate_paper');
                setPaperStep('course');
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
                    setPaperStep('class');
                  }}
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
                    setPaperStep('subject');
                  }}
                  onBack={() => setPaperStep('course')}
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
                    setPaperStep('topics');
                  }}
                  onBack={() => setPaperStep('class')}
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
                  onBackToSubjects={() => setPaperStep('subject')}
                  onBackToClasses={() => setPaperStep('class')}
                />
              )}

              {/* STEP 5: LIVE PAPER PREVIEW & ACTION CANVAS */}
              {paperStep === 'canvas' && (
                <div className="p-4 max-w-6xl mx-auto space-y-4">
                  {/* Return Bar to Topics */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs no-print">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPaperStep('topics')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Topics</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setManualPickerTab('all');
                          setShowManualPicker(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <span>📋 Manual Selector</span>
                      </button>
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
                setActiveNav('generate_paper');
              }}
              onGoToUpload={() => {
                if (isSuperAdmin(currentUser)) {
                  setActiveNav('upload_material');
                } else {
                  notify.info("سوالات اپلوڈ کرنے کی سہولت صرف ایڈمن کے لیے مخصوص ہے۔ (Admin Access Required)");
                }
              }}
              onGoToDirectory={() => setActiveNav('directory')}
              onGoToSettings={() => setActiveNav('default_paper_settings')}
              onNavigate={(navId) => {
                if ((navId === 'upload_material' || navId === 'admin_portal' || navId === 'question_bank_editor') && !isSuperAdmin(currentUser)) {
                  notify.info("یہ فیچر صرف ایڈمنسٹریٹر کے لیے مخصوص ہے۔ (Admin Access Required)");
                  return;
                }
                setActiveNav(navId);
              }}
              bank={bank}
              selectedClass={selectedClass}
              savedPapers={savedPapers}
              currentUser={currentUser}
            />
          )}

          {/* 3. MATERIAL UPLOAD VIEW (ADMIN ONLY) */}
          {activeNav === 'upload_material' && (
            isSuperAdmin(currentUser) ? (
              <div className="p-4 max-w-7xl mx-auto space-y-4">
                <div className="flex items-center justify-between no-print">
                  <button
                    onClick={() => setActiveNav('dashboard')}
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
                    setActiveNav('generate_paper');
                  }}
                />
              </div>
            ) : (
              <div className="p-8 max-w-md mx-auto text-center space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-bold leading-relaxed">
                  ⚠️ سوالات اور نیا مٹیریل اپلوڈ کرنے کی سہولت صرف ایڈمنسٹریٹر کے لیے مخصوص ہے۔ (Admin Access Required)
                </div>
                <button
                  onClick={() => setActiveNav('dashboard')}
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
                  onClick={() => setActiveNav('dashboard')}
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
                  setActiveNav('generate_paper');
                }}
                onGoToUpload={() => setActiveNav('upload_material')}
              />
            </div>
          )}

          {/* 5. SECONDARY PTM VIEWS (Saved Papers, Past Papers, Model Papers, Teachers, etc.) */}
          {['saved_papers', 'past_papers', 'model_papers', 'teachers', 'papers_history', 'login_history', 'default_paper_settings'].includes(activeNav) && (
            <PTMSecondaryViews
              activeNav={activeNav}
              currentUser={currentUser}
              paperConfig={paperConfig}
              setPaperConfig={setPaperConfig}
              onGoToGenerate={() => setActiveNav('generate_paper')}
              savedPapers={savedPapers}
              onOpenSavedPaper={handleOpenSavedPaper}
              onDeleteSavedPaper={handleDeleteSavedPaper}
              onStartNewPaper={handleStartNewPaper}
              onResumeCurrentDraft={() => {
                setActiveNav('generate_paper');
                setPaperStep('canvas');
              }}
              hasActiveDraft={Boolean(paperData.mcqs?.length || paperData.shortQuestions?.length || paperData.longQuestions?.length)}
              onExportDocx={handleExportDocx}
              onNavigate={handleSafeNavigate}
            />
          )}

          {/* 6. PRICING & SUBSCRIPTION PACKAGES VIEW */}
          {activeNav === 'pricing' && (
            <PricingPlansView
              currentUser={currentUser}
              userSubscribed={userSubscribed}
              onNavigate={handleSafeNavigate}
              onGoToDashboard={() => handleSafeNavigate('dashboard')}
              onLogout={handleLogout}
            />
          )}

          {/* 7. FULL-SCREEN DEDICATED CONTACT & ADMIN SUPPORT HUB */}
          {activeNav === 'contact' && (
            <ContactTeamView
              currentUser={currentUser}
              onGoToGenerate={() => handleSafeNavigate('generate_paper')}
              onResumeCurrentDraft={() => {
                handleSafeNavigate('generate_paper');
                setPaperStep('canvas');
              }}
              hasActiveDraft={Boolean(paperData.mcqs?.length || paperData.shortQuestions?.length || paperData.longQuestions?.length)}
            />
          )}

          {/* 8. AUTOMATIC DATE-SHEET & MONTHLY SYLLABUS TEST PLANNER */}
          {activeNav === 'date_sheet_planner' && (
            <DateSheetPlannerView
              bank={bank}
              selectedClass={selectedClass}
              paperConfig={paperConfig}
              currentUser={currentUser}
              onGoToGenerator={() => handleSafeNavigate('generate_paper')}
              onGenerateSpecificPaper={handleGenerateSpecificPaperFromDateSheet}
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

      {/* GLOBAL PROFESSIONAL CONFIRMATION MODAL */}
      <ConfirmationModal />

    </div>
  );
}
