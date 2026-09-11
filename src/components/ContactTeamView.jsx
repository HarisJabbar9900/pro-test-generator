import React, { useState } from 'react';
import { 
  Mail, Phone, MessageSquare, Copy, Check, ExternalLink, 
  ShieldCheck, Sparkles, Send, User, MessageCircle, Clock, HeartHandshake,
  CheckCircle2, ArrowRight, ArrowLeft, HelpCircle, ChevronDown, ChevronUp,
  Building2, Award, Zap, Headphones, Laptop, FileText
} from 'lucide-react';
import { notify } from '../utils/notify';

export default function ContactTeamView({
  currentUser = null,
  onGoToGenerate,
  onResumeCurrentDraft,
  hasActiveDraft = false
}) {
  const [copiedField, setCopiedField] = useState(null); // 'phone' | 'email' | null
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    subject: 'Package & Account Activation',
    message: ''
  });

  const contactDetails = {
    teamName: 'Pro Test Maker Official Team',
    contactPerson: 'Haris Jabbar',
    role: 'Head of Operations & System Administrator',
    phoneDisplay: '0333-4354374',
    phoneRaw: '+923334354374',
    email: 'testgenerator76@gmail.com',
    whatsappNumber: '923334354374'
  };

  const handleCopy = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      notify.success(`Copied ${fieldName === 'phone' ? 'Phone Number' : 'Email Address'} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (e) {
      notify.info(`Contact: ${text}`);
    }
  };

  const openEmailInGmail = () => {
    const su = encodeURIComponent(`[PTM Inquiry] ${formData.subject} - from ${formData.name || currentUser?.name || 'Educator'}`);
    const bo = encodeURIComponent(
      formData.message 
        ? `Dear Haris Jabbar & Pro Test Maker Team,\n\n${formData.message}\n\n---------------------------\nSender Name: ${formData.name || currentUser?.name || 'Educator'}\nSender Email: ${formData.email || currentUser?.email || 'N/A'}\nSender Phone/WhatsApp: ${formData.phone || 'N/A'}\nPlatform Status: ${currentUser ? 'Registered Educator' : 'Visitor'}`
        : `Dear Haris Jabbar & Pro Test Maker Team,\n\nI would like to inquire about Pro Test Maker platform services.\n\nFrom: ${formData.name || currentUser?.name || 'Educator'} (${formData.email || currentUser?.email || ''})`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactDetails.email}&su=${su}&body=${bo}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    notify.success("Opening Gmail Compose directly in browser...");
  };

  const openEmailInDefaultApp = () => {
    const su = encodeURIComponent(`[PTM Inquiry] ${formData.subject} - from ${formData.name || currentUser?.name || 'Educator'}`);
    const bo = encodeURIComponent(
      formData.message 
        ? `Dear Haris Jabbar & Pro Test Maker Team,\n\n${formData.message}\n\n---------------------------\nSender Name: ${formData.name || currentUser?.name || 'Educator'}\nSender Email: ${formData.email || currentUser?.email || 'N/A'}\nSender Phone/WhatsApp: ${formData.phone || 'N/A'}`
        : `Dear Haris Jabbar & Pro Test Maker Team,\n\nI would like to inquire about Pro Test Maker.\n\nFrom: ${formData.name || currentUser?.name || 'Educator'}`
    );
    window.location.href = `mailto:${contactDetails.email}?subject=${su}&body=${bo}`;
    notify.info("Opening your device's default mail app...");
  };

  const handleSendWhatsApp = () => {
    const textEncoded = encodeURIComponent(
      `*Assalam-o-Alaikum Haris Jabbar / Pro Test Maker Team!*\n\n` +
      `*Name:* ${formData.name || currentUser?.name || 'Educator'}\n` +
      `*Email:* ${formData.email || currentUser?.email || 'N/A'}\n` +
      `*Contact Number:* ${formData.phone || 'N/A'}\n` +
      `*Topic:* ${formData.subject}\n\n` +
      `*Message:* ${formData.message || 'I need direct assistance regarding Pro Test Maker subscriptions / paper generation.'}`
    );
    window.open(`https://wa.me/${contactDetails.whatsappNumber}?text=${textEncoded}`, '_blank');
  };

  const faqs = [
    {
      q: "How do I activate my Pro Test Maker subscription package?",
      a: "Select your desired plan from the Subscription Plans page, transfer the fee via EasyPaisa or JazzCash to Haris Jabbar (0333-4354374), and share the payment screenshot on WhatsApp. Your account is activated instantly within 5 minutes."
    },
    {
      q: "Can I customize the Academy Name, Logo and Watermark on tests?",
      a: "Yes! Every single layout supports full personalization. Go to 'Default Paper Settings' to choose from 13+ board exam headers, set your institute's title, tagline, watermark, font sizes, and MCQ column arrangements."
    },
    {
      q: "Are the questions verified according to the latest Pakistani board syllabus?",
      a: "Absolutely. All MCQs, Short Questions, and Long Questions are mapped chapter-by-chapter and topic-by-topic matching official Punjab, Federal (FBISE), and National Curriculum textbooks."
    },
    {
      q: "What if I need custom material or specific subject addition?",
      a: "Reach out to Haris Jabbar directly via WhatsApp (0333-4354374) or email (testgenerator76@gmail.com). We provide rapid question bank updates and customized institutional solutions for academies and schools."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 font-sans select-none animate-fadeIn pb-16">
      
      {/* 1. TOP BREADCRUMB & RETURN BAR */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span 
            onClick={onGoToGenerate}
            className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Home</span>
          </span>
          <span>/</span>
          <span className="text-slate-900 font-black">Contact Pro Test Maker Team</span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveDraft && typeof onResumeCurrentDraft === 'function' && (
            <button
              type="button"
              onClick={onResumeCurrentDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Active Paper</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoToGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* 2. HERO BANNER */}
      <div className="relative bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white py-10 sm:py-16 px-4 sm:px-8 overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Dedicated Administrative & Support Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight">
            We’re Here to Support Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Teaching Excellence</span>.
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
            Have questions about package activation, custom test paper headers, or institutional licenses? Connect directly with Haris Jabbar & the Pro Test Maker engineering team.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Founder Communication</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-300" />
              <span>Under 10-Minute Response Time</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Super Admin Access</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER (FULL WIDTH RESPONSIVE GRID) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-8 relative z-10 space-y-8">
        
        {/* HARIS JABBAR SPOTLIGHT BANNER */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 w-full md:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md ring-4 ring-blue-50 shrink-0">
              HJ
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {contactDetails.contactPerson}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold border border-emerald-300 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Head of Operations & Super Admin</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium max-w-xl leading-relaxed">
                "Pro Test Maker is engineered to eliminate exam preparation stress for Pakistani educators, academies, and institutions. Every inquiry is personally addressed."
              </p>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp Direct</span>
            </button>
            <button
              type="button"
              onClick={openEmailInGmail}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Compose Gmail</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN PRIMARY CONTACT HUB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* CARD 1: PHONE & WHATSAPP */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-5 sm:space-y-6 hover:shadow-xl transition-shadow">
            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Instant Response</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Phone & WhatsApp Channel
                </span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <a 
                    href={`tel:${contactDetails.phoneRaw}`}
                    className="text-xl sm:text-3xl font-black text-slate-900 hover:text-emerald-700 transition-colors tracking-tight font-mono break-all"
                  >
                    {contactDetails.phoneDisplay}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(contactDetails.phoneDisplay, 'phone')}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer shadow-2xs shrink-0"
                    title="Copy phone number"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Available for direct calls and 24/7 WhatsApp messaging across Pakistan.
                </p>
              </div>
            </div>

            {/* BUTTONS DIRECTLY UNDER PHONE NUMBER */}
            <div className="pt-4 border-t border-slate-100 flex flex-col xs:flex-row items-stretch gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Chat on WhatsApp</span>
              </button>

              <a
                href={`tel:${contactDetails.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all cursor-pointer shrink-0"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* CARD 2: DIRECT OFFICIAL EMAIL */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-5 sm:space-y-6 hover:shadow-xl transition-shadow">
            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-xs">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 flex items-center gap-1">
                  <span>Official Inbox</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Administrative Email
                </span>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <a 
                    href={`mailto:${contactDetails.email}`}
                    className="text-base sm:text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors tracking-tight truncate block max-w-[calc(100%-40px)]"
                    title={contactDetails.email}
                  >
                    {contactDetails.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(contactDetails.email, 'email')}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer shadow-2xs shrink-0"
                    title="Copy email address"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Direct email communication for partnerships, enterprise licenses & receipts.
                </p>
              </div>
            </div>

            {/* BUTTONS DIRECTLY UNDER EMAIL ADDRESS */}
            <div className="pt-4 border-t border-slate-100 flex flex-col xs:flex-row items-stretch gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={openEmailInGmail}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Open in Gmail Direct</span>
              </button>

              <button
                type="button"
                onClick={openEmailInDefaultApp}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all cursor-pointer shrink-0"
                title="Send via system default mail software (Outlook, Apple Mail)"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Mail App</span>
              </button>
            </div>
          </div>

        </div>

        {/* 4. INTERACTIVE MESSAGE COMPOSER */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Send a Direct Message to Haris Jabbar</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Fill in your message below and choose your preferred delivery channel (Gmail, WhatsApp, or Mail App).
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
              100% Confidential
            </span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              openEmailInGmail();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your Name / Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Prof. Tariq Mahmood"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. teacher@academy.edu.pk"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">WhatsApp / Phone (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. 0300-1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Topic of Inquiry</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white cursor-pointer"
              >
                <option value="Package & Account Activation">⚡ Package & Account Activation (Quick Activation)</option>
                <option value="Question Bank Addition Request">📚 Question Bank Addition / Subject Request</option>
                <option value="Technical Support & Paper Formatting">🛠️ Technical Support & Paper Formatting</option>
                <option value="Institutional License / Academy Deal">🏫 School / Academy Institutional License</option>
                <option value="Other Inquiries">💬 General Inquiries & Suggestions</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Your Message Details</label>
              <textarea
                rows={4}
                required
                placeholder="Type your message, questions, or specific academy requirements here..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none bg-slate-50/50"
              />
            </div>

            {/* ACTION BUTTONS ROW */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Choose how you would like to transmit this message:
              </span>

              <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Send via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={openEmailInDefaultApp}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Mail App</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Open in Gmail Direct</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 5. WHY CONTACT US / TRUST HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Instant Verification</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Transferred your package fee? WhatsApp the slip to Haris Jabbar for activation in under 5 minutes.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Institutional Customization</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We personalize custom headers, logos, and specific exam layouts for schools and academies.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Dedicated Teacher Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              24/7 direct guidance for test formatting, bilingual questions, and syllabus adjustments.
            </p>
          </div>
        </div>

        {/* 6. INTERACTIVE FAQS */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Common Teacher Inquiries</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 font-medium border-t border-slate-200/60 pt-3 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
