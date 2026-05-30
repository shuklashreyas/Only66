/**
 * Local storage utilities for the MVP.
 * Handles all persistence of challenges, check-ins, and user data.
 */

import type { Tone } from "./tone";

export interface LocalUser {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface LocalChallenge {
  id: string;
  name: string;
  kind: "build" | "quit";
  motivation: string | null;
  tone: Tone;
  start_date: string;
  reminder_time: string;
  status: "active" | "completed" | "abandoned";
  createdAt: string;
}

export interface LocalCheckIn {
  id: string;
  challenge_id: string;
  day_number: number;
  date: string;
  completed: boolean;
  difficulty?: number;
  almost_folded?: boolean;
  notes?: string | null;
  createdAt: string;
}

const STORAGE_KEYS = {
  user: "only66_user",
  userName: "only66_user_name",
  challenges: "only66_challenges",
  checkIns: "only66_checkIns",
};

// User management
export function getLocalUser(): LocalUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.user);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setLocalUser(user: LocalUser): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function createLocalUser(displayName: string): LocalUser {
  const user: LocalUser = {
    id: generateId(),
    displayName,
    createdAt: new Date().toISOString(),
  };
  setLocalUser(user);
  setUserDisplayName(displayName);
  return user;
}

export function clearLocalUser(): void {
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.userName);
}

export function getUserDisplayName(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.userName)?.trim() || "";
    if (stored) return stored;

    // Backward-compat migration: reuse legacy local user displayName if present.
    const legacy = getLocalUser()?.displayName?.trim() || "";
    if (legacy) {
      localStorage.setItem(STORAGE_KEYS.userName, legacy);
      return legacy;
    }

    return null;
  } catch {
    return null;
  }
}

export function setUserDisplayName(name: string): void {
  const normalized = name.trim();
  if (!normalized) {
    localStorage.removeItem(STORAGE_KEYS.userName);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.userName, normalized);
}

// Challenge management
export function getChallenges(): LocalChallenge[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.challenges);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getActiveChallenges(): LocalChallenge[] {
  return getChallenges().filter((c) => c.status === "active");
}

export function getLatestChallenge(): LocalChallenge | null {
  const challenges = getChallenges();
  return challenges.length > 0 ? challenges[challenges.length - 1] : null;
}

export function getLatestAbandonedChallenge(): LocalChallenge | null {
  const challenges = getChallenges();
  for (let index = challenges.length - 1; index >= 0; index--) {
    if (challenges[index].status === "abandoned") {
      return challenges[index];
    }
  }
  return null;
}

export function getActiveChallengeForUser(): LocalChallenge | null {
  return getActiveChallenges()[0] ?? null;
}

export function createChallenge(data: Omit<LocalChallenge, "id" | "createdAt">): LocalChallenge {
  const challenge: LocalChallenge = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const challenges = getChallenges();
  challenges.push(challenge);
  localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(challenges));
  return challenge;
}

export function updateChallenge(id: string, updates: Partial<LocalChallenge>): void {
  const challenges = getChallenges();
  const idx = challenges.findIndex((c) => c.id === id);
  if (idx !== -1) {
    challenges[idx] = { ...challenges[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(challenges));
  }
}

export function deleteChallenge(id: string): void {
  const challenges = getChallenges().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(challenges));
}

// Check-in management
export function getCheckIns(): LocalCheckIn[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.checkIns);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getCheckInsForChallenge(challengeId: string): LocalCheckIn[] {
  return getCheckIns()
    .filter((c) => c.challenge_id === challengeId)
    .sort((a, b) => a.day_number - b.day_number);
}

export function getCheckInByDateAndChallenge(
  challengeId: string,
  date: string,
): LocalCheckIn | null {
  const checkIns = getCheckIns();
  return checkIns.find((c) => c.challenge_id === challengeId && c.date === date) ?? null;
}

export function createCheckIn(data: Omit<LocalCheckIn, "id" | "createdAt">): LocalCheckIn {
  const checkIn: LocalCheckIn = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const checkIns = getCheckIns();
  checkIns.push(checkIn);
  localStorage.setItem(STORAGE_KEYS.checkIns, JSON.stringify(checkIns));
  return checkIn;
}

export function deleteAllCheckIns(): void {
  localStorage.removeItem(STORAGE_KEYS.checkIns);
}

// Helper
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
