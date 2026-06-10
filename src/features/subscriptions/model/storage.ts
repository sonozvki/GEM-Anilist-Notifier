import path from "path";
import type { SubscriptionsData } from "./types";

const SUBS_FILE = path.join(process.cwd(), "data", "subscriptions.json");

export async function loadSubscriptions(): Promise<SubscriptionsData> {
  const file = Bun.file(SUBS_FILE);
  if (!(await file.exists())) return {};
  return file.json<SubscriptionsData>();
}

export async function saveSubscriptions(data: SubscriptionsData): Promise<void> {
  await Bun.write(SUBS_FILE, JSON.stringify(data, null, 2));
}

export async function addSubscriber(mediaId: string, title: string, userId: string): Promise<boolean> {
  const data = await loadSubscriptions();
  const entry = data[mediaId] ?? { title, subscribers: [] };

  if (entry.subscribers.includes(userId)) return false;

  entry.subscribers.push(userId);
  data[mediaId] = entry;
  await saveSubscriptions(data);
  return true;
}

export async function removeSubscriber(mediaId: string, userId: string): Promise<boolean> {
  const data = await loadSubscriptions();
  const entry = data[mediaId];
  if (!entry) return false;

  const idx = entry.subscribers.indexOf(userId);
  if (idx === -1) return false;

  entry.subscribers.splice(idx, 1);
  await saveSubscriptions(data);
  return true;
}

export async function getSubscribers(mediaId: string): Promise<string[]> {
  const data = await loadSubscriptions();
  return data[mediaId]?.subscribers ?? [];
}
