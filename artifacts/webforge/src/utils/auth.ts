// ─── Shared admin authentication utility ─────────────────────────────────────
//
// Security model (client-side only):
//   • Password never stored in source — compared as SHA-256 against VITE_ADMIN_HASH
//   • sessionStorage (not localStorage) — session expires when the tab closes
//   • Rate limiting — 3 failed attempts locks login for 5 minutes
//   • Session token is a random string, not the password or its hash

const SESSION_KEY = "ns_session";
const RATE_KEY    = "ns_rate";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS   = 5 * 60 * 1000; // 5 minutes

// ── SHA-256 using Web Crypto API ──────────────────────────────────────────────
export async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
type RateState = { attempts: number; until: number };

function getRateState(): RateState {
  try { return JSON.parse(sessionStorage.getItem(RATE_KEY) ?? "{}"); } catch {}
  return { attempts: 0, until: 0 };
}
function saveRateState(s: RateState) {
  try { sessionStorage.setItem(RATE_KEY, JSON.stringify(s)); } catch {}
}

export function getRateLimit(): { locked: boolean; attempts: number; remainingMs: number } {
  const s = getRateState();
  const locked = s.attempts >= MAX_ATTEMPTS && Date.now() < s.until;
  return { locked, attempts: s.attempts, remainingMs: Math.max(0, s.until - Date.now()) };
}

export function recordFailedAttempt(): void {
  const s = getRateState();
  const attempts = s.attempts + 1;
  const until = attempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : s.until;
  saveRateState({ attempts, until });
}

export function clearRateLimit(): void {
  try { sessionStorage.removeItem(RATE_KEY); } catch {}
}

// ── Session management ────────────────────────────────────────────────────────
function makeToken(): string {
  // Random string that is NOT the password or its hash
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(18)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `ns.${rand}`;
}

export function checkAdmin(): boolean {
  try {
    const tok = sessionStorage.getItem(SESSION_KEY);
    return typeof tok === "string" && tok.startsWith("ns.");
  } catch { return false; }
}

export function logout(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

// ── Login (async — SHA-256) ───────────────────────────────────────────────────
export async function attemptLogin(password: string): Promise<"ok" | "wrong" | "locked"> {
  const { locked } = getRateLimit();
  if (locked) return "locked";

  const hash    = await sha256hex(password);
  const correct = import.meta.env.VITE_ADMIN_HASH;

  if (hash === correct) {
    sessionStorage.setItem(SESSION_KEY, makeToken());
    clearRateLimit();
    return "ok";
  }

  recordFailedAttempt();
  return "wrong";
}
