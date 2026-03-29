import { APIRequestContext } from '@playwright/test';
import { getAuthToken, tokenCookieHeader } from './auth.helper';

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
  roomid: number;
}

export function buildBookingPayload(overrides: Partial<BookingPayload> = {}): BookingPayload {
  return {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2025-08-01', checkout: '2025-08-05' },
    additionalneeds: 'Breakfast',
    roomid: 1,
    ...overrides,
  };
}

const BASE = 'https://automationintesting.online/api';

export async function createBooking(
  request: APIRequestContext,
  payload?: Partial<BookingPayload>
): Promise<{ bookingid: number; roomid: number; firstname: string; lastname: string }> {
  const token = await getAuthToken(request);
  const res = await request.post(`${BASE}/booking`, {
    data: buildBookingPayload(payload),
    headers: { Cookie: tokenCookieHeader(token) },
  });
  const body = await res.json();
  if (!body.bookingid) throw new Error(`Create booking failed (${res.status()}): ${JSON.stringify(body)}`);
  return body;
}

export async function deleteBooking(
  request: APIRequestContext,
  id: number,
  token: string
): Promise<void> {
  await request.delete(`${BASE}/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
  });
}
