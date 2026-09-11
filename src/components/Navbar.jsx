import React, { useState } from 'react';
import { 
  FileText, Printer, Download, Sparkles, BookOpen, Eye, Settings, 
  Layers, Cloud, CheckCircle2, AlertTriangle, ExternalLink, X, RefreshCw 
} from 'lucide-react';
import { testFirebaseConnection } from '../utils/firebaseBankService';

export default function Navbar({
  selectedClass,
  activeView,
  setActiveView,
  onPrintPaper,
  onExportDocx,
  showAnswerKey,
  onToggleAnswerKey,
  totalPaperMarks
}) {
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [testingStatus, setTestingStatus] = useState(null); // null | 'testing' | { success: boolean, message: string }

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    const result = await testFirebaseConnection();
    setTestingStatus(result);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-lg tracking-tight text-slate-900">
                    PaperGen <span className="text-indigo-600">Pro</span>
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {selectedClass} Class
                  </span>
                  {/* Clickable Firebase Badge */}
                  <button
                    onClick={() => {
                      setShowFirebaseModal(true);
                      handleTestConnection();
                    }}
                    title="Click to check Firebase live connection"
                    className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Firebase Live Check</span>
                    <Cloud className="w-3 h-3 text-emerald-600 ml-0.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Topic-wise Question Bank & Test Paper Builder</p>
              </div>
            </div>

          {/* Center Navigation Tabs: 1. Paper Banayein vs 2. Material Upload vs 3. Uploaded Directory */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveView('generator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'generator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Paper Banayein</span>
            </button>
            <button
              onClick={() => setActiveView('upload')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'upload'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>2. Material Upload Karein</span>
            </button>
            <button
              onClick={() => setActiveView('directory')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'directory'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. Uploaded Topics Directory</span>
            </button>
          </div>

          {/* Right Controls & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Marks Badge (when in generator view) */}
            {activeView === 'generator' && (
              <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Total Marks</span>
                <span className="text-xs font-bold text-amber-600">{totalPaperMarks} Marks</span>
              </div>
            )}

            {/* Answer Key Toggle */}
            {activeView === 'generator' && (
              <button
                onClick={onToggleAnswerKey}
                title="Toggle Teacher Answer Key / Solution Sheet"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  showAnswerKey
                    ? 'bg-emerald-600/90 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{showAnswerKey ? 'Answer Key ON' : 'Answer Key'}</span>
              </button>
            )}

            {/* Export & Print */}
            {activeView === 'generator' && (
              <button
                onClick={onPrintPaper}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            )}

            {activeView === 'generator' && (
              <button
                onClick={onExportDocx}
                title="Export as Word (.docx)"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Word</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>

    {/* FIREBASE CONNECTION DIAGNOSTIC MODAL */}
    {showFirebaseModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn text-slate-800">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
          
          <button
            onClick={() => setShowFirebaseModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Firebase Connection Status</h2>
              <p className="text-xs text-slate-500">Real-time Cloud Sync & Database Diagnostics</p>
            </div>
          </div>

          {/* Test Status Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Cloud Ping</span>
              <button
                onClick={handleTestConnection}
                disabled={testingStatus === 'testing'}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>Test Now</span>
              </button>
            </div>

            {testingStatus === 'testing' ? (
              <div className="flex items-center gap-2 text-sm text-amber-700 py-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Testing connection to Firebase Firestore...</span>
              </div>
            ) : testingStatus?.connected ? (
              <div className="flex items-start gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <span className="font-bold block">100% Connected & Verified!</span>
                  <span className="text-xs text-emerald-700">{testingStatus.message}</span>
                </div>
              </div>
            ) : testingStatus ? (
              <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold block">Status Note:</span>
                  <span className="text-xs text-slate-700">{testingStatus.message}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Click "Test Now" to ping your Firebase project.</div>
            )}
          </div>

          {/* Connected Firebase Details */}
          <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Project ID:</span>
              <span className="font-mono font-semibold text-indigo-700">protestmaker-bf157</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Auth Domain:</span>
              <span className="font-mono text-slate-700">protestmaker-bf157.firebaseapp.com</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Storage Bucket:</span>
              <span className="font-mono text-slate-700">protestmaker-bf157.firebasestorage.app</span>
            </div>
          </div>

          {/* How to verify in Firebase Console */}
          <div className="text-xs text-slate-600 space-y-1.5 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="font-semibold text-slate-800">Firebase Console me kesy check karen?</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-600 underline inline-flex items-center gap-0.5">console.firebase.google.com <ExternalLink className="w-3 h-3" /></a></li>
              <li>Apna project <strong>protestmaker-bf157</strong> open karen.</li>
              <li>Left menu se <strong>Firestore Database</strong> par click karen.</li>
              <li>Wahan aapko <strong>question_banks</strong> collection aur <strong>main_bank</strong> document nazar aayega jisme aapke saare uploaded questions save ho rahe hain!</li>
            </ol>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowFirebaseModal(false)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    )}
    </>
  );
}

