import React, { useState } from 'react';
import { 
  X, Mail, Phone, MessageSquare, Copy, Check, ExternalLink, 
  ShieldCheck, Sparkles, Send, User, MessageCircle, Clock, HeartHandshake
} from 'lucide-react';
import { notify } from '../utils/notify';

export default function ContactTeamModal({
  isOpen,
  onClose,
  currentUser = null
}) {
  const [copiedField, setCopiedField] = useState(null); // 'phone' | 'email' | null
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    subject: 'General Inquiry',
    message: ''
  });

  if (!isOpen) return null;

  const contactDetails = {
    teamName: 'Pro Test Maker Team',
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
      notify.success(`Copied ${fieldName === 'phone' ? 'Phone number' : 'Email address'} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (e) {
      notify.info(`Contact: ${text}`);
    }
  };

  const openEmailInGmail = (customSubject, customBody) => {
    const su = encodeURIComponent(customSubject || `[PTM Inquiry] ${formData.subject || 'Platform Inquiry'} - from ${formData.name || currentUser?.name || 'Educator'}`);
    const bo = encodeURIComponent(
      customBody || 
      (formData.message 
        ? `Dear Haris Jabbar & Pro Test Maker Team,\n\n${formData.message}\n\n---------------------------\nSender: ${formData.name || currentUser?.name || 'Educator'} (${formData.email || currentUser?.email || 'N/A'})`
        : `Dear Haris Jabbar & Pro Test Maker Team,\n\nI would like to inquire about Pro Test Maker platform services.\n\nFrom: ${currentUser?.name || ''} (${currentUser?.email || ''})`)
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactDetails.email}&su=${su}&body=${bo}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    notify.success("Opening Gmail Compose directly in browser...");
  };

  const openEmailInDefaultApp = (customSubject, customBody) => {
    const su = encodeURIComponent(customSubject || `[PTM Inquiry] ${formData.subject || 'Platform Inquiry'} - from ${formData.name || currentUser?.name || 'Educator'}`);
    const bo = encodeURIComponent(
      customBody || 
      (formData.message 
        ? `Dear Haris Jabbar & Pro Test Maker Team,\n\n${formData.message}\n\n---------------------------\nSender: ${formData.name || currentUser?.name || 'Educator'} (${formData.email || currentUser?.email || 'N/A'})`
        : `Dear Haris Jabbar & Pro Test Maker Team,\n\nI would like to inquire about Pro Test Maker.\n\nFrom: ${currentUser?.name || ''}`)
    );
    window.location.href = `mailto:${contactDetails.email}?subject=${su}&body=${bo}`;
    notify.info("Opening device default mail client...");
  };

  const handleSendEmail = (e) => {
    e?.preventDefault();
    openEmailInGmail(
      `[PTM Inquiry] ${formData.subject} - from ${formData.name || 'Educator'}`,
      `Dear Haris Jabbar & Pro Test Maker Team,\n\n${formData.message}\n\n---------------------------\nSender: ${formData.name || currentUser?.name || 'Educator'} (${formData.email || currentUser?.email || 'N/A'})\nRole: ${currentUser ? 'Registered Teacher' : 'Visitor'}`
    );
  };

  const handleSendWhatsApp = () => {
    const textEncoded = encodeURIComponent(
      `*Assalam-o-Alaikum Haris Jabbar / Pro Test Maker Team!*\n\n` +
      `*Name:* ${formData.name || currentUser?.name || 'Educator'}\n` +
      `*Email:* ${formData.email || currentUser?.email || 'N/A'}\n` +
      `*Subject:* ${formData.subject}\n` +
      `*Message:* ${formData.message || 'I need information about Pro Test Maker subscription/support.'}`
    );
    window.open(`https://wa.me/${contactDetails.whatsappNumber}?text=${textEncoded}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="relative bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e3a8a] text-white p-5 sm:p-6 select-none shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-blue-300" />
                <span>Official Support & Contact</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{contactDetails.teamName}</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Direct communication with administrator for subscriptions, technical support & partnerships.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          
          {/* ADMINISTRATOR CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                  HJ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                      {contactDetails.contactPerson}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {contactDetails.role}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-slate-400" /> 24/7 Priority Support
                </span>
              </div>
            </div>

            {/* DIRECT CONTACT CHANNELS (2 COLUMNS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* 1. Phone / WhatsApp Card */}
              <div className="flex flex-col justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone / WhatsApp</div>
                      <a 
                        href={`tel:${contactDetails.phoneRaw}`} 
                        className="text-xs sm:text-sm font-black text-slate-900 hover:text-emerald-700 truncate block transition-colors"
                      >
                        {contactDetails.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(contactDetails.phoneDisplay, 'phone')}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Copy phone number"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Actions directly under phone number */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                    title="Chat directly on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Chat on WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${contactDetails.phoneRaw}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer shrink-0"
                    title="Call this number directly"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* 2. Direct Email Card */}
              <div className="flex flex-col justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Email</div>
                      <a 
                        href={`mailto:${contactDetails.email}`}
                        className="text-xs sm:text-sm font-black text-slate-900 hover:text-blue-600 truncate block transition-colors"
                        title={contactDetails.email}
                      >
                        {contactDetails.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(contactDetails.email, 'email')}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Actions directly under email */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEmailInGmail()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                    title="Open Gmail compose directly in browser"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>Open in Gmail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEmailInDefaultApp()}
                    className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer shrink-0"
                    title="Open default desktop mail app (Outlook, Windows Mail, Apple Mail)"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mail App</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* QUICK DIRECT INQUIRY MESSAGE FORM */}
          <form onSubmit={handleSendEmail} className="space-y-3 pt-1 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Send Quick Message to Admin</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Delivers directly to admin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Your Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Professor Ahmad"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Inquiry Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white"
                >
                  <option value="Package & Account Activation">Package & Account Activation</option>
                  <option value="Question Bank Addition Request">Question Bank Addition Request</option>
                  <option value="Technical Support & Paper Formatting">Technical Support & Paper Formatting</option>
                  <option value="Institutional License / Academy Deal">Institutional License / Academy Deal</option>
                  <option value="Other Inquiries">Other Inquiries</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">Message Details</label>
              <textarea
                rows={3}
                required
                placeholder="Write your question, feedback, or requirements for Haris Jabbar & the team..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => openEmailInDefaultApp(`[PTM Inquiry] ${formData.subject}`, formData.message)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Send using device default mail app (Outlook, Windows Mail, Apple Mail)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mail App</span>
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Directly opens Gmail compose with your message"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open in Gmail Direct</span>
              </button>
            </div>
          </form>

        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-500 font-medium shrink-0">
          <div className="flex items-center gap-1 text-slate-600">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
            <span>Dedicated to Pakistani Educators & Academies</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
