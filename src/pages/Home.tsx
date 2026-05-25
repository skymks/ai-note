import type { Record, User } from '../types';
import './Home.css';

interface Props {
  user: User;
  recentRecords: Record[];
  onGoRecords: () => void;
  onGoNewRecord: () => void;
  onGoVoiceRecord: () => void;
  onGoRecordDetail: (id: string) => void;
}

export default function Home({ user, recentRecords, onGoRecords, onGoNewRecord, onGoVoiceRecord, onGoRecordDetail }: Props) {
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 12) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  };

  return (
    <div className="home-page">
      <div className="home-greeting">
        <h1 className="home-greeting-text">{getGreeting()}，{user.account}</h1>
        <p className="home-date">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>

      <div className="home-actions">
        <button className="home-action-card home-action--image" onClick={onGoNewRecord}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="3" width="22" height="22" rx="4" stroke="#fff" strokeWidth="2" />
            <circle cx="10" cy="10" r="2.5" stroke="#fff" strokeWidth="1.5" />
            <path d="M3 20l6-6 4 4 3-3 9 9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>图片记录</span>
        </button>
        <button className="home-action-card home-action--voice" onClick={onGoVoiceRecord}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 3v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 11a5 5 0 005 5 5 5 0 005-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 19v4M10 23h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>语音记录</span>
        </button>
      </div>

      <div className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title">最近记录</h2>
          <button className="home-section-more" onClick={onGoRecords}>查看全部</button>
        </div>
        {recentRecords.length === 0 ? (
          <div className="home-empty">
            <p>暂无记录</p>
            <span>点击上方按钮开始记录</span>
          </div>
        ) : (
          <div className="home-record-list">
            {recentRecords.map(record => (
              <button key={record.id} className="home-record-item" onClick={() => onGoRecordDetail(record.id)}>
                <div className={`home-record-icon home-record-icon--${record.type}`}>
                  {record.type === 'image' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1" />
                      <path d="M2 14l4-4 3 3 2-2 7 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  ) : record.type === 'voice' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6.5 8a3.5 3.5 0 007 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 14v3M7.5 19h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M7 8h6M7 10.5h6M7 13h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="home-record-info">
                  <span className="home-record-title">{record.title}</span>
                  <span className="home-record-time">{new Date(record.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
