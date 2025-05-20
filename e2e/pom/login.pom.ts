import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  // Referenz auf Page Objekt
  private page: Page;

  // Lcators
  private emailField: Locator;
  private passwordField: Locator;
  private loginButton: Locator;
  private loginHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailField = page.getByLabel('Email');
    this.passwordField = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', {
      name: 'Submit sign in form',
    });
    this.loginHeader = page.getByRole('heading', {
      name: 'Sign In',
    });
  }

  async goToPage() {
    await this.page.goto('/auth/signin');
    await this.page.waitForURL('/auth/signin');
    await expect(this.loginHeader).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);

    await this.loginButton.click();

    await this.page.waitForURL('/');
    await expect(
      this.page.getByRole('button', { name: 'User profile actions menu' }),
    ).toBeVisible();
  }
}
