import { API_BASE, API_ENDPOINTS } from '../constants';
import { Sound } from '../types';

type UnknownRecord = Record<string, unknown>;
type ApiEnvelope<T> = {
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly errors?: unknown;
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

const readString = (value: unknown): string | null => (typeof value === 'string' ? value : null);

const readNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const readBoolean = (value: unknown): boolean => value === true;

const readStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const parseValidationErrors = (value: unknown): string | null => {
  if (!isRecord(value)) {
    return null;
  }

  const messages = Object.entries(value)
    .map(([field, entryValue]) => {
      if (typeof entryValue === 'string') {
        return `${field}: ${entryValue}`;
      }

      if (Array.isArray(entryValue)) {
        const stringEntries = entryValue.filter((item): item is string => typeof item === 'string');
        return stringEntries.length > 0 ? `${field}: ${stringEntries.join(', ')}` : null;
      }

      return null;
    })
    .filter((entry): entry is string => entry !== null);

  return messages.length > 0 ? messages.join('; ') : null;
};

const assertSoundId = (value: number): void => {
  if (!isPositiveInteger(value)) {
    throw new Error('Invalid sound id');
  }
};

const parseApiError = (payload: unknown, fallback: string): string => {
  if (!isRecord(payload)) {
    return fallback;
  }

  const envelope = payload as ApiEnvelope<unknown>;

  if (typeof envelope.message === 'string' && envelope.message.trim()) {
    return envelope.message;
  }

  if (typeof envelope.error === 'string' && envelope.error.trim()) {
    return envelope.error;
  }

  const validationErrors = parseValidationErrors(envelope.errors);

  if (validationErrors) {
    return validationErrors;
  }

  return fallback;
};

const parseSound = (value: unknown): Sound => {
  if (!isRecord(value)) {
    throw new Error('Invalid sound payload');
  }

  const id = readNumber(value.id);
  const filename = readString(value.filename);

  if (!isPositiveInteger(id) || !filename) {
    throw new Error('Invalid sound payload');
  }

  return {
    id,
    filename,
    sourceType: readString(value.source_type) ?? 'local',
    url: readString(value.url),
    volume: readNumber(value.volume),
    description: readString(value.description),
    tags: readStringList(value.tags),
    isJoinSound: readBoolean(value.is_join_sound),
    isLeaveSound: readBoolean(value.is_leave_sound),
    insertedAt: readString(value.inserted_at),
    updatedAt: readString(value.updated_at),
  };
};

const parseSoundsPayload = (payload: unknown): Sound[] => {
  if (Array.isArray(payload)) {
    return payload.map(parseSound);
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data.map(parseSound);
  }

  throw new Error('Invalid API response structure');
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text || null;
  }

  return response.json();
};

const readResponse = async (response: Response): Promise<unknown> => {
  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(parseApiError(payload, `Request failed with status ${response.status}`));
  }

  if (isRecord(payload) && 'data' in payload) {
    return payload.data;
  }

  return payload;
};

export const fetchSounds = async (): Promise<Sound[]> => {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.sounds}`);
  return parseSoundsPayload(await readResponse(response));
};

export const playSound = async (id: number): Promise<void> => {
  assertSoundId(id);

  const response = await fetch(`${API_BASE}${API_ENDPOINTS.playSound(id)}`, {
    method: 'POST',
  });

  await readResponse(response);
};
