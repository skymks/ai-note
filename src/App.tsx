import { useState, useCallback } from 'react';
import type { Page, Record, User } from './types';
import { getCurrentUser, loginUser, logout as doLogout, getRecords, getPrivateRecords, getRecord, saveRecord, updateRecord, deleteRecord, verifyPrivacyPassword } from './utils/storage';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RecordList from './pages/RecordList';
import RecordDetail from './pages/RecordDetail';
import EditRecord from './pages/EditRecord';
import NewRecord from './pages/NewRecord';
import VoiceRecord from './pages/VoiceRecord';
import Mine from './pages/Mine';
import Settings from './pages/Settings';
import PasswordVerify from './pages/PasswordVerify';
import './App.css';

type Tab = 'home' | 'records' | 'mine';

export default function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [page, setPage] = useState<Page>(user ? 'home' : 'login');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [detailRecordId, setDetailRecordId] = useState<string | null>(null);
  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const goHome = useCallback(() => {
    setUser(getCurrentUser());
    setPage('home');
    setActiveTab('home');
  }, []);

  const handleLogin = useCallback(() => {
    goHome();
  }, [goHome]);

  const handleRegister = useCallback(() => {
    setPage('login');
  }, []);

  const handleLogout = useCallback(() => {
    doLogout();
    setUser(null);
    setPage('login');
  }, []);

  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setPage(tab);
  }, []);

  const handleGoRecordDetail = useCallback((id: string) => {
    setDetailRecordId(id);
    setPage('record-detail');
  }, []);

  const handleGoEdit = useCallback((id: string) => {
    setEditRecordId(id);
    setPage('edit-record');
  }, []);

  const handleSaveNewRecord = useCallback((title: string, content: string, imageUrl?: string) => {
    if (!user) return;
    saveRecord({
      userId: user.id,
      type: 'image',
      title,
      content,
      imageUrl,
      isPrivate: false,
    });
    refresh();
    setPage('records');
    setActiveTab('records');
  }, [user, refresh]);

  const handleSaveVoiceRecord = useCallback((title: string, content: string) => {
    if (!user) return;
    saveRecord({
      userId: user.id,
      type: 'voice',
      title,
      content,
      isPrivate: false,
    });
    refresh();
    setPage('records');
    setActiveTab('records');
  }, [user, refresh]);

  const handleEditSave = useCallback((id: string, title: string, content: string) => {
    updateRecord(id, { title, content });
    refresh();
    setDetailRecordId(id);
    setPage('record-detail');
  }, [refresh]);

  const handleDeleteRecord = useCallback((id: string) => {
    deleteRecord(id);
    refresh();
    setPage('records');
    setActiveTab('records');
  }, [refresh]);

  const handleTogglePrivate = useCallback((id: string) => {
    const rec = getRecord(id);
    if (rec) {
      updateRecord(id, { isPrivate: !rec.isPrivate });
      refresh();
    }
  }, [refresh]);

  const handlePrivacyAccess = useCallback(() => {
    setShowPasswordVerify(true);
  }, []);

  const handleVerified = useCallback(() => {
    setShowPasswordVerify(false);
    setPage('privacy');
  }, []);

  // Auth pages
  if (!user || page === 'login' || page === 'register') {
    if (page === 'register') {
      return <Register onRegistered={handleRegister} onGoLogin={() => setPage('login')} />;
    }
    return <Login onLogin={handleLogin} onGoRegister={() => setPage('register')} />;
  }

  // Get data
  const userRecords = getRecords(user.id);
  const privateRecords = getPrivateRecords(user.id);
  const recentRecords = [...userRecords].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  const allRecords = [...userRecords].sort((a, b) => b.createdAt - a.createdAt);
  const currentDetailRecord = detailRecordId ? getRecord(detailRecordId) : null;
  const currentEditRecord = editRecordId ? getRecord(editRecordId) : null;

  const isTabPage = ['home', 'records', 'mine'].includes(page);

  return (
    <div className="app">
      {page === 'home' && (
        <Home
          user={user}
          recentRecords={recentRecords}
          onGoRecords={() => switchTab('records')}
          onGoNewRecord={() => setPage('new-record')}
          onGoVoiceRecord={() => setPage('voice-record')}
          onGoRecordDetail={handleGoRecordDetail}
        />
      )}

      {page === 'records' && (
        <RecordList
          records={allRecords}
          onGoRecordDetail={handleGoRecordDetail}
          onGoNewRecord={() => setPage('new-record')}
        />
      )}

      {page === 'mine' && (
        <Mine
          user={user}
          onGoPrivacy={handlePrivacyAccess}
          onGoSettings={() => setPage('settings')}
          onLogout={handleLogout}
        />
      )}

      {page === 'record-detail' && currentDetailRecord && (
        <RecordDetail
          record={currentDetailRecord}
          onBack={() => switchTab('records')}
          onEdit={handleGoEdit}
          onDelete={handleDeleteRecord}
          onTogglePrivate={handleTogglePrivate}
        />
      )}

      {page === 'edit-record' && currentEditRecord && (
        <EditRecord
          record={currentEditRecord}
          onBack={() => handleGoRecordDetail(editRecordId!)}
          onSave={handleEditSave}
        />
      )}

      {page === 'new-record' && (
        <NewRecord
          onBack={() => switchTab('home')}
          onSave={handleSaveNewRecord}
        />
      )}

      {page === 'voice-record' && (
        <VoiceRecord
          onBack={() => switchTab('home')}
          onSave={handleSaveVoiceRecord}
        />
      )}

      {page === 'privacy' && (
        <RecordList
          records={privateRecords.sort((a, b) => b.createdAt - a.createdAt)}
          onGoRecordDetail={handleGoRecordDetail}
          onGoNewRecord={() => setPage('new-record')}
          isPrivate
        />
      )}

      {page === 'settings' && (
        <Settings onBack={() => switchTab('mine')} />
      )}

      {/* Bottom tab bar */}
      {isTabPage && (
        <nav className="tab-bar">
          <button
            className={`tab-item ${activeTab === 'home' ? 'tab-item--active' : ''}`}
            onClick={() => switchTab('home')}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 10L11 3l8 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span>首页</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'records' ? 'tab-item--active' : ''}`}
            onClick={() => switchTab('records')}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 8h8M7 11h8M7 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>记录</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'mine' ? 'tab-item--active' : ''}`}
            onClick={() => switchTab('mine')}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 19c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>我的</span>
          </button>
        </nav>
      )}

      {/* Password verification modal */}
      {showPasswordVerify && (
        <PasswordVerify
          onVerified={handleVerified}
          onCancel={() => setShowPasswordVerify(false)}
          verify={(pw) => verifyPrivacyPassword(user.id, pw)}
        />
      )}
    </div>
  );
}
