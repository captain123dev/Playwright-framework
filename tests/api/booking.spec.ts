import { test, expect } from '@playwright/test';
import { getAuthToken, tokenCookieHeader } from '../../helpers/auth.helper';
import { buildBookingPayload, createBooking, deleteBooking } from '../../helpers/booking.helper';

const BASE = 'https://automationintesting.online/api';

test.describe('Booking API - Read', () => {
  test('GET /booking with roomid returns 200', async ({ request }) => {
    const token = await getAuthToken(request);
    const start = Date.now();
    const res = await request.get(`${BASE}/booking?roomid=1`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('GET /booking/{id} returns 200 with all required fields', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);
    try {
      const start = Date.now();
      const res = await request.get(`${BASE}/booking/${bookingid}`, {
        headers: { Cookie: tokenCookieHeader(token) },
      });
      expect(res.status()).toBe(200);
      expect(Date.now() - start).toBeLessThan(3000);
      const body = await res.json();
      expect(body).toHaveProperty('firstname');
      expect(body).toHaveProperty('lastname');
      expect(body).toHaveProperty('depositpaid');
      expect(body).toHaveProperty('bookingdates');
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('GET /booking/{id} with invalid ID returns 404', async ({ request }) => {
    const token = await getAuthToken(request);
    const start = Date.now();
    const res = await request.get(`${BASE}/booking/999999999`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(404);
    expect(Date.now() - start).toBeLessThan(3000);
  });
});

test.describe('Booking API - Write (CRUD)', () => {
  test('POST /booking with valid payload returns bookingid', async ({ request }) => {
    const token = await getAuthToken(request);
    const payload = buildBookingPayload();
    const start = Date.now();
    const res = await request.post(`${BASE}/booking`, {
      data: payload,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(res.status()).toBe(201);
    expect(Date.now() - start).toBeLessThan(3000);
    const body = await res.json();
    expect(body).toHaveProperty('bookingid');
    await deleteBooking(request, body.bookingid, token);
  });

  test('POST /booking with missing firstname returns error', async ({ request }) => {
    const token = await getAuthToken(request);
    const payload: any = buildBookingPayload();
    delete payload.firstname;
    const start = Date.now();
    const res = await request.post(`${BASE}/booking`, {
      data: payload,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(Date.now() - start).toBeLessThan(3000);
    expect([400, 500]).toContain(res.status());
  });

  test('POST /booking checkin after checkout - platform behaviour documented', async ({ request }) => {
    const token = await getAuthToken(request);
    const payload = buildBookingPayload({
      bookingdates: { checkin: '2025-08-10', checkout: '2025-08-01' },
    });
    const start = Date.now();
    const res = await request.post(`${BASE}/booking`, {
      data: payload,
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(Date.now() - start).toBeLessThan(3000);
    expect([200, 400, 409, 500]).toContain(res.status());
  });

  test('PUT /booking/{id} with valid token returns 200', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);
    const updated = buildBookingPayload({ 
  firstname: 'Updated', 
  lastname: 'Name',
  bookingdates: { checkin: '2030-07-01', checkout: '2030-07-05' }
});    try {
      const start = Date.now();
      const res = await request.put(`${BASE}/booking/${bookingid}`, {
        data: updated,
        headers: { Cookie: tokenCookieHeader(token) },
      });
      expect(res.status()).toBe(200);
      expect(Date.now() - start).toBeLessThan(3000);
    const body = await res.json();
expect(body).toBeTruthy();
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('PUT /booking/{id} without token returns 403', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);
    try {
      const start = Date.now();
      const res = await request.put(`${BASE}/booking/${bookingid}`, {
        data: buildBookingPayload(),
      });
      expect([403, 401]).toContain(res.status());
      expect(Date.now() - start).toBeLessThan(3000);
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('DELETE /booking/{id} with token - subsequent GET returns 404', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);
    const start = Date.now();
    const deleteRes = await request.delete(`${BASE}/booking/${bookingid}`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect([200, 201, 202]).toContain(deleteRes.status());
    expect(Date.now() - start).toBeLessThan(3000);
    const getRes = await request.get(`${BASE}/booking/${bookingid}`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });
    expect(getRes.status()).toBe(404);
  });

  test('DELETE /booking/{id} without token returns 403', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);
    try {
      const start = Date.now();
      const res = await request.delete(`${BASE}/booking/${bookingid}`);
      expect([403, 401]).toContain(res.status());
      expect(Date.now() - start).toBeLessThan(3000);
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });
});
