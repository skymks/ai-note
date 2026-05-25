import { useState } from 'react';
import type { Record } from '../types';
import './EditRecord.css';

interface Props {
  record: Record;
  onBack: () => void;
  onSave: (id: string, title: string, content: string) => void;
}

export default function EditRecord({ record, onBack, onSave }: Props) {
  const [title, setTitle] = useState(record.title);
  const [content, setContent] = useState(record.content);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave(record.id, title.trim() || '未命名记录', content.trim());
  };

  return (
    <div className="editrecord-page">
      <div className="editrecord-nav">
        <button className="editrecord-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="editrecord-nav-title">编辑记录</span>
        <button className="editrecord-save" onClick={handleSave} disabled={!title.trim() && !content.trim()}>
          保存
        </button>
      </div>

      <div className="editrecord-form">
        <input
          className="editrecord-title-input"
          type="text"
          placeholder="输入标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {record.imageUrl && (
          <div className="editrecord-image">
            <img src={record.imageUrl} alt="记录图片" />
          </div>
        )}

        <textarea
          className="editrecord-content"
          placeholder="输入内容..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={10}
        />
      </div>
    </div>
  );
}
