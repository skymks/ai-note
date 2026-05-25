import type { Record } from '../types';
import './RecordList.css';

interface Props {
  records: Record[];
  onGoRecordDetail: (id: string) => void;
  onGoNewRecord: () => void;
  isPrivate?: boolean;
}

export default function RecordList({ records, onGoRecordDetail, onGoNewRecord, isPrivate }: Props) {
  return (
    <div className="recordlist-page">
      <div className="recordlist-header">
        <h1 className="recordlist-title">{isPrivate ? '隐私空间' : '我的记录'}</h1>
        <span className="recordlist-count">{records.length} 条</span>
      </div>

      {records.length === 0 ? (
        <div className="recordlist-empty">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="12" y="12" width="40" height="40" rx="6" stroke="#d9d9d9" strokeWidth="2" />
            <path d="M22 26h20M22 32h20M22 38h12" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>{isPrivate ? '暂无隐私记录' : '暂无记录'}</p>
          {!isPrivate && <span>点击右下角按钮添加新记录</span>}
        </div>
      ) : (
        <div className="recordlist-list">
          {records.map(record => (
            <button key={record.id} className="recordlist-item" onClick={() => onGoRecordDetail(record.id)}>
              <div className={`recordlist-item-type recordlist-item-type--${record.type}`}>
                {record.type === 'image' ? '图' : record.type === 'voice' ? '音' : '文'}
              </div>
              <div className="recordlist-item-content">
                <span className="recordlist-item-title">{record.title}</span>
                <span className="recordlist-item-preview">{record.content.slice(0, 50) || '无内容'}</span>
              </div>
              <span className="recordlist-item-date">{new Date(record.createdAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</span>
            </button>
          ))}
        </div>
      )}

      {!isPrivate && (
        <button className="recordlist-fab" onClick={onGoNewRecord}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
