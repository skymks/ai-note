import { useState, useRef, useCallback, useEffect } from 'react';
import './VoiceRecord.css';

interface Props {
  onBack: () => void;
  onSave: (title: string, content: string) => void;
}

export default function VoiceRecord({ onBack, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recording, setRecording] = useState(false);
  const [liveText, setLiveText] = useState('');
  const [duration, setDuration] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef(false);
  const finalTextRef = useRef('');

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setContent(prev => prev + '\n[语音识别不可用，请手动输入内容]\n您的浏览器不支持Web Speech API。');
      return;
    }

    finalTextRef.current = '';
    recordingRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTextRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setLiveText(finalTextRef.current + interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setLiveText('');
        setContent(prev => prev + '\n[麦克风权限被拒绝，请在浏览器设置中允许麦克风访问]');
        stopRecording();
      } else if (event.error !== 'aborted') {
        stopRecording();
      }
    };

    recognition.onend = () => {
      if (recordingRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    setRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    recordingRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const text = finalTextRef.current.trim();
    if (text) {
      setContent(prev => prev ? prev + '\n' + text : text);
      if (!title.trim()) {
        setTitle(text.split('\n')[0].slice(0, 20));
      }
    }
    finalTextRef.current = '';
    setLiveText('');
  }, [title]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave(title.trim() || '语音记录', content.trim());
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voicerecord-page">
      <div className="voicerecord-nav">
        <button className="voicerecord-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="voicerecord-nav-title">新增语音记录</span>
        <button className="voicerecord-save" onClick={handleSave} disabled={!title.trim() && !content.trim()}>
          保存
        </button>
      </div>

      <div className="voicerecord-form">
        <input
          className="voicerecord-title-input"
          type="text"
          placeholder="输入标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="voicerecord-recorder">
          <div className="voicerecord-visual">
            {recording ? (
              <div className="voicerecord-wave">
                <span /><span /><span /><span /><span />
              </div>
            ) : (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 8v16" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M13 17a7 7 0 0014 0" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 27v5M15 36h10" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span className="voicerecord-timer">{formatDuration(duration)}</span>
          {liveText && (
            <div className="voicerecord-live">{liveText}</div>
          )}
          <button
            className={`voicerecord-btn ${recording ? 'voicerecord-btn--recording' : ''}`}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="6" width="12" height="12" rx="2" fill="#fff" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M8 10a4 4 0 008 0" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 18v3M9 23h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        <textarea
          className="voicerecord-content"
          placeholder="语音识别结果将显示在这里，也可手动输入..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
}
