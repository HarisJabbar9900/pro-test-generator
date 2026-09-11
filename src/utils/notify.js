import { toast } from 'sonner';
import { confirmAction } from './confirmDialog.js';

/**
 * Modern notification and alert service powered by Sonner.
 */
export const notify = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3500,
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4500,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      duration: 3500,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      duration: 4000,
      ...options,
    });
  },

  promise: (promise, options = {}) => {
    return toast.promise(promise, options);
  },

  confirm: (options) => {
    return confirmAction(options);
  },

  dismiss: (id) => {
    toast.dismiss(id);
  },

  custom: (jsx, options = {}) => {
    return toast.custom(jsx, options);
  },
};

export { toast, confirmAction };
export default notify;
