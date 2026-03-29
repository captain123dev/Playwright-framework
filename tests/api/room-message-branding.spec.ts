import { test, expect } from '@playwright/test';
import { getAuthToken, tokenCookieHeader } from '../../helpers/auth.helper';

const BASE = 'https://automationintesting.online/api';

test.describe('Room API', () => {
  let createdRoomId: number;

  const roomPayload = {
    roomName: 'AutoTestRoom',
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

  test('POST /room with token creates room', async ({ request }) => {
    const token = await getAuthToken(request);

    // Get room list before creating
    const beforeRes = await request.get(`${BASE}/room`);
    const beforeBody = await beforeRes.json();
    const beforeIds = beforeBody.rooms.map((r: any) => r.roomid);

    const start = Date.now();
    const res = await request.post(`${BASE}/room`, {
      data: roomPayload,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect([200, 201]).toContain(res.status());
    expect(Date.now() - start).toBeLessThan(3000);

    // Get room list after to find new room ID
    const afterRes = await request.get(`${BASE}/room`);
    const afterBody = await afterRes.json();
    const newRoom = afterBody.rooms.find((r: any) => !beforeIds.includes(r.roomid));
    expect(newRoom).toBeTruthy();
    createdRoomId = newRoom.roomid;
  });

  test('PUT /room/{id} with token updates room', async ({ request }) => {
    const token = await getAuthToken(request);
    if (!createdRoomId) test.skip();
    const start = Date.now();
    const res = await request.put(`${BASE}/room/${createdRoomId}`, {
      data: { ...roomPayload, roomPrice: 200 },
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('POST /room without token returns 403', async ({ request }) => {
    const start = Date.now();
    const res = await request.post(`${BASE}/room`, { data: roomPayload });
    expect([403, 401]).toContain(res.status());
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('DELETE /room/{id} with token removes room', async ({ request }) => {
    const token = await getAuthToken(request);
    if (!createdRoomId) test.skip();
    const start = Date.now();
    const res = await request.delete(`${BASE}/room/${createdRoomId}`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect([200, 202, 204]).toContain(res.status());
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('DELETE /room without token returns 403', async ({ request }) => {
    const start = Date.now();
    const res = await request.delete(`${BASE}/room/9999`);
    expect([403, 401]).toContain(res.status());
    expect(Date.now() - start).toBeLessThan(3000);
  });
});

test.describe('Message API', () => {
  test('GET /message without token returns 403', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/message/summary`);
    expect([403, 401]).toContain(res.status());
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
    const updated = {
      name: 'Automated Test Hotel',
      map: original.map,
      logoUrl:'https://www.mwtestconsultancy.co.uk/img/rbp-logo.jpg',
      description: original.description,
      directions: original.directions,
      contact: original.contact,
      address: original.address,
    };
    const start = Date.now();
    const putRes = await request.put(`${BASE}/branding`, {
      data: updated,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(putRes.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
    expect(putRes.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
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
    const res = await request.put(`${BASE}/branding`, {
      data: { ...original, name: 'Hacked' },
    });
    expect([403, 401]).toContain(res.status());
    expect(Date.now() - start).toBeLessThan(3000);
  });
});
