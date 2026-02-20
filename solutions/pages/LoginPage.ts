import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form Elements - use exact selectors
    this.emailInput = page.getByRole('textbox', {
      name: 'Email address for sign in',
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password for sign in',
    });

    this.submitButton = page.getByRole('button', {
      name: 'Submit sign in form',
    });

    this.errorMessage = page.getByText(/invalid|incorrect|error|failed/i);

    this.forgotPasswordLink = page.getByRole('link', {
      name: /forgot password/i,
    });

    this.signUpLink = page.getByRole('link', {
      name: 'Navigate to sign up page',
    });
  }

  async goto() {
    await this.page.goto('/auth/signin');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Login Actions
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async submitEmptyForm() {
    await this.submitButton.click();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  // Status Checks
  async hasErrorMessage(): Promise<boolean> {
    return await this.errorMessage
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async getErrorMessage(): Promise<string | null> {
    if (await this.hasErrorMessage()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/auth/signin');
  }

  // Helper Methods
  async waitForRedirect(timeout: number = 5000) {
    await this.page.waitForURL(
      (url) => !url.pathname.includes('/auth/signin'),
      {
        timeout,
      },
    );
  }

  async navigateToForgotPassword() {
    if (await this.forgotPasswordLink.isVisible()) {
      await this.forgotPasswordLink.click();
    }
  }

  async navigateToSignUp() {
    if (await this.signUpLink.isVisible()) {
      await this.signUpLink.click();
    }
  }
}
