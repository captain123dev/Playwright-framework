import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly welcomeBanner: Locator;
  readonly roomList: Locator;
  readonly contactName: Locator;
  readonly contactEmail: Locator;
  readonly contactPhone: Locator;
  readonly contactSubject: Locator;
  readonly contactDescription: Locator;
  readonly contactSubmit: Locator;
  readonly contactSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeBanner = page.locator('.hotel-description, .jumbotron, [class*="banner"], h1').first();
    this.roomList = page.locator('.room, .hotel-room, [class*="room"]').first();
    this.contactName = page.locator('#name');
    this.contactEmail = page.locator('#email');
    this.contactPhone = page.locator('#phone');
    this.contactSubject = page.locator('#subject');
    this.contactDescription = page.locator('#description');
    this.contactSubmit = page.locator('#submitContact');
    this.contactSuccessMessage = page.locator('.contact, [class*="contact"]').getByText(/thanks|sent|success/i);
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async submitContactForm(data: {
    name: string; email: string; phone: string; subject: string; description: string;
  }) {
    await this.contactName.fill(data.name);
    await this.contactEmail.fill(data.email);
    await this.contactPhone.fill(data.phone);
    await this.contactSubject.fill(data.subject);
    await this.contactDescription.fill(data.description);
    await this.contactSubmit.click();
  }
}

export class BookingPage {
  readonly page: Page;
  readonly bookButton: Locator;
  readonly firstnameField: Locator;
  readonly lastnameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly submitBooking: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookButton = page.locator('button:has-text("Book")').first();
    this.firstnameField = page.locator('[placeholder*="irstname"], input[name="firstname"]').first();
    this.lastnameField = page.locator('[placeholder*="astname"], input[name="lastname"]').first();
    this.emailField = page.locator('[placeholder*="mail"], input[name="email"]').first();
    this.phoneField = page.locator('[placeholder*="hone"], input[name="phone"]').first();
    this.submitBooking = page.locator('button:has-text("Book")').last();
    this.successBanner = page.locator('text=/Booking Successful/i, [class*="success"]');
  }

  async fillGuestDetails(data: { firstname: string; lastname: string; email: string; phone: string }) {
    await this.firstnameField.fill(data.firstname);
    await this.lastnameField.fill(data.lastname);
    await this.emailField.fill(data.email);
    await this.phoneField.fill(data.phone);
  }
}

export class AdminLoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('#doLogin');
    this.errorMessage = page.locator('.alert, [class*="error"], p:has-text("error")');
  }

  async navigate() {
    await this.page.goto('/admin');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}

export class AdminDashboardPage {
  readonly page: Page;
  readonly roomNameField: Locator;
  readonly roomTypeSelect: Locator;
  readonly roomAccessibleSelect: Locator;
  readonly roomPriceField: Locator;
  readonly createRoomButton: Locator;
  readonly logoutButton: Locator;
  readonly roomsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomNameField = page.locator('#roomName');
    this.roomTypeSelect = page.locator('#type');
    this.roomAccessibleSelect = page.locator('#accessible');
    this.roomPriceField = page.locator('#roomPrice');
    this.createRoomButton = page.locator('#createRoom');
    this.logoutButton = page.locator('a:has-text("Logout"), button:has-text("Logout")');
    this.roomsSection = page.locator('.room-listing, #roomlisting, [class*="room"]').first();
  }

  async createRoom(data: { name: string; type: string; accessible: string; price: string }) {
    await this.roomNameField.fill(data.name);
    await this.roomTypeSelect.selectOption(data.type);
    await this.roomAccessibleSelect.selectOption(data.accessible);
    await this.roomPriceField.fill(data.price);
    await this.createRoomButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
