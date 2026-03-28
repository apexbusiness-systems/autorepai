/* eslint-disable no-console */
const isProd = import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (!isProd) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (!isProd) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (!isProd) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (!isProd) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (!isProd) {
      console.debug(...args);
    }
  },
};
