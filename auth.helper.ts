import { APIRequestContext } from '@playwright/test';

let cachedToken: string | null = null;

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  if (cachedToken) return cachedToken;

  const response = await request.post(
    `${process.env.BASE_API_URL || 'https://restful-booker.herokuapp.com'}/auth`,
    {
      data: {
        username: process.env.ADMIN_USER || 'admin',
        password: process.env.ADMIN_PASS || 'password',
      },
    }
  );

  const body = await response.json();
  if (!body.token) throw new Error(`Auth failed: ${JSON.stringify(body)}`);
  cachedToken = body.token;
  return cachedToken!;
}

export function clearTokenCache(): void {
  cachedToken = null;
}

export function tokenCookieHeader(token: string): string {
  return `token=${token}`;
}
