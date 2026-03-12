import { test, expect } from '@playwright/test';
import { getAuthToken, tokenCookieHeader } from '../../helpers/auth.helper';

const BASE = process.env.BASE_URL || 'https://automationintesting.online';

test.describe('Room API', () => {
  let createdRoomId: number;

  const roomPayload = {
    type: 'Single',
    beds: 1,
    accessible: false,
    image: 'https://www.mwtestconsultancy.co.uk/img/room2.jpg',
    description: 'Automated test room',
    features: ['WiFi', 'TV'],
    roomPrice: 100,
  };

  test('GET /room returns 200 with rooms list', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/room`);
    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
    const body = await res.json();
    expect(body).toHaveProperty('rooms');
    expect(Array.isArray(body.rooms)).toBe(true);
  });

  test('POST /room with token creates room with correct fields', async ({ request }) => {
    const token = await getAuthToken(request);

    const start = Date.now();
    const res = await request.post(`${BASE}/room`, {
      data: roomPayload,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(201);
    expect(Date.now() - start).toBeLessThan(3000);

    const body = await res.json();
    expect(body).toHaveProperty('roomid');
    expect(body.type).toBe(roomPayload.type);
    expect(body.roomPrice).toBe(roomPayload.roomPrice);
    createdRoomId = body.roomid;
  });

  test('PUT /room/{id} with token updates room details', async ({ request }) => {
    const token = await getAuthToken(request);
    if (!createdRoomId) test.skip();

    const start = Date.now();
    const res = await request.put(`${BASE}/room/${createdRoomId}`, {
      data: { ...roomPayload, roomPrice: 200 },
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);

    const body = await res.json();
    expect(body.roomPrice).toBe(200);
  });

  test('POST /room without token returns 403', async ({ request }) => {
    const start = Date.now();
    const res = await request.post(`${BASE}/room`, { data: roomPayload });
    expect(res.status()).toBe(403);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('DELETE /room/{id} with token removes room from list', async ({ request }) => {
    const token = await getAuthToken(request);
    if (!createdRoomId) test.skip();

    const start = Date.now();
    const res = await request.delete(`${BASE}/room/${createdRoomId}`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(202);
    expect(Date.now() - start).toBeLessThan(3000);

    const listRes = await request.get(`${BASE}/room`);
    const body = await listRes.json();
    const ids = body.rooms.map((r: any) => r.roomid);
    expect(ids).not.toContain(createdRoomId);
  });

  test('DELETE /room/{id} without token returns 403', async ({ request }) => {
    const start = Date.now();
    const res = await request.delete(`${BASE}/room/1`);
    expect(res.status()).toBe(403);
    expect(Date.now() - start).toBeLessThan(3000);
  });
});

test.describe('Message API', () => {
  test('GET /message without token returns 403', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/message`);
    expect(res.status()).toBe(403);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('GET /message with token returns 200 with messages list', async ({ request }) => {
    const token = await getAuthToken(request);
    const start = Date.now();
    const res = await request.get(`${BASE}/message`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
    const body = await res.json();
    expect(body).toHaveProperty('messages');
  });
});

test.describe('Branding API', () => {
  test('GET /branding returns 200 with required fields', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/branding`);
    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
    const body = await res.json();
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('contact');
  });

  test('PUT /branding with token updates and persists changes', async ({ request }) => {
    const token = await getAuthToken(request);
    const getRes = await request.get(`${BASE}/branding`);
    const original = await getRes.json();

    const updated = { ...original, name: 'Automated Test Hotel' };

    const start = Date.now();
    const putRes = await request.put(`${BASE}/branding`, {
      data: updated,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(putRes.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);

    const verifyRes = await request.get(`${BASE}/branding`);
    const verifyBody = await verifyRes.json();
    expect(verifyBody.name).toBe('Automated Test Hotel');

    // Restore original
    await request.put(`${BASE}/branding`, {
      data: original,
      headers: { Cookie: tokenCookieHeader(token) },
    });
  });

  test('PUT /branding without token returns 403', async ({ request }) => {
    const getRes = await request.get(`${BASE}/branding`);
    const original = await getRes.json();

    const start = Date.now();
    const res = await request.put(`${BASE}/branding`, { data: { ...original, name: 'Hacked' } });
    expect(res.status()).toBe(403);
    expect(Date.now() - start).toBeLessThan(3000);
  });
});
