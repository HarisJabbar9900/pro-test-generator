// Utility to track and retrieve per-user statistics, personal activity log,
// and administrative management (create account, block/unblock, subscription & quota, password reset).
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export function getCleanUserKey(email) {
  return (email || 'anonymous').toLowerCase().trim();
}

export function getUserStats(email) {
  const key = getCleanUserKey(email);
  try {
    // 1. Created papers count
    const storedCreated = localStorage.getItem(`ptm_created_papers_count_${key}`);
    let createdCount = 0;
    if (storedCreated !== null) {
      createdCount = parseInt(storedCreated, 10) || 0;
    } else {
      const saved = JSON.parse(localStorage.getItem(`ptm_saved_papers_${key}`) || '[]');
      createdCount = saved.length || 0;
    }

    // 2. Deleted papers count
    const storedDeleted = localStorage.getItem(`ptm_deleted_papers_count_${key}`);
    const deletedCount = storedDeleted !== null ? (parseInt(storedDeleted, 10) || 0) : 0;

    // 3. Login count
    const storedLogins = localStorage.getItem(`ptm_login_count_${key}`);
    let loginCount = 1;
    if (storedLogins !== null) {
      loginCount = parseInt(storedLogins, 10) || 1;
    } else {
      try {
        const logs = JSON.parse(localStorage.getItem('ptm_login_logs') || '[]');
        const userLogs = logs.filter(l => (l.userEmail || l.email || '').toLowerCase() === key);
        loginCount = Math.max(userLogs.length, 1);
      } catch (e) {
        loginCount = 1;
      }
    }

    // 4. Activity Logs (Always keep latest 15 actions)
    const storedActivity = localStorage.getItem(`ptm_activity_log_${key}`);
    let activityLog = [];
    if (storedActivity) {
      activityLog = JSON.parse(storedActivity).slice(0, 15);
    }

    return {
      createdCount,
      deletedCount,
      loginCount,
      activityLog
    };
  } catch (err) {
    console.error("Error reading user stats:", err);
    return { createdCount: 0, deletedCount: 0, loginCount: 1, activityLog: [] };
  }
}

export function recordPaperCreated(email, paperTitle = 'Examination Paper') {
  if (!email) return;
  const key = getCleanUserKey(email);
  try {
    const currentCreated = parseInt(localStorage.getItem(`ptm_created_papers_count_${key}`) || '0', 10);
    const newCount = currentCreated + 1;
    localStorage.setItem(`ptm_created_papers_count_${key}`, newCount.toString());

    // Append to personal activity log (Max 15 recent actions)
    const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    const logItem = {
      id: `act-${Date.now()}`,
      type: 'create',
      title: paperTitle,
      timestamp: nowFormatted,
      timeIso: new Date().toISOString()
    };
    const stored = JSON.parse(localStorage.getItem(`ptm_activity_log_${key}`) || '[]');
    const updatedLogs = [logItem, ...stored].slice(0, 15);
    localStorage.setItem(`ptm_activity_log_${key}`, JSON.stringify(updatedLogs));
  } catch (err) {
    console.error("Error recording paper created:", err);
  }
}

export function recordPaperDeleted(email, paperTitle = 'Examination Paper') {
  if (!email) return;
  const key = getCleanUserKey(email);
  try {
    const currentDeleted = parseInt(localStorage.getItem(`ptm_deleted_papers_count_${key}`) || '0', 10);
    const newCount = currentDeleted + 1;
    localStorage.setItem(`ptm_deleted_papers_count_${key}`, newCount.toString());

    // Append to personal activity log (Max 15 recent actions)
    const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    const logItem = {
      id: `act-${Date.now()}`,
      type: 'delete',
      title: paperTitle,
      timestamp: nowFormatted,
      timeIso: new Date().toISOString()
    };
    const stored = JSON.parse(localStorage.getItem(`ptm_activity_log_${key}`) || '[]');
    const updatedLogs = [logItem, ...stored].slice(0, 15);
    localStorage.setItem(`ptm_activity_log_${key}`, JSON.stringify(updatedLogs));
  } catch (err) {
    console.error("Error recording paper deleted:", err);
  }
}

export function recordUserLoginEvent(email, userName = 'User') {
  if (!email) return;
  const key = getCleanUserKey(email);
  try {
    const currentLogins = parseInt(localStorage.getItem(`ptm_login_count_${key}`) || '0', 10);
    const newCount = currentLogins + 1;
    localStorage.setItem(`ptm_login_count_${key}`, newCount.toString());

    // Append to personal activity log (Max 15 recent actions)
    const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    const logItem = {
      id: `act-${Date.now()}`,
      type: 'login',
      title: 'Successful Login to Pro Test Maker',
      timestamp: nowFormatted,
      timeIso: new Date().toISOString()
    };
    const stored = JSON.parse(localStorage.getItem(`ptm_activity_log_${key}`) || '[]');
    const updatedLogs = [logItem, ...stored].slice(0, 15);
    localStorage.setItem(`ptm_activity_log_${key}`, JSON.stringify(updatedLogs));
  } catch (err) {
    console.error("Error recording login event:", err);
  }
}

export function clearUserActivityLog(email) {
  if (!email) return;
  const key = getCleanUserKey(email);
  try {
    localStorage.removeItem(`ptm_activity_log_${key}`);
  } catch (err) {
    console.error("Error clearing activity log:", err);
  }
}

// ============================================================================
// ADMIN USER MANAGEMENT API (Firestore & LocalStorage Sync)
// ============================================================================

/**
 * 1. Create a new Teacher or User Account
 */
export async function createTeacherAccount({
  name,
  email,
  phone = '',
  password,
  institute = 'Educators Academy',
  role = 'Senior Subject Teacher',
  packagePlan = 'Educators Annual',
  expiryDate = '2026-12-31',
  maxPapers = -1 // -1 = unlimited
}) {
  const cleanEmail = getCleanUserKey(email);
  if (!cleanEmail || !password) {
    throw new Error('Email and Password are required');
  }

  const cleanPhone = (phone || '').trim();
  const cleanPhoneDigits = cleanPhone.replace(/\D/g, '');
  let stdPhone = cleanPhoneDigits;
  if (cleanPhoneDigits.startsWith('923') && cleanPhoneDigits.length === 12) {
    stdPhone = '0' + cleanPhoneDigits.slice(2);
  } else if (cleanPhoneDigits.startsWith('3') && cleanPhoneDigits.length === 10) {
    stdPhone = '0' + cleanPhoneDigits;
  }

  const nowFormatted = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
  const newUser = {
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    phoneClean: cleanPhoneDigits,
    phoneStd: stdPhone,
    password: password.trim(),
    institute: institute.trim(),
    role: role.trim(),
    package: packagePlan,
    expiryDate: expiryDate,
    maxPapers: Number(maxPapers) || -1,
    status: 'active', // 'active' | 'blocked'
    isAdmin: false,
    createdAt: nowFormatted,
    createdAtIso: new Date().toISOString(),
    lastLogin: 'Not Logged In Yet'
  };

  // A. Save to Firestore 'users' collection
  try {
    const docRef = doc(db, "users", cleanEmail);
    await setDoc(docRef, newUser);
  } catch (err) {
    console.warn("Firestore user creation note:", err.message);
  }

  // B. Save to LocalStorage registered users cache
  try {
    const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
    const filtered = localUsers.filter(u => u.email?.toLowerCase() !== cleanEmail);
    const updated = [newUser, ...filtered];
    localStorage.setItem('ptm_registered_users', JSON.stringify(updated));
  } catch (err) {
    console.error("LocalStorage save error:", err);
  }

  return newUser;
}

/**
 * 2. Toggle User Status (Block / Unblock)
 */
export async function updateUserStatus(email, newStatus = 'active') {
  const cleanEmail = getCleanUserKey(email);
  if (!cleanEmail) return;

  // Never allow blocking master Super Admin!
  if (cleanEmail === 'testgenerator76@gmail.com' || cleanEmail === 'testgenerator76') {
    throw new Error('Super Admin account cannot be blocked!');
  }

  // A. Update Firestore
  try {
    const docRef = doc(db, "users", cleanEmail);
    await setDoc(docRef, { status: newStatus }, { merge: true });
  } catch (err) {
    console.warn("Firestore status update note:", err.message);
  }

  // B. Update LocalStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
    const updated = localUsers.map(u => {
      if (u.email?.toLowerCase() === cleanEmail) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    localStorage.setItem('ptm_registered_users', JSON.stringify(updated));
  } catch (err) {}

  // If current logged-in user is the one blocked, remove active session
  try {
    const currentActive = JSON.parse(localStorage.getItem('ptm_active_user') || '{}');
    if (currentActive.email?.toLowerCase() === cleanEmail && newStatus === 'blocked') {
      localStorage.removeItem('ptm_active_user');
      sessionStorage.removeItem('ptm_active_user');
    }
  } catch (err) {}

  return newStatus;
}

/**
 * 3. Update User Subscription & Quota
 */
export async function updateUserSubscription(email, {
  packagePlan,
  expiryDate,
  maxPapers,
  subscriptionStatus
}) {
  const cleanEmail = getCleanUserKey(email);
  if (!cleanEmail) return;

  const updates = {};
  if (packagePlan !== undefined) {
    updates.package = packagePlan;
    updates.subscriptionStatus = subscriptionStatus !== undefined 
      ? subscriptionStatus 
      : (packagePlan && packagePlan !== 'None' && packagePlan !== 'Unpaid / Locked' ? 'active' : 'unpaid');
  }
  if (expiryDate !== undefined) updates.expiryDate = expiryDate;
  if (maxPapers !== undefined) updates.maxPapers = Number(maxPapers);

  // A. Update Firestore
  try {
    const docRef = doc(db, "users", cleanEmail);
    await setDoc(docRef, updates, { merge: true });
  } catch (err) {
    console.warn("Firestore subscription update note:", err.message);
  }

  // B. Update LocalStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
    const updated = localUsers.map(u => {
      if (u.email?.toLowerCase() === cleanEmail) {
        return { ...u, ...updates };
      }
      return u;
    });
    localStorage.setItem('ptm_registered_users', JSON.stringify(updated));
  } catch (err) {}

  // C. Update active session if target user is currently active
  try {
    const rawSession = sessionStorage.getItem('ptm_active_user');
    if (rawSession) {
      const activeSession = JSON.parse(rawSession);
      if (activeSession.email?.toLowerCase() === cleanEmail) {
        sessionStorage.setItem('ptm_active_user', JSON.stringify({ ...activeSession, ...updates }));
      }
    }
    const rawLocal = localStorage.getItem('ptm_active_user');
    if (rawLocal) {
      const activeLocal = JSON.parse(rawLocal);
      if (activeLocal.email?.toLowerCase() === cleanEmail) {
        localStorage.setItem('ptm_active_user', JSON.stringify({ ...activeLocal, ...updates }));
      }
    }
  } catch (err) {}

  return updates;
}

/**
 * 4. Reset User Password
 */
export async function updateUserPassword(email, newPassword) {
  const cleanEmail = getCleanUserKey(email);
  if (!cleanEmail || !newPassword) {
    throw new Error('Email and new password are required');
  }

  const cleanPass = newPassword.trim();

  // A. Update Firestore
  try {
    const docRef = doc(db, "users", cleanEmail);
    await setDoc(docRef, { password: cleanPass }, { merge: true });
  } catch (err) {
    console.warn("Firestore password update note:", err.message);
  }

  // B. Update LocalStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
    const updated = localUsers.map(u => {
      if (u.email?.toLowerCase() === cleanEmail) {
        return { ...u, password: cleanPass };
      }
      return u;
    });
    localStorage.setItem('ptm_registered_users', JSON.stringify(updated));
  } catch (err) {}

  return true;
}
