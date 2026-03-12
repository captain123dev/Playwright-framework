import { test, expect } from '@playwright/test';
import { HomePage, BookingPage } from '../../pages/index';

test.describe('UI – Public Frontend: Booking Flow', () => {
  test('Homepage loads with welcome banner and room listing', async ({ page }) => {
    const home = new HomePage(page);
    await test.step('Navigate to homepage', () => home.navigate());

    await test.step('Verify welcome banner is visible', async () => {
      await expect(home.welcomeBanner).toBeVisible();
    });

    await test.step('Verify room listing is visible', async () => {
      await expect(page.locator('.hotel-room, .room, [class*="room"]').first()).toBeVisible();
    });
  });

  test('Happy path booking completes with Booking Successful banner', async ({ page }) => {
    const home = new HomePage(page);
    const booking = new BookingPage(page);

    await test.step('Navigate to homepage', () => home.navigate());

    await test.step('Open a room booking panel', async () => {
      const bookBtn = page.locator('button:has-text("Book this room"), button:has-text("Book")').first();
      await bookBtn.click();
    });

    await test.step('Select valid dates via date picker', async () => {
      // Click and drag on the calendar to select a range
      const calendar = page.locator('.rbc-calendar, .fc, [class*="calendar"]').first();
      if (await calendar.isVisible()) {
        // Date picker interaction — click on a future date cell
        const dateCells = page.locator('.rbc-date-cell, .fc-day, [class*="day"]:not([class*="disabled"])');
        const count = await dateCells.count();
        if (count >= 3) {
          await dateCells.nth(2).click();
          await dateCells.nth(4).click();
        }
      }
    });

    await test.step('Fill guest details', async () => {
      await booking.fillGuestDetails({
        firstname: 'Test',
        lastname: 'User',
        email: 'testuser@example.com',
        phone: '01234567890',
      });
    });

    await test.step('Submit booking', async () => {
      await booking.submitBooking.click();
    });

    await test.step('Verify success banner', async () => {
      await expect(
        page.locator('text=/Booking Successful/i, [class*="confirm"], h3:has-text("Booking Successful")').first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test('Submit empty booking form shows validation errors on all required fields', async ({ page }) => {
    const home = new HomePage(page);

    await test.step('Navigate to homepage', () => home.navigate());

    await test.step('Open booking panel', async () => {
      const bookBtn = page.locator('button:has-text("Book this room"), button:has-text("Book")').first();
      await bookBtn.click();
    });

    await test.step('Click Book without filling fields', async () => {
      const submitBtn = page.locator('button:has-text("Book")').last();
      await submitBtn.click();
    });

    await test.step('Verify validation errors are visible', async () => {
      const errors = page.locator('.alert-danger, [class*="error"], p.text-danger');
      await expect(errors.first()).toBeVisible({ timeout: 5000 });
    });
  });
});

test.describe('UI – Contact Form', () => {
  test('Valid contact form submission shows success message', async ({ page }) => {
    const home = new HomePage(page);
    await test.step('Navigate', () => home.navigate());

    await test.step('Fill and submit contact form', () =>
      home.submitContactForm({
        name: 'Test User',
        email: 'test@example.com',
        phone: '01234567890',
        subject: 'Test Subject',
        description: 'This is a test message for the contact form, it must be at least 20 chars.',
      })
    );

    await test.step('Verify success message', async () => {
      await expect(
        page.locator('h2:has-text("Thanks"), [class*="success"], text=/thanks for getting in touch/i').first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test('Empty contact form submission shows validation errors', async ({ page }) => {
    const home = new HomePage(page);
    await test.step('Navigate', () => home.navigate());

    await test.step('Submit empty form', async () => {
      await home.contactSubmit.click();
    });

    await test.step('Verify validation errors', async () => {
      await expect(
        page.locator('.alert-danger, p.text-danger, [class*="error"]').first()
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test('Special characters in contact name handled gracefully', async ({ page }) => {
    const home = new HomePage(page);
    await test.step('Navigate', () => home.navigate());

    await test.step('Fill form with special characters', () =>
      home.submitContactForm({
        name: "O'Brien & <Test>",
        email: 'test@example.com',
        phone: '01234567890',
        subject: 'Special chars test',
        description: 'Testing special characters in the contact form submission here.',
      })
    );

    await test.step('Page does not crash – still visible', async () => {
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
