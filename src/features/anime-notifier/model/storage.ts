import path from "path";
import type { StorageData } from "./types";

const STATE_FILE = path.join(process.cwd(), "data", "state.json");
const EMPTY: StorageData = { shows: {} };

export async function loadState(): Promise<StorageData>
{
  const file = Bun.file(STATE_FILE);
  if (!(await file.exists())) return structuredClone(EMPTY);
  const json = await file.json();
  return json as StorageData;
}

export async function saveState(data: StorageData): Promise<void>
{
  await Bun.write(STATE_FILE, JSON.stringify(data, null, 2));
}
