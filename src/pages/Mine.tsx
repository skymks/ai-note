import type { User } from '../types';
import './Mine.css';

interface Props {
  user: User;
  onGoPrivacy: () => void;
  onGoSettings: () => void;
  onLogout: () => void;
}

export default function Mine({ user, onGoPrivacy, onGoSettings, onLogout }: Props) {
  return (
    <div className="mine-page">
      <div className="mine-profile">
        <div className="mine-avatar">
          {user.account.charAt(0).toUpperCase()}
        </div>
        <div className="mine-info">
          <h2 className="mine-name">{user.account}</h2>
          <span className="mine-id">ID: {user.id.slice(0, 8)}</span>
        </div>
      </div>

      <div className="mine-menu">
        <button className="mine-menu-item" onClick={onGoPrivacy}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 5v5c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5V5l-7-3z" stroke="#fa8c16" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 8v4M10 14h.01" stroke="#fa8c16" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>隐私空间</span>
          <svg className="mine-menu-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <button className="mine-menu-item" onClick={onGoSettings}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="#666" strokeWidth="1.5" />
            <path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2 2M14.5 14.5l2 2M3.5 16.5l2-2M14.5 5.5l2-2" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>设置</span>
          <svg className="mine-menu-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <button className="mine-logout" onClick={onLogout}>退出登录</button>
    </div>
  );
}
