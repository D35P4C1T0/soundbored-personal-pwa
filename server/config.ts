interface EnvConfig {
  readonly port: number;
  readonly soundboredApiUrl: string;
  readonly soundboredApiToken: string;
}

const normalizeApiUrl = (value: string): string => {
  const trimmedValue = value.trim().replace(/\/+$/, '');
  return trimmedValue.endsWith('/api') ? trimmedValue : `${trimmedValue}/api`;
};

const parsePort = (value: string | undefined): number => {
  const parsedPort = Number.parseInt(value ?? '3000', 10);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return parsedPort;
};

const parseApiUrl = (value: string | undefined): string => {
  if (!value) {
    throw new Error('SOUNDBORED_API_URL is required');
  }

  try {
    return normalizeApiUrl(new URL(value).toString());
  } catch {
    throw new Error('SOUNDBORED_API_URL must be a valid URL');
  }
};

const parseApiToken = (env: NodeJS.ProcessEnv): string => {
  const token = env.SOUNDBORED_API_TOKEN || env.SOUNDBORED_TOKEN;

  if (!token) {
    throw new Error(
      'SOUNDBORED_API_TOKEN is required (legacy SOUNDBORED_TOKEN is also accepted)'
    );
  }

  return token;
};

export const readConfig = (env: NodeJS.ProcessEnv): EnvConfig => ({
  port: parsePort(env.PORT),
  soundboredApiUrl: parseApiUrl(env.SOUNDBORED_API_URL),
  soundboredApiToken: parseApiToken(env),
});

export type { EnvConfig };
