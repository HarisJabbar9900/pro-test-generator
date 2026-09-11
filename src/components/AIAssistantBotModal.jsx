import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, Sparkles, ShieldCheck, ShieldAlert, 
  RotateCcw, Copy, Check, MessageSquare, Sliders, ExternalLink, HelpCircle
} from 'lucide-react';
import { fetchBotConfig, askAssistantBot, DEFAULT_BOT_RULES } from '../utils/aiBotService';
import { isSuperAdmin } from '../utils/pricingPlansService';
import AdminBotRulesModal from './AdminBotRulesModal';

export default function AIAssistantBotModal({
  isOpen,
  onClose,
  currentUser,
  onOpenPricing,
  onOpenContact
}) {
  const [botConfig, setBotConfig] = useState(DEFAULT_BOT_RULES);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: DEFAULT_BOT_RULES.welcomeMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showAdminRules, setShowAdminRules] = useState(false);
  
  const messagesEndRef = useRef(null);
  const isAdmin = isSuperAdmin(currentUser);

  // Load Cloud Rules from Firestore on mount
  useEffect(() => {
    fetchBotConfig().then(cfg => {
      setBotConfig(cfg);
      setMessages([
        {
          id: 'msg-1',
          sender: 'bot',
          text: cfg.welcomeMessage || DEFAULT_BOT_RULES.welcomeMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }).catch(() => {});
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const botAnswer = await askAssistantBot(text, botConfig);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            sender: 'bot',
            text: botAnswer,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 400);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: "I apologize, but I encountered a temporary problem processing your question. Please feel free to ask again or contact our team directly!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: botConfig.welcomeMessage || DEFAULT_BOT_RULES.welcomeMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickQuestions = [
    "How to generate an exam paper?",
    "What are the subscription plans & fees?",
    "Does it include Teacher Answer Keys?",
    "How are textbook exercise questions separated?",
    "Can I put my School Logo and Watermark?"
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 bg-slate-950/60 backdrop-blur-xs no-print animate-fadeIn">
        <div className="w-full sm:max-w-md h-full sm:h-[620px] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col justify-between overflow-hidden relative">
          
          {/* TOP BAR */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6 text-cyan-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm tracking-tight text-white">{botConfig.botName}</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">AI</span>
                </div>
                <p className="text-[11px] text-blue-200">Official Website & Curriculum Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Admin Rule Editor Button */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAdminRules(true)}
                  className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-colors"
                  title="Admin: Edit Bot Behavior & Guardrail Rules"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES SCROLL AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            
            {/* Confidentiality Assurance Notice */}
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ask me anything about creating tests, PECTAA syllabus, packages, and features. Confidential data is securely protected.</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-xs shadow-xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line break-words">{msg.text}</div>
                  
                  {/* Action Copy for Bot Message */}
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="absolute -right-7 top-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                      title="Copy Answer"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 px-1 mt-0.5">{msg.time}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-xs w-20">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTIONS CAROUSEL */}
          <div className="p-2 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-[11px] font-medium text-slate-700 shrink-0 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about test generation, packages, syllabus..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-800 font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-blue-600/25 cursor-pointer transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* ADMIN RULES MODAL (ACCESSIBLE ONLY TO ADMINS) */}
      {isAdmin && showAdminRules && (
        <AdminBotRulesModal
          isOpen={showAdminRules}
          onClose={() => setShowAdminRules(false)}
          currentConfig={botConfig}
          currentUser={currentUser}
          onConfigSaved={(updated) => setBotConfig(updated)}
        />
      )}
    </>
  );
}
