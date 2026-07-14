import type { Locator, Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Submit sign in form' });
    this.signUpLink = page.getByRole('link', { name: 'Navigate to sign up page' });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/auth/signin');
    await this.page.waitForURL('/auth/signin');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await this.page.waitForURL('/');
    await this.page.getByRole('button', { name: 'User profile actions menu' }).waitFor({ state: 'visible' });
  }

  async navigateToSignUp(): Promise<void> {
    await this.signUpLink.click();
    await this.page.waitForURL('/auth/signup');
  }
}
