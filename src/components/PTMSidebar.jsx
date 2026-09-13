import React from 'react';
import { 
  Gauge, Send, Save, Newspaper, Users, 
  Files, Clock, Settings, LogOut, CheckCircle2, X,
  UploadCloud, ShieldCheck, KeyRound, School, Calendar, Sparkles, Lock, Headphones, Database, Bot,
  FileSignature, Languages
} from 'lucide-react';
import { notify } from '../utils/notify';
import { isSuperAdmin } from '../utils/pricingPlansService';

export default function PTMSidebar({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
  activeNav,
  setActiveNav,
  onOpenContact,
  userName = "Senior Teacher",
  expiryDate = "31-12-2026",
  accessType = "Full Access",
  packageType = "Educators Academy",
  currentUser = null,
  userSubscribed = true,
  onLogout,
  appLanguage = 'en',
  onToggleLanguage
}) {
  const isAdmin = isSuperAdmin(currentUser);
  const isUrdu = appLanguage === 'ur';

  const navItems = [
    { 
      id: 'dashboard', 
      label: isUrdu ? 'Dashboard • ڈیش بورڈ' : 'Dashboard', 
      icon: Gauge 
    },
    { 
      id: 'generate_paper', 
      label: isUrdu ? 'Generate Paper • نیا پرچہ بنائیں' : 'Generate Paper', 
      icon: Send 
    },
    { 
      id: 'pricing', 
      label: isAdmin 
        ? (isUrdu ? 'Pricing & Packages • پیکیجز' : 'Pricing & Packages') 
        : (isUrdu ? 'Subscription Plans • پیکیجز و فیس' : 'Subscription Plans'), 
      icon: Sparkles,
      badge: isUrdu ? '3 پیکیجز' : '3 Cards'
    },
    ...(isAdmin ? [
      { 
        id: 'user_management', 
        label: isUrdu ? 'User Management • یوزر مینجمنٹ' : 'User Management', 
        icon: Users, 
        isAdmin: true, 
        badge: 'Users' 
      },
      { 
        id: 'question_bank_editor', 
        label: isUrdu ? 'Question Bank • سوالات ایڈٹ' : 'Questions & Answers', 
        icon: Database, 
        isAdmin: true, 
        badge: 'Live Edit' 
      },
      { 
        id: 'upload_material', 
        label: isUrdu ? 'Upload Material • مٹیریل اپلوڈ' : 'Upload Material', 
        icon: UploadCloud, 
        isAdmin: true 
      }
    ] : []),
    { 
      id: 'past_papers', 
      label: isUrdu ? 'Past Papers • سابقہ بورڈ پرچے' : 'Past Papers', 
      icon: Newspaper 
    },
    { 
      id: 'date_sheet_planner', 
      label: isUrdu ? 'Date-Sheet • امتحانی پلانر' : 'Date-Sheet Planner', 
      icon: Calendar, 
      badge: 'Planner' 
    },
    { 
      id: 'contact', 
      label: isUrdu ? 'Contact Team • رابطہ و رہنمائی' : 'Contact Team', 
      icon: Headphones, 
      badge: 'Direct' 
    },
  ];

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (typeof onCloseMobile === 'function') {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity animate-fadeIn"
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 md:relative md:sticky md:top-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-16' : 'md:w-64'}
          w-72 sm:w-64 shrink-0 bg-[#222d32] text-slate-200 h-screen flex flex-col font-sans select-none no-print border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden shadow-2xl md:shadow-none
        `}
      >
        
        {/* MOBILE CLOSE HEADER (SHOWN ONLY ON MOBILE) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-700/80 bg-[#1e272b]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">PTM</span>
            </div>
            <span className="text-xs font-black text-white uppercase tracking-wider">Navigation Menu</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      
      {/* USER PROFILE SECTION */}
      <div className={`border-b border-slate-700/60 bg-gradient-to-b from-[#1c2529] to-[#222d32] flex flex-col items-center justify-center transition-all duration-300 ${
        collapsed ? 'py-3 px-1.5' : 'p-4 text-center'
      }`}>
        
        {/* User Monogram Avatar with Active Status Dot */}
        <div className="relative group">
          <div className={`${
            collapsed ? 'w-10 h-10 text-xs' : 'w-14 h-14 text-base'
          } rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-black shadow-lg shadow-blue-500/20 ring-2 ring-white/20 flex items-center justify-center tracking-tight transition-all duration-300 group-hover:scale-105 select-none`}>
            {currentUser?.name 
              ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
              : (userName ? userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'PT')}
          </div>

          {/* Active Status Pulse Dot */}
          <span 
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#222d32] rounded-full shadow-xs" 
            title="Active Session"
          />
        </div>

        {/* Extended Profile Details (Shown Only When Expanded) */}
        {!collapsed && (
          <div className="mt-2.5 flex flex-col items-center w-full animate-fadeIn text-center space-y-1.5">
            
            {/* User Name */}
            <h2 className="text-white font-black text-sm tracking-wide truncate max-w-full leading-tight">
              {currentUser?.name || userName}
            </h2>

            {/* Role Badge (Emerald for Teacher, Amber for Admin) */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-2xs ${
              currentUser?.isAdmin 
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300' 
                : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentUser?.isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className="truncate max-w-[170px]">
                {currentUser?.isAdmin ? 'System Administrator' : (currentUser?.role || accessType)}
              </span>
            </div>

            {/* School / Institution */}
            <div className="text-[11px] font-medium text-slate-300 flex items-center justify-center gap-1.5 max-w-full px-2">
              <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate font-semibold">{currentUser?.institute || packageType}</span>
            </div>

            {/* Expiry Pill / Status Pill */}
            {!userSubscribed && !currentUser?.isAdmin ? (
              <div className="text-[10px] text-rose-200 font-extrabold flex items-center justify-center gap-1.5 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-600/60 mt-0.5 animate-pulse shadow-sm">
                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Status: <strong className="text-white">Unpaid / Locked</strong></span>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Expiry: <strong className="text-slate-200 font-bold">{currentUser?.expiryDate || expiryDate}</strong></span>
              </div>
            )}

            {/* Action Buttons: Logout & Change Password */}
            <div className="grid grid-cols-2 gap-2 mt-2.5 w-full pt-1">
              <button
                type="button"
                onClick={onLogout}
                className="py-1.5 px-2 bg-slate-800/90 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer group active:scale-95"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                <span>Logout</span>
              </button>
              
              <button
                type="button"
                onClick={() => notify.info("Password Settings", { description: "Password can be managed by contacting the school coordinator or system admin." })}
                className="py-1.5 px-2 bg-slate-800/90 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-slate-700/80 hover:border-blue-500/40 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer group active:scale-95"
                title="Account security settings"
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* NAVIGATION MENU ITEMS (EXPANDED LIST VS COMPACT ICON-ONLY RAIL) */}
      <nav className={`flex-1 transition-all ${collapsed ? 'py-3 px-1.5 space-y-2' : 'py-2 px-0 space-y-1'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          const isLocked = !userSubscribed && !currentUser?.isAdmin && item.id !== 'pricing';

          const handleClick = () => {
            if (isLocked) {
              notify.warning("پہلے پیکیج حاصل کریں (Subscription Required)", {
                description: "یہ فیچر لاک ہے۔ پیپرز بنانے اور ڈیش بورڈ استعمال کرنے کے لیے پہلے پیکیج منتخب کریں۔"
              });
              handleNavClick('pricing');
              return;
            }
            handleNavClick(item.id);
          };

          // Mini / Collapsed Icon-Only View (desktop only when collapsed)
          if (collapsed) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={handleClick}
                title={isLocked ? `${item.label} (🔒 Locked - Please Subscribe)` : item.label}
                className={`w-11 h-11 mx-auto flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer group relative ${
                  isActive
                    ? 'bg-[#007bff] text-white shadow-md'
                    : isLocked
                    ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-950/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                )}
              </button>
            );
          }

          // Full Expanded View
          return (
            <button
              key={item.id}
              type="button"
              onClick={handleClick}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-[#007bff] text-white font-bold shadow-md'
                  : isLocked
                  ? 'text-slate-500 hover:text-slate-300 hover:bg-rose-950/20 opacity-70'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {isLocked ? (
                <Lock className="w-4 h-4 shrink-0 text-slate-500" />
              ) : (
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              )}
              <span className="truncate flex-1">{item.label}</span>
              {isLocked ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50">
                  🔒 Locked
                </span>
              ) : item.badge ? (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                  item.id === 'model_papers'
                    ? 'bg-rose-500 text-white shadow-xs animate-heartbeat'
                    : isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* LANGUAGE SWITCH BUTTON (FULL & COLLAPSED) */}
      <div className="p-2 border-t border-slate-700/60 bg-[#1d262a]">
        {collapsed ? (
          <button
            type="button"
            onClick={onToggleLanguage}
            className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isUrdu 
                ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={isUrdu ? "Switch to English" : "اردو فعال کریں"}
          >
            <Languages className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleLanguage}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98 ${
              isUrdu 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="تبدیل کریں: انگریزی اور اردو (Switch Language)"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'اردو فعال ہے • English' : 'English / اردو منتخب کریں'}</span>
          </button>
        )}
      </div>

      {/* FOOTER ACCENT */}
      <div className="mt-auto p-2.5 text-center border-t border-slate-700/60 text-[10px] text-slate-400">
        {collapsed ? (
          <span className="font-mono text-[9px] font-bold text-slate-500">PTM</span>
        ) : (
          <span>PRO TEST MAKER v2.5</span>
        )}
      </div>

    </aside>
  </>
  );
}
