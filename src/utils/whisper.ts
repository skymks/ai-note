import { env, pipeline } from '@huggingface/transformers';

// Load model from local project files (public/models/) instead of HuggingFace Hub
env.remoteHost = window.location.origin + '/models/';
env.remotePathTemplate = '{model}/';

const MODEL_ID = 'whisper-base';

let transcriber: Awaited<ReturnType<typeof pipeline>> | null = null;
let loadPromise: Promise<void> | null = null;

export async function loadModel(): Promise<void> {
  if (transcriber) return;
  if (loadPromise) {
    await loadPromise;
    return;
  }

  loadPromise = (async () => {
    try {
      transcriber = await pipeline(
        'automatic-speech-recognition',
        MODEL_ID,
        {
          device: 'wasm',
          dtype: 'int8',
          session_options: { graphOptimizationLevel: 'disabled' },
        }
      );
    } catch (e) {
      loadPromise = null;
      throw e;
    }
  })();

  await loadPromise;
}

export async function transcribeAudio(
  audioData: Float32Array
): Promise<string> {
  if (!transcriber) throw new Error('Model not loaded');

  const result = await (transcriber as any)(audioData, {
    language: 'chinese',
    task: 'transcribe',
    chunk_length_s: 30,
    stride_length_s: 5,
  });

  return result.text;
}

export async function audioBlobToFloat32(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const sampleRate = 16000;
  const length = Math.ceil(audioBuffer.duration * sampleRate);
  const offlineCtx = new OfflineAudioContext(1, length, sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start();

  const resampled = await offlineCtx.startRendering();
  await audioContext.close();
  return resampled.getChannelData(0);
}
