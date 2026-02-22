import { toast } from "sonner";

export const showSuccess = (message: string) =>
  toast.success(message, { duration: 3000 });

export const showError = (message: string) =>
  toast.error(message, { duration: 5000 });

export const showInfo = (message: string) =>
  toast.info(message, { duration: 3000 });

export const showWarning = (message: string) =>
  toast.warning(message, { duration: 4000 });

export const showPromise = <T,>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) =>
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
