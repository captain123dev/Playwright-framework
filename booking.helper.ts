import { APIRequestContext } from '@playwright/test';

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

export function buildBookingPayload(overrides: Partial<BookingPayload> = {}): BookingPayload {
  return {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2025-08-01', checkout: '2025-08-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

export async function createBooking(
  request: APIRequestContext,
  payload?: Partial<BookingPayload>
): Promise<{ bookingid: number; booking: BookingPayload }> {
  const BASE = process.env.BASE_API_URL || 'https://restful-booker.herokuapp.com';
  const res = await request.post(`${BASE}/booking`, { data: buildBookingPayload(payload) });
  return res.json();
}

export async function deleteBooking(
  request: APIRequestContext,
  id: number,
  token: string
): Promise<void> {
  const BASE = process.env.BASE_API_URL || 'https://restful-booker.herokuapp.com';
  await request.delete(`${BASE}/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
  });
}
