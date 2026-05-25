import { useState } from 'react';
import { loginUser } from '../utils/storage';
import './Login.css';

interface Props {
  onLogin: () => void;
  onGoRegister: () => void;
}

export default function Login({ onLogin, onGoRegister }: Props) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!account.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }
    const user = loginUser(account.trim(), password);
    if (user) {
      onLogin();
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="40" rx="10" fill="#1890ff" />
            <path d="M16 18h16M16 24h16M16 30h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="login-title">AI Note</h1>
        <p className="login-subtitle">智能笔记，随时记录</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}
        <div className="login-field">
          <input
            type="text"
            placeholder="请输入账号"
            value={account}
            onChange={e => setAccount(e.target.value)}
          />
        </div>
        <div className="login-field">
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-btn">登录</button>
      </form>

      <div className="login-footer">
        <span>还没有账号？</span>
        <button className="login-link" onClick={onGoRegister}>立即注册</button>
      </div>
    </div>
  );
}
