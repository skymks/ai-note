import { useState } from 'react';
import './PasswordVerify.css';

interface Props {
  onVerified: () => void;
  onCancel: () => void;
  verify: (password: string) => boolean;
}

export default function PasswordVerify({ onVerified, onCancel, verify }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('请输入隐私密码');
      return;
    }
    if (verify(password)) {
      onVerified();
    } else {
      setError('密码错误');
      setPassword('');
    }
  };

  return (
    <div className="pwverify-overlay">
      <div className="pwverify-modal">
        <h2 className="pwverify-title">验证隐私密码</h2>
        <p className="pwverify-desc">请输入隐私密码以访问隐私空间</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="pwverify-error">{error}</div>}
          <input
            className="pwverify-input"
            type="password"
            placeholder="请输入隐私密码"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            autoFocus
          />
          <div className="pwverify-actions">
            <button type="button" className="pwverify-cancel" onClick={onCancel}>取消</button>
            <button type="submit" className="pwverify-confirm">确认</button>
          </div>
        </form>
      </div>
    </div>
  );
}
