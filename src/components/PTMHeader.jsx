import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, User, Maximize2, Cloud, LogOut, KeyRound, 
  ChevronDown, Settings, ShieldCheck, CheckCircle2, Phone, Bot
} from 'lucide-react';
import UserProfileModal from './UserProfileModal';

export default function PTMHeader({
  sidebarOpen = true,
  onToggleSidebar,
  onGoHome,
  onOpenContact,
  onOpenFirebaseStatus,
  onOpenAiBot,
  onOpenAdmin,
  currentUser,
  onUpdateUser,
  onLogout
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('profile'); // 'profile' | 'password'
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleOpenProfileModal = (tab = 'profile') => {
    setModalTab(tab);
    setModalOpen(true);
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-14 px-2 sm:px-4 flex items-center justify-between no-print z-30 sticky top-0 shadow-xs font-sans">
        
        {/* LEFT: LOGO & NAV LINKS */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Brand Logo & Name */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-black text-[10px] text-blue-700 tracking-tighter">
                PTM
              </div>
            </div>
            <span className="font-black text-sm sm:text-base tracking-wider hidden sm:inline text-slate-900 uppercase truncate">
              PRO <span className="text-blue-600">TEST MAKER</span>
            </span>
          </div>

          {/* Hamburger Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 rounded-lg transition-all duration-300 cursor-pointer shrink-0 ${
              !sidebarOpen ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' : ''
            }`}
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <Menu className={`w-5 h-5 transition-transform duration-500 ease-in-out ${!sidebarOpen ? 'rotate-90 text-blue-600' : 'rotate-0'}`} />
          </button>

          {/* Links: Home, Contact */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600">
            <button 
              type="button"
              onClick={onGoHome}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              type="button"
              onClick={onOpenContact}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* RIGHT: AI ASSISTANT, FIREBASE STATUS, USER ACCOUNT DROPDOWN, FULLSCREEN */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* AI Assistant Bot Trigger Button */}
          <button
            type="button"
            onClick={onOpenAiBot}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            title="Ask AI Assistant about website & syllabus"
          >
            <Bot className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">AI Assistant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Live Firebase Status Indicator */}
          <button
            type="button"
            onClick={onOpenFirebaseStatus}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-[11px] font-bold transition-all cursor-pointer"
            title="Firebase Live Status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud Active</span>
            <Cloud className="w-3 h-3 text-emerald-600" />
          </button>

          {/* REFINED USER ACCOUNT DROPDOWN (UPDATE PROFILE / CHANGE PASSWORD) */}
          {currentUser && (
            <div className="relative" ref={dropdownRef}>
              
              {/* Profile Trigger Button */}
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                title="Account Options (پروفائل و پاسورڈ تبدیل کریں)"
              >
                {/* Monogram Avatar */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 ring-1 ring-white/60">
                  {currentUser.name 
                    ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'U'}
                </div>

                {/* User Info (Name & Role) */}
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-slate-800 max-w-[120px] truncate">
                      {currentUser.name}
                    </span>
                    {currentUser.isAdmin && (
                      <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black border border-amber-300 leading-none">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold max-w-[120px] truncate">
                    {currentUser.isAdmin ? 'Administrator' : (currentUser.role || 'Teacher')}
                  </span>
                </div>

                {/* Dropdown Chevron */}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* POPUP DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-scaleUp origin-top-right">
                  
                  {/* Dropdown Header Info */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 -mt-2 rounded-t-2xl">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {currentUser.email || 'No email registered'}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        {currentUser.isAdmin ? 'Admin Portal Active' : (currentUser.role || 'Faculty Member')}
                      </span>
                    </div>
                  </div>

                  {/* Menu Action 1: Update Profile */}
                  <div className="p-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenProfileModal('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-blue-500 shrink-0" />
                      <div className="flex-1">
                        <div>Update Profile</div>
                        <div className="text-[10px] font-medium text-slate-400">نام اور ادارہ تبدیل کریں</div>
                      </div>
                    </button>

                    {/* Menu Action 2: Change Password */}
                    <button
                      type="button"
                      onClick={() => handleOpenProfileModal('password')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <KeyRound className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="flex-1">
                        <div>Change Password</div>
                        <div className="text-[10px] font-medium text-slate-400">نیا پاسورڈ مقرر کریں</div>
                      </div>
                    </button>

                    {/* Menu Action 3: Contact Pro Test Maker Team */}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (typeof onOpenContact === 'function') onOpenContact();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="flex-1">
                        <div>Contact Team</div>
                        <div className="text-[10px] font-medium text-slate-400">Haris Jabbar • 0333-4354374</div>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 my-1" />

                  {/* Menu Action 3: Logout */}
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="flex-1">
                        <div>Log Out</div>
                        <div className="text-[10px] font-medium text-rose-400">سیشن بند کریں</div>
                      </div>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="hidden sm:inline-flex p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* USER PROFILE & PASSWORD UPDATE MODAL */}
      <UserProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
        initialTab={modalTab}
      />
    </>
  );
}
