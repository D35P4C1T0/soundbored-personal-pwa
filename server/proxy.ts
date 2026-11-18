import { Response } from 'express';
import { EnvConfig } from './config';

const isNetworkError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  const cause = error as Error & { cause?: { code?: string } };
  const message = `${error.message} ${cause.cause?.code ?? ''}`.toUpperCase();

  return ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'FETCH FAILED'].some((code) =>
    message.includes(code)
  );
};

const readResponseBody = async (response: globalThis.Response, method: string) => {
  if (response.status === 204 || response.status === 205) {
    return { status: response.status, body: undefined };
  }

  const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  const text = await response.text();
  if (method === 'POST' && response.ok && !text) {
    return { status: response.status, body: undefined };
  }

  if (contentType === 'application/json' || contentType?.endsWith('+json')) {
    try {
      return { status: response.status, body: JSON.parse(text) as unknown };
    } catch {
      console.error('Soundbored returned invalid JSON', response.status, response.url);
    }
  } else {
    if (!contentType || contentType === 'text/plain') {
      if (response.status === 403 && text === 'You are not a member of this soundboard') {
        return { status: 403, body: { error: text } };
      }
      if (response.status === 404 && text === 'Unknown soundboard') {
        return { status: 404, body: { error: text } };
      }
    }
    console.error('Soundbored returned an unexpected content type', response.status, contentType, response.url);
  }

  return { status: 502, body: { error: 'Soundbored returned an invalid API response. Check the API URL.' } };
};

export const sendProxyBody = (res: Response, status: number, body: unknown): void => {
  if (body === undefined) {
    res.status(status).end();
    return;
  }

  res.status(status).json(body);
};

export const requestSoundbored = async (
  config: EnvConfig,
  path: string,
  init: RequestInit = {}
) => {
  const response = await fetch(`${config.soundboredApiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.soundboredApiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(10_000),
  });

  return readResponseBody(response, init.method ?? 'GET');
};

export const sendProxyFailure = (
  res: Response,
  config: EnvConfig,
  action: string,
  error: unknown
): void => {
  console.error(action, error);

  const networkError = isNetworkError(error);
  const message = networkError
    ? `Cannot connect to Soundbored API at ${config.soundboredApiUrl}. Check the URL, confirm the Soundbored server is running, and verify that your personal API token still exists in Settings.`
    : 'Could not read the Soundbored API response';

  res.status(networkError ? 503 : 502).json({
    error: action,
    message,
  });
};
