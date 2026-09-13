import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
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

    // Für Assertions: expect(loginPage.errorMessage).toBeVisible()
    this.errorMessage = page.getByText('Invalid email or password');

    this.signUpLink = page.getByRole('link', {
      name: 'Navigate to sign up page',
    });
  }

  async goto(): Promise<this> {
    await this.page.goto('/auth/signin');
    return this;
  }

  // Login Actions: kein networkidle, das Ergebnis prüft der Test per expect
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
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

  async navigateToSignUp() {
    await this.signUpLink.click();
  }
}
