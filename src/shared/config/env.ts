function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const NODE_ENV = (process.env.NODE_ENV ?? "development") as "development" | "production";

export const config = {
  env: NODE_ENV,
  discord: {
    token: requireEnv("TOKEN_BOT"),
    channelId: requireEnv("CHANNEL_ID"),
  },
  anilist: {
    username: requireEnv("ANILIST_USERNAME"),
  },
  cron: {
    // Every minute in dev for easy testing, every hour in prod
    schedule: NODE_ENV === "production" ? "0 * * * *" : "* * * * *",
  },
} as const;
