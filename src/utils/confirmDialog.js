/**
 * Professional Promise-based Confirmation Dialog Service
 * Replaces ugly browser native window.confirm() with modern, elegant UI modals.
 */

let activeHandler = null;

export function registerConfirmHandler(handler) {
  activeHandler = handler;
}

/**
 * Trigger a confirmation dialog.
 * @param {Object|string} options - Configuration object or prompt message
 * @param {string} [options.title] - Dialog title (e.g. "Reset Paper", "Delete Subject")
 * @param {string} [options.message] - Description / warning text
 * @param {string} [options.confirmText] - Label on confirm button (default: "Confirm")
 * @param {string} [options.cancelText] - Label on cancel button (default: "Cancel")
 * @param {'danger'|'warning'|'info'} [options.type] - Dialog style/intent (default: 'warning')
 * @param {Function} [options.onConfirm] - Optional direct callback
 * @param {Function} [options.onCancel] - Optional direct cancel callback
 * @returns {Promise<boolean>} Resolves true if confirmed, false if cancelled
 */
export function confirmAction(options) {
  const opts = typeof options === 'string' ? { message: options } : (options || {});

  if (activeHandler) {
    return new Promise((resolve) => {
      activeHandler({
        title: opts.title || (opts.type === 'danger' ? 'Confirm Deletion' : 'Please Confirm'),
        message: opts.message || 'Are you sure you want to proceed?',
        confirmText: opts.confirmText || (opts.type === 'danger' ? 'Delete' : 'Confirm'),
        cancelText: opts.cancelText || 'Cancel',
        type: opts.type || 'warning',
        onConfirm: () => {
          opts.onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          opts.onCancel?.();
          resolve(false);
        }
      });
    });
  }

  // Fallback if dialog component is not yet mounted
  const fallbackResult = window.confirm(opts.message || 'Are you sure?');
  if (fallbackResult) opts.onConfirm?.();
  else opts.onCancel?.();
  return Promise.resolve(fallbackResult);
}

export default confirmAction;
