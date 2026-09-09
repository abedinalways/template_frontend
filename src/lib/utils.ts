import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Safely extracts human-readable error message from unknown error objects (e.g. RTK Query errors, fetch errors)
 */
export function getErrorMessage(error: unknown, fallbackMessage = "An unexpected error occurred"): string {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    // RTK Query FetchBaseQueryError with data object
    const rtkError = error as {
      data?: { message?: string; error?: string };
      message?: string;
      status?: number | string;
    };

    if (rtkError.data?.message) {
      return rtkError.data.message;
    }
    if (rtkError.data?.error) {
      return rtkError.data.error;
    }
    if (rtkError.message) {
      return rtkError.message;
    }
  }

  return fallbackMessage;
}
