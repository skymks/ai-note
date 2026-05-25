import type { Record } from '../types';
import './RecordDetail.css';

interface Props {
  record: Record;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePrivate: (id: string) => void;
}

export default function RecordDetail({ record, onBack, onEdit, onDelete, onTogglePrivate }: Props) {
  return (
    <div className="detail-page">
      <div className="detail-nav">
        <button className="detail-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="detail-nav-title">记录详情</span>
        <div className="detail-nav-actions">
          <button className="detail-action-btn" onClick={() => onEdit(record.id)}>编辑</button>
          <button className="detail-action-btn detail-action-btn--danger" onClick={() => onDelete(record.id)}>删除</button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-type-badge">
          <span className={`detail-type detail-type--${record.type}`}>
            {record.type === 'image' ? '图片记录' : record.type === 'voice' ? '语音记录' : '文本记录'}
          </span>
          {record.isPrivate && <span className="detail-private-badge">隐私</span>}
        </div>

        <h1 className="detail-title">{record.title}</h1>

        <div className="detail-meta">
          <span>创建于 {new Date(record.createdAt).toLocaleString('zh-CN')}</span>
          {record.updatedAt !== record.createdAt && (
            <span> · 更新于 {new Date(record.updatedAt).toLocaleString('zh-CN')}</span>
          )}
        </div>

        {record.imageUrl && (
          <div className="detail-image">
            <img src={record.imageUrl} alt="记录图片" />
          </div>
        )}

        <div className="detail-text">{record.content}</div>

        <div className="detail-bottom-actions">
          <button
            className="detail-toggle-private"
            onClick={() => onTogglePrivate(record.id)}
          >
            {record.isPrivate ? '移出隐私空间' : '移入隐私空间'}
          </button>
        </div>
      </div>
    </div>
  );
}
