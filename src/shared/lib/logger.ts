import { config } from "@shared/config/env";

const isDev = config.env === "development";

function ts() { return new Date().toISOString(); }

export const logger = {
  debug: (msg: string, ...args: unknown[]) => {
    if (isDev)
      console.debug(`[${ts()}] DEBUG ${msg}`, ...args);
  },
  info: (msg: string, ...args: unknown[]) => {
    console.info(`[${ts()}] INFO  ${msg}`, ...args);
  },
  warn: (msg: string, ...args: unknown[]) => {
    console.warn(`[${ts()}] WARN  ${msg}`, ...args);
  },
  error: (msg: string, ...args: unknown[]) => {
    console.error(`[${ts()}] ERROR ${msg}`, ...args);
  },
};
