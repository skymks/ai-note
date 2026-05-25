export interface User {
  id: string;
  account: string;
  password: string;
  privacyPassword: string;
  createdAt: number;
}

export interface Record {
  id: string;
  userId: string;
  type: 'image' | 'voice' | 'text';
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  isPrivate: boolean;
  createdAt: number;
  updatedAt: number;
}

export type Page =
  | 'login'
  | 'register'
  | 'home'
  | 'records'
  | 'mine'
  | 'new-record'
  | 'voice-record'
  | 'record-detail'
  | 'edit-record'
  | 'privacy'
  | 'settings'
  | 'password-verify';
