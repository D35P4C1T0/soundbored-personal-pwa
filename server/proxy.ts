import { Response } from 'express';
import { EnvConfig } from './config';

type ProxyBody = Record<string, unknown> | string | null;

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

const readResponseBody = async (response: globalThis.Response): Promise<ProxyBody> => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json() as Promise<Record<string, unknown>>;
  }

  const text = await response.text();
  return text || null;
};

export const sendProxyBody = (res: Response, status: number, body: ProxyBody): void => {
  if (body === null) {
    res.status(status).end();
    return;
  }

  if (typeof body === 'string') {
    res.status(status).send(body);
    return;
  }

  res.status(status).json(body);
};

export const requestSoundbored = async (
  config: EnvConfig,
  path: string,
  init: RequestInit = {}
): Promise<{ readonly status: number; readonly body: ProxyBody }> => {
  const response = await fetch(`${config.soundboredApiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.soundboredApiToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  return {
    status: response.status,
    body: await readResponseBody(response),
  };
};

export const sendProxyFailure = (
  res: Response,
  config: EnvConfig,
  action: string,
  error: unknown
): void => {
  console.error(action, error);

  const message = isNetworkError(error)
    ? `Cannot connect to Soundbored API at ${config.soundboredApiUrl}. Check the URL, confirm the Soundbored server is running, and verify that your personal API token still exists in Settings.`
    : error instanceof Error
      ? error.message
      : 'Unexpected proxy error';

  res.status(isNetworkError(error) ? 503 : 500).json({
    error: action,
    message,
  });
};
