/**
 * Simple logger utility to manage console output across the application.
 * In production, console logs are suppressed to improve performance and avoid
 * polluting the browser console. This also serves as a central point for
 * integrating with dedicated logging services like Sentry or LogRocket.
 */

const isProd = import.meta.env.PROD;

export const logger = {
  error: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.error(message, ...args);
    }
    // TODO: Send to external logging service in production
  },
  warn: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.warn(message, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.info(message, ...args);
    }
  },
  log: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.log(message, ...args);
    }
  },
};
