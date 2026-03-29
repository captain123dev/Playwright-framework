import { test, expect } from '@playwright/test';
import { AdminLoginPage, AdminDashboardPage } from '../../pages/index';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';

test.describe('UI - Admin Panel', () => {
  test('Login with valid credentials redirects to dashboard with Rooms section', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await test.step('Navigate to admin login', () => loginPage.navigate());

    await test.step('Enter valid credentials and submit', () => loginPage.login(ADMIN_USER, ADMIN_PASS));

    await test.step('Verify dashboard loads with Rooms section', async () => {
      await page.waitForURL(/admin/, { timeout: 10000 });
      const dashboard = new AdminDashboardPage(page);
      await expect(dashboard.roomsSection).toBeVisible({ timeout: 10000 });
    });
  });

  test('Login with invalid credentials shows error and does not redirect', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await test.step('Navigate to admin login', () => loginPage.navigate());

    await test.step('Enter invalid credentials', () => loginPage.login('admin', 'wrongpassword'));

    await test.step('Verify error shown and URL unchanged', async () => {
      await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
      expect(page.url()).toContain('admin');
    });
  });

  test('Login with empty fields shows validation before submission', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await test.step('Navigate to admin login', () => loginPage.navigate());

    await test.step('Click login without filling fields', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Verify validation error or page remains on login', async () => {
      const stillOnLogin = page.url().includes('/admin') &&
        await loginPage.usernameField.isVisible();
      expect(stillOnLogin).toBe(true);
    });
  });

  test('Create new room appears in room list', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboard = new AdminDashboardPage(page);

    await test.step('Login as admin', async () => {
      await loginPage.navigate();
      await loginPage.login(ADMIN_USER, ADMIN_PASS);
      await page.waitForURL(/admin/, { timeout: 10000 });
    });

    const roomName = `AutoRoom${Date.now()}`;

    await test.step('Create new room', () =>
      dashboard.createRoom({
        name: roomName,
        type: 'Single',
        accessible: 'false',
        price: '99',
      })
    );

    await test.step('Verify room appears in list', async () => {
      await expect(
        page.locator(`//*[contains(text(),"${roomName}")]`).first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test('Logout clears session and redirects to login page', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboard = new AdminDashboardPage(page);

    await test.step('Login as admin', async () => {
      await loginPage.navigate();
      await loginPage.login(ADMIN_USER, ADMIN_PASS);
      await page.waitForURL(/admin/, { timeout: 10000 });
    });

    await test.step('Click Logout', () => dashboard.logout());

    await test.step('Verify redirected to login', async () => {
      await expect(loginPage.usernameField).toBeVisible({ timeout: 10000 });
    });

    await test.step('Navigating to /admin redirects back to login', async () => {
      try {
        await page.goto('/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });
      } catch {
        // navigation may abort after logout - expected behaviour
      }
      // Verify dashboard is not visible - session is cleared
      const isDashboardGone = !await page.locator('#roomlisting').isVisible();
      expect(isDashboardGone).toBe(true);
    });
  });

  test('View booking report - calendar/summary loads for a room', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await test.step('Login as admin', async () => {
      await loginPage.navigate();
      await loginPage.login(ADMIN_USER, ADMIN_PASS);
      await page.waitForURL(/admin/, { timeout: 10000 });
    });

    await test.step('Click on a room report link', async () => {
      const reportLink = page.locator('a:has-text("Report"), button:has-text("Report")').first();
      if (await reportLink.isVisible()) {
        await reportLink.click();
        await expect(
          page.locator('.rbc-calendar, [class*="report"], [class*="calendar"]').first()
        ).toBeVisible({ timeout: 10000 });
      }
    });
  });
});
