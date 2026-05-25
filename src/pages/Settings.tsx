import './Settings.css';

interface Props {
  onBack: () => void;
}

export default function Settings({ onBack }: Props) {
  return (
    <div className="settings-page">
      <div className="settings-nav">
        <button className="settings-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="settings-nav-title">设置</span>
        <div style={{ width: 28 }} />
      </div>

      <div className="settings-list">
        <div className="settings-item">
          <span className="settings-label">版本信息</span>
          <span className="settings-value">v1.0.0</span>
        </div>
        <div className="settings-item">
          <span className="settings-label">应用名称</span>
          <span className="settings-value">AI Note</span>
        </div>
        <div className="settings-item">
          <span className="settings-label">技术栈</span>
          <span className="settings-value">React + TypeScript</span>
        </div>
        <div className="settings-item">
          <span className="settings-label">数据存储</span>
          <span className="settings-value">本地存储</span>
        </div>
      </div>

      <div className="settings-footer">
        <p>AI Note v1.0.0</p>
        <span>智能笔记，随时记录</span>
      </div>
    </div>
  );
}
