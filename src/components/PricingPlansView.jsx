import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Sparkles, Shield, Award, Zap, 
  HelpCircle, ArrowRight, Copy, Check, MessageCircle, 
  Settings, RefreshCw, X, Plus, Trash2, Edit3, Save, 
  Clock, FileText, Smartphone, Building, AlertCircle,
  Lock, LogOut, Send, Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { notify } from '../utils/notify';
import { 
  getLocalPricingPlans, 
  getLocalPaymentInfo, 
  fetchPricingFromFirestore, 
  savePricingToFirestore, 
  resetPricingToDefaults,
  submitPaymentProof,
  DEFAULT_PRICING_PLANS,
  DEFAULT_PAYMENT_INFO,
  isSuperAdmin
} from '../utils/pricingPlansService';

export default function PricingPlansView({ 
  currentUser, 
  userSubscribed = false, 
  onNavigate, 
  onGoToDashboard, 
  onLogout 
}) {
  const isAdmin = isSuperAdmin(currentUser);

  const [plans, setPlans] = useState(() => getLocalPricingPlans());
  const [paymentInfo, setPaymentInfo] = useState(() => getLocalPaymentInfo());
  const [isLoading, setIsLoading] = useState(false);

  // Card Display Language State: 'en' (default) | 'ur'
  const [cardLang, setCardLang] = useState(() => {
    try {
      return localStorage.getItem('ptm_pricing_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const handleSetLang = (lang) => {
    setCardLang(lang);
    try {
      localStorage.setItem('ptm_pricing_lang', lang);
    } catch (e) {}
  };

  // Subscribe Modal State for Teacher
  const [selectedPlanForSub, setSelectedPlanForSub] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [paymentTrxId, setPaymentTrxId] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  // Admin Edit Modal State
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);
  const [editingPlans, setEditingPlans] = useState(plans);
  const [editingPayment, setEditingPayment] = useState(paymentInfo);
  const [adminActiveTab, setAdminActiveTab] = useState('plans'); // 'plans' | 'payment'
  const [adminSelectedPlanId, setAdminSelectedPlanId] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch live from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    const loadLivePricing = async () => {
      setIsLoading(true);
      const data = await fetchPricingFromFirestore();
      if (isMounted && data) {
        setPlans(data.plans);
        setPaymentInfo(data.paymentInfo);
        setEditingPlans(data.plans);
        setEditingPayment(data.paymentInfo);
      }
      if (isMounted) setIsLoading(false);
    };
    loadLivePricing();
    return () => { isMounted = false; };
  }, []);

  // Copy helper
  const handleCopy = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      notify.success("Copied to clipboard!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      notify.error("Failed to copy");
    }
  };

  // Open Subscribe Modal
  const handleOpenSubscribe = (plan) => {
    setSelectedPlanForSub(plan);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}
  };

  // Open Admin Edit
  const handleOpenAdminEditor = () => {
    setEditingPlans(JSON.parse(JSON.stringify(plans)));
    setEditingPayment(JSON.parse(JSON.stringify(paymentInfo)));
    setShowAdminEditModal(true);
  };

  // Save Admin Changes
  const handleSaveAdminPlans = async () => {
    setIsSaving(true);
    try {
      const success = await savePricingToFirestore(editingPlans, editingPayment);
      setPlans(editingPlans);
      setPaymentInfo(editingPayment);
      setShowAdminEditModal(false);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      if (success) {
        notify.success("Pricing plans & payment settings saved to Cloud Firestore!");
      } else {
        notify.info("Saved to local storage (Cloud sync will retry automatically).");
      }
    } catch (err) {
      notify.error("Error saving plans: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = async () => {
    if (!window.confirm("Are you sure you want to reset all 3 cards and payment details to default presets?")) return;
    setIsSaving(true);
    await resetPricingToDefaults();
    setPlans(DEFAULT_PRICING_PLANS);
    setPaymentInfo(DEFAULT_PAYMENT_INFO);
    setEditingPlans(DEFAULT_PRICING_PLANS);
    setEditingPayment(DEFAULT_PAYMENT_INFO);
    setIsSaving(false);
    setShowAdminEditModal(false);
    notify.info("Plans reset to default presets (Basic: Rs. 3,000 for 3 Months).");
  };

  // WhatsApp Contact Direct Link
  const getWhatsAppLink = (plan) => {
    const waNumber = (paymentInfo.adminWhatsApp || '923001234567').replace(/[^0-9]/g, '');
    const userEmail = currentUser?.email || 'N/A';
    const userName = currentUser?.name || 'Teacher';
    const text = encodeURIComponent(
      `السلام علیکم!\nمیں نے Pro Test Maker کا "${plan.name} Package (Rs. ${plan.price.toLocaleString()})" منتخب کیا ہے۔\nمیرا رجسٹرڈ ای میل: ${userEmail}\nنام: ${userName}\nبرائے مہربانی اکاؤنٹ ایکٹیویٹ فرما دیں۔ شکریہ!`
    );
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  return (
    <div className="w-full max-w-full p-3 sm:p-5 lg:p-7 space-y-6 font-sans animate-fadeIn box-border min-w-0">
      
      {/* 1. TOP HEADER & INTRO BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Subscription & Membership Plans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Select Your Subscription Package
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            امتحانات اور ٹیسٹ پیپرز باآسانی تیار کرنے کے لیے اپنی سہولت کے مطابق پیکیج کا انتخاب کریں۔ ایکٹیویشن فوری طور پر ہو جاتی ہے۔
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAdminEditor}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Settings className="w-4 h-4" />
              <span>Admin: Edit Cards & Pricing</span>
            </button>
          )}

          {/* If unapproved / unpaid, do NOT show Go to Dashboard! Only show Logout */}
          {!userSubscribed && !isAdmin ? (
            typeof onLogout === 'function' && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out (لاگ آؤٹ)</span>
              </button>
            )
          ) : (
            typeof onGoToDashboard === 'function' && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* 2A. PAYWALL LOCK BANNER FOR UNAPPROVED / UNPAID USERS */}
      {!isAdmin && !userSubscribed && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 rounded-2xl p-4 sm:p-5 text-white shadow-xl shadow-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-400/40 animate-pulse">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-sm sm:text-base">
                اکاؤنٹ غیر فعال ہے: پیپر بنانے کے لیے پیکیج حاصل کریں (Account Not Activated)
              </h3>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              معزز استاد! آپ کا اکاؤنٹ ابھی ایڈمن کی طرف سے منظور (Approve) نہیں ہوا۔ پیپر جنریٹر، ڈیش بورڈ اور سوالات کا ذخیرہ انلاک کرنے کے لیے نیچے دیا گیا کوئی پیکیج منتخب کریں اور فیس جمع کروا کر واٹس ایپ پر رسید بھیجیں۔
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-black bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
            <Shield className="w-4 h-4 text-amber-300" />
            <span>Status: Unpaid / Locked</span>
          </div>
        </div>
      )}

      {/* 2B. ACTIVE SUBSCRIBED USER NOTICE */}
      {!isAdmin && userSubscribed && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <h3 className="font-extrabold text-sm sm:text-base">
                آپ کا اکاؤنٹ فعال اور تصدیق شدہ ہے! (Active Subscription)
              </h3>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              پیکیج: <strong>{currentUser?.package}</strong> | میعاد: <strong>{currentUser?.expiryDate || 'Active'}</strong> | کوٹہ: <strong>{currentUser?.maxPapers === -1 ? 'Unlimited' : `${currentUser?.maxPapers} Papers`}</strong>
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-bold bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/25">
            <Award className="w-4 h-4 text-amber-300" />
            <span>All Features Unlocked</span>
          </div>
        </div>
      )}

      {/* LANGUAGE SELECTOR / OPTION SWITCHER: ENGLISH (DEFAULT) VS URDU */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 flex items-center gap-2">
              <span>Card Display Language</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {cardLang === 'en' ? 'English (Active)' : 'اردو (فعال ہے)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Switch cards display between clean English and Urdu
            </p>
          </div>
        </div>

        {/* Language Segmented Toggle Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleSetLang('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              cardLang === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧 English</span>
            {cardLang === 'en' && <span className="text-[9px] bg-blue-700 px-1 py-0.2 rounded text-blue-100">Default</span>}
          </button>
          <button
            type="button"
            onClick={() => handleSetLang('ur')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              cardLang === 'ur'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇵🇰 اردو (Urdu)</span>
          </button>
        </div>
      </div>

      {/* 3. THE 3 PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
        {plans.map((plan) => {
          const isPopular = Boolean(plan.popular);
          const isPlatinum = plan.id === 'platinum';

          const isUrdu = cardLang === 'ur';

          // Clean language-specific fields
          const planName = isUrdu ? (plan.nameUrdu || plan.name) : plan.name;
          const planBadge = isUrdu ? (plan.badgeUrdu || plan.badge) : plan.badge;
          const planDuration = isUrdu ? (plan.durationUrdu || plan.durationLabel) : `${plan.durationLabel} Access`;
          const durationDetail = isUrdu 
            ? `${plan.durationDays || 90} دن کی مکمل رسائی` 
            : `Valid for ${plan.durationDays || 90} Days`;
          
          const planQuota = isUrdu
            ? (plan.maxPapersUrdu || (plan.maxPapers === -1 || plan.maxPapers === '-1' ? 'لامحدود امتحانی پیپرز' : `${plan.maxPapers} امتحانی پیپرز`))
            : (plan.maxPapers === -1 || plan.maxPapers === '-1' ? 'Unlimited Examination Papers' : `${plan.maxPapers} Examination Papers`);

          // Select features: use Urdu list if in Urdu mode, otherwise clean English list
          const rawFeatures = isUrdu && Array.isArray(plan.featuresUrdu) && plan.featuresUrdu.length > 0
            ? plan.featuresUrdu
            : (Array.isArray(plan.features) ? plan.features : []);

          // In English mode, strip any remaining legacy Urdu in parentheses like (3 ماہ رسائی)
          const features = isUrdu
            ? rawFeatures
            : rawFeatures.map(f => typeof f === 'string' ? f.replace(/\s*\([^\)]*[\u0600-\u06FF]+[^\)]*\)/g, '').trim() : f);

          const quotaLabel = isUrdu ? 'امتحانی کوٹہ:' : 'Paper Quota:';
          const whatsIncludedLabel = isUrdu ? 'پیکیج کی خصوصیات:' : "What's Included:";
          const ctaLabel = isUrdu ? 'یہ پیکیج حاصل کریں' : 'Subscribe Now';

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isPopular
                  ? 'bg-white border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2'
                  : isPlatinum
                  ? 'bg-gradient-to-b from-white to-slate-50/80 border-2 border-purple-400/70 shadow-xl shadow-purple-500/10'
                  : 'bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50'
              }`}
            >
              {/* Popular / Best Value Ribbon */}
              {planBadge && (
                <div className={`py-1.5 px-4 text-center text-[11px] font-black uppercase tracking-wider ${
                  isPopular
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isPlatinum
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 border-b border-slate-200'
                }`}>
                  {planBadge}
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                
                {/* Plan Title & Subtitle + Language quick switch */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={isUrdu ? 'text-right' : 'text-left'}>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {planName}
                    </h2>
                    <span className="text-xs font-semibold text-slate-500">
                      {isUrdu ? 'پرو ٹیسٹ میکر امتحانی پیکیج' : 'Standard Examination Tier'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Per-Card Quick Toggle Option */}
                    <button
                      type="button"
                      onClick={() => handleSetLang(isUrdu ? 'en' : 'ur')}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black border border-slate-200 transition-colors cursor-pointer"
                      title={isUrdu ? 'Switch card to English' : 'Switch card to Urdu'}
                    >
                      {isUrdu ? 'EN' : 'اردو'}
                    </button>

                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-md ${
                      isPopular
                        ? 'bg-gradient-to-tr from-indigo-600 to-blue-500'
                        : isPlatinum
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500'
                        : 'bg-gradient-to-tr from-blue-600 to-cyan-500'
                    }`}>
                      {isPopular ? <Zap className="w-5 h-5" /> : isPlatinum ? <Award className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="my-4 p-4 rounded-2xl bg-slate-50/90 border border-slate-100/90 text-center">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    {planDuration}
                  </div>
                  <div className="flex items-baseline justify-center gap-1.5 mt-1">
                    <span className="text-xs font-extrabold text-slate-600">Rs.</span>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {Number(plan.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">
                    {durationDetail}
                  </div>
                </div>

                {/* Quota Highlights */}
                <div className={`mb-4 pb-4 border-b border-slate-100 flex items-center justify-between text-xs ${isUrdu ? 'flex-row-reverse' : ''}`}>
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {quotaLabel}
                  </span>
                  <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {planQuota}
                  </span>
                </div>

                {/* Features Bullet List */}
                <div className="space-y-2.5 flex-1 mb-6" dir={isUrdu ? 'rtl' : 'ltr'}>
                  <div className={`text-xs font-black uppercase tracking-wider text-slate-400 ${isUrdu ? 'text-right' : 'text-left'}`}>
                    {whatsIncludedLabel}
                  </div>
                  {features.map((feat, idx) => (
                    <div key={idx} className={`flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed ${isUrdu ? 'text-right' : 'text-left'}`}>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isPopular ? 'text-indigo-600' : isPlatinum ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Subscribe CTA Button */}
                <button
                  type="button"
                  onClick={() => handleOpenSubscribe(plan)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                    isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                      : isPlatinum
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/15'
                  }`}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className={`w-4 h-4 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PAYMENT & INSTRUCTIONS ACCORDION / FOOTER */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Official Payment Accounts & Support
              </h3>
              <p className="text-xs text-slate-500">
                رقم مندرجہ ذیل اکاؤنٹس میں بھیج کر رسید واٹس ایپ پر ارسال کریں
              </p>
            </div>
          </div>
          
          <a
            href={`https://wa.me/${(paymentInfo.adminWhatsApp || '923001234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام علیکم! مجھے Pro Test Maker کے پیکیج کے بارے میں معلومات چاہیے۔')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Admin Support</span>
          </a>
        </div>

        {/* 3 Payment Methods Columns & Note (Blurred for Regular Users) */}
        <div className="relative">
          <div className={!isAdmin ? "filter blur-md select-none pointer-events-none opacity-40 transition-all duration-300" : ""}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* EasyPaisa */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    EasyPaisa
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentInfo.easyPaisaNumber, 'easypaisa')}
                    className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-md cursor-pointer"
                    title="Copy Number"
                  >
                    {copiedField === 'easypaisa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono font-bold text-sm text-emerald-950">
                  {paymentInfo.easyPaisaNumber}
                </div>
                <div className="text-[11px] text-emerald-800">
                  Title: <strong>{paymentInfo.easyPaisaTitle}</strong>
                </div>
              </div>

              {/* JazzCash */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    JazzCash
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentInfo.jazzCashNumber, 'jazzcash')}
                    className="p-1 text-amber-700 hover:bg-amber-100 rounded-md cursor-pointer"
                    title="Copy Number"
                  >
                    {copiedField === 'jazzcash' ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono font-bold text-sm text-amber-950">
                  {paymentInfo.jazzCashNumber}
                </div>
                <div className="text-[11px] text-amber-800">
                  Title: <strong>{paymentInfo.jazzCashTitle}</strong>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    {paymentInfo.bankName || 'Meezan Bank'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(paymentInfo.bankAccountNumber, 'bank')}
                    className="p-1 text-blue-700 hover:bg-blue-100 rounded-md cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === 'bank' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono font-bold text-xs text-blue-950 truncate">
                  Acc: {paymentInfo.bankAccountNumber}
                </div>
                <div className="text-[11px] text-blue-800 truncate">
                  Title: <strong>{paymentInfo.bankAccountTitle}</strong>
                </div>
                {paymentInfo.bankIban && (
                  <div className="text-[10px] font-mono text-blue-600 truncate">
                    IBAN: {paymentInfo.bankIban}
                  </div>
                )}
              </div>

            </div>

            {/* Urdu note */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-center font-medium">
              {paymentInfo.instructions}
            </div>
          </div>

          {/* Blur Protection Lock Overlay for Users */}
          {!isAdmin && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center">
              <div className="bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 rounded-2xl p-5 sm:p-6 max-w-md mx-auto space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                    آفیشل ادائیگی اکاؤنٹس (Official Accounts)
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    پیکیج کی فیس جمع کروانے اور اکاؤنٹ ایکٹیویٹ کروانے کے لیے براہ کرم آفیشل ایڈمن واٹس ایپ پر رابطہ فرمائیں۔
                  </p>
                </div>
                <a
                  href={`https://wa.me/${(paymentInfo.adminWhatsApp || '923001234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام علیکم! مجھے Pro Test Maker کا پیکیج ایکٹیویٹ کروانا ہے، برائے مہربانی آفیشل پیمنٹ اکاؤنٹ نمبرز فراہم کریں۔')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Admin for Payment Info</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TEACHER SUBSCRIPTION MODAL                                             */}
      {/* ========================================================================= */}
      {selectedPlanForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative text-slate-800 space-y-5 animate-scaleUp">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPlanForSub(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Activate {selectedPlanForSub.name} Package
                </h3>
                <p className="text-xs text-slate-500">
                  اکاؤنٹ فوری ایکٹیویٹ کروانے کے لیے ہدایات پر عمل کریں
                </p>
              </div>
            </div>

            {/* Selected Plan Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">
                  Selected Plan
                </div>
                <div className="text-xl font-black">{selectedPlanForSub.name} ({selectedPlanForSub.durationLabel})</div>
                <div className="text-[11px] text-slate-300">
                  Quota: {selectedPlanForSub.maxPapers === -1 ? 'Unlimited Papers' : `${selectedPlanForSub.maxPapers} Papers`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-indigo-200 font-bold">Total Fee</div>
                <div className="text-2xl font-black text-amber-300">
                  Rs. {Number(selectedPlanForSub.price).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Payment Details Quick View */}
            <div className="space-y-2 text-xs">
              <div className="font-extrabold text-slate-700">1. فیس مندرجہ ذیل اکاؤنٹ میں منتقل کریں:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">EasyPaisa</div>
                  <div className="font-mono font-black text-emerald-700">{paymentInfo.easyPaisaNumber}</div>
                  <div className="text-[10px] text-slate-500">{paymentInfo.easyPaisaTitle}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">JazzCash</div>
                  <div className="font-mono font-black text-amber-700">{paymentInfo.jazzCashNumber}</div>
                  <div className="text-[10px] text-slate-500">{paymentInfo.jazzCashTitle}</div>
                </div>
              </div>
            </div>

            {/* Step 2: Send WhatsApp */}
            <div className="space-y-2 text-xs">
              <div className="font-extrabold text-slate-700">2. پیمنٹ کا اسکرین شاٹ واٹس ایپ پر بھیجیں:</div>
              <a
                href={getWhatsAppLink(selectedPlanForSub)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Activation Message (ایک کلک پر رابطہ)</span>
              </a>
            </div>

            {/* Step 3: Transaction ID / Proof Submission */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="font-extrabold text-slate-700">3. یا ٹرانزیکشن ID درج کر کے اطلاع جمع کروائیں:</div>
              {proofSubmitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>آپ کی درخواست اور رسید موصول ہو گئی ہے۔ ایڈمنسٹریٹر تصدیق کے بعد اکاؤنٹ چالو کر دے گا۔</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="TID نمبر یا بھیجنے والے کا فون نمبر..."
                    value={paymentTrxId}
                    onChange={(e) => setPaymentTrxId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <button
                    type="button"
                    disabled={isSubmittingProof || !paymentTrxId.trim()}
                    onClick={async () => {
                      if (!paymentTrxId.trim()) return;
                      setIsSubmittingProof(true);
                      await submitPaymentProof(currentUser?.email, {
                        planName: selectedPlanForSub.name,
                        amount: selectedPlanForSub.price,
                        trxId: paymentTrxId.trim()
                      });
                      setIsSubmittingProof(false);
                      setProofSubmitted(true);
                      notify.success("ادائیگی کی اطلاع ایڈمن کو بھیج دی گئی!");
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {isSubmittingProof ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>اطلاع بھیجیں</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Note */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                آپ کا ای میل <strong>({currentUser?.email || 'N/A'})</strong> خودکار طور پر پیغام میں شامل ہے۔ تصدیق کے بعد ایڈمن آپ کا اکاؤنٹ فوری طور پر ایکٹیو کر دے گا۔
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPlanForSub(null);
                setProofSubmitted(false);
                setPaymentTrxId('');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ADMIN PLAN EDITOR MODAL (SUPER ADMIN ONLY)                             */}
      {/* ========================================================================= */}
      {showAdminEditModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative text-slate-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Admin Pricing & Payment Editor
                  </h3>
                  <p className="text-xs text-slate-500">
                    تمام 3 پیکیج کارڈز کی قیمتیں، دورانیہ، فیچرز اور بینک ڈیٹیلز تبدیل کریں
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdminEditModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Navigation Tabs */}
            <div className="px-5 pt-3 border-b border-slate-200 flex items-center gap-2 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setAdminActiveTab('plans')}
                className={`px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                  adminActiveTab === 'plans'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Edit 3 Pricing Cards
              </button>
              <button
                type="button"
                onClick={() => setAdminActiveTab('payment')}
                className={`px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
                  adminActiveTab === 'payment'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Payment Accounts & WhatsApp
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              
              {/* TAB 1: EDIT THE 3 CARDS */}
              {adminActiveTab === 'plans' && (
                <div className="space-y-4">
                  
                  {/* Select which plan to edit */}
                  <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
                    {editingPlans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAdminSelectedPlanId(p.id)}
                        className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          adminSelectedPlanId === p.id
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {p.name} (Rs. {p.price})
                      </button>
                    ))}
                  </div>

                  {/* Active Selected Card Editor Fields */}
                  {(() => {
                    const planIndex = editingPlans.findIndex(p => p.id === adminSelectedPlanId);
                    if (planIndex === -1) return null;
                    const plan = editingPlans[planIndex];

                    const updateField = (field, value) => {
                      const updated = [...editingPlans];
                      updated[planIndex] = { ...updated[planIndex], [field]: value };
                      setEditingPlans(updated);
                    };

                    const updateFeature = (fIndex, value) => {
                      const updated = [...editingPlans];
                      const newFeats = [...(updated[planIndex].features || [])];
                      newFeats[fIndex] = value;
                      updated[planIndex] = { ...updated[planIndex], features: newFeats };
                      setEditingPlans(updated);
                    };

                    const addFeature = () => {
                      const updated = [...editingPlans];
                      const newFeats = [...(updated[planIndex].features || []), 'New Feature Point'];
                      updated[planIndex] = { ...updated[planIndex], features: newFeats };
                      setEditingPlans(updated);
                    };

                    const removeFeature = (fIndex) => {
                      const updated = [...editingPlans];
                      const newFeats = (updated[planIndex].features || []).filter((_, idx) => idx !== fIndex);
                      updated[planIndex] = { ...updated[planIndex], features: newFeats };
                      setEditingPlans(updated);
                    };

                    return (
                      <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Plan Name */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Plan Name (English)</label>
                            <input
                              type="text"
                              value={plan.name || ''}
                              onChange={(e) => updateField('name', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Plan Name Urdu */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Plan Name (Urdu)</label>
                            <input
                              type="text"
                              value={plan.nameUrdu || ''}
                              onChange={(e) => updateField('nameUrdu', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-right"
                            />
                          </div>

                          {/* Price (PKR) */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Price in PKR (e.g. 3000)</label>
                            <input
                              type="number"
                              value={plan.price || 0}
                              onChange={(e) => updateField('price', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Duration Label */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Duration (English, e.g. 3 Months)</label>
                            <input
                              type="text"
                              value={plan.durationLabel || ''}
                              onChange={(e) => updateField('durationLabel', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Duration Urdu */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Urdu, e.g. 3 ماہ)</label>
                            <input
                              type="text"
                              value={plan.durationUrdu || ''}
                              onChange={(e) => updateField('durationUrdu', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-right"
                            />
                          </div>

                          {/* Paper Limit */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Paper Limit (-1 for Unlimited)</label>
                            <input
                              type="number"
                              value={plan.maxPapers ?? -1}
                              onChange={(e) => updateField('maxPapers', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Card Badge English */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Card Badge (English, e.g. Starter)</label>
                            <input
                              type="text"
                              value={plan.badge || ''}
                              onChange={(e) => updateField('badge', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Card Badge Urdu */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Card Badge (Urdu, e.g. شروعاتی پلان)</label>
                            <input
                              type="text"
                              value={plan.badgeUrdu || ''}
                              onChange={(e) => updateField('badgeUrdu', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 text-right"
                            />
                          </div>
                        </div>

                        {/* Features Editor */}
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-black text-slate-700">Card Features (Bullets)</label>
                            <button
                              type="button"
                              onClick={addFeature}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Bullet</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(plan.features || []).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={(e) => updateFeature(fIdx, e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFeature(fIdx)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                                  title="Delete feature"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* TAB 2: EDIT PAYMENT DETAILS */}
              {adminActiveTab === 'payment' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* EasyPaisa */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">EasyPaisa Account Title</label>
                      <input
                        type="text"
                        value={editingPayment.easyPaisaTitle || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, easyPaisaTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">EasyPaisa Mobile Number</label>
                      <input
                        type="text"
                        value={editingPayment.easyPaisaNumber || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, easyPaisaNumber: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>

                    {/* JazzCash */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">JazzCash Account Title</label>
                      <input
                        type="text"
                        value={editingPayment.jazzCashTitle || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, jazzCashTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">JazzCash Mobile Number</label>
                      <input
                        type="text"
                        value={editingPayment.jazzCashNumber || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, jazzCashNumber: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={editingPayment.bankName || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, bankName: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account Title</label>
                      <input
                        type="text"
                        value={editingPayment.bankAccountTitle || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, bankAccountTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                      />
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        value={editingPayment.bankAccountNumber || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, bankAccountNumber: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bank IBAN (Optional)</label>
                      <input
                        type="text"
                        value={editingPayment.bankIban || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, bankIban: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admin WhatsApp Number (e.g. 923001234567 - without plus or dashes)
                      </label>
                      <input
                        type="text"
                        value={editingPayment.adminWhatsApp || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, adminWhatsApp: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Urdu Payment Instructions</label>
                      <textarea
                        rows={2}
                        value={editingPayment.instructions || ''}
                        onChange={(e) => setEditingPayment(p => ({ ...p, instructions: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium text-right"
                      />
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handleResetDefaults}
                disabled={isSaving}
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Reset to Presets
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminEditModal(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdminPlans}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save All Changes to Cloud</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
