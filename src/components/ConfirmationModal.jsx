import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, Trash2, RotateCcw, X, Check } from 'lucide-react';
import { registerConfirmHandler } from '../utils/confirmDialog';

export default function ConfirmationModal() {
  const [dialogState, setDialogState] = useState(null);

  useEffect(() => {
    registerConfirmHandler((config) => {
      setDialogState(config);
    });
    return () => registerConfirmHandler(null);
  }, []);

  useEffect(() => {
    if (!dialogState) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogState]);

  if (!dialogState) return null;

  const {
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    onConfirm,
    onCancel
  } = dialogState;

  const handleConfirm = () => {
    const cb = onConfirm;
    setDialogState(null);
    cb?.();
  };

  const handleCancel = () => {
    const cb = onCancel;
    setDialogState(null);
    cb?.();
  };

  // Determine icon & color theme
  let icon = <AlertTriangle className="w-7 h-7 text-amber-600" />;
  let iconBg = 'bg-amber-100/90 border-amber-200 text-amber-600 ring-4 ring-amber-50';
  let confirmBtnClass = 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md shadow-amber-600/25';

  if (type === 'danger') {
    icon = <Trash2 className="w-7 h-7 text-rose-600" />;
    iconBg = 'bg-rose-100/90 border-rose-200 text-rose-600 ring-4 ring-rose-50';
    confirmBtnClass = 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-md shadow-rose-600/25';
  } else if (type === 'info') {
    icon = <Info className="w-7 h-7 text-blue-600" />;
    iconBg = 'bg-blue-100/90 border-blue-200 text-blue-600 ring-4 ring-blue-50';
    confirmBtnClass = 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-600/25';
  } else if (title?.toLowerCase().includes('reset') || title?.toLowerCase().includes('discard')) {
    icon = <RotateCcw className="w-7 h-7 text-amber-600" />;
  }

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 no-print"
      onClick={handleCancel}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden animate-in zoom-in-95 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close 'X' button top right */}
        <button
          type="button"
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Header Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs mb-4 transition-transform ${iconBg}`}>
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>

          {/* Description / Message */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed max-w-sm whitespace-pre-line">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 w-full mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300 border border-slate-200/80 transition-all cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              autoFocus
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${confirmBtnClass}`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
