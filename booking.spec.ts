import { test, expect } from '@playwright/test';
import { getAuthToken, tokenCookieHeader } from '../../helpers/auth.helper';
import { buildBookingPayload, createBooking, deleteBooking } from '../../helpers/booking.helper';

const BASE = process.env.BASE_API_URL || 'https://restful-booker.herokuapp.com';

test.describe('Booking API – Read', () => {
  test('GET /booking returns 200 with array of bookingids', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/booking`);

    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    body.forEach((item: any) => expect(item).toHaveProperty('bookingid'));
  });

  test('GET /booking/{id} returns 200 with all required fields', async ({ request }) => {
    const { bookingid } = await createBooking(request);
    const token = await getAuthToken(request);

    try {
      const start = Date.now();
      const res = await request.get(`${BASE}/booking/${bookingid}`);

      expect(res.status()).toBe(200);
      expect(Date.now() - start).toBeLessThan(3000);

      const body = await res.json();
      expect(body).toHaveProperty('firstname');
      expect(body).toHaveProperty('lastname');
      expect(body).toHaveProperty('totalprice');
      expect(body).toHaveProperty('depositpaid');
      expect(body).toHaveProperty('bookingdates');
      expect(body.bookingdates).toHaveProperty('checkin');
      expect(body.bookingdates).toHaveProperty('checkout');
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('GET /booking/{id} with invalid ID returns 404', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/booking/999999999`);

    expect(res.status()).toBe(404);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  test('GET /booking?firstname filters correctly', async ({ request }) => {
    const token = await getAuthToken(request);
    const payload = buildBookingPayload({ firstname: 'UniqueTestName123' });
    const { bookingid } = await createBooking(request, payload);

    try {
      const start = Date.now();
      const res = await request.get(`${BASE}/booking?firstname=UniqueTestName123`);

      expect(res.status()).toBe(200);
      expect(Date.now() - start).toBeLessThan(3000);

      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.some((b: any) => b.bookingid === bookingid)).toBe(true);
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('GET /booking?checkin=&checkout= date range filter', async ({ request }) => {
    const start = Date.now();
    const res = await request.get(`${BASE}/booking?checkin=2025-01-01&checkout=2025-12-31`);

    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);
    expect(Array.isArray(await res.json())).toBe(true);
  });
});

test.describe('Booking API – Write (CRUD)', () => {
  test('POST /booking with valid payload returns 200 with bookingid and matching fields', async ({ request }) => {
    const token = await getAuthToken(request);
    const payload = buildBookingPayload();

    const start = Date.now();
    const res = await request.post(`${BASE}/booking`, { data: payload });

    expect(res.status()).toBe(200);
    expect(Date.now() - start).toBeLessThan(3000);

    const body = await res.json();
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');
    expect(body.booking.firstname).toBe(payload.firstname);
    expect(body.booking.lastname).toBe(payload.lastname);
    expect(body.booking.totalprice).toBe(payload.totalprice);

    await deleteBooking(request, body.bookingid, token);
  });

  test('POST /booking with missing firstname returns error', async ({ request }) => {
    const payload: any = buildBookingPayload();
    delete payload.firstname;

    const start = Date.now();
    const res = await request.post(`${BASE}/booking`, { data: payload });
    expect(Date.now() - start).toBeLessThan(3000);
    expect([400, 500]).toContain(res.status());
  });

  test('POST /booking with checkin after checkout returns error', async ({ request }) => {
    const payload = buildBookingPayload({
      bookingdates: { checkin: '2025-08-10', checkout: '2025-08-01' },
    });

    const start = Date.now();
    const res = await request.post(`${BASE}/booking`, { data: payload });
    expect(Date.now() - start).toBeLessThan(3000);
    expect([400, 500]).toContain(res.status());
  });

  test('PUT /booking/{id} with valid token returns 200 and updates all fields', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);
    const updated = buildBookingPayload({ firstname: 'Updated', lastname: 'Name' });

    try {
      const start = Date.now();
      const res = await request.put(`${BASE}/booking/${bookingid}`, {
        data: updated,
        headers: { Cookie: tokenCookieHeader(token) },
      });

      expect(res.status()).toBe(200);
      expect(Date.now() - start).toBeLessThan(3000);

      const body = await res.json();
      expect(body.firstname).toBe('Updated');
      expect(body.lastname).toBe('Name');
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
      expect(res.status()).toBe(403);
      expect(Date.now() - start).toBeLessThan(3000);
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('PATCH /booking/{id} updates only the patched field', async ({ request }) => {
    const token = await getAuthToken(request);
    const original = buildBookingPayload({ firstname: 'OriginalName' });
    const { bookingid } = await createBooking(request, original);

    try {
      const start = Date.now();
      const res = await request.patch(`${BASE}/booking/${bookingid}`, {
        data: { firstname: 'PatchedName' },
        headers: { Cookie: tokenCookieHeader(token) },
      });

      expect(res.status()).toBe(200);
      expect(Date.now() - start).toBeLessThan(3000);

      const body = await res.json();
      expect(body.firstname).toBe('PatchedName');
      expect(body.lastname).toBe(original.lastname);
      expect(body.totalprice).toBe(original.totalprice);
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });

  test('DELETE /booking/{id} with token returns 201; subsequent GET returns 404', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);

    const start = Date.now();
    const deleteRes = await request.delete(`${BASE}/booking/${bookingid}`, {
      headers: { Cookie: tokenCookieHeader(token) },
    });

    expect(deleteRes.status()).toBe(201);
    expect(Date.now() - start).toBeLessThan(3000);

    const getRes = await request.get(`${BASE}/booking/${bookingid}`);
    expect(getRes.status()).toBe(404);
  });

  test('DELETE /booking/{id} without token returns 403', async ({ request }) => {
    const token = await getAuthToken(request);
    const { bookingid } = await createBooking(request);

    try {
      const start = Date.now();
      const res = await request.delete(`${BASE}/booking/${bookingid}`);
      expect(res.status()).toBe(403);
      expect(Date.now() - start).toBeLessThan(3000);
    } finally {
      await deleteBooking(request, bookingid, token);
    }
  });
});
