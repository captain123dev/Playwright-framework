import { APIRequestContext } from '@playwright/test';

const tokenCache: Record<string, string> = {};

export async function getAuthToken(
  request: APIRequestContext,
  baseUrl: string = 'https://automationintesting.online/api'
): Promise<string> {
  if (tokenCache[baseUrl]) return tokenCache[baseUrl];

  const response = await request.post(`${baseUrl}/auth/login`, {
    data: { username: 'admin', password: 'password' },
  });

  const text = await response.text();
  let body: any;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Auth not JSON. Status: ${response.status()}, Body: ${text.substring(0, 300)}`);
  }

  if (!body.token) throw new Error(`Auth failed: ${JSON.stringify(body)}`);
  tokenCache[baseUrl] = body.token;
  return tokenCache[baseUrl];
}

export function clearTokenCache(): void {
  Object.keys(tokenCache).forEach(k => delete tokenCache[k]);
}

export function tokenCookieHeader(token: string): string {
  return `token=${token}`;
}
