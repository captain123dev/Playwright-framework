import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_API_URL || 'https://restful-booker.herokuapp.com';

test.describe('Auth API', () => {
  test('POST /auth – valid credentials returns 200 with non-empty token', async ({ request }) => {
    const start = Date.now();
    const res = await request.post(`${BASE}/auth`, {
      data: { username: process.env.ADMIN_USER || 'admin', password: process.env.ADMIN_PASS || 'password' },
    });

    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);

    const body = await res.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /auth – invalid password returns 200 with Bad credentials', async ({ request }) => {
    const start = Date.now();
    const res = await request.post(`${BASE}/auth`, {
      data: { username: 'admin', password: 'wrongpassword' },
    });

    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);

    const body = await res.json();
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });

  test('POST /auth – empty body returns error response', async ({ request }) => {
    const start = Date.now();
    const res = await request.post(`${BASE}/auth`, { data: {} });

    expect(Date.now() - start).toBeLessThan(3000);
    const body = await res.json();
    // Should not return a valid token
    expect(body.token).toBeUndefined();
  });
});
