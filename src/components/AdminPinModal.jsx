import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminPinModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Get stored pin or default to 1234
  const getStoredPin = () => {
    return localStorage.getItem('protestgenerator_admin_pin') || '1234';
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const correctPin = getStoredPin();

    if (pin.trim() === correctPin) {
      setErrorMsg('');
      setPin('');
      onSuccess();
    } else {
      setErrorMsg('Incorrect PIN! Default PIN is 1234');
    }
  };

  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = getStoredPin();

    if (currentPinInput.trim() !== correctPin) {
      setErrorMsg('Current PIN is incorrect!');
      return;
    }

    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      setErrorMsg('New PIN must be at least 4 digits!');
      return;
    }

    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setErrorMsg('New PIN and Confirm PIN do not match!');
      return;
    }

    localStorage.setItem('protestgenerator_admin_pin', newPinInput.trim());
    setChangeSuccessMsg('PIN successfully updated!');
    setErrorMsg('');
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => {
      setIsChangingPin(false);
      setChangeSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-slate-800">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon & Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {isChangingPin ? 'Change Admin PIN' : 'Admin Portal Access'}
          </h2>
          <p className="text-xs text-slate-500">
            {isChangingPin 
              ? 'Update your secret admin passkey' 
              : 'Enter your 4-digit security PIN to unlock material upload & management'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {changeSuccessMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{changeSuccessMsg}</span>
          </div>
        )}

        {/* FORM 1: PIN VERIFICATION */}
        {!isChangingPin ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                Enter Security PIN
              </label>
              <input
                type="password"
                maxLength="8"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="• • • •"
                className="w-full text-center tracking-[0.6em] text-2xl font-black py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900"
              />
              <p className="text-[11px] text-slate-400 text-center mt-1">
                Default PIN: <span className="font-mono font-bold text-blue-600">1234</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={!pin}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(true);
                  setErrorMsg('');
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Change Admin PIN ⚙️
              </button>
            </div>
          </form>
        ) : (
          /* FORM 2: CHANGE PIN */
          <form onSubmit={handleChangePinSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Current PIN</label>
              <input
                type="password"
                maxLength="8"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="Current PIN (e.g. 1234)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">New PIN</label>
              <input
                type="password"
                maxLength="8"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="New 4-8 digit PIN"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Confirm New PIN</label>
              <input
                type="password"
                maxLength="8"
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="Repeat New PIN"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPin(false);
                  setErrorMsg('');
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Save PIN
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
