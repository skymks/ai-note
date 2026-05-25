import type { User, Record } from '../types';

const USERS_KEY = 'ai_note_users';
const CURRENT_USER_KEY = 'ai_note_current_user';
const RECORDS_KEY = 'ai_note_records';

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Users
export function getUsers(): User[] {
  return read<User>(USERS_KEY);
}

export function findUser(account: string): User | undefined {
  return getUsers().find(u => u.account === account);
}

export function registerUser(account: string, password: string, privacyPassword: string): User | null {
  if (findUser(account)) return null;
  const users = getUsers();
  const user: User = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    account,
    password,
    privacyPassword,
    createdAt: Date.now(),
  };
  users.push(user);
  write(USERS_KEY, users);
  return user;
}

export function loginUser(account: string, password: string): User | null {
  const user = findUser(account);
  if (user && user.password === password) {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  }
  return null;
}

export function getCurrentUser(): User | null {
  const id = localStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function verifyPrivacyPassword(userId: string, password: string): boolean {
  const user = getUsers().find(u => u.id === userId);
  return user?.privacyPassword === password;
}

// Records
export function getRecords(userId: string): Record[] {
  return read<Record>(RECORDS_KEY).filter(r => r.userId === userId && !r.isPrivate);
}

export function getPrivateRecords(userId: string): Record[] {
  return read<Record>(RECORDS_KEY).filter(r => r.userId === userId && r.isPrivate);
}

export function getAllRecords(userId: string): Record[] {
  return read<Record>(RECORDS_KEY).filter(r => r.userId === userId);
}

export function getRecord(id: string): Record | undefined {
  return read<Record>(RECORDS_KEY).find(r => r.id === id);
}

export function saveRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Record {
  const records = read<Record>(RECORDS_KEY);
  const newRecord: Record = {
    ...record,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  records.push(newRecord);
  write(RECORDS_KEY, records);
  return newRecord;
}

export function updateRecord(id: string, updates: Partial<Pick<Record, 'title' | 'content' | 'isPrivate' | 'type'>>) {
  const records = read<Record>(RECORDS_KEY);
  const idx = records.findIndex(r => r.id === id);
  if (idx !== -1) {
    records[idx] = { ...records[idx], ...updates, updatedAt: Date.now() };
    write(RECORDS_KEY, records);
  }
}

export function deleteRecord(id: string) {
  const records = read<Record>(RECORDS_KEY).filter(r => r.id !== id);
  write(RECORDS_KEY, records);
}
