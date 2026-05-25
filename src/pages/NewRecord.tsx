import { useState, useRef } from 'react';
import { initOCR, recognizeText, extractText } from '../utils/ocr';
import './NewRecord.css';

interface Props {
  onBack: () => void;
  onSave: (title: string, content: string, imageUrl?: string) => void;
}

export default function NewRecord({ onBack, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [recognizing, setRecognizing] = useState(false);
  const [ocrError, setOcrError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = () => {
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    setRecognizing(true);
    setOcrError('');
    try {
      await initOCR();
      const result = await recognizeText(file);
      const text = extractText(result);
      if (text) {
        setContent(prev => prev ? prev + '\n' + text : text);
        if (!title.trim() && text.length > 0) {
          const firstLine = text.split('\n')[0].slice(0, 20);
          setTitle(firstLine);
        }
      }
    } catch (err) {
      console.error('OCR failed:', err);
      setOcrError('识别失败，请重试');
    } finally {
      setRecognizing(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave(
      title.trim() || '未命名记录',
      content.trim(),
      imageUrl
    );
  };

  return (
    <div className="newrecord-page">
      <div className="newrecord-nav">
        <button className="newrecord-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="newrecord-nav-title">新增图片记录</span>
        <button className="newrecord-save" onClick={handleSave} disabled={!title.trim() && !content.trim()}>
          保存
        </button>
      </div>

      <div className="newrecord-form">
        <input
          className="newrecord-title-input"
          type="text"
          placeholder="输入标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="newrecord-image-area">
          {imageUrl ? (
            <div className="newrecord-image-preview">
              <img src={imageUrl} alt="预览" />
              <button className="newrecord-image-remove" onClick={() => setImageUrl(undefined)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ) : (
            <button className="newrecord-image-upload" onClick={handleImageSelect}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="4" stroke="#ccc" strokeWidth="2" />
                <path d="M16 11v10M11 16h10" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{recognizing ? 'OCR 识别中...' : '选择图片进行识别'}</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFileChange} />
        </div>

        <textarea
          className="newrecord-content"
          placeholder="识别结果或手动输入内容..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
        />

        {ocrError && <p className="newrecord-ocr-error">{ocrError}</p>}
      </div>
    </div>
  );
}
