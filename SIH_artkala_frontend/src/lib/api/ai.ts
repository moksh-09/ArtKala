import { apiFetch, API_BASE_URL } from "./apiClient";

export interface AIStatus {
  asr: string;
  translation: string;
  catalogue: string;
  image_processing: string;
  pricing: string;
  demo_override_enabled: boolean;
}

export async function getAIStatus(): Promise<AIStatus> {
  return apiFetch<AIStatus>("/ai/status");
}

export async function enhanceImage(imageFile: File): Promise<Record<string, unknown>> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/ai/image-enhance`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image enhancement failed: ${response.statusText}`);
  }
  return response.json();
}

export async function transcribeAudio(
  audioBlob?: Blob,
  language?: string,
  transcriptOverride?: string
): Promise<{ text: string; language: string; source: string; mode: string }> {
  const formData = new FormData();
  if (audioBlob) {
    formData.append("audio", audioBlob, "recording.wav");
  }
  if (language) {
    formData.append("language", language);
  }
  if (transcriptOverride) {
    formData.append("transcript_override", transcriptOverride);
  }

  const response = await fetch(`${API_BASE_URL}/ai/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }
  return response.json();
}
