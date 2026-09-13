import React, { useState, useMemo, useEffect } from 'react';
import { 
  Save, Newspaper, Users, FileClock, Clock, 
  Settings, CheckCircle2, ShieldCheck, Printer, Download,
  ArrowRight, ArrowLeft, X, Sparkles, Landmark, Award, BookOpen,
  Plus, Search, Edit3, Trash2, UserPlus, Mail, Phone, Filter,
  RotateCw, School, Calendar, Activity, CheckCircle,
  Laptop, LogIn, UserCheck, Timer, KeyRound, Ban, Check, Sliders, Lock,
  FileSignature, Eye, EyeOff, Copy, FileText, CheckSquare
} from 'lucide-react';
import { MODEL_PAPERS_CATALOG } from '../utils/modelPapersData';
import { db } from '../firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { notify } from '../utils/notify';
import HeaderConfigPanel from './HeaderConfigPanel';
import DefaultPaperSettingsView from './DefaultPaperSettingsView';
import { 
  getUserStats,
  createTeacherAccount,
  updateUserStatus,
  updateUserSubscription,
  updateUserPassword,
  clearUserActivityLog,
  deleteUserAccount
} from '../utils/userActivityTracker';
import { isSuperAdmin } from '../utils/pricingPlansService';

export default function PTMSecondaryViews({
  activeNav,
  currentUser = null,
  paperConfig,
  setPaperConfig,
  onGoToGenerate,
  savedPapers = [],
  onOpenSavedPaper,
  onDeleteSavedPaper,
  onStartNewPaper,
  onResumeCurrentDraft,
  hasActiveDraft = false,
  onExportDocx,
  onNavigate,
  onBack,
  appLanguage = 'en',
  onToggleLanguage
}) {
  const isUrdu = appLanguage === 'ur';
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [adminActiveTab, setAdminActiveTab] = useState('users'); // 'users' | 'sessions'
  const [userFilterTab, setUserFilterTab] = useState('all'); // 'all' | 'teachers' | 'subscribed' | 'blocked' | 'admin'
  const [selectedPastPaperBoard, setSelectedPastPaperBoard] = useState(null);

  // Model Papers States
  const [selectedModelPaperId, setSelectedModelPaperId] = useState(MODEL_PAPERS_CATALOG[0]?.id || 'grade-12-cs-model-paper-2025-26');
  const [modelPaperTab, setModelPaperTab] = useState('all'); // 'all' | 'objective' | 'subjective'
  const [showAnswerKeys, setShowAnswerKeys] = useState(false);
  const [copiedPaperText, setCopiedPaperText] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState('12th');
  const [activityRefreshTick, setActivityRefreshTick] = useState(0);

  
  const handleCopyModelPaper = (paper) => {
    if (!paper) return;
    try {
      let text = `${paper.fullTitle}\n${paper.class} | Session: ${paper.session}\nTotal Marks: ${paper.totalMarks} | Time Allowed: ${paper.totalTime}\n\n`;
      text += `=====================================\n`;
      text += `${paper.objective.title}\nTotal Marks: ${paper.objective.marks} | Time Allowed: ${paper.objective.time}\n`;
      text += `${paper.objective.instructions}\n`;
      text += `=====================================\n\n`;
      
      paper.objective.questions.forEach((q) => {
        text += `Q${q.qNum}: ${q.question}\n`;
        text += `(a) ${q.options[0]}   (b) ${q.options[1]}   (c) ${q.options[2]}   (d) ${q.options[3]}\n`;
        text += `Correct Answer: ${q.answer} ${q.answerKey}\n\n`;
      });

      text += `=====================================\n`;
      text += `${paper.subjective.title}\nTotal Marks: ${paper.subjective.marks} | Time Allowed: ${paper.subjective.time}\n`;
      text += `=====================================\n\n`;

      text += `--- ${paper.subjective?.section1?.title || 'SECTION I'} ---\n`;
      const shortParts = paper?.subjective?.section1?.parts || paper?.subjective?.section1?.subSections || [];
      shortParts.forEach((part) => {
        text += `\n${part.qNum}: ${part.instruction}\n`;
        (part.questions || []).forEach((q, idx) => {
          const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][idx] || `${idx + 1}`;
          text += `  ${roman}. ${q}\n`;
        });
      });

      text += `\n--- ${paper.subjective.section2.title} ---\n`;
      text += `${paper.subjective.section2.instruction}\n\n`;
      paper.subjective.section2.questions.forEach((q) => {
        text += `${q.qNum}: ${q.question} (${q.marks} Marks)\n`;
      });

      navigator.clipboard.writeText(text).then(() => {
        setCopiedPaperText(true);
        notify.success("Grade 12 Model Paper copied to clipboard!");
        setTimeout(() => setCopiedPaperText(false), 2500);
      }).catch(() => {
        notify.error("Failed to copy paper text");
      });
    } catch (e) {
      notify.error("Error copying paper: " + e.message);
    }
  };

  // Admin User Management States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    institute: 'Educators Academy',
    role: 'Senior Subject Teacher',
    packagePlan: 'Educators Annual',
    expiryDate: '2026-12-31',
    maxPapers: 50
  });

  const [subModalUser, setSubModalUser] = useState(null);
  const [subForm, setSubForm] = useState({
    packagePlan: 'Educators Annual',
    expiryDate: '2026-12-31',
    maxPapers: 50
  });

  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // 1. Create Teacher / User
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      notify.error("Please fill in Name, Email and Password");
      return;
    }
    try {
      const created = await createTeacherAccount(createForm);
      setRegisteredUsers(prev => [created, ...prev.filter(u => u.email?.toLowerCase() !== created.email.toLowerCase())]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        institute: 'Educators Academy',
        role: 'Senior Subject Teacher',
        packagePlan: 'Educators Annual',
        expiryDate: '2026-12-31',
        maxPapers: 50
      });
      notify.success(`Account created successfully for ${created.name}!`);
    } catch (err) {
      notify.error(err.message || "Failed to create account");
    }
  };

  // 2. Toggle Status (Block / Unblock)
  const handleToggleBlock = async (u) => {
    if (u.isAdmin || u.email?.toLowerCase() === 'testgenerator76@gmail.com') {
      notify.error("Super Admin account cannot be blocked!");
      return;
    }
    const nextStatus = u.status === 'blocked' ? 'active' : 'blocked';
    try {
      await updateUserStatus(u.email, nextStatus);
      setRegisteredUsers(prev => prev.map(item => {
        if (item.email?.toLowerCase() === u.email?.toLowerCase()) {
          return { ...item, status: nextStatus };
        }
        return item;
      }));
      if (nextStatus === 'blocked') {
        notify.warning(`User ${u.name || u.email} has been Blocked / Suspended!`);
      } else {
        notify.success(`User ${u.name || u.email} is now Active!`);
      }
    } catch (err) {
      notify.error(err.message || "Failed to update status");
    }
  };

  // 3. Update Subscription & Paper Quota
  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    if (!subModalUser) return;
    try {
      const isNone = subForm.packagePlan.includes('None') || subForm.packagePlan.includes('Unpaid');
      const nextStatus = isNone ? 'unpaid' : 'active';
      await updateUserSubscription(subModalUser.email, {
        ...subForm,
        subscriptionStatus: nextStatus
      });
      setRegisteredUsers(prev => prev.map(item => {
        if (item.email?.toLowerCase() === subModalUser.email?.toLowerCase()) {
          return { 
            ...item, 
            ...subForm, 
            package: subForm.packagePlan, 
            subscriptionStatus: nextStatus 
          };
        }
        return item;
      }));
      setSubModalUser(null);
      notify.success(`Subscription updated for ${subModalUser.name || subModalUser.email}!`);
    } catch (err) {
      notify.error(err.message || "Failed to update subscription");
    }
  };

  // 4. Reset User Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetModalUser || !newPasswordInput.trim()) {
      notify.error("Please enter a new password");
      return;
    }
    try {
      await updateUserPassword(resetModalUser.email, newPasswordInput.trim());
      setRegisteredUsers(prev => prev.map(item => {
        if (item.email?.toLowerCase() === resetModalUser.email?.toLowerCase()) {
          return { ...item, password: newPasswordInput.trim() };
        }
        return item;
      }));
      const uName = resetModalUser.name || resetModalUser.email;
      setResetModalUser(null);
      setNewPasswordInput('');
      notify.success(`Password reset successfully for ${uName}!`);
    } catch (err) {
      notify.error(err.message || "Failed to reset password");
    }
  };

  // 5. Delete User Account
  const handleDeleteUser = async (u) => {
    if (!u || u.isAdmin || u.email === 'testgenerator76@gmail.com') {
      notify.error(isUrdu ? "ایڈمن اکاؤنٹ ڈیلیٹ نہیں کیا جا سکتا۔" : "Super Admin account cannot be deleted.");
      return;
    }
    const uName = u.name || u.email;
    const confirmMsg = isUrdu
      ? `کیا آپ واقعی ${uName} کا اکاؤنٹ مکمل ڈیلیٹ کرنا چاہتے ہیں؟`
      : `Are you sure you want to permanently delete the account for ${uName}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteUserAccount(u.email);
      setRegisteredUsers(prev => prev.filter(item => item.email?.toLowerCase() !== u.email?.toLowerCase()));
      notify.success(isUrdu ? `${uName} کا اکاؤنٹ کامیابی سے حذف کر دیا گیا` : `Account deleted for ${uName}!`);
    } catch (err) {
      notify.error(err.message || "Failed to delete account");
    }
  };

  // Fetch all registered users and login activity from Firestore & Local Storage
  const fetchUsersAndLogs = async () => {
    setIsLoadingUsers(true);
    let usersMap = new Map();

    // 1. Fetch from Firebase Firestore 'users' collection
    try {
      const snap = await getDocs(collection(db, "users"));
      snap.forEach(docSnap => {
        const d = docSnap.data();
        const key = (d.email || docSnap.id).toLowerCase();
        usersMap.set(key, { id: docSnap.id, ...d });
      });
    } catch (e) {
      console.warn("Firestore users fetch note:", e.message);
    }

    // 2. Merge local storage registered users
    try {
      const local = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
      local.forEach(u => {
        if (u.email) {
          const key = u.email.toLowerCase();
          if (!usersMap.has(key)) {
            usersMap.set(key, u);
          } else {
            // Firestore data is authoritative! Stale local cache must not overwrite Firestore data!
            usersMap.set(key, { ...u, ...usersMap.get(key) });
          }
        }
      });
    } catch (e) {}

    // 3. Ensure Admin account is present
    if (!usersMap.has('testgenerator76@gmail.com')) {
      usersMap.set('testgenerator76@gmail.com', {
        name: 'System Administrator',
        email: 'testgenerator76@gmail.com',
        institute: 'Central Examination Board',
        role: 'Super Administrator',
        isAdmin: true,
        createdAt: 'Official Master Account',
        lastLogin: currentUser?.isAdmin ? (currentUser.lastLogin || 'Online Now') : 'Today, 8:45 PM'
      });
    }

    // 4. Ensure current logged-in user is marked as online
    if (currentUser?.email) {
      const currKey = currentUser.email.toLowerCase();
      const existing = usersMap.get(currKey) || {};
      usersMap.set(currKey, {
        ...existing,
        ...currentUser,
        isOnlineNow: true
      });
    }

    setRegisteredUsers(Array.from(usersMap.values()));

    // 5. Fetch login activity logs (from Firestore & Local Storage)
    let logsArr = [];
    try {
      const logsSnap = await getDocs(collection(db, "login_logs"));
      logsSnap.forEach(docSnap => {
        logsArr.push({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (e) {
      console.warn("Firestore login logs fetch note:", e.message);
    }

    try {
      const storedLogs = JSON.parse(localStorage.getItem('ptm_login_logs') || '[]');
      storedLogs.forEach(sl => {
        if (!logsArr.some(item => item.id === sl.id || (item.email === sl.email && item.timestamp === sl.timestamp))) {
          logsArr.push(sl);
        }
      });
    } catch (e) {}

    // Sort by isoTime or timestamp descending
    logsArr.sort((a, b) => new Date(b.isoTime || b.timestamp || 0) - new Date(a.isoTime || a.timestamp || 0));
    setLoginLogs(logsArr.slice(0, 30));

    setIsLoadingUsers(false);
  };

  useEffect(() => {
    if (isSuperAdmin(currentUser) && (activeNav === 'login_history' || activeNav === 'teachers' || activeNav === 'user_management')) {
      fetchUsersAndLogs();
    }
  }, [activeNav, currentUser]);

  useEffect(() => {
    if (activeNav === 'login_history') {
      setAdminActiveTab('sessions');
    } else if (activeNav === 'user_management') {
      setAdminActiveTab('users');
    }
  }, [activeNav]);

  // Teachers & Staff Directory State
  const [teachersList, setTeachersList] = useState(() => {
    try {
      const saved = localStorage.getItem('ptm_teachers_directory_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 't-1',
        name: 'Haris Jabbar',
        role: 'Principal & Exam Controller',
        badge: 'Super Admin',
        email: 'haris.admin@school.edu.pk',
        phone: '+92 300 1234567',
        department: 'Administration',
        subjects: ['All Subjects', 'Supervision'],
        papersCount: 64,
        status: 'Active',
        avatarBg: 'bg-blue-600'
      },
      {
        id: 't-2',
        name: 'Prof. Muhammad Usman',
        role: 'HOD Computer Science',
        badge: 'Senior Examiner',
        email: 'usman.cs@school.edu.pk',
        phone: '+92 312 9876543',
        department: 'Computer Science',
        subjects: ['Computer Science (9th - 12th)'],
        papersCount: 48,
        status: 'Active',
        avatarBg: 'bg-cyan-600'
      },
      {
        id: 't-3',
        name: 'Dr. Ayesha Malik',
        role: 'Senior Physics Specialist',
        badge: 'Paper Setter',
        email: 'ayesha.phy@school.edu.pk',
        phone: '+92 333 4567890',
        department: 'Physics',
        subjects: ['Physics (11th & 12th)'],
        papersCount: 32,
        status: 'Active',
        avatarBg: 'bg-indigo-600'
      },
      {
        id: 't-4',
        name: 'Sir Imran Tariq',
        role: 'Mathematics Faculty Lead',
        badge: 'Senior Teacher',
        email: 'imran.math@school.edu.pk',
        phone: '+92 321 7654321',
        department: 'Mathematics',
        subjects: ['Mathematics (9th & 10th)'],
        papersCount: 26,
        status: 'Active',
        avatarBg: 'bg-amber-600'
      },
      {
        id: 't-5',
        name: 'Miss Sana Javed',
        role: 'Chemistry Lecturer',
        badge: 'Examiner',
        email: 'sana.chem@school.edu.pk',
        phone: '+92 345 6789012',
        department: 'Chemistry',
        subjects: ['Chemistry (11th & 12th)'],
        papersCount: 19,
        status: 'Active',
        avatarBg: 'bg-rose-600'
      },
      {
        id: 't-6',
        name: 'Qari Abdul Rehman',
        role: 'Islamiat & Arabic Head',
        badge: 'Examiner',
        email: 'qari.isl@school.edu.pk',
        phone: '+92 301 2345678',
        department: 'Islamic Studies',
        subjects: ['Islamiat Compulsory', 'Tarjuma-tul-Quran'],
        papersCount: 15,
        status: 'Active',
        avatarBg: 'bg-teal-600'
      }
    ];
  });

  const [teacherSearch, setTeacherSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Subject Teacher',
    badge: 'Examiner',
    department: 'Computer Science',
    subjects: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  // Sync to localStorage
  const updateTeachersList = (newList) => {
    setTeachersList(newList);
    try {
      localStorage.setItem('ptm_teachers_directory_v2', JSON.stringify(newList));
    } catch (e) {}
  };

  const filteredTeachers = useMemo(() => {
    return teachersList.filter(t => {
      const matchesSearch = !teacherSearch.trim() || 
        t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        t.department.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        t.role.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        (t.subjects || []).some(s => s.toLowerCase().includes(teacherSearch.toLowerCase()));

      const matchesDept = departmentFilter === 'ALL' || t.department.toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesDept;
    });
  }, [teachersList, teacherSearch, departmentFilter]);

  if (activeNav === 'default_paper_settings') {
    return (
      <DefaultPaperSettingsView
        paperConfig={paperConfig}
        setPaperConfig={setPaperConfig}
        onGoToGenerate={onGoToGenerate}
        onResumeCurrentDraft={onResumeCurrentDraft}
        hasActiveDraft={hasActiveDraft}
        onBack={onBack}
      />
    );
  }

  if (activeNav === 'saved_papers') {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Save className="w-6 h-6 text-blue-600" />
                <span>Saved Papers Archive</span>
                {isUrdu && <span className="text-sm font-bold text-blue-600 font-sans">• محفوظ شدہ امتحانی پرچے</span>}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isUrdu 
                  ? 'آپ کے تیار کردہ تمام پیپرز کا محفوظ ریکارڈ۔ یہاں سے دوبارہ پرنٹ، ایڈٹ اور ڈاؤنلوڈ کریں۔' 
                  : 'Manage, re-open, print, and download your saved question papers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveDraft && (
              <button
                type="button"
                onClick={onResumeCurrentDraft || onGoToGenerate}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{isUrdu ? '⚡ جاری رکھیں • Resume' : '⚡ Resume Active Paper'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onStartNewPaper || onGoToGenerate}
              className="px-4 py-2 bg-[#007bff] hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isUrdu ? '+ نیا پرچہ بنائیں • New Paper' : '+ Create New Paper'}</span>
            </button>
          </div>
        </div>

        {/* ACTIVE IN-PROGRESS PAPER RESUME BANNER */}
        {hasActiveDraft && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                📝
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-full">
                  Unsaved Draft in Memory
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                  {paperConfig.subject || 'Active Paper'} ({paperConfig.gradeClass || 'Current Class'})
                </h3>
                <p className="text-xs text-slate-600">
                  You have an active paper open in the canvas. You can resume editing without losing any questions!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResumeCurrentDraft || onGoToGenerate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm shrink-0 transition-all cursor-pointer"
            >
              Continue Editing →
            </button>
          </div>
        )}

        {/* SAVED PAPERS LIST */}
        {savedPapers && savedPapers.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>{savedPapers.length} Saved {savedPapers.length === 1 ? 'Paper' : 'Papers'}</span>
              <span>Sorted by Most Recent</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {savedPapers.map((paper) => (
                <div 
                  key={paper.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-extrabold">
                        {paper.subject}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold">
                        {paper.gradeClass}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Marks: <strong className="text-slate-900 font-extrabold">{paper.totalMarks || 50}</strong>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        • Saved: {paper.savedAt || paper.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {paper.title || `${paper.subject} Examination Paper`}
                    </h3>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>MCQs: <strong>{paper.mcqCount || paper.paperData?.mcqs?.length || 0}</strong></span>
                      <span>Shorts: <strong>{paper.shortCount || paper.paperData?.shortQuestions?.length || 0}</strong></span>
                      <span>Longs: <strong>{paper.longCount || paper.paperData?.longQuestions?.length || 0}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenSavedPaper && onOpenSavedPaper(paper)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
                      title="Open paper in Canvas and continue editing"
                    >
                      <span>📝 Open & Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenSavedPaper) {
                          onOpenSavedPaper(paper);
                          setTimeout(() => window.print(), 400);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
                      title="Print this saved paper"
                    >
                      <span>🖨️ Print</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSavedPaper && onDeleteSavedPaper(paper.id)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      title="Delete this saved paper"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-2xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Save className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Saved Papers Yet</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
              Whenever you create a test and click <strong>"Save Paper"</strong> on the paper canvas, it will be automatically archived here so you can re-open, edit, or print it anytime!
            </p>
            <button
              type="button"
              onClick={onStartNewPaper || onGoToGenerate}
              className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Start Building a Paper Now</span>
            </button>
          </div>
        )}
      </div>
    );
  }


  const pastPaperBoards = [
    {
      id: 'fbise',
      name: 'FBISE Islamabad (2020-2025)',
      shortName: 'Federal Board Islamabad',
      urdu: 'فیڈرل بورڈ اسلام آباد',
      tag: 'Federal Board',
      subtitle: 'Official 5-year past papers with complete objective & subjective solved questions.',
      coverage: 'Matric & Intermediate (All Groups)',
      icon: Landmark,
      accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
    },
    {
      id: 'kptb',
      name: 'KPTB Peshawar Board',
      shortName: 'KPK All Boards',
      urdu: 'خیبر پختونخوا ایجوکیشن بورڈز',
      tag: 'KPK Boards',
      subtitle: 'Peshawar, Mardan, Swat, Abbottabad & Malakand past board exam papers archive.',
      coverage: 'Matric & Intermediate (KP Textbook)',
      icon: ShieldCheck,
      accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
    },
    {
      id: 'punjab',
      name: 'Punjab Boards Past Papers',
      shortName: 'Punjab All 9 Boards',
      urdu: 'تمام پنجاب ایجوکیشنل بورڈز',
      tag: 'Punjab Boards',
      subtitle: 'Lahore, Rawalpindi, Gujranwala, Faisalabad, Multan & Sahiwal BISE archives.',
      coverage: 'All Punjab Boards (5-Year Bank)',
      icon: Award,
      accentGradient: 'from-emerald-600 via-teal-600 to-green-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
    }
  ];

  // ==========================================
  // MODEL PAPERS ARCHIVE VIEW (GRADE 12 BOARD SPEC)
  // ==========================================
  if (activeNav === 'model_papers') {
    const selectedPaper = MODEL_PAPERS_CATALOG.find(p => p.id === selectedModelPaperId) || MODEL_PAPERS_CATALOG[0];

    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

    return (
      <div className="w-full max-w-7xl mx-auto p-2.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 font-sans min-w-0 overflow-x-hidden">
        {/* HEADER & TOP CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            )}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shadow-xs shrink-0">
              <FileSignature className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
                  Official Model Papers
                </h1>
                {isUrdu && (
                  <span className="text-sm font-bold text-orange-600 font-sans">
                    • سرکاری ماڈل پیپرز
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] sm:text-xs font-black border border-orange-200 shadow-2xs">
                  {isUrdu ? 'سیشن 2025-2026' : '2025 - 2026 Session'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-bold border border-blue-200">
                  {isUrdu ? 'مکمل نصاب' : 'Full Book Syllabus'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-relaxed break-words">
                {isUrdu 
                  ? 'پنجاب اور فیڈرل بورڈ کے عین مطابق حل شدہ معروضی و انشائیہ ماڈل پرچے مع مکمل جوابی کلید۔'
                  : 'Authentic Punjab & Federal Board examination standard model papers with complete objective & subjective questions.'}
              </p>
            </div>
          </div>

          {/* QUICK ACTIONS BAR (MOBILE PRIORITY: 3-COL ON PHONES, FLEX ROW ON DESKTOP) */}
          <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto sm:flex sm:items-center sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAnswerKeys(!showAnswerKeys)}
              className={`px-1.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs ${
                showAnswerKeys 
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showAnswerKeys ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
              <span className="sm:hidden">{showAnswerKeys ? 'Hide' : 'Keys'}</span>
              <span className="hidden sm:inline">
                {showAnswerKeys 
                  ? (isUrdu ? 'Hide • جوابات چھپائیں' : 'Hide Answers') 
                  : (isUrdu ? 'Keys • جوابی کلید' : 'Reveal Answers')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCopyModelPaper(selectedPaper)}
              className="px-1.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedPaperText ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
              <span className="sm:hidden">{copiedPaperText ? 'Copied' : 'Copy'}</span>
              <span className="hidden sm:inline">
                {copiedPaperText 
                  ? 'Copied!' 
                  : (isUrdu ? 'Copy • پیپر کاپی کریں' : 'Copy Paper')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-1.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Print</span>
              <span className="hidden sm:inline">{isUrdu ? 'Print • پرنٹ کریں' : 'Print Model Paper'}</span>
            </button>
          </div>
        </div>

        {/* CLASS SELECTION TABS (TOUCH-SCROLLABLE WITH NO HORIZONTAL CUTOFF) */}
        <div className="w-full max-w-full min-w-0 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar touch-pan-x">
          <div className="flex items-center gap-1.5 sm:gap-2 w-max min-w-full">
            {[
              { key: '12th', label: '12th Class (Inter Part-II)', available: true, count: '1 Model Paper' },
              { key: '11th', label: '11th Class (Inter Part-I)', available: false, count: 'Coming Soon' },
              { key: '10th', label: '10th Class (Matric Part-II)', available: false, count: 'Coming Soon' },
              { key: '9th', label: '9th Class (Matric Part-I)', available: false, count: 'Coming Soon' }
            ].map((cls) => (
              <button
                key={cls.key}
                type="button"
                onClick={() => {
                  if (cls.available) setSelectedClassFilter(cls.key);
                  else notify.info(`${cls.label} model papers are being compiled according to the 2026 syllabus.`);
                }}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap cursor-pointer shadow-2xs ${
                  selectedClassFilter === cls.key
                    ? 'bg-orange-600 text-white shadow-md'
                    : cls.available
                    ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
                }`}
              >
                <span>{cls.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  selectedClassFilter === cls.key 
                    ? 'bg-white/20 text-white' 
                    : cls.available 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {cls.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* PAPER HERO BANNER (MOBILE-OPTIMIZED GRID & SCALING) */}
        <div className="w-full max-w-full min-w-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-6 min-w-0">
            <div className="space-y-1.5 sm:space-y-2 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-orange-500 text-white text-[10px] sm:text-[11px] font-black rounded-full uppercase tracking-wider shadow-xs">
                  {selectedPaper.badge}
                </span>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 text-white/90 text-[10px] sm:text-[11px] font-bold rounded-full border border-white/20">
                  {selectedPaper.board}
                </span>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-bold rounded-full border border-emerald-500/30">
                  Session {selectedPaper.session}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight break-words">
                {selectedPaper.subject}
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed break-words">
                {selectedPaper.class} — {selectedPaper.description}
              </p>
            </div>

            {/* MARKS & DURATION STATS (CLEAN 2x2 ON MOBILE, 4-IN-A-ROW ON TABLET/DESKTOP) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full lg:w-auto shrink-0 mt-1 lg:mt-0 min-w-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 text-center min-w-0">
                <div className="text-lg sm:text-2xl font-black text-orange-400 leading-tight">{selectedPaper.totalMarks}</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5 truncate">Total Marks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 text-center min-w-0">
                <div className="text-base sm:text-xl font-black text-white leading-tight">{selectedPaper.objectiveMarks}</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5 truncate">Part 1 (MCQs)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 text-center min-w-0">
                <div className="text-base sm:text-xl font-black text-white leading-tight">{selectedPaper.subjectiveMarks}</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5 truncate">Part 2 (Subj)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 text-center min-w-0">
                <div className="text-base sm:text-base font-black text-emerald-400 leading-tight">2h 30m</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5 truncate">Total Time</div>
              </div>
            </div>
          </div>

          {/* VIEW TAB SWITCHER (RESPONSIVE TOUCH TABS) */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
            <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-black/40 p-1 sm:p-1.5 rounded-xl border border-white/10 w-full sm:w-auto min-w-0">
              <button
                type="button"
                onClick={() => setModelPaperTab('all')}
                className={`px-1.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center cursor-pointer min-w-0 ${
                  modelPaperTab === 'all' 
                    ? 'bg-orange-500 text-white shadow-xs' 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="sm:hidden truncate block">All (75M)</span>
                <span className="hidden sm:inline">Complete Paper (All 75 Marks)</span>
              </button>
              <button
                type="button"
                onClick={() => setModelPaperTab('objective')}
                className={`px-1.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center cursor-pointer min-w-0 ${
                  modelPaperTab === 'objective' 
                    ? 'bg-orange-500 text-white shadow-xs' 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="sm:hidden truncate block">MCQs (15M)</span>
                <span className="hidden sm:inline">Part 1: Objective (15 MCQs)</span>
              </button>
              <button
                type="button"
                onClick={() => setModelPaperTab('subjective')}
                className={`px-1.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center cursor-pointer min-w-0 ${
                  modelPaperTab === 'subjective' 
                    ? 'bg-orange-500 text-white shadow-xs' 
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="sm:hidden truncate block">Subj (60M)</span>
                <span className="hidden sm:inline">Part 2: Subjective (60 Marks)</span>
              </button>
            </div>

            <div className="text-[11px] sm:text-xs text-indigo-200 font-semibold flex items-center justify-between sm:justify-start gap-1.5 min-w-0">
              <span>Section:</span>
              <strong className="text-white truncate">
                {modelPaperTab === 'all' ? 'Objective + Subjective' : modelPaperTab === 'objective' ? '15 MCQs Only' : 'Shorts & Longs Only'}
              </strong>
            </div>
          </div>
        </div>

        {/* PRINTABLE PAPER CONTAINER (MOBILE-OPTIMIZED GAP & PADDING) */}
        <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">

          {/* ========================================================= */}
          {/* PART 1: OBJECTIVE (15 MARKS)                              */}
          {/* ========================================================= */}
          {(modelPaperTab === 'all' || modelPaperTab === 'objective') && (
            <div className="w-full max-w-full min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Objective Header */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-3.5 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight break-words">
                      {selectedPaper.objective.title} — MULTIPLE CHOICE QUESTIONS
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 leading-relaxed break-words">
                    {selectedPaper.objective.instructions}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 flex-wrap">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-100 text-amber-900 font-black text-[10px] sm:text-xs rounded-lg sm:rounded-xl border border-amber-200">
                    Marks: {selectedPaper.objective.marks}
                  </span>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl border border-slate-200">
                    Time: {selectedPaper.objective.time}
                  </span>
                </div>
              </div>

              {/* MCQs Grid (1 Column on Mobile, 2 Columns on Desktop) */}
              <div className="p-3 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                {(selectedPaper?.objective?.questions || []).map((q) => {
                  const optionLetters = ['(a)', '(b)', '(c)', '(d)'];

                  return (
                    <div 
                      key={q.qNum}
                      className="p-3 sm:p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-orange-300 transition-all space-y-2.5 sm:space-y-3 shadow-2xs group flex flex-col justify-between min-w-0"
                    >
                      <div className="min-w-0">
                        {/* Question Statement */}
                        <div className="flex items-start gap-2 sm:gap-2.5 min-w-0">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-orange-100 text-orange-700 font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            {q.qNum}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-words flex-1 min-w-0">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options Grid (Mobile-friendly Wrapping & Spacing) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mt-2 sm:mt-3 pl-0 sm:pl-7 min-w-0">
                          {(q.options || []).map((opt, optIdx) => {
                            const isCorrect = showAnswerKeys && optIdx === q.correctIndex;

                            return (
                              <div
                                key={optIdx}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-start sm:items-center gap-1.5 break-words min-w-0 ${
                                  isCorrect
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`text-[11px] font-bold shrink-0 mt-0.5 sm:mt-0 ${isCorrect ? 'text-emerald-700' : 'text-slate-400'}`}>
                                  {optionLetters[optIdx]}
                                </span>
                                <span className="break-words flex-1 leading-snug min-w-0">{opt}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0 mt-0.5 sm:mt-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Answer Key Footer */}
                      {showAnswerKeys && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-[11px] pl-0 sm:pl-7 min-w-0">
                          <span className="text-emerald-700 font-bold flex items-center gap-1 min-w-0">
                            <Check className="w-3.5 h-3.5 shrink-0" /> Correct: <strong className="break-words">{q.answer} {q.answerKey}</strong>
                          </span>
                          <span className="text-slate-400 font-mono text-[9px] sm:text-[10px] shrink-0">1 Mark</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PART 2: SUBJECTIVE (60 MARKS)                             */}
          {/* ========================================================= */}
          {(modelPaperTab === 'all' || modelPaperTab === 'subjective') && (
            <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
              
              {/* SECTION I: SHORT QUESTIONS */}
              <div className="w-full max-w-full min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Subjective Section I Header */}
                <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent p-3.5 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight break-words">
                        {selectedPaper?.subjective?.title || 'PART 2: SUBJECTIVE'} — {selectedPaper?.subjective?.section1?.title || 'SECTION I'}
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 leading-relaxed break-words">
                      {selectedPaper?.subjective?.section1?.totalMarks || selectedPaper?.subjective?.section1?.marks || 36} Marks total across Q #2, Q #3, and Q #4 (Attempt any 6 from each)
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 flex-wrap">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-900 font-black text-[10px] sm:text-xs rounded-lg sm:rounded-xl border border-blue-200">
                      Total: {selectedPaper?.subjective?.section1?.totalMarks || selectedPaper?.subjective?.section1?.marks || 36} Marks
                    </span>
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl border border-slate-200">
                      Time: {selectedPaper?.subjective?.time || '2 Hours 10 Minutes'}
                    </span>
                  </div>
                </div>

                {/* Question Sets (Q2, Q3, Q4) */}
                <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
                  {(selectedPaper?.subjective?.section1?.parts || selectedPaper?.subjective?.section1?.subSections || []).map((part) => (
                    <div key={part.qNum} className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 bg-slate-50/40 space-y-3 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-200 pb-2.5 sm:pb-3 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-600 text-white font-black text-xs rounded-lg shadow-2xs shrink-0">
                            {part.qNum}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 break-words flex-1 min-w-0">
                            {part.instruction}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold rounded-md sm:rounded-lg shrink-0 self-start sm:self-auto">
                          Attempt {part.required || 6} of {(part.questions || []).length} • {part.totalMarks || 12} Marks
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 pt-1 min-w-0">
                        {(part.questions || []).map((qText, qIdx) => (
                          <div 
                            key={qIdx}
                            className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all flex items-start gap-2 sm:gap-2.5 shadow-2xs group min-w-0"
                          >
                            <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 font-black text-[10px] sm:text-[11px] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {romanNumerals[qIdx] || qIdx + 1}
                            </span>
                            <p className="text-xs font-semibold text-slate-800 leading-relaxed break-words flex-1 min-w-0">
                              {qText}
                            </p>
                            <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-1 mt-0.5">
                              2M
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION II: LONG / DESCRIPTIVE QUESTIONS */}
              <div className="w-full max-w-full min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Subjective Section II Header */}
                <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent p-3.5 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight break-words">
                        {selectedPaper?.subjective?.section2?.title || 'SECTION II'}
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5 leading-relaxed break-words">
                      {selectedPaper?.subjective?.section2?.instruction || 'Note: Attempt any THREE descriptive questions.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 flex-wrap">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-900 font-black text-[10px] sm:text-xs rounded-lg sm:rounded-xl border border-purple-200">
                      Total: {selectedPaper?.subjective?.section2?.totalMarks || 24} Marks
                    </span>
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl">
                      Attempt {selectedPaper?.subjective?.section2?.required || 3} of {(selectedPaper?.subjective?.section2?.questions || []).length}
                    </span>
                  </div>
                </div>

                {/* Long Questions List */}
                <div className="p-3 sm:p-6 space-y-2.5 sm:space-y-3 min-w-0">
                  {(selectedPaper?.subjective?.section2?.questions || []).map((lq) => (
                    <div 
                      key={lq.qNum}
                      className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 shadow-2xs group min-w-0"
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-purple-100 text-purple-800 font-black text-xs group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 self-start">
                          {lq.qNum}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-words flex-1 min-w-0">
                          {lq.question}
                        </p>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start shrink-0">
                        <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] sm:text-xs font-black border border-purple-200">
                          {lq.marks} Marks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER NOTICE (MOBILE FULL-WIDTH ACTION) */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="leading-relaxed">Compiled strictly in accordance with Punjab & Federal Curriculum & Textbook Board (PCTB/FBISE) 2025-2026.</span>
          </div>
          <button
            type="button"
            onClick={() => onGoToGenerate?.()}
            className="w-full sm:w-auto text-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            Create Custom Paper From Bank &rarr;
          </button>
        </div>

      </div>
    );
  }

  if (activeNav === 'past_papers') {
    return (
      <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-7 relative font-sans">
        {/* HEADER & BREADCRUMB */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            )}
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center shadow-xs">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Past Papers Archive
                </h1>
                {isUrdu && (
                  <span className="text-sm font-bold text-blue-600 font-sans">
                    • بورڈ کے 5 سالہ پرچے
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
                  {isUrdu ? '5 سالہ پرچے 2020-2025' : '2020 - 2025'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isUrdu 
                  ? 'فیڈرل، لاہور، راولپنڈی اور تمام پنجاب بورڈز کے 5 سالہ حل شدہ پرچے اور معروضی سوالات۔'
                  : 'FBISE, BISE Lahore, Rawalpindi, and KP Board official past exam papers & solved questions'}
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">{isUrdu ? 'ریکارڈ:' : 'Archive:'}</span>
            <span className="text-blue-700 font-bold">{isUrdu ? '5 سالہ حل شدہ امتحانات' : '5-Year Board Papers'}</span>
          </div>
        </div>

        {/* PROFESSIONAL PAST PAPERS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
          {pastPaperBoards.map((board) => {
            const IconComponent = board.icon;

            return (
              <div
                key={board.id}
                onClick={() => setSelectedPastPaperBoard(board)}
                className="group relative cursor-pointer select-none rounded-2xl bg-white p-5 sm:p-6 shadow-xs hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-blue-400 overflow-hidden flex flex-col justify-between min-h-[270px]"
              >
                {/* Top Accent Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${board.accentGradient}`} />

                {/* Card Header Row */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${board.badgeBg}`}>
                      {board.tag}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  </div>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xs ${board.iconBg}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="my-2 space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                    {board.name}
                  </h2>

                  <div className="pt-0.5">
                    <span className="text-base sm:text-lg font-bold font-urdu text-slate-700 block">
                      {board.urdu}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 pt-0.5 leading-relaxed">
                    {board.subtitle}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 text-[10px] font-bold">
                      📋 {board.coverage}
                    </span>
                  </div>
                </div>

                {/* Card Bottom Interactive Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                    <span>Data Entry Underway</span>
                  </span>
                  
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Subtle Ambient Hover Backdrop */}
                <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/20 transition-colors pointer-events-none rounded-2xl" />
              </div>
            );
          })}
        </div>

        {/* BILINGUAL "DATA ENTRY IN PROGRESS" MODAL */}
        {selectedPastPaperBoard && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedPastPaperBoard(null)}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scaleUp relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Gradient Banner with Animated Icon */}
              <div className={`p-6 bg-gradient-to-r ${selectedPastPaperBoard.accentGradient} text-white relative overflow-hidden`}>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
                      <Clock className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block">
                        Past Papers Archive Digitization
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                        {selectedPastPaperBoard.shortName}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPastPaperBoard(null)}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Close Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content: English & Urdu Information */}
              <div className="p-6 space-y-5">
                {/* English Section */}
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <h4 className="text-base font-black text-slate-900 tracking-tight">
                      Past Papers Data Entry in Progress!
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We are actively uploading, digitizing, and categorizing the complete 5-year past board exam papers (2020–2025) with verified objective & subjective solution keys for <strong>{selectedPastPaperBoard.name}</strong>. You will be able to browse and generate past-paper-based tests very soon!
                  </p>
                </div>

                {/* Urdu Section */}
                <div className="space-y-1.5 bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-right" dir="rtl">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-lg font-black font-urdu text-amber-950">
                      پاسٹ پیپرز ڈیٹا انٹری کا کام تیزی سے جاری ہے!
                    </h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200/80 text-amber-900">
                      عنقریب دستیاب
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-urdu text-amber-900 leading-relaxed">
                    اس تعلیمی بورڈ (<strong>{selectedPastPaperBoard.urdu}</strong>) کے گذشتہ 5 سالہ امتحانی پرچہ جات (معروضی، مختصر اور تفصیلی سوالات مع تصدیق شدہ حل) کی ڈیٹا انٹری اور آرکائیو تیاری پر کام جاری ہے۔ آپ بہت جلد مکمل امتحانی پرچے حاصل کر سکیں گے اور باآسانی ٹیسٹ بنا سکیں گے۔
                  </p>
                </div>

                {/* Verified Feature Points */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>2020-2025 Past Exams</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% Verified Keys</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedPastPaperBoard(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close / بند کریں
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPastPaperBoard(null);
                    onGoToGenerate();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Go to Paper Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleOpenAddStaff = () => {
    setEditingStaffId(null);
    setStaffForm({
      name: '',
      role: 'Subject Teacher',
      badge: 'Examiner',
      department: 'Computer Science',
      subjects: 'Computer Science',
      email: '',
      phone: '',
      status: 'Active'
    });
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staff) => {
    setEditingStaffId(staff.id);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      badge: staff.badge || 'Examiner',
      department: staff.department,
      subjects: (staff.subjects || []).join(', '),
      email: staff.email || '',
      phone: staff.phone || '',
      status: staff.status || 'Active'
    });
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffForm.name.trim()) {
      notify.warning("Please enter teacher's name.");
      return;
    }

    const subs = staffForm.subjects.split(',').map(s => s.trim()).filter(Boolean);

    if (editingStaffId) {
      const updated = teachersList.map(t => t.id === editingStaffId ? {
        ...t,
        ...staffForm,
        subjects: subs.length > 0 ? subs : [staffForm.department]
      } : t);
      updateTeachersList(updated);
      notify.success("Teacher profile updated successfully!");
    } else {
      const newMember = {
        id: `t-${Date.now()}`,
        ...staffForm,
        subjects: subs.length > 0 ? subs : [staffForm.department],
        papersCount: 0,
        avatarBg: 'bg-blue-600'
      };
      updateTeachersList([newMember, ...teachersList]);
      notify.success("New faculty member added successfully!");
    }

    setIsStaffModalOpen(false);
    setEditingStaffId(null);
  };

  const toggleTeacherStatus = (id) => {
    const updated = teachersList.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Active' ? 'On Leave' : 'Active';
        notify.info(`${t.name} status set to ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    });
    updateTeachersList(updated);
  };

  const handleDeleteTeacher = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from faculty?`)) {
      const updated = teachersList.filter(t => t.id !== id);
      updateTeachersList(updated);
      notify.success(`${name} removed from faculty directory.`);
    }
  };


  const totalFacultyCount = teachersList.length;
  const activeFacultyCount = teachersList.filter(t => t.status === 'Active').length;
  const totalPapersCreated = teachersList.reduce((acc, t) => acc + (t.papersCount || 0), 0);
  const departmentsCount = new Set(teachersList.map(t => t.department)).size;

  if (activeNav === 'teachers') {
    if (!currentUser?.isAdmin) {
      return (
        <div className="p-4 sm:p-8 max-w-2xl mx-auto my-12 text-center bg-white rounded-3xl border border-red-200 shadow-xl space-y-4 font-sans animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            ایڈمن سیکیورٹی پروٹیکشن (Access Restricted)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            اساتذہ کی فہرست اور مینجمنٹ صرف سپروائزر ایڈمنسٹریٹر کے لیے مختص ہے۔ بطور استاد آپ صرف اپنے ذاتی پیپرز اور سرگرمی دیکھ سکتے ہیں۔
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              ڈیش بورڈ پر جائیں (Back to Dashboard)
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-7 relative font-sans">
        
        {/* HEADER & QUICK ACTION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Teachers & Staff Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
                  Faculty Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Assign subject papers, review exam authoring permissions, and manage staff credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddStaff}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Teacher</span>
          </button>
        </div>

        {/* 4 STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Faculty
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {totalFacultyCount} Members
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Examiners
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">
                {activeFacultyCount} Active
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Papers Generated
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 block">
                {totalPapersCreated} Papers
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Departments
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
                {departmentsCount} Subjects
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              placeholder="Search faculty by teacher name, subject, or role..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['ALL', 'Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Administration'].map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  departmentFilter.toLowerCase() === dept.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* TEACHERS DIRECTORY TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Teacher / Faculty Member</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Assigned Subjects</th>
                  <th className="py-3.5 px-4 text-center">Exam Papers</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-bold text-sm text-slate-600">No teachers found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try clearing your search query or department filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const initials = teacher.name.split(' ').map(n => n[0]).slice(0, 2).join('');
                    const isActive = teacher.status === 'Active';

                    return (
                      <tr 
                        key={teacher.id} 
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        {/* Member Identity */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${teacher.avatarBg || 'bg-blue-600'} text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0`}>
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {teacher.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                                  {teacher.badge || 'Faculty'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                                {teacher.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Department & Role */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-800 text-xs block">
                            {teacher.department}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {teacher.role}
                          </span>
                        </td>

                        {/* Assigned Subjects */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
                            {(teacher.subjects || []).map((sub, sIdx) => (
                              <span 
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Papers Count */}
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-[11px]">
                            {teacher.papersCount || 0}
                          </span>
                        </td>

                        {/* Status Toggle Button */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleTeacherStatus(teacher.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                              isActive 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                            }`}
                            title="Click to toggle status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span>{teacher.status}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStaff(teacher)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Edit Teacher"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Teacher"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD / EDIT TEACHER MODAL */}
        {isStaffModalOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setIsStaffModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-white">
                      {editingStaffId ? 'Edit Faculty Profile' : 'Add New Teacher'}
                    </h3>
                    <span className="text-xs text-white/80 font-medium">
                      Assign subjects and examination roles
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveStaff} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    placeholder="e.g. Prof. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department</label>
                    <select
                      value={staffForm.department}
                      onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Islamic Studies">Islamic Studies</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Role / Designation</label>
                    <input
                      type="text"
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      placeholder="e.g. Senior Lecturer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Subjects (comma separated)</label>
                  <input
                    type="text"
                    value={staffForm.subjects}
                    onChange={(e) => setStaffForm({ ...staffForm, subjects: e.target.value })}
                    placeholder="e.g. Physics 11th, Physics 12th"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      placeholder="tariq@school.edu.pk"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsStaffModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                  >
                    {editingStaffId ? 'Update Teacher' : 'Save Teacher'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  if (activeNav === 'papers_history') {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 font-sans">
        <div className="border-b border-slate-200 pb-3">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Papers History</h1>
          <p className="text-xs text-slate-500 font-medium">Audit log of all recently generated examination papers</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-2xs">
          <FileClock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">No recent generation logs to display.</p>
        </div>
      </div>
    );
  }

  if (activeNav === 'login_history' || activeNav === 'user_management') {
    // -------------------------------------------------------------
    // TEACHER PERSONAL ACTIVITY & STATS VIEW (STRICTLY NO ADMIN OR OTHER USERS DATA)
    // -------------------------------------------------------------
    if (!isSuperAdmin(currentUser)) {
      if (activeNav === 'user_management') {
        return (
          <div className="p-4 sm:p-8 max-w-2xl mx-auto my-12 text-center bg-white rounded-3xl border border-red-200 shadow-xl space-y-4 font-sans animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {isUrdu ? 'ایڈمن سیکیورٹی پروٹیکشن (رسائی محدود ہے)' : 'Admin Security Protection (Access Restricted)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {isUrdu 
                ? 'یوزر مینجمنٹ اور تمام رجسٹرڈ اکاؤنٹس کی تفصیل صرف سپروائزر ایڈمنسٹریٹر کے لیے مختص ہے۔ بطور استاد آپ صرف اپنا ذاتی اکاؤنٹ اور پیپرز استعمال کر سکتے ہیں۔'
                : 'User Management and registered accounts control is strictly restricted to Super Administrator.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                {isUrdu ? 'ڈیش بورڈ پر جائیں (Back to Dashboard)' : 'Back to Dashboard'}
              </button>
            </div>
          </div>
        );
      }

      const userStats = getUserStats(currentUser?.email);
      const teacherName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Teacher';
      const teacherInitial = teacherName.charAt(0).toUpperCase();
      const teacherInstitute = currentUser?.institute || 'Educators Academy';
      const teacherRole = currentUser?.role || 'Senior Subject Teacher';
      const teacherCreatedPapers = Math.max(userStats.createdCount, savedPapers.length);
      const teacherDeletedPapers = userStats.deletedCount;
      const teacherLoginCount = userStats.loginCount;
      const teacherLastLogin = currentUser?.lastLogin || 'Online Now';

      return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 font-sans animate-fadeIn">
          {/* Header with Title and Privacy Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  محفوظ ذاتی ریکارڈ (Private Teacher Portal)
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  اکاؤنٹ فعال (Active & Verified)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                میری سرگرمی اور ذاتی شماریات (My Activity & Stats)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                آپ کے بنائے گئے پیپرز، ڈیلیٹ کیے گئے پیپرز، اور لاگ ان سرگرمی کا محفوظ ذاتی ریکارڈ
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('generate_paper')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>نیا پیپر بنائیں (Generate Paper)</span>
              </button>
            </div>
          </div>

          {/* Privacy Security Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-xs sm:text-sm">
                  مکمل ذاتی ڈیٹا سیکیورٹی (100% Isolated Data)
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  یہ ڈیش بورڈ صرف آپ کے ذاتی اکاؤنٹ کے لیے مخصوص ہے۔ ایڈمن اور دیگر تمام اساتذہ کا ڈیٹا الگ، محفوظ اور انکرپٹڈ ہے۔
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 font-bold rounded-xl text-[11px] self-start md:self-auto shrink-0 shadow-2xs flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              پرائیویٹ رسائی (Only You)
            </span>
          </div>

          {/* 4 MAIN STAT CARDS (EXACTLY AS REQUESTED) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Papers Created */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold">کل بنائے گئے پیپرز</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-black text-slate-800 tracking-tight">{teacherCreatedPapers}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Papers Created & Saved</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                <button 
                  onClick={() => onNavigate && onNavigate('saved_papers')}
                  className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Saved Papers دیکھیں</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 2. Papers Deleted */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold">ڈیلیٹ کیے گئے پیپرز</span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-black text-rose-600 tracking-tight">{teacherDeletedPapers}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Papers Removed from Archive</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-400">
                <span>صاف ستھرا آرکائیو ریکارڈ</span>
              </div>
            </div>

            {/* 3. Total Logins */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold">کل لاگ انز کی تعداد</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <LogIn className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-black text-amber-700 tracking-tight">{teacherLoginCount}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total Successful Logins</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>محفوظ سیشن (Secure Session)</span>
              </div>
            </div>

            {/* 4. Last Login Time & Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold">آخری بار لاگ ان</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-black text-slate-800 truncate">{teacherLastLogin}</p>
                <span className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  موجودہ سیشن آن لائن
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-500">
                <span>Active Teacher Session</span>
              </div>
            </div>

          </div>

          {/* TEACHER PROFILE & ACCOUNT INFORMATION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                {teacherInitial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                    {teacherName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                    Senior Faculty
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser?.email}
                </p>
                <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5 mt-0.5">
                  <School className="w-3.5 h-3.5 text-blue-600" />
                  {teacherInstitute}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">عہدہ / ROLE</span>
                <span className="font-bold text-slate-800">{teacherRole}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">اکاؤنٹ میعاد / EXPIRY</span>
                <span className="font-bold text-emerald-700">31-12-2026</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">رسائی سٹیٹس / ACCESS</span>
                <span className="font-bold text-blue-700">Full Teacher Access</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">سیکیورٹی پروٹیکشن</span>
                <span className="font-bold text-emerald-700">End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* TEACHER'S PERSONAL ACTIVITY TIMELINE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <FileClock className="w-4 h-4 text-blue-600" />
                <h3 className="font-black text-slate-800 text-xs sm:text-sm">
                  میری ذاتی سرگرمی کی ٹائم لائن (Personal Activity Log)
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  تازہ ترین {userStats.activityLog?.length || 0} سرگرمیاں (Recent 15)
                </span>
                {userStats.activityLog && userStats.activityLog.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("کیا آپ واقعی اپنی سرگرمی ہسٹری (Activity Log) صاف کرنا چاہتے ہیں؟")) {
                        clearUserActivityLog(currentUser?.email);
                        notify.success("سرگرمی لاگ کامیابی سے صاف کر دیا گیا!");
                        setActivityRefreshTick(t => t + 1);
                      }
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                    title="Clear recent activity history"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>صاف کریں</span>
                  </button>
                )}
              </div>
            </div>

            {(!userStats.activityLog || userStats.activityLog.length === 0) ? (
              <div className="py-10 text-center text-slate-400 text-xs font-medium space-y-1">
                <p>آپ کا اکاؤنٹ کامیابی سے فعال ہے۔</p>
                <p className="text-[11px] text-slate-400">
                  جیسے جیسے آپ نئے پیپرز بنائیں گے یا ڈیلیٹ کریں گے، وہ اس محفوظ ذاتی لاگ میں نظر آئیں گے۔
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userStats.activityLog.map((act) => (
                  <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        act.type === 'create' ? 'bg-blue-100 text-blue-700' :
                        act.type === 'delete' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {act.type === 'create' ? <Newspaper className="w-4 h-4" /> :
                         act.type === 'delete' ? <Trash2 className="w-4 h-4" /> :
                         <LogIn className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800 text-xs">{act.title}</span>
                          <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                            act.type === 'create' ? 'bg-blue-100 text-blue-800' :
                            act.type === 'delete' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {act.type === 'create' ? 'Paper Created' : act.type === 'delete' ? 'Paper Deleted' : 'Login'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                          {act.timestamp}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold self-end sm:self-auto">
                      ✓ Recorded
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      );
    }

    // -------------------------------------------------------------
    // ADMIN USER MANAGEMENT & AUDIT VIEW (Super Admin Control Hub)
    // -------------------------------------------------------------
    const totalUsers = registeredUsers.length;
    const activeTeachersCount = registeredUsers.filter(u => !u.isAdmin && u.status !== 'blocked').length;
    const blockedCount = registeredUsers.filter(u => u.status === 'blocked').length;
    const subscribedCount = registeredUsers.filter(u => !u.isAdmin && u.package && u.package !== 'None' && u.subscriptionStatus !== 'unpaid').length;
    const adminCount = registeredUsers.filter(u => u.isAdmin).length;
    const onlineCount = registeredUsers.filter(u => u.isOnlineNow).length || 1;

    const queryStr = userSearchQuery.trim().toLowerCase();
    const displayUsers = registeredUsers.filter(u => {
      // 1. Tab filter
      if (userFilterTab === 'teachers' && u.isAdmin) return false;
      if (userFilterTab === 'blocked' && u.status !== 'blocked') return false;
      if (userFilterTab === 'subscribed' && (!u.package || u.package === 'None' || u.subscriptionStatus === 'unpaid')) return false;
      if (userFilterTab === 'admin' && !u.isAdmin) return false;

      // 2. Search query filter
      if (!queryStr) return true;
      return (
        (u.name && u.name.toLowerCase().includes(queryStr)) ||
        (u.email && u.email.toLowerCase().includes(queryStr)) ||
        (u.institute && u.institute.toLowerCase().includes(queryStr)) ||
        (u.role && u.role.toLowerCase().includes(queryStr)) ||
        (u.phone && u.phone.includes(queryStr)) ||
        (u.phoneStd && u.phoneStd.includes(queryStr))
      );
    });

    return (
      <div className="w-full max-w-full p-3 sm:p-5 lg:p-7 space-y-5 font-sans animate-fadeIn box-border min-w-0">
        {/* Header with Title and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
                {isUrdu ? 'سپروائزر ایڈمن پورٹل' : 'Super Admin Master Hub'}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {isUrdu ? 'لائیو ماسٹر ڈیٹا بیس فعال' : 'Live Master Database Connected'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
              {isUrdu ? 'یوزر مینجمنٹ و رجسٹرڈ اساتذہ کنٹرول سینٹر' : 'User Management & Accounts Control Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {isUrdu 
                ? 'تمام رجسٹرڈ اساتذہ، پاسورڈز، پیکیجز، اکاؤنٹس بلاک/ایکٹیو اور لائیو لاگ ان سیشن لاگز کا مکمل کنٹرول'
                : 'Central directory of all registered teachers, passwords reveal, subscription plans, quota & session audit'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isUrdu ? '+ نیا استاد رجسٹر کریں' : '+ Create New Teacher'}</span>
            </button>
            <button
              type="button"
              onClick={fetchUsersAndLogs}
              disabled={isLoadingUsers}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>{isLoadingUsers ? (isUrdu ? 'تازہ ہو رہا ہے...' : 'Refreshing...') : (isUrdu ? 'ڈیٹا ریفریش کریں' : 'Refresh Data')}</span>
            </button>
          </div>
        </div>

        {/* PRIMARY VIEW SWITCHER TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAdminActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              adminActiveTab === 'users'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.01]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isUrdu ? 'تمام رجسٹرڈ اکاؤنٹس و پاسورڈز' : 'Registered Users & Passwords'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              adminActiveTab === 'users' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {totalUsers}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminActiveTab('sessions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              adminActiveTab === 'sessions'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.01]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isUrdu ? 'حالیہ لاگ ان سرگرمی لاگز' : 'Live Login & Session Logs'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              adminActiveTab === 'sessions' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {loginLogs.length}
            </span>
          </button>
        </div>

        {/* Security Policy Reminder Box */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 border border-blue-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
              <Timer className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-800 text-xs sm:text-sm">
                Staff Security Timeout (5-Minute Inactivity Protection)
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Teachers and staff sessions automatically terminate after 5 minutes of inactivity. Super Administrator sessions remain active with permanent access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/90 border border-emerald-300 font-bold text-emerald-800 text-[11px] shadow-2xs whitespace-nowrap">
              ✓ Admin: Unlimited
            </span>
            <span className="px-3 py-1 rounded-full bg-white/90 border border-blue-300 font-bold text-blue-800 text-[11px] shadow-2xs whitespace-nowrap">
              ⏱ Teachers: 5 Min
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px] font-bold">{isUrdu ? 'کل اکاؤنٹس' : 'Total Accounts'}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 mt-1.5">{totalUsers}</p>
            <span className="text-[10px] text-slate-400 font-medium">{isUrdu ? 'تمام رجسٹرڈ اکاؤنٹس' : 'All Registered Accounts'}</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px] font-bold">{isUrdu ? 'فعال اساتذہ' : 'Active Faculty'}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-1.5">{activeTeachersCount}</p>
            <span className="text-[10px] text-emerald-600 font-medium">{isUrdu ? 'فعال تصدیق شدہ اساتذہ' : 'Active Verified Teachers'}</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px] font-bold">{isUrdu ? 'پیکیج ہولڈرز' : 'Subscribed Users'}</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-700 mt-1.5">{subscribedCount}</p>
            <span className="text-[10px] text-purple-600 font-medium">{isUrdu ? 'منظور شدہ پیکیجز' : 'Paid & Active Plans'}</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px] font-bold">{isUrdu ? 'بلاک شدہ اکاؤنٹس' : 'Suspended Access'}</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Ban className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-600 mt-1.5">{blockedCount}</p>
            <span className="text-[10px] text-rose-600 font-medium">{isUrdu ? 'معطل اکاؤنٹس' : 'Suspended Users'}</span>
          </div>
        </div>

        {/* TAB 1: REGISTERED USERS DIRECTORY */}
        {adminActiveTab === 'users' && (
          <div className="space-y-4">
            {/* Quick Filter Pills + Search Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: isUrdu ? 'تمام' : 'All', count: totalUsers },
                  { id: 'teachers', label: isUrdu ? 'اساتذہ' : 'Teachers', count: activeTeachersCount },
                  { id: 'subscribed', label: isUrdu ? 'پیکیج والے' : 'Subscribed', count: subscribedCount },
                  { id: 'blocked', label: isUrdu ? 'بلاک شدہ' : 'Blocked', count: blockedCount },
                  { id: 'admin', label: isUrdu ? 'ایڈمن' : 'Admins', count: adminCount }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setUserFilterTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      userFilterTab === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      userFilterTab === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 md:max-w-md min-w-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder={isUrdu ? "نام، ای میل، فون، سکول سے تلاش کریں..." : "Search user by name, email, phone, school..."}
                  className="w-full pl-10 pr-8 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                />
                {userSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

        {/* User Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-xs sm:text-sm text-slate-800">
                All Registered Accounts & Live User Management
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              Live Master Database View
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-4">User / Name</th>
                  <th className="py-3 px-4">Email & Phone</th>
                  <th className="py-3 px-4">Password / پاسورڈ</th>
                  <th className="py-3 px-4">School / Institute</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Plan & Quota</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">
                      No matching registered users found.
                    </td>
                  </tr>
                ) : (
                  displayUsers.map((u, idx) => {
                    const isCurrent = currentUser?.email && u.email && currentUser.email.toLowerCase() === u.email.toLowerCase();
                    const initial = (u.name || u.email || 'U').charAt(0).toUpperCase();

                    return (
                      <tr key={u.id || u.email || idx} className={`hover:bg-slate-50/80 transition-colors ${isCurrent ? 'bg-blue-50/40' : ''}`}>
                        {/* User Avatar + Name */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0 shadow-2xs ${
                              u.isAdmin ? 'bg-gradient-to-tr from-indigo-600 to-purple-600' : 'bg-gradient-to-tr from-blue-600 to-teal-500'
                            }`}>
                              {initial}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800 text-xs">
                                  {u.name || (u.email ? u.email.split('@')[0] : 'Unnamed User')}
                                </span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                ID: {(u.id || u.email || 'acc').slice(0, 14)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-700 font-mono text-[11px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              {u.email}
                            </span>
                            {(u.phone || u.phoneClean || u.phoneStd) && (
                              <span className="font-medium text-emerald-700 font-mono text-[10px] flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                                {u.phone || u.phoneStd}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Password with Eye Reveal & Copy */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {u.isAdmin ? (
                            <span className="text-[11px] text-slate-400 font-mono italic">Protected</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 min-w-[70px] text-center tracking-wide select-all">
                                {visiblePasswords[u.id || u.email] ? (u.password || '******') : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setVisiblePasswords(prev => ({ ...prev, [u.id || u.email]: !prev[u.id || u.email] }))}
                                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-2xs"
                                title={visiblePasswords[u.id || u.email] ? "پاسورڈ چھپائیں (Hide Password)" : "پاسورڈ دیکھیں (Show Password)"}
                              >
                                {visiblePasswords[u.id || u.email] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              {u.password && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(u.password);
                                    notify.success("Password copied to clipboard!");
                                  }}
                                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
                                  title="پاسورڈ کاپی کریں (Copy Password)"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Institute / School */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {u.institute || 'Allied / Punjab College'}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {u.isAdmin || u.role?.toLowerCase().includes('admin') ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <ShieldCheck className="w-3 h-3" />
                              Super Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Users className="w-3 h-3" />
                              Teacher / Faculty
                            </span>
                          )}
                        </td>

                        {/* Plan & Quota */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {u.isAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                              Unlimited Lifetime
                            </span>
                          ) : (!u.package || u.package === 'None' || u.package === 'unpaid' || u.subscriptionStatus === 'unpaid' || u.subscriptionStatus === 'pending_verification') ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 font-black px-2 py-0.5 rounded-full text-[10px] border ${
                                  u.subscriptionStatus === 'pending_verification'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                  <Lock className="w-3 h-3" />
                                  {u.subscriptionStatus === 'pending_verification' ? 'Pending Approval' : 'Unpaid / Locked'}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-500">
                                  0 Papers
                                </span>
                              </div>
                              {u.paymentProof ? (
                                <span className="text-[10px] text-indigo-700 font-extrabold block">
                                  Proof: {u.paymentProof.planName} (TID: {u.paymentProof.trxId})
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 block italic">
                                  No plan approved yet
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-slate-800 text-xs">
                                  {u.package}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                  {Number(u.maxPapers) === -1 ? 'Unlimited' : `${u.maxPapers ?? 50} Papers`}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                Exp: {u.expiryDate || 'Active'}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Last Login Time */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <div>
                              <span className="font-black text-slate-800 text-xs block">
                                {u.lastLogin || (isCurrent ? 'Online Now' : 'Recently Logged In')}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-sans">
                                {isCurrent ? 'Current active session' : 'Last recorded entry'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status (Clickable Block / Active Toggle) */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {u.isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <ShieldCheck className="w-3 h-3" />
                              Permanent
                            </span>
                          ) : u.status === 'blocked' ? (
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 cursor-pointer shadow-2xs transition-all active:scale-95"
                              title="Account is suspended. Click to Unblock / Reactivate"
                            >
                              <Ban className="w-3 h-3 text-rose-600" />
                              <span>Blocked</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 cursor-pointer shadow-2xs transition-all active:scale-95"
                              title="Account is active. Click to Suspend / Block"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </button>
                          )}
                        </td>

                        {/* Actions (Manage Plan & Reset Password) */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {u.isAdmin ? (
                            <span className="text-[11px] text-slate-400 font-semibold italic">Protected</span>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              {/* If unapproved / unpaid, provide prominent 1-click Approve action */}
                              {(!u.package || u.package === 'None' || u.subscriptionStatus === 'unpaid' || u.subscriptionStatus === 'pending_verification') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSubModalUser(u);
                                    const requestedPlan = u.paymentProof?.planName || 'Basic (3 Months - Rs. 3,000)';
                                    let days = 90;
                                    let quota = 50;
                                    if (requestedPlan.includes('Silver')) { days = 180; quota = 150; }
                                    else if (requestedPlan.includes('Platinum')) { days = 365; quota = -1; }
                                    const d = new Date();
                                    d.setDate(d.getDate() + days);
                                    setSubForm({
                                      packagePlan: requestedPlan,
                                      expiryDate: d.toISOString().split('T')[0],
                                      maxPapers: quota
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-all active:scale-95 cursor-pointer shadow-xs"
                                  title="Approve & Assign Subscription Plan"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setSubModalUser(u);
                                  setSubForm({
                                    packagePlan: u.package && u.package !== 'None' ? u.package : 'Basic (3 Months - Rs. 3,000)',
                                    expiryDate: u.expiryDate || (() => {
                                      const d = new Date(); d.setDate(d.getDate() + 90); return d.toISOString().split('T')[0];
                                    })(),
                                    maxPapers: u.maxPapers !== undefined && u.maxPapers > 0 ? u.maxPapers : 50
                                  });
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                title="Edit Subscription Package & Paper Quota"
                              >
                                <Sliders className="w-3 h-3" />
                                <span>Plan</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setResetModalUser(u);
                                  setNewPasswordInput('');
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                title="Reset User Password"
                              >
                                <KeyRound className="w-3 h-3" />
                                <span>Password</span>
                              </button>

                              {!u.isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="w-3 h-3 text-rose-600" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* TAB 2: LIVE LOGIN & SESSION LOGS */}
    {adminActiveTab === 'sessions' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-xs sm:text-sm text-slate-800">
              {isUrdu ? 'حالیہ لاگ ان سرگرمی لاگز (Live Session Activity)' : 'Live Session & Login Audit Trail'}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {isUrdu ? `کل لاگز: ${loginLogs.length}` : `Latest ${loginLogs.length} Records`}
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4">User / Name & Email</th>
                <th className="py-3 px-4">Timestamp / لاگ ان کا وقت</th>
                <th className="py-3 px-4">Device & Platform</th>
                <th className="py-3 px-4">IP Address / Location</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loginLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                    {isUrdu ? 'کوئی لاگ ان ریکارڈ موجود نہیں ہے۔' : 'No login audit records found.'}
                  </td>
                </tr>
              ) : (
                loginLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-black text-xs">
                          {(log.name || log.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">
                            {log.name || (log.email ? log.email.split('@')[0] : 'User')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {log.email || log.userEmail || '—'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-sans text-[11px] text-slate-700">
                      {log.timestamp || log.timeFormatted || log.isoTime || 'Just Now'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-600">
                      {log.device || log.userAgent || 'Chrome / Windows PC'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {log.ip || log.ipAddress || '182.185.142.x (Pakistan)'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Success
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}



        {/* ================================================================= */}
        {/* 1. CREATE TEACHER / USER MODAL                                    */}
        {/* ================================================================= */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-8 animate-scaleUp">
              <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight">Create New Teacher / User</h3>
                    <p className="text-[11px] text-blue-100 font-medium">Add a new faculty account with custom credentials</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-medium">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Teacher / User Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Prof. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address / Username *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="teacher@school.edu.pk"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* Mobile / Phone Number */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={createForm.phone || ''}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="e.g. 0300 1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">Account Password *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPass = 'Teach#' + Math.floor(1000 + Math.random() * 9000);
                        setCreateForm({ ...createForm, password: randomPass });
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      Generate Random Password
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* School / Institute & Role */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">School / Institute</label>
                    <input
                      type="text"
                      value={createForm.institute}
                      onChange={(e) => setCreateForm({ ...createForm, institute: e.target.value })}
                      placeholder="e.g. Educators Academy"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                      placeholder="e.g. Physics Lecturer"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                {/* Package Plan & Max Papers */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Package Plan</label>
                    <select
                      value={createForm.packagePlan}
                      onChange={(e) => {
                        const plan = e.target.value;
                        let days = 90;
                        let quota = 50;
                        if (plan.includes('Demo') || plan.includes('Trial')) { days = 2; quota = 10; }
                        else if (plan.includes('Silver')) { days = 180; quota = 150; }
                        else if (plan.includes('Platinum')) { days = 365; quota = -1; }
                        else if (plan.includes('Basic')) { days = 90; quota = 50; }
                        else if (plan.includes('None') || plan.includes('Unpaid')) { days = 0; quota = 0; }
                        const date = new Date();
                        date.setDate(date.getDate() + days);
                        const exp = days > 0 ? date.toISOString().split('T')[0] : null;
                        setCreateForm({ ...createForm, packagePlan: plan, expiryDate: exp, maxPapers: quota });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="Trial / Demo (2 Days Free)">🎁 Trial / Demo (2 Days Free - 10 Papers)</option>
                      <option value="Basic (3 Months - Rs. 3,000)">Basic (3 Months - Rs. 3,000)</option>
                      <option value="Silver (6 Months - Rs. 5,000)">Silver (6 Months - Rs. 5,000)</option>
                      <option value="Platinum (12 Months - Rs. 9,000)">Platinum (12 Months - Rs. 9,000)</option>
                      <option value="Custom Plan">Custom Plan</option>
                      <option value="None (Unpaid / Locked)">None (Unpaid / Locked)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Paper Quota</label>
                    <select
                      value={createForm.maxPapers}
                      onChange={(e) => setCreateForm({ ...createForm, maxPapers: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value="10">10 Papers Max</option>
                      <option value="25">25 Papers Max</option>
                      <option value="50">50 Papers Max</option>
                      <option value="100">100 Papers Max</option>
                      <option value="-1">Unlimited Papers (-1)</option>
                    </select>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Expiry Date</label>
                  <input
                    type="date"
                    value={createForm.expiryDate}
                    onChange={(e) => setCreateForm({ ...createForm, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Account</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. MANAGE SUBSCRIPTION & QUOTA MODAL                              */}
        {/* ================================================================= */}
        {subModalUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden my-8 animate-scaleUp">
              <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight">Manage Plan & Quotas</h3>
                    <p className="text-[11px] text-blue-100 font-medium">
                      {subModalUser.name || subModalUser.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubModalUser(null)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSubscription} className="p-6 space-y-4 text-xs font-medium">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Account</div>
                  <div className="font-black text-slate-800 text-xs mt-0.5">{subModalUser.name || 'Teacher Account'}</div>
                  <div className="font-mono text-slate-500 text-[11px]">{subModalUser.email}</div>
                </div>

                {/* Package Plan */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subscription Package Plan</label>
                  <select
                    value={subForm.packagePlan}
                    onChange={(e) => {
                      const plan = e.target.value;
                      let days = 90;
                      let quota = 50;
                      if (plan.includes('Demo') || plan.includes('Trial')) { days = 2; quota = 10; }
                      else if (plan.includes('Silver')) { days = 180; quota = 150; }
                      else if (plan.includes('Platinum')) { days = 365; quota = -1; }
                      else if (plan.includes('Basic')) { days = 90; quota = 50; }
                      else if (plan.includes('None') || plan.includes('Unpaid')) { days = 0; quota = 0; }
                      const date = new Date();
                      date.setDate(date.getDate() + days);
                      const exp = days > 0 ? date.toISOString().split('T')[0] : null;
                      setSubForm({ ...subForm, packagePlan: plan, expiryDate: exp, maxPapers: quota });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  >
                    <option value="Trial / Demo (2 Days Free)">🎁 Trial / Demo (2 Days Free - 10 Papers)</option>
                    <option value="Basic (3 Months - Rs. 3,000)">Basic (3 Months - Rs. 3,000)</option>
                    <option value="Silver (6 Months - Rs. 5,000)">Silver (6 Months - Rs. 5,000)</option>
                    <option value="Platinum (12 Months - Rs. 9,000)">Platinum (12 Months - Rs. 9,000)</option>
                    <option value="Custom Plan">Custom Plan</option>
                    <option value="None (Unpaid / Locked)">None (Unpaid / Locked)</option>
                  </select>
                </div>

                {/* Expiry Date */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">Expiration Date</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 2);
                          setSubForm({
                            ...subForm,
                            packagePlan: 'Trial / Demo (2 Days Free)',
                            expiryDate: d.toISOString().split('T')[0],
                            maxPapers: subForm.maxPapers <= 0 ? 10 : subForm.maxPapers
                          });
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-[10px] font-bold text-emerald-800 transition-colors cursor-pointer"
                      >
                        +2 Days Demo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 30);
                          setSubForm({ ...subForm, expiryDate: d.toISOString().split('T')[0] });
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        +30d
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setFullYear(d.getFullYear() + 1);
                          setSubForm({ ...subForm, expiryDate: d.toISOString().split('T')[0] });
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        +1 Year
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    required
                    value={subForm.expiryDate}
                    onChange={(e) => setSubForm({ ...subForm, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                  />
                </div>

                {/* Paper Quota */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Maximum Allowed Papers Quota</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[10, 25, 50, -1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSubForm({ ...subForm, maxPapers: val })}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          subForm.maxPapers === val
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val === -1 ? 'Unlimited' : `${val} Papers`}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={subForm.maxPapers}
                    onChange={(e) => setSubForm({ ...subForm, maxPapers: Number(e.target.value) })}
                    placeholder="Enter custom count or -1 for unlimited"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Enter <strong>-1</strong> for unlimited paper generation quota.
                  </span>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubModalUser(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Update Subscription</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. RESET USER PASSWORD MODAL                                      */}
        {/* ================================================================= */}
        {resetModalUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden my-8 animate-scaleUp">
              <div className="p-5 bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight">Reset User Password</h3>
                    <p className="text-[11px] text-amber-100 font-medium">
                      Direct Admin Password Override
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResetModalUser(null);
                    setNewPasswordInput('');
                  }}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4 text-xs font-medium">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Selected Account</div>
                  <div className="font-black text-sm mt-0.5">{resetModalUser.name || 'Teacher Account'}</div>
                  <div className="font-mono text-[11px] text-amber-800">{resetModalUser.email}</div>
                </div>

                {/* New Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">New Assigned Password *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const generated = 'Key#' + Math.floor(1000 + Math.random() * 9000);
                        setNewPasswordInput(generated);
                      }}
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
                    >
                      Generate Strong Password
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Type new password here..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    This will immediately update Firestore and the authentication cache. Share this new password directly with the teacher.
                  </p>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalUser(null);
                      setNewPasswordInput('');
                    }}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md shadow-amber-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  return null;
}

