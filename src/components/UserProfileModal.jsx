import React, { useState } from 'react';
import { 
  X, User, School, Lock, KeyRound, ShieldCheck, 
  CheckCircle2, AlertCircle, Save, ArrowRight, Eye, EyeOff, Phone
} from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { notify } from '../utils/notify';
import confetti from 'canvas-confetti';

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  initialTab = 'profile' // 'profile' | 'password'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Profile form state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [institute, setInstitute] = useState(currentUser?.institute || '');
  const [role, setRole] = useState(currentUser?.role || 'Senior Subject Teacher');

  // 2. Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // ACTION: Save Profile Changes
  // -------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name cannot be blank.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanPhone = (phone || '').trim();
      const phoneDigits = cleanPhone.replace(/\D/g, '');
      let stdPhone = phoneDigits;
      if (phoneDigits.startsWith('923') && phoneDigits.length === 12) {
        stdPhone = '0' + phoneDigits.slice(2);
      } else if (phoneDigits.startsWith('3') && phoneDigits.length === 10) {
        stdPhone = '0' + phoneDigits;
      }

      const updatedUser = {
        ...currentUser,
        name: name.trim(),
        phone: cleanPhone,
        phoneClean: phoneDigits,
        phoneStd: stdPhone,
        institute: institute.trim() || 'Educators Academy',
        role: role
      };

      // 1. Update in Firebase Firestore if email exists
      if (currentUser?.email) {
        try {
          const userDocRef = doc(db, "users", currentUser.email.toLowerCase().trim());
          await setDoc(userDocRef, {
            name: name.trim(),
            phone: cleanPhone,
            phoneClean: phoneDigits,
            phoneStd: stdPhone,
            institute: institute.trim() || 'Educators Academy',
            role: role
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Firestore profile update note:", dbErr.message);
        }
      }

      // 2. Update local storage registered users list
      try {
        const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
        const updatedList = localUsers.map(u => {
          if (u.email?.toLowerCase() === currentUser?.email?.toLowerCase()) {
            return { 
              ...u, 
              name: name.trim(), 
              phone: cleanPhone, 
              phoneClean: phoneDigits, 
              phoneStd: stdPhone, 
              institute: institute.trim(), 
              role 
            };
          }
          return u;
        });
        localStorage.setItem('ptm_registered_users', JSON.stringify(updatedList));
      } catch (e) {}

      // 3. Update active session
      if (typeof onUpdateUser === 'function') {
        onUpdateUser(updatedUser);
      }

      setSuccessMessage('Profile updated successfully! (پروفائل کامیابی سے تبدیل ہو گئی)');
      notify.success("Profile Updated", { description: "Your details have been saved." });

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 900);

    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ACTION: Change Account Password
  // -------------------------------------------------------------
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const emailKey = (currentUser?.email || '').toLowerCase().trim();

      // 1. If admin account, update admin password
      if (currentUser?.isAdmin || emailKey === 'testgenerator76@gmail.com') {
        // Admin password update
        notify.success("Admin Password Updated", { description: "New password set successfully." });
      }

      // 2. Update in Firebase Firestore
      if (emailKey) {
        try {
          const userDocRef = doc(db, "users", emailKey);
          await setDoc(userDocRef, {
            password: newPassword
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Firestore password update note:", dbErr.message);
        }
      }

      // 3. Update in local storage
      try {
        const localUsers = JSON.parse(localStorage.getItem('ptm_registered_users') || '[]');
        const updatedList = localUsers.map(u => {
          if (u.email?.toLowerCase() === emailKey) {
            return { ...u, password: newPassword };
          }
          return u;
        });
        localStorage.setItem('ptm_registered_users', JSON.stringify(updatedList));
      } catch (e) {}

      try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } }); } catch (e) {}

      setSuccessMessage('Password changed successfully! (پاسورڈ کامیابی سے تبدیل ہو گیا)');
      notify.success("Password Changed", { description: "Use your new password for your next login." });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);

    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative text-slate-800 animate-scaleUp">
        
        {/* TOP BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-black text-base shadow-md flex items-center justify-center shrink-0 border-2 border-white/20">
              {currentUser?.name 
                ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                : 'PT'}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-white tracking-wide truncate">
                {currentUser?.name || 'User Profile'}
              </h2>
              <p className="text-xs text-cyan-300 font-medium truncate">
                {currentUser?.email || 'user@protestmaker.pk'}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-amber-300 border border-white/15">
                {currentUser?.isAdmin ? '👑 Administrator' : (currentUser?.role || 'Teacher')}
              </span>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER: EDIT PROFILE | CHANGE PASSWORD */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('password');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>

          {/* NOTIFICATION ALERTS */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 1: UPDATE PROFILE FORM                                  */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 animate-fadeIn">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Full Name (پورا نام) *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Mobile / Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Mobile / WhatsApp (موبائل یا واٹس ایپ نمبر)
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* School / Academy */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  School / College / Academy (ادارہ / اسکول)
                </label>
                <div className="relative flex items-center">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    placeholder="e.g. Al-hadi School / Punjab College"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Designation / Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Role / Designation (عہدہ)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="Senior Subject Teacher">Senior Subject Teacher</option>
                  <option value="Head of Department">Head of Department (HOD)</option>
                  <option value="School Principal">School Principal</option>
                  <option value="Academy Director">Academy Director</option>
                  {currentUser?.isAdmin && <option value="System Administrator">System Administrator</option>}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>

            </form>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 2: CHANGE PASSWORD FORM                                 */}
          {/* ----------------------------------------------------------- */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-3.5 animate-fadeIn">
              
              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  New Password (نیا پاسورڈ) *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Confirm New Password (تصدیق نیا پاسورڈ) *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Updating...' : 'Change Password'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
