import { useState, useRef, useCallback, useEffect } from 'react';
import { loadModel, transcribeAudio, audioBlobToFloat32 } from '../utils/whisper';
import './VoiceRecord.css';

interface Props {
  onBack: () => void;
  onSave: (title: string, content: string) => void;
}

export default function VoiceRecord({ onBack, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    setErrorMsg('');
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        if (chunksRef.current.length === 0) return;

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

        try {
          setTranscribing(true);
          const audioData = await audioBlobToFloat32(blob);
          await loadModel();
          const text = await transcribeAudio(audioData);

          if (text.trim()) {
            setContent((prev) => (prev ? prev + '\n' + text.trim() : text.trim()));
            setTitle((prev) => {
              if (!prev.trim()) return text.trim().split('\n')[0].slice(0, 20);
              return prev;
            });
          }
        } catch (err) {
          console.error('Transcription failed:', err);
          setErrorMsg('语音转写失败，请重试');
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);

      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setErrorMsg('无法访问麦克风，请检查权限设置');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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

      {errorMsg && (
        <div className="voicerecord-error">{errorMsg}</div>
      )}

      <div className="voicerecord-form">
        <input
          className="voicerecord-title-input"
          type="text"
          placeholder="输入标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="voicerecord-recorder">
          <div className="voicerecord-visual">
            {recording ? (
              <div className="voicerecord-wave">
                <span /><span /><span /><span /><span />
              </div>
            ) : transcribing ? (
              <div className="voicerecord-transcribing">
                <div className="voicerecord-spinner" />
                <span>正在转写...</span>
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
          <button
            className={`voicerecord-btn ${recording ? 'voicerecord-btn--recording' : ''}`}
            onClick={recording ? stopRecording : startRecording}
            disabled={transcribing}
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
          placeholder="录音结束后将自动转写文字，也可手动输入..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
}
