import { useState } from 'react';
import { registerUser } from '../utils/storage';
import './Register.css';

interface Props {
  onRegistered: () => void;
  onGoLogin: () => void;
}

export default function Register({ onRegistered, onGoLogin }: Props) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyPassword, setPrivacyPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!account.trim()) { setError('请输入账号'); return; }
    if (account.trim().length < 3) { setError('账号至少3个字符'); return; }
    if (!password) { setError('请输入密码'); return; }
    if (password.length < 6) { setError('密码至少6个字符'); return; }
    if (password !== confirmPassword) { setError('两次密码不一致'); return; }
    if (!privacyPassword) { setError('请输入隐私密码'); return; }

    const user = registerUser(account.trim(), password, privacyPassword);
    if (!user) {
      setError('该账号已被注册');
      return;
    }
    onRegistered();
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <h1 className="register-title">创建账号</h1>
        <p className="register-subtitle">注册后即可使用AI笔记功能</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        {error && <div className="register-error">{error}</div>}
        <div className="register-field">
          <label>账号</label>
          <input
            type="text"
            placeholder="请输入账号（至少3个字符）"
            value={account}
            onChange={e => setAccount(e.target.value)}
          />
        </div>
        <div className="register-field">
          <label>密码</label>
          <input
            type="password"
            placeholder="请输入密码（至少6个字符）"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="register-field">
          <label>确认密码</label>
          <input
            type="password"
            placeholder="请再次输入密码"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="register-field">
          <label>隐私密码</label>
          <input
            type="password"
            placeholder="用于访问隐私空间"
            value={privacyPassword}
            onChange={e => setPrivacyPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="register-btn">注册</button>
      </form>

      <div className="register-footer">
        <span>已有账号？</span>
        <button className="register-link" onClick={onGoLogin}>去登录</button>
      </div>
    </div>
  );
}
